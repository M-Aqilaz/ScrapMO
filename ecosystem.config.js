// PM2 Ecosystem Configuration
// ============================
// File ini digunakan untuk menjalankan aplikasi dengan PM2 (Process Manager)
// Install PM2: npm install -g pm2
// Jalankan: pm2 start ecosystem.config.js

module.exports = {
    apps: [{
        name: 'news-scraper',
        script: 'server.js',
        instances: 1, // Gunakan 'max' untuk cluster mode
        autorestart: true,
        watch: false,
        max_memory_restart: '500M',
        env: {
            NODE_ENV: 'development',
            PORT: 3001
        },
        env_production: {
            NODE_ENV: 'production',
            PORT: 3001
        },
        // Log configuration
        log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
        error_file: './logs/error.log',
        out_file: './logs/out.log',
        merge_logs: true,
    }]
};
