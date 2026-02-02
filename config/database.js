/**
 * Database Connection Pool
 * ========================
 * PostgreSQL connection pool setup
 */

const { Pool } = require('pg');
const config = require('./index');

const pool = new Pool(config.database);

// Test connection on startup
pool.connect()
    .then(client => {
        console.log('✅ Database connected successfully!');
        console.log(`🌍 Environment: ${config.NODE_ENV}`);
        client.release();
    })
    .catch(err => {
        console.error('❌ Database connection error:', err.message);
        console.error('💡 Pastikan PostgreSQL berjalan dan konfigurasi sudah benar.');
    });

module.exports = pool;
