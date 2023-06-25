import { DataSource } from "typeorm"

export const myDataSource = new DataSource({
    type: "mysql",
    host: "127.0.0.1",
    port: 3306,
    username: "root",
    password: "root",
    database: "qaf",
    entities: ["src/entities/*{.js,.ts}"],
    logging: true,  
})
