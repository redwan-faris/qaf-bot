    import express from 'express';
 
    import dotenv from 'dotenv';
    import { myDataSource } from './app-data-source';
    import routes from "./routes";
import { bot } from './bot/bot';

    dotenv.config();
    const app = express();
    app.use(express.json());

    myDataSource
        .initialize()
        .then(() => {
            console.log("Data Source has been initialized!")
            bot.launch()
        })
        .catch((err) => {
            console.error("Error during Data Source initialization:", err)
        })
    app.use('/', routes);



    const port = process.env.PORT ;
    app.listen( port || 3000, () => {
    console.log(`Express server started on port ${port}`);
    });
