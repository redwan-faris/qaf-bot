import express from 'express';
import { bot } from './bot/bot';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
 

 
bot.launch();

 const port = process.env.PORT ;
app.listen( port || 3000, () => {
  console.log(`Express server started on port ${port}`);
});
