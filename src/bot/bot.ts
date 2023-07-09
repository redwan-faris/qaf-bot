import { Telegraf, Context, Markup } from "telegraf";
import { message } from "telegraf/filters";
import dotenv from "dotenv";
import { EventInterface } from "../types/event.type";
import { downloadMedia, convertToHash } from "./helpers";
import { saveEvent, saveMedia, getBotMessages, checkIfUserExist, getOrCreateMember, updateMember } from './api';
import { Event } from "../entities/Event";
import { TypeEnum } from "../enums/TypeEnum";
import { Member } from '../entities/Member';

// TODO refactor the bot code 
dotenv.config();
const token = process.env.BOT_TOKEN;

export class Bot {
  private bot: Telegraf<Context>;
  private step: string;
  private event: EventInterface;
  private data: any;
  private member: Member | null;
  constructor() {
    if (!token) {
      console.error("BOT_TOKEN is not defined in the environment variables");
      process.exit(1);
    }

    this.bot = new Telegraf(token).catch(e => console.log(e));
    this.bot.catch((error: any, ctx: Context) => {
      console.error('Bot error occurred:', error); 
    });

 
    this.event = {
      type: TypeEnum.BLOGGER,
      description: "",
      member: {
        full_name: '',
        memberId: 0,
      },
      address: "",
      media: [] as string[],
    };
    this.updateData();
    this.setupMiddleware();
    this.setupCommands();
    this.setupActions();
    this.setupMessageHandlers();

  }

  public updateData() {
    setTimeout(() => {
      getBotMessages().then((result) => {
        this.data = convertToHash(result);
      });
    }, 1000);
  }

  private setupCommands(): void {


    this.bot.command("start",async  (ctx: Context) => {

      if (ctx.message && ctx.message.from) {
        const userId = ctx.message.from.id;
        this.event.member.memberId = userId
        this.member! = await getOrCreateMember(userId);
      }
      ctx.reply(this.data['CREETING']?this.data['CREETING']:'الرساله غير متوفرة الان لكن تم تسجيل معلوماتك', Markup.keyboard([
        ['/send'],

      ]).resize());
    }).catch((error: any, ctx: Context) => {
      console.error('Bot error occurred:', error); 
    });;

    this.bot.command("send", async (ctx) => {
      if (ctx.message && ctx.message.from) {
        const userId = ctx.message.from.id;
        this.event.member.memberId = userId
        this.member! = await getOrCreateMember(userId);
      }

      ctx.telegram.sendMessage(ctx.chat.id, this.data['SENDER_TYPE_QUESTION']?this.data['SENDER_TYPE_QUESTION']:'الرساله غير متوفرة الان لكن تم تسجيل معلوماتك', {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: this.data['REPORTER']?this.data['REPORTER']:'الرساله غير متوفرة الان لكن تم تسجيل معلوماتك',
                callback_data: "reporter",
              },
              {
                text: this.data['BLOGGER']? this.data['BLOGGER']:'الرساله غير متوفرة الان لكن تم تسجيل معلوماتك',
                callback_data: "blogger",
              },
            ],
          ],
        },
      });
    }).catch((error: any, ctx: Context) => {
      console.error('Bot error occurred:', error); 
    });;
  }

  private setupActions(): void {

    this.bot.action("reporter", (ctx) => {
          ctx.deleteMessage().catch();
     
      if (this.member!?.full_name) {
        this.event.member.full_name = this.member!.full_name;
       
        ctx.replyWithHTML(this.data['LOCATION_NAME_QUESTION']?this.data['LOCATION_NAME_QUESTION']:'الرساله غير متوفرة الان لكن تم تسجيل معلوماتك', {
          reply_markup: {
            force_reply: true,
          },
        });
        this.member!.step = "event";
        updateMember(this.member.id,"event")
      } else {
        ctx.replyWithHTML(this.data['REPORTER_NAME_QUESTION']?this.data['REPORTER_NAME_QUESTION']:'الرساله غير متوفرة الان لكن تم تسجيل معلوماتك', {
          reply_markup: {
            force_reply: true,
          },
        });
        this.member!!.step = "location";
      }
      this.event.type = TypeEnum.REPORTER;

    }).catch((error: any, ctx: Context) => {
      console.error('Bot error occurred:', error); 
    });;

    this.bot.action("blogger", (ctx) => {
          ctx.deleteMessage().catch();;
      if (this.member!?.full_name) {
        this.event.member.full_name = this.member!.full_name;
        ctx.replyWithHTML(this.data['LOCATION_NAME_QUESTION']?this.data['LOCATION_NAME_QUESTION']:'الرساله غير متوفرة الان لكن تم تسجيل معلوماتك', {
          reply_markup: {
            force_reply: true,
          },
        });
        this.member!.step = "event";
        updateMember(this.member.id,"event")
      } else {
        ctx.replyWithHTML(this.data['REPORTER_NAME_QUESTION']?this.data['REPORTER_NAME_QUESTION']:'الرساله غير متوفرة الان لكن تم تسجيل معلوماتك', {
          reply_markup: {
            force_reply: true,
          },
        });
        this.member!.step = "location";
        updateMember(this.member!.id,"location")
      }
      this.event.type = TypeEnum.BLOGGER;

    }).catch((error: any, ctx: Context) => {
      console.error('Bot error occurred:', error); 
    });;

    this.bot.action("location", (ctx) => {
          ctx.deleteMessage().catch();;
      ctx.replyWithHTML(this.data['LOCATION_NAME_QUESTION']?this.data['LOCATION_NAME_QUESTION']:'الرساله غير متوفرة الان لكن تم تسجيل معلوماتك', {
        reply_markup: {
          force_reply: true,
        },
      });
      this.member!.step = "event";
      updateMember(this.member!.id,"event")
    }).catch((error: any, ctx: Context) => {
      console.error('Bot error occurred:', error); 
    });;

    this.bot.action("mediaAccept", (ctx) => {
          ctx.deleteMessage().catch();;
      ctx.replyWithHTML(this.data['MEDIA_QUESTION']?this.data['MEDIA_QUESTION']:'الرساله غير متوفرة الان لكن تم تسجيل معلوماتك', {
        reply_markup: {
          force_reply: true,
        },
      });
      this.member!.step = "media";
    }).catch((error: any, ctx: Context) => {
      console.error('Bot error occurred:', error); 
    });;

    this.bot.action("mediaDecline", async (ctx) => {

          ctx.deleteMessage().catch();;
      ctx.replyWithHTML(this.data['GRATITUDE_MESSAGEX']?this.data['GRATITUDE_MESSAGEX']:'الرساله غير متوفرة الان لكن تم تسجيل معلوماتك');
      if(this.member!){
      this.member!.step = ""; 
      updateMember(this.member!.id,"")
      let paths = await downloadMedia(this.event.media);
      const newEvent: Event = await saveEvent(this.event,this.member!.id);
      await saveMedia(paths, newEvent);
      }
    }).catch((error: any, ctx: Context) => {
      console.error('Bot error occurred:', error); 
    });;
  }

  private setupMessageHandlers(): void {
    this.bot.on(message("text"), (ctx) => {
      if (this.member!.step === "location") {
        const reporterName = ctx.message.text;
        if (reporterName) {
          this.event.member.full_name = reporterName;
        }
        ctx.replyWithHTML(this.data['LOCATION_NAME_QUESTION']?this.data['LOCATION_NAME_QUESTION']:'الرساله غير متوفرة الان لكن تم تسجيل معلوماتك', {
          reply_markup: {
            force_reply: true,
          },
        });
        this.member!.step = "event";
        updateMember(this.member!.id,"event")
      } else if (this.member!.step === "event") {
        const location = ctx.message.text;
        this.event.address = location;
        ctx.replyWithHTML(this.data['EVENT_NAME_QUESTION']?this.data['EVENT_NAME_QUESTION']:'الرساله غير متوفرة الان لكن تم تسجيل معلوماتك', {
          reply_markup: {
            force_reply: true,
          },
        });
        this.member!.step = "media";
        updateMember(this.member!.id,"media")
      } else if (this.member!.step == "media") {
        const description = ctx.message.text;
        this.event.description = description;
        ctx.telegram.sendMessage(ctx.chat.id, this.data['MEDIA_QUESTION']?this.data['MEDIA_QUESTION']:'الرساله غير متوفرة الان لكن تم تسجيل معلوماتك', {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: this.data['MEDIA_ACCEPT']?this.data['MEDIA_ACCEPT']:'الرساله غير متوفرة الان لكن تم تسجيل معلوماتك',
                  callback_data: "mediaAccept",
                },
                {
                  text: this.data['MEDIA_DECLINE']?this.data['MEDIA_DECLINE']:'الرساله غير متوفرة الان لكن تم تسجيل معلوماتك',
                  callback_data: "mediaDecline",
                },
              ],
            ],
          },
        });
      }
    }).catch((error: any, ctx: Context) => {
      console.error('Bot error occurred:', error); 
    });;

    this.bot.on(message("photo"), async (ctx) => {
      if (this.member!.step === "media") {
        const photo = ctx.message.photo[ctx.message.photo.length - 1];

        const fileId = photo.file_id;
        const file = await ctx.telegram.getFile(fileId);
        const fileUrl = `https://api.telegram.org/file/bot${token}/${file.file_path}`;
        this.event.media.push(fileUrl);
        ctx.telegram.sendMessage(ctx.chat.id, this.data['SECOND_MEDIA_QUESTION']?this.data['SECOND_MEDIA_QUESTION']:'الرساله غير متوفرة الان لكن تم تسجيل معلوماتك', {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: this.data['MEDIA_ACCEPT']?this.data['MEDIA_ACCEPT']:'الرساله غير متوفرة الان لكن تم تسجيل معلوماتك',
                  callback_data: "mediaAccept",
                },
                {
                  text: this.data['MEDIA_DECLINE']? this.data['MEDIA_DECLINE']:'الرساله غير متوفرة الان لكن تم تسجيل معلوماتك',
                  callback_data: "mediaDecline",
                },
              ],
            ],
          },
        });
      }
    }).catch((error: any, ctx: Context) => {
      console.error('Bot error occurred:', error); 
    });;

    this.bot.on(message("video"), async (ctx) => {
      if (this.member!.step === "media") {
        const video = ctx.message.video;

        const fileId = video.file_id;
        const file = await ctx.telegram.getFile(fileId);
        const fileUrl = `https://api.telegram.org/file/bot${token}/${file.file_path}`;

        this.event.media.push(fileUrl);
        ctx.telegram.sendMessage(ctx.chat.id, this.data['SECOND_MEDIA_QUESTION']?this.data['SECOND_MEDIA_QUESTION']:'الرساله غير متوفرة الان لكن تم تسجيل معلوماتك', {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: this.data['MEDIA_ACCEPT']?this.data['MEDIA_ACCEPT']:'الرساله غير متوفرة الان لكن تم تسجيل معلوماتك',
                  callback_data: "mediaAccept",
                },
                {
                  text:this.data['MEDIA_ACCEPT']?this.data['MEDIA_ACCEPT']:'الرساله غير متوفرة الان لكن تم تسجيل معلوماتك',
                  callback_data: "mediaDecline",
                },
              ],
            ],
          },
        });
      }
    }).catch((error: any, ctx: Context) => {
      console.error('Bot error occurred:', error); 
    });;
  }

  private setupMiddleware(): void {
  
  
    this.bot.use(async(ctx, next) => {
   
      if (ctx.message && ctx.message.from) {
        const userId = ctx.message.from.id;
        this.event.member.memberId = userId
        this.member! = await getOrCreateMember(userId);
      }
       
      return next(); 
    });


  }

  public async start(): Promise<void> {

    await this.bot.launch();
    console.log("Bot is running...");

    this.bot.catch((error) => {
      console.error('Error:', error);
      // Handle the error here or send an appropriate response to the user
    });

  }
}