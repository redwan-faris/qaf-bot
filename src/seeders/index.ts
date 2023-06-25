import { createPool } from 'mysql2/promise';
import seedMessages from './messages.seeder';
import * as dotenv from 'dotenv';


dotenv.config(); 

async function runSeeds() {
  const pool = createPool({
 
    port: 3306,
    user: "root",
    password: "root",
    database: "qaf", 
  }); 
  const connection = await pool.getConnection();
 
  await seedMessages(connection);
 

  connection.release();
  pool.end();
}

runSeeds();