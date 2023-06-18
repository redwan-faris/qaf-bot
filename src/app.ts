import express from 'express';
import { bot } from './bot/bot';
import dotenv from 'dotenv';
import { myDataSource } from './app-data-source';
import routes from "./views";

dotenv.config();
const app = express();
app.use(express.json());

myDataSource
    .initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err)
    })
app.use('/', routes);
    
bot.launch();

const port = process.env.PORT ;
app.listen( port || 3000, () => {
  console.log(`Express server started on port ${port}`);
});
