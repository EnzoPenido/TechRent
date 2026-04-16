const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function seedUsers() {
  let connection;
  try {
    console.log('Connecting to database...');
    console.log('DB Config:', {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      database: process.env.DB_NAME,
    });
    
    // First, connect without database to create it if it doesn't exist
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });
    
    console.log('Connected! Creating database if needed...');
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
    await connection.query(`USE ${process.env.DB_NAME}`);
    
    // Check if users already exist
    const [users] = await connection.query('SELECT COUNT(*) as count FROM usuarios');
    console.log('Current users in database:', users[0].count);
    
    if (users[0].count === 0) {
      console.log('No users found, creating test users...');
      
      const testUsers = [
        { nome: 'Admin User', email: 'admin@techrent.com', senha: 'admin123', nivel_acesso: 'admin' },
        { nome: 'Técnico User', email: 'tecnico@techrent.com', senha: 'tech123', nivel_acesso: 'tecnico' },
        { nome: 'Cliente User', email: 'cliente@techrent.com', senha: 'client123', nivel_acesso: 'cliente' },
      ];
      
      for (const user of testUsers) {
        const senhaHash = await bcrypt.hash(user.senha, 10);
        try {
          await connection.query(
            'INSERT INTO usuarios (nome, email, senha, nivel_acesso) VALUES (?, ?, ?, ?)',
            [user.nome, user.email, senhaHash, user.nivel_acesso]
          );
          console.log(`Created user: ${user.email}`);
        } catch (err) {
          console.error(`Error creating user ${user.email}:`, err.message);
        }
      }
    } else {
      console.log('Users already exist in database');
    }
    
    // Show all users (without passwords)
    const [allUsers] = await connection.query('SELECT id, nome, email, nivel_acesso FROM usuarios');
    console.log('\nCurrent users in database:');
    console.table(allUsers);
    
    await connection.end();
    
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error.message);
    console.error('Full error:', error);
    if (error.sql) console.error('SQL:', error.sql);
    if (error.errno) console.error('Error Code:', error.errno);
    if (connection) await connection.end();
    process.exit(1);
  }
}

seedUsers();

seedUsers();
