import { Connection } from 'mysql2/promise';

async function seedRoles(connection: Connection) {
  try {
    const rolesToSeed = [

      { roleName: 'superadmin' },
      { roleName: 'admin' },
   
    ];

    for (const role of rolesToSeed) {
      await connection.query('INSERT INTO roles (role_name) VALUES (?)', [role.roleName]);
    }

    console.log(`Successfully seeded ${rolesToSeed.length} roles.`);
  } catch (error) {
    console.error('Error seeding roles:', error);
  }
}

export default seedRoles;