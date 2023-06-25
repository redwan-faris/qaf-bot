import { Telegraf, Context } from "telegraf";
import {  message } from "telegraf/filters";
import dotenv from "dotenv"; 
import { EventInterface } from "../types/event.type";
import { downloadMedia } from "./helpers";
import { saveEvent, saveMedia ,getBotMessages} from "./api";
import { Event } from "../entities/Event";
 


dotenv.config();
const token = process.env.BOT_TOKEN;
let step = "";
let event:EventInterface = {
  description:"",
  reporter:"",
  address:"",
  media:[] as string[]
};
if (!token) {
  console.error("BOT_TOKEN is not defined in the environment variables");
  process.exit(1);
}

export const bot = new Telegraf(token);
 

bot.command("start", (ctx: Context) => {
  ctx.reply("مرحبا بك في بوت انا مراسل");
});

bot.command("option1", (ctx) => {
  ctx.telegram.sendMessage(ctx.chat.id, "كيف تريد ارسال المعلومات؟", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "انا مراسل",
            callback_data: "reporter",
          },
          {
            text: "انا مدون",
            callback_data: "location",
          },
        ],
      ],
    },
  });
});

bot.action("reporter", (ctx) => {
  ctx.deleteMessage();
  ctx.replyWithHTML("من فضلك اكتب اسم المراسل:", {
    reply_markup: {
      force_reply: true,
    },
  });

  step = "location";
});

bot.action("location", (ctx) => {
  ctx.deleteMessage();
  ctx.replyWithHTML("من فضلك أدخل الموقع:", {
    reply_markup: {
      force_reply: true,
    },
  });
  step = "event";
});

bot.on(message("text"), (ctx) => {
  if (step === "location") {
    const reporterName = ctx.message.text;
    if(reporterName){
      event.reporter = reporterName;
    }
    ctx.replyWithHTML("من فضلك أدخل الموقع:", {
      reply_markup: {
        force_reply: true,
      },
    });
    step = "event";
  } else if (step === "event") {
    const location = ctx.message.text;
    event.address = location;
    ctx.replyWithHTML("من فضلك أدخل الحدث:", {
      reply_markup: {
        force_reply: true,
      },
    });
    step = "media";
  } else if (step == "media") {
    const description = ctx.message.text;
    event.description = description;
    ctx.telegram.sendMessage(ctx.chat.id, "هل تريد مشاركة صور او فديوهات تخص الحدث؟", {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "نعم",
              callback_data: "mediaAccept",
            },
            {
              text: "لا",
              callback_data: "mediaDecline",
            },
          ],
        ],
      },
    });
  }
});

bot.action("mediaAccept", (ctx) => {
  ctx.deleteMessage();
  ctx.replyWithHTML("من فضلك أدخل الصورة او الفديو", {
    reply_markup: {
      force_reply: true,
    },
  });
  step = "media";
});


 
bot.action("mediaDecline", async (ctx) => {
  console.log(event)  
  ctx.deleteMessage();
  ctx.replyWithHTML("شكرا لمشاركتك المعلومات");
  step = "finish";
  let paths = await downloadMedia(event.media);
  const newEvent:Event = await saveEvent(event);
  await saveMedia(paths,newEvent)
  console.log(paths)
});

bot.on(message("photo"),async  (ctx) => {
  if (step === "media") {
    const photo = ctx.message.photo[ctx.message.photo.length -1];
  
    const fileId = photo.file_id;
    const file = await ctx.telegram.getFile(fileId);
    const fileUrl = `https://api.telegram.org/file/bot${token}/${file.file_path}`;
    event.media.push(fileUrl);
    ctx.telegram.sendMessage(ctx.chat.id, "هل توجد صور  او فديوهات اخرى؟", {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "نعم",
              callback_data: "mediaAccept",
            },
            {
              text: "لا",
              callback_data: "mediaDecline",
            },
          ],
        ],
      },
    });
  
  }
});

bot.on(message("video"),async  (ctx) => {
  if (step === "media") {
    const photo = ctx.message.video ;
  
    const fileId = photo.file_id;
    const file = await ctx.telegram.getFile(fileId);
    const fileUrl = `https://api.telegram.org/file/bot${token}/${file.file_path}`;
 
    event.media.push(fileUrl);
    ctx.telegram.sendMessage(ctx.chat.id, "هل توجد صور  او فديوهات اخرى؟", {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "نعم",
              callback_data: "mediaAccept",
            },
            {
              text: "لا",
              callback_data: "mediaDecline",
            },
          ],
        ],
      },
    });
  
  }
});


bot.use((ctx: Context, next: () => Promise<void>) => {
  console.log("Received update:", ctx.update);
  return next();
});
