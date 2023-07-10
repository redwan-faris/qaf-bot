import { Telegraf, Context, Markup } from "telegraf";
import { message } from "telegraf/filters";
import dotenv from "dotenv";
import { EventInterface } from "../types/event.type";
import { downloadMedia, convertToHash } from "./helpers";
import { saveEvent, saveMedia, getBotMessages, getOrCreateMember, updateMember } from './api';
import { Event } from "../entities/Event";
import { TypeEnum } from "../enums/TypeEnum";
import { Member } from '../entities/Member';

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

    this.bot = new Telegraf(token);
    this.bot.catch((error: any, ctx: Context) => {
      console.error('Bot error occurred:', error); 
    });

    this.event = {
      type: TypeEnum.BLOGGER,
      description: "",
      member: {
        address:'',
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
    this.bot.command("start", async (ctx: Context) => {
      try {
        if (ctx.message && ctx.message.from) {
          const userId = ctx.message.from.id;
          this.event.member.memberId = userId;
          this.member! = await getOrCreateMember(userId);
        }
        ctx.reply(this.data['CREETING'] || 'الرسالة غير متوفرة الآن لكن تم تسجيل معلوماتك', Markup.keyboard([
          ['/send'],
        ]).resize());
      } catch (error) {
        console.error('Error occurred while executing command "start":', error);
      }
    });

    this.bot.command("send", async (ctx) => {
      try {
        if (ctx.message && ctx.message.from) {
          const userId = ctx.message.from.id;
          this.event.member.memberId = userId;
          this.member! = await getOrCreateMember(userId);
        }

        ctx.telegram.sendMessage(ctx.chat.id, this.data['SENDER_TYPE_QUESTION'] || 'الرسالة غير متوفرة الآن لكن تم تسجيل معلوماتك', {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: this.data['REPORTER'] || 'الرسالة غير متوفرة الآن لكن تم تسجيل معلوماتك',
                  callback_data: "reporter",
                },
                {
                  text: this.data['BLOGGER'] || 'الرسالة غير متوفرة الآن لكن تم تسجيل معلوماتك',
                  callback_data: "blogger",
                },
              ],
            ],
          },
        });
      } catch (error) {
        console.error('Error occurred while executing command "send":', error);
      }
    });
  }

  private setupActions(): void {
    this.bot.action("reporter", async (ctx) => {
      try {
        await ctx.deleteMessage();
   
        if (this.member!?.full_name) {
          this.event.member.full_name = this.member!.full_name;
          ctx.replyWithHTML(this.data['LOCATION_NAME_QUESTION'] || 'الرسالة غير متوفرة الآن لكن تم تسجيل معلوماتك', {
            reply_markup: {
              force_reply: true,
            },
          });
          this.member!.step = "event";
          await updateMember(this.member!.id, "event");
        } else {
          ctx.replyWithHTML(this.data['REPORTER_NAME_QUESTION'] || 'الرسالة غير متوفرة الآن لكن تم تسجيل معلوماتك', {
            reply_markup: {
              force_reply: true,
            },
          });
          this.member!.step = "location";
        }
        this.event.type = TypeEnum.REPORTER;
      } catch (error) {
        console.error('Error occurred while executing action "reporter":', error);
      }
    });

    this.bot.action("blogger", async (ctx) => {
      try {
        await ctx.deleteMessage();
        if (this.member!?.full_name) {
          this.event.member.full_name = this.member!.full_name;
          ctx.replyWithHTML(this.data['LOCATION_NAME_QUESTION'] || 'الرسالة غير متوفرة الآن لكن تم تسجيل معلوماتك', {
            reply_markup: {
              force_reply: true,
            },
          });
          this.member!.step = "event";
          await updateMember(this.member!.id, "event");
        } else {
          ctx.replyWithHTML(this.data['REPORTER_NAME_QUESTION'] || 'الرسالة غير متوفرة الآن لكن تم تسجيل معلوماتك', {
            reply_markup: {
              force_reply: true,
            },
          });
          this.member!.step = "location";
          await updateMember(this.member!.id, "location");
        }
        this.event.type = TypeEnum.BLOGGER;
      } catch (error) {
        console.error('Error occurred while executing action "blogger":', error);
      }
    });

    this.bot.action("location", async (ctx) => {
      try {
        await ctx.deleteMessage();
        ctx.replyWithHTML(this.data['LOCATION_NAME_QUESTION'] || 'الرسالة غير متوفرة الآن لكن تم تسجيل معلوماتك', {
          reply_markup: {
            force_reply: true,
          },
        });
        this.member!.step = "event";
        await updateMember(this.member!.id, "event");
      } catch (error) {
        console.error('Error occurred while executing action "location":', error);
      }
    });

    this.bot.action("mediaAccept", async (ctx) => {
      try {
        await ctx.deleteMessage();
        ctx.replyWithHTML(this.data['MEDIA_QUESTION'] || 'الرسالة غير متوفرة الآن لكن تم تسجيل معلوماتك', {
          reply_markup: {
            force_reply: true,
          },
        });
        this.member!.step = "media";
      } catch (error) {
        console.error('Error occurred while executing action "mediaAccept":', error);
      }
    });

    this.bot.action("mediaDecline", async (ctx) => {
      try {
        await ctx.deleteMessage();
        ctx.replyWithHTML(this.data['GRATITUDE_MESSAGEX'] || 'الرسالة غير متوفرة الآن لكن تم تسجيل معلوماتك');
        if (this.member!) {
          this.member!.step = "";
          await updateMember(this.member!.id, "");
          const paths = await downloadMedia(this.event.media);
          const newEvent: Event = await saveEvent(this.event, this.member!.id);
          await saveMedia(paths, newEvent);
        }
      } catch (error) {
        console.error('Error occurred while executing action "mediaDecline":', error);
      }
    });
  }

  private setupMessageHandlers(): void {
    this.bot.on(message("text"), async (ctx) => {
      try {
        if (this.member!.step === "location") {
          const reporterName = ctx.message.text;
          if (reporterName) {
            this.event.member.full_name = reporterName;
          }
          ctx.replyWithHTML(this.data['LOCATION_NAME_QUESTION'] || 'الرسالة غير متوفرة الآن لكن تم تسجيل معلوماتك', {
            reply_markup: {
              force_reply: true,
            },
          });
          this.member!.step = "event";
          await updateMember(this.member!.id, "event");
        } else if (this.member!.step === "event") {
          const location = ctx.message.text;
          this.event.address = location;
          ctx.replyWithHTML(this.data['EVENT_NAME_QUESTION'] || 'الرسالة غير متوفرة الآن لكن تم تسجيل معلوماتك', {
            reply_markup: {
              force_reply: true,
            },
          });
          this.member!.step = "media";
          await updateMember(this.member!.id, "media");
        } else if (this.member!.step == "media") {
          const description = ctx.message.text;
          this.event.description = description;
          ctx.telegram.sendMessage(ctx.chat.id, this.data['MEDIA_QUESTION'] || 'الرسالة غير متوفرة الآن لكن تم تسجيل معلوماتك', {
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: this.data['MEDIA_ACCEPT'] || 'الرسالة غير متوفرة الآن لكن تم تسجيل معلوماتك',
                    callback_data: "mediaAccept",
                  },
                  {
                    text: this.data['MEDIA_DECLINE'] || 'الرسالة غير متوفرة الآن لكن تم تسجيل معلوماتك',
                    callback_data: "mediaDecline",
                  },
                ],
              ],
            },
          });
        }
      } catch (error) {
        console.error('Error occurred while handling message of type "text":', error);
      }
    });

    this.bot.on(message("photo"), async (ctx) => {
      try {
        if (this.member!.step === "media") {
          const photo = ctx.message.photo[ctx.message.photo.length - 1];
          const fileId = photo.file_id;
          const file = await ctx.telegram.getFile(fileId);
          const fileUrl = `https://api.telegram.org/file/bot${token}/${file.file_path}`;
          this.event.media.push(fileUrl);
          ctx.telegram.sendMessage(ctx.chat.id, this.data['SECOND_MEDIA_QUESTION'] || 'الرسالة غير متوفرة الآن لكن تم تسجيل معلوماتك', {
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: this.data['MEDIA_ACCEPT'] || 'الرسالة غير متوفرة الآن لكن تم تسجيل معلوماتك',
                    callback_data: "mediaAccept",
                  },
                  {
                    text: this.data['MEDIA_DECLINE'] || 'الرسالة غير متوفرة الآن لكن تم تسجيل معلوماتك',
                    callback_data: "mediaDecline",
                  },
                ],
              ],
            },
          });
        }
      } catch (error) {
        console.error('Error occurred while handling message of type "photo":', error);
      }
    });

    this.bot.on(message("video"), async (ctx) => {
      try {
        if (this.member!.step === "media") {
          const video = ctx.message.video;
          const fileId = video.file_id;
          const file = await ctx.telegram.getFile(fileId);
          const fileUrl = `https://api.telegram.org/file/bot${token}/${file.file_path}`;
          this.event.media.push(fileUrl);
          ctx.telegram.sendMessage(ctx.chat.id, this.data['SECOND_MEDIA_QUESTION'] || 'الرسالة غير متوفرة الآن لكن تم تسجيل معلوماتك', {
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: this.data['MEDIA_ACCEPT'] || 'الرسالة غير متوفرة الآن لكن تم تسجيل معلوماتك',
                    callback_data: "mediaAccept",
                  },
                  {
                    text: this.data['MEDIA_DECLINE'] || 'الرسالة غير متوفرة الآن لكن تم تسجيل معلوماتك',
                    callback_data: "mediaDecline",
                  },
                ],
              ],
            },
          });
        }
      } catch (error) {
        console.error('Error occurred while handling message of type "video":', error);
      }
    });
  }

  private setupMiddleware(): void {
    this.bot.use(async (ctx, next) => {
      try {
        if (ctx.message && ctx.message.from) {
          const userId = ctx.message.from.id;
          this.event.member.memberId = userId;
          this.member! = await getOrCreateMember(userId);
        }
        return next();
      } catch (error) {
        console.error('Error occurred in middleware:', error);
      }
    });
  }

  public async start(): Promise<void> {
    try {
      await this.bot.launch();
      console.log("Bot is running...");
    } catch (error) {
      console.error('Error occurred while starting the bot:', error);
    }

    this.bot.catch((error) => {
      console.error('Error:', error);
    });
  }
}
