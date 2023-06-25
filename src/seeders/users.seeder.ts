import { Connection } from 'mysql2/promise';
import * as bcrypt from 'bcrypt';

async function seedUsers(connection: Connection) {
  try {
    const hashedPassword = await  bcrypt.hashSync('password1234', 8); 

    const userToSeed = {
      username: 'admin',
      password: hashedPassword,
      roleId: 1,
      name:'redwan'
    };

    await connection.query('INSERT INTO users (name,username, password, role_id) VALUES (?,?, ?, ?)', [
      userToSeed.name,
      userToSeed.username,
      userToSeed.password,
      userToSeed.roleId,
    ]); 

    console.log('Successfully seeded user.');
  } catch (error) {
    console.error('Error seeding user:', error);
  }
}

export default seedUsers;