import express from 'express';
import dotenv from 'dotenv';
import { myDataSource } from './app-data-source';
import routes from "./routes";
import { Bot } from './bot/bot';
import cors from 'cors';

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

export const bot = new Bot();


setTimeout(() => {
  bot.start();
}, 1000);
myDataSource
  .initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });

app.use('/', routes);
app.use((err:any, req:any, res:any, next:any) => {
  console.error(err);
  res.status(500).send('Internal Server Error');
});
const port = process.env.PORT;
app.listen(port || 3000, () => {
  console.log(`Express server started on port ${port}`);
});
