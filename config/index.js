/**
 * Centralized Configuration
 * =========================
 * Load and export all configuration variables
 */

require('dotenv').config();

module.exports = {
    // Server config
    PORT: process.env.PORT || 3001,
    NODE_ENV: process.env.NODE_ENV || 'development',

    // CORS config
    corsOptions: {
        origin: process.env.ALLOWED_ORIGINS
            ? process.env.ALLOWED_ORIGINS.split(',')
            : '*',
        methods: ['GET', 'POST', 'DELETE'],
        allowedHeaders: ['Content-Type']
    },

    // Database config
    database: {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        database: process.env.DB_NAME || 'n8n_db',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || '123',
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000
    },

    // Session config
    session: {
        secret: process.env.SESSION_SECRET || 'news-scraper-secret-key-change-in-production',
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        }
    }
};
