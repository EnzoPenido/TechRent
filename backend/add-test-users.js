const mysql = require('mysql2/promise');
require('dotenv').config();

async function addTestUsers() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const testUsers = [
      {
        nome: 'Admin Test',
        email: 'admin@test.com',
        senha: '$2a$10$OmJMFOgGPZXZ5wEFq.kile..Nzd8n3orDQxhZKJ1LHnaIWJgkw.uC', // admin123
        nivel_acesso: 'admin'
      },
      {
        nome: 'Técnico Test',
        email: 'tecnico@test.com',
        senha: '$2a$10$OmJMFOgGPZXZ5wEFq.kile..Nzd8n3orDQxhZKJ1LHnaIWJgkw.uC', // admin123
        nivel_acesso: 'tecnico'
      },
      {
        nome: 'Cliente Test',
        email: 'cliente@test.com',
        senha: '$2a$10$OmJMFOgGPZXZ5wEFq.kile..Nzd8n3orDQxhZKJ1LHnaIWJgkw.uC', // admin123
        nivel_acesso: 'cliente'
      }
    ];

    for (const user of testUsers) {
      try {
        const [existing] = await connection.query('SELECT id FROM usuarios WHERE email = ?', [user.email]);
        if (existing.length === 0) {
          await connection.query(
            'INSERT INTO usuarios (nome, email, senha, nivel_acesso) VALUES (?, ?, ?, ?)',
            [user.nome, user.email, user.senha, user.nivel_acesso]
          );
          console.log(`✓ Created user: ${user.email}`);
        } else {
          console.log(`- User already exists: ${user.email}`);
        }
      } catch (err) {
        console.error(`✗ Error with user ${user.email}:`, err.message);
      }
    }

    const [allUsers] = await connection.query('SELECT id, nome, email, nivel_acesso FROM usuarios');
    console.log('\nAll users in database:');
    console.table(allUsers);

    await connection.end();
  } catch (error) {
    console.error('Error:', error.message);
    if (connection) await connection.end();
  }
}

addTestUsers();
