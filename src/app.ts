import express from 'express';
import dotenv from 'dotenv';
import { myDataSource } from './app-data-source';
import routes from "./routes";
import { Bot } from './bot/bot';

dotenv.config();
const app = express();
app.use(express.json());

const bot = new Bot();
bot.start();
myDataSource
  .initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });

app.use('/', routes);

const port = process.env.PORT;
app.listen(port || 3000, () => {
  console.log(`Express server started on port ${port}`);
});
