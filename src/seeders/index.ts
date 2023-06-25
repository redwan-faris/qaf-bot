import { createPool } from 'mysql2/promise';
import seedMessages from './messages.seeder';
import * as dotenv from 'dotenv';
import seedUsers from './users.seeder';
import seedRoles from './roles.seeder';


dotenv.config(); 

async function runSeeds() {
  const pool = createPool({
    host:'127.0.0.1',
    port: 3306,
    user: "root",
    password: "root",
    database: "qaf", 
  }); 
  const connection = await pool.getConnection();
 
  await seedMessages(connection);
  await seedRoles(connection);
  await seedUsers(connection);

  connection.release();
  pool.end();
}

runSeeds();