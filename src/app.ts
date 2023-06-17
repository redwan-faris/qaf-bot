import express from 'express';
import { bot } from './bot/bot';
import dotenv from 'dotenv';
import { myDataSource } from './app-data-source';

dotenv.config();
const app = express();
 
myDataSource
    .initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err)
    })
 
bot.launch();

const port = process.env.PORT ;
app.listen( port || 3000, () => {
  console.log(`Express server started on port ${port}`);
});
