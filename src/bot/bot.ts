import { Telegraf, Context, Markup, session } from "telegraf";
import { message } from "telegraf/filters";
import dotenv from "dotenv";
import { EventInterface } from "../types/event.type";
import { downloadMedia, convertToHash } from "./helpers";
import { saveEvent, saveMedia, getBotMessages, checkIfUserExist, getOrCreateMember, updateMember } from './api';
import { Event } from "../entities/Event";
import { TypeEnum } from "../enums/TypeEnum";
import { Member } from '../entities/Member'
dotenv.config();
const token = process.env.BOT_TOKEN;

export class Bot {
  private bot: Telegraf<Context>;
  private step: string;
  private event: any = {};
  private data: any;
  private member: { [key: number]: Member };
  private sessions: { [key: number]: EventInterface };

  constructor() {
    if (!token) {
      console.error("BOT_TOKEN is not defined in the environment variables");
      process.exit(1);
    }

    this.bot = new Telegraf(token);
    this.member = {};
    this.sessions = {};

    this.bot.catch((error: any, ctx: Context) => {
      console.error('Bot error occurred:', error);
    });

    this.event = {
      type: TypeEnum.BLOGGER,
      description: "",
    
      address: "",
      media: [] as string[],
    };
    this.updateData();
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
          this.member[userId] = await getOrCreateMember(userId);
          this.sessions[userId] = { ...this.event };
    
          this.sessions[userId].member.memberId = userId;
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
        
          this.member[userId] = await getOrCreateMember(userId);
          this.sessions[userId] = { ...this.event };
          this.sessions[userId].member = {...{
            full_name:'',
            memberId:0
          }}
          this.sessions[userId].member.memberId = userId; 
 
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
    this.bot.action("reporter", async (ctx:any) => { 
      const userId = ctx.from?.id;
       
      try {
        await ctx.deleteMessage();
        if (this.member[userId]?.full_name) {
          this.sessions[userId].member.full_name = this.member[userId].full_name;
          ;
          ctx.replyWithHTML(this.data['LOCATION_NAME_QUESTION'] || 'الرسالة غير متوفرة الآن لكن تم تسجيل معلوماتك', {
            reply_markup: {
              force_reply: true,
            },
          });
          this.member[userId].step = "event";
          await updateMember(this.member[userId].id, "event");
        } else {
          ctx.replyWithHTML(this.data['REPORTER_NAME_QUESTION'] || 'الرسالة غير متوفرة الآن لكن تم تسجيل معلوماتك', {
            reply_markup: {
              force_reply: true,
            },
          });
          this.member[userId].step = "location";
          ;
        }
        this.sessions[userId].type = TypeEnum.REPORTER;
      } catch (error) {
        console.error('Error occurred while executing action "reporter":', error);
      }
    });

    this.bot.action("blogger", async (ctx:any) => {
      const userId = ctx.from?.id;
 
      try {
        await ctx.deleteMessage();
        if (this.member[userId]?.full_name) {
          this.sessions[userId].member.full_name = this.member[userId].full_name;
          
          ctx.replyWithHTML(this.data['LOCATION_NAME_QUESTION'] || 'الرسالة غير متوفرة الآن لكن تم تسجيل معلوماتك', {
            reply_markup: {
              force_reply: true,
            },
          });
          this.member[userId].step = "event";
          
          await updateMember(this.member[userId].id, "event");
        } else {
          ctx.replyWithHTML(this.data['REPORTER_NAME_QUESTION'] || 'الرسالة غير متوفرة الآن لكن تم تسجيل معلوماتك', {
            reply_markup: {
              force_reply: true,
            },
          });
          this.member[userId].step = "location";
      
          await updateMember(this.member[userId].id, "location");
        }
        this.sessions[userId].type = TypeEnum.BLOGGER;
      } catch (error) {
        console.error('Error occurred while executing action "blogger":', error);
      }
    });

    this.bot.action("location", async (ctx:any) => {
      const userId = ctx.from?.id;
      try {
        await ctx.deleteMessage();
        ctx.replyWithHTML(this.data['LOCATION_NAME_QUESTION'] || 'الرسالة غير متوفرة الآن لكن تم تسجيل معلوماتك', {
          reply_markup: {
            force_reply: true,
          },
        });
        this.member[userId].step = "event";
        ;
        await updateMember(this.member[userId].id, "event");
      } catch (error) {
        console.error('Error occurred while executing action "location":', error);
      }
    });

    this.bot.action("mediaAccept", async (ctx:any) => {
      const userId = ctx.from?.id;
      try {
        await ctx.deleteMessage();
        ctx.replyWithHTML(this.data['MEDIA_QUESTION'] || 'الرسالة غير متوفرة الآن لكن تم تسجيل معلوماتك', {
          reply_markup: {
            force_reply: true,
          },
        });
        this.member[userId].step = "media";
        ;
      } catch (error) {
        console.error('Error occurred while executing action "mediaAccept":', error);
      }
    });

    this.bot.action("mediaDecline", async (ctx:any) => {
      const userId = ctx.from?.id;
      console.log(this.sessions)
      try { 
        await ctx.deleteMessage();
        ctx.replyWithHTML(this.data['GRATITUDE_MESSAGEX'] || 'الرسالة غير متوفرة الآن لكن تم تسجيل معلوماتك');
        if (this.member[userId]) {
          this.member[userId].step = "";
          
          await updateMember(this.member[userId].id, "");
          const paths = await downloadMedia(this.sessions[userId].media);
          const newEvent: Event = await saveEvent(this.sessions[userId], this.member[userId].id);
          await saveMedia(paths, newEvent);
          delete this.sessions[userId] 
        }
      } catch (error) {
        console.error('Error occurred while executing action "mediaDecline":', error);
      }
    });
  }

  private setupMessageHandlers(): void {
    this.bot.on(message("text"), async (ctx) => {
      const userId = ctx.from?.id;
      try {
        if (this.member[userId].step === "location") {
          const reporterName = ctx.message.text;
          if (reporterName) {
            this.sessions[userId].member.full_name = reporterName;
          }
          ctx.replyWithHTML(this.data['LOCATION_NAME_QUESTION'] || 'الرسالة غير متوفرة الآن لكن تم تسجيل معلوماتك', {
            reply_markup: {
              force_reply: true,
            },
          });
          this.member[userId].step = "event";
          await updateMember(this.member[userId].id, "event");
        } else if (this.member[userId].step === "event") {
          const location = ctx.message.text;
          this.sessions[userId].address = location;
          ctx.replyWithHTML(this.data['EVENT_NAME_QUESTION'] || 'الرسالة غير متوفرة الآن لكن تم تسجيل معلوماتك', {
            reply_markup: {
              force_reply: true,
            },
          });
          this.member[userId].step = "media";
          ;
          await updateMember(this.member[userId].id, "media");
        } else if (this.member[userId].step == "media") {
          const description = ctx.message.text;
          this.sessions[userId].description = description;
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
      const userId = ctx.from?.id;
      if (userId) {
        const member = this.member[userId];

        try {
          if (member && member.step === "media") {
            const photo = ctx.message.photo[ctx.message.photo.length - 1];
            const fileId = photo.file_id;
            const file = await ctx.telegram.getFile(fileId);
            const fileUrl = `https://api.telegram.org/file/bot${token}/${file.file_path}`;
            this.sessions[userId].media.push(fileUrl);
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
      }
    });

    this.bot.on(message("video"), async (ctx) => {
      const userId = ctx.from?.id;
      if (userId) {
        const member = this.member[userId];

        try {
          if (member && member.step === "media") {
            const video = ctx.message.video;
            const fileId = video.file_id;
            const file = await ctx.telegram.getFile(fileId);
            const fileUrl = `https://api.telegram.org/file/bot${token}/${file.file_path}`;
            this.sessions[userId].media.push(fileUrl);
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
