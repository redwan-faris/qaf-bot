import { Telegraf, Context } from "telegraf";
import { message } from "telegraf/filters";
import dotenv from "dotenv";
import { EventInterface } from "../types/event.type";
import { downloadMedia,convertToHash } from "./helpers";
import { saveEvent, saveMedia, getBotMessages } from "./api";
import { Event } from "../entities/Event";
import { BotMessage } from "../entities/BotMessage";

dotenv.config();
const token = process.env.BOT_TOKEN;

export class Bot {
  private bot: Telegraf<Context>;
  private step: string;
  private event: EventInterface;
  private data:any;
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
    this.updateData();
    this.setupCommands();
    this.setupActions();
    this.setupMessageHandlers();
    this.setupMiddleware();
  }

  public updateData(){
    setTimeout(() => {
      getBotMessages().then((result) => {
        this.data = convertToHash(result);
      });
    }, 1000);
  }

  private setupCommands(): void {
    this.bot.command("start", (ctx: Context) => {
      ctx.reply(this.data['CREETING']);
    });

    this.bot.command("send", (ctx) => {
      ctx.telegram.sendMessage(ctx.chat.id, this.data['SENDER_TYPE_QUESTION'], {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: this.data['REPORTER'],
                callback_data: "reporter",
              },
              {
                text: this.data['BLOGGER'],
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
      ctx.replyWithHTML(this.data['REPORTER_NAME_QUESTION'], {
        reply_markup: {
          force_reply: true,
        },
      });

      this.step = "location";
    });

    this.bot.action("location", (ctx) => {
      ctx.deleteMessage();
      ctx.replyWithHTML(this.data['LOCATION_NAME_QUESTION'], {
        reply_markup: {
          force_reply: true,
        },
      });
      this.step = "event";
    });

    this.bot.action("mediaAccept", (ctx) => {
      ctx.deleteMessage();
      ctx.replyWithHTML(this.data['MEDIA_QUESTION'], {
        reply_markup: {
          force_reply: true,
        },
      });
      this.step = "media";
    });

    this.bot.action("mediaDecline", async (ctx) => {
      ctx.deleteMessage();
      ctx.replyWithHTML(this.data['GRATITUDE_MESSAGEX']);
      this.step = "finish";
      let paths = await downloadMedia(this.event.media);
      const newEvent: Event = await saveEvent(this.event);
      await saveMedia(paths, newEvent); 
    });
  }

  private setupMessageHandlers(): void {
    this.bot.on(message("text"), (ctx) => {
      if (this.step === "location") {
        const reporterName = ctx.message.text;
        if (reporterName) {
          this.event.reporter = reporterName;
        }
        ctx.replyWithHTML(this.data['LOCATION_NAME_QUESTION'], {
          reply_markup: {
            force_reply: true,
          },
        });
        this.step = "event";
      } else if (this.step === "event") {
        const location = ctx.message.text;
        this.event.address = location;
        ctx.replyWithHTML(this.data['EVENT_NAME_QUESTION'], {
          reply_markup: {
            force_reply: true,
          },
        });
        this.step = "media";
      } else if (this.step == "media") {
        const description = ctx.message.text;
        this.event.description = description;
        ctx.telegram.sendMessage(ctx.chat.id, this.data['MEDIA_QUESTION'], {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: this.data['MEDIA_ACCEPT'],
                  callback_data: "mediaAccept",
                },
                {
                  text: this.data['MEDIA_DECLINE'],
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
        ctx.telegram.sendMessage(ctx.chat.id, this.data['SECOND_MEDIA_QUESTION'], {
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
        ctx.telegram.sendMessage(ctx.chat.id, this.data['SECOND_MEDIA_QUESTION'], {
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