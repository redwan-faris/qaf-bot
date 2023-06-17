import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';

dotenv.config(); 
const token = process.env.BOT_TOKEN;

if (!token) {
    console.error('BOT_TOKEN is not defined in the environment variables');
    process.exit(1);
  }

export const bot = new Telegraf(token);

 
bot.command('start', (ctx) => {
  ctx.reply('مرحبا بك في بوت انا مراسل');
});

bot.use((ctx, next) => {
 
  console.log('Received update:', ctx.update);
 
  return next();
});
