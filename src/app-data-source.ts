import { DataSource } from "typeorm"
​
export const myDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "root",
    database: "qaf_bot",
    entities: ["src/entity/*.js"],
    logging: true,
    synchronize: true,
})
