// Setup users table
const pool = require('./config/database');
const bcrypt = require('bcryptjs');

async function setupUsersTable() {
    try {
        console.log('Creating users table...');

        // Create table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Users table created');

        // Hash password for admin
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);
        console.log('Generated hash for admin123:', hashedPassword);

        // Insert admin user
        await pool.query(`
            INSERT INTO users (username, password) 
            VALUES ($1, $2)
            ON CONFLICT (username) DO NOTHING
        `, ['admin', hashedPassword]);
        console.log('✅ Admin user created (username: admin, password: admin123)');

        // Verify
        const result = await pool.query('SELECT id, username, created_at FROM users');
        console.log('Users in database:', result.rows);

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

setupUsersTable();
