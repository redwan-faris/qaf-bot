import { Telegraf, Context } from "telegraf";
import { message } from "telegraf/filters";
import dotenv from "dotenv";
import { EventInterface } from "../types/event.type";
import { downloadMedia } from "./helpers";
import { saveEvent, saveMedia, getBotMessages } from "./api";
import { Event } from "../entities/Event";

dotenv.config();
const token = process.env.BOT_TOKEN;

export class Bot {
  private bot: Telegraf<Context>;
  private step: string;
  private event: EventInterface;

  constructor() {
    if (!token) {
      console.error("BOT_TOKEN is not defined in the environment variables");
      process.exit(1);
    }

    this.bot = new Telegraf(token);
    this.step = "";
    this.event = {
      description: "",
      reporter: "",
      address: "",
      media: [] as string[],
    };

    this.setupCommands();
    this.setupActions();
    this.setupMessageHandlers();
    this.setupMiddleware();
  }

  private setupCommands(): void {
    this.bot.command("start", (ctx: Context) => {
      ctx.reply("مرحبا بك في بوت انا مراسل");
    });

    this.bot.command("option1", (ctx) => {
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
  }

  private setupActions(): void {
    this.bot.action("reporter", (ctx) => {
      ctx.deleteMessage();
      ctx.replyWithHTML("من فضلك اكتب اسم المراسل:", {
        reply_markup: {
          force_reply: true,
        },
      });

      this.step = "location";
    });

    this.bot.action("location", (ctx) => {
      ctx.deleteMessage();
      ctx.replyWithHTML("من فضلك أدخل الموقع:", {
        reply_markup: {
          force_reply: true,
        },
      });
      this.step = "event";
    });

    this.bot.action("mediaAccept", (ctx) => {
      ctx.deleteMessage();
      ctx.replyWithHTML("من فضلك أدخل الصورة او الفديو", {
        reply_markup: {
          force_reply: true,
        },
      });
      this.step = "media";
    });

    this.bot.action("mediaDecline", async (ctx) => {
      ctx.deleteMessage();
      ctx.replyWithHTML("شكرا لمشاركتك المعلومات");
      this.step = "finish";
      let paths = await downloadMedia(this.event.media);
      const newEvent: Event = await saveEvent(this.event);
      await saveMedia(paths, newEvent);
      console.log(paths);
    });
  }

  private setupMessageHandlers(): void {
    this.bot.on(message("text"), (ctx) => {
      if (this.step === "location") {
        const reporterName = ctx.message.text;
        if (reporterName) {
          this.event.reporter = reporterName;
        }
        ctx.replyWithHTML("من فضلك أدخل الموقع:", {
          reply_markup: {
            force_reply: true,
          },
        });
        this.step = "event";
      } else if (this.step === "event") {
        const location = ctx.message.text;
        this.event.address = location;
        ctx.replyWithHTML("من فضلك أدخل الحدث:", {
          reply_markup: {
            force_reply: true,
          },
        });
        this.step = "media";
      } else if (this.step == "media") {
        const description = ctx.message.text;
        this.event.description = description;
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

    this.bot.on(message("photo"), async (ctx) => {
      if (this.step === "media") {
        const photo = ctx.message.photo[ctx.message.photo.length - 1];

        const fileId = photo.file_id;
        const file = await ctx.telegram.getFile(fileId);
        const fileUrl = `https://api.telegram.org/file/bot${token}/${file.file_path}`;
        this.event.media.push(fileUrl);
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

    this.bot.on(message("video"), async (ctx) => {
      if (this.step === "media") {
        const video = ctx.message.video;

        const fileId = video.file_id;
        const file = await ctx.telegram.getFile(fileId);
        const fileUrl = `https://api.telegram.org/file/bot${token}/${file.file_path}`;

        this.event.media.push(fileUrl);
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
  }

  private setupMiddleware(): void {
    this.bot.use((ctx: Context, next: () => Promise<void>) => {
      console.log("Received update:", ctx.update);
      return next();
    });
  }

  public async start(): Promise<void> {
    await this.bot.launch();
    console.log("Bot is running...");
  }
}

 
