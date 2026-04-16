const mysql = require('mysql2/promise');
const fs = require('fs');
require('dotenv').config();

async function setupDatabase() {
  try {
    console.log('Connecting to MySQL...');
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT || 3306,
    });

    console.log('Connected! Reading schema file...');
    const schema = fs.readFileSync(__dirname + '/../bd/schema.sql', 'utf8');
    
    // Split the schema into individual statements
    const statements = schema.split(';').filter(s => s.trim());
    
    console.log(`Found ${statements.length} SQL statements`);
    
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          console.log('Executing:', statement.substring(0, 50) + '...');
          await connection.query(statement);
        } catch (err) {
          if (err.code === 'ER_DB_CREATE_EXISTS') {
            console.log('Database already exists, continuing...');
          } else {
            console.error('Error executing statement:', err.message);
          }
        }
      }
    }
    
    await connection.end();
    console.log('Database setup complete!');
  } catch (error) {
    console.error('Database setup failed:', error.message);
  }
}

setupDatabase();
