import { DataSource } from "typeorm"
import dotenv from 'dotenv';
dotenv.config(); 
export const myDataSource = new DataSource({
    type: "mysql",
    host: "127.0.0.1",
    port: 3306,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: ["src/entities/*{.js,.ts}"],
    logging: false,  
    synchronize:true
})
