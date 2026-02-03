/**
 * Setup RSS Source Table
 * Run: node setup_rss_source.js
 */
require('dotenv').config();
const pool = require('./config/database');

// Province data
const provinces = [
    { id: 11, region: 'Aceh' },
    { id: 12, region: 'Sumatera Utara' },
    { id: 13, region: 'Sumatera Barat' },
    { id: 14, region: 'Riau' },
    { id: 15, region: 'Jambi' },
    { id: 16, region: 'Sumatera Selatan' },
    { id: 17, region: 'Bengkulu' },
    { id: 18, region: 'Lampung' },
    { id: 19, region: 'Kepulauan Bangka Belitung' },
    { id: 21, region: 'Kepulauan Riau' },
    { id: 31, region: 'Jakarta' },
    { id: 32, region: 'Jawa Barat' },
    { id: 33, region: 'Jawa Tengah' },
    { id: 34, region: 'DI Yogyakarta' },
    { id: 35, region: 'Jawa Timur' },
    { id: 36, region: 'Banten' },
    { id: 51, region: 'Bali' },
    { id: 52, region: 'Nusa Tenggara Barat' },
    { id: 53, region: 'Nusa Tenggara Timur' },
    { id: 61, region: 'Kalimantan Barat' },
    { id: 62, region: 'Kalimantan Tengah' },
    { id: 63, region: 'Kalimantan Selatan' },
    { id: 64, region: 'Kalimantan Timur' },
    { id: 65, region: 'Kalimantan Utara' },
    { id: 71, region: 'Sulawesi Utara' },
    { id: 72, region: 'Sulawesi Tengah' },
    { id: 73, region: 'Sulawesi Selatan' },
    { id: 74, region: 'Sulawesi Tenggara' },
    { id: 75, region: 'Gorontalo' },
    { id: 76, region: 'Sulawesi Barat' },
    { id: 81, region: 'Maluku' },
    { id: 82, region: 'Maluku Utara' },
    { id: 91, region: 'Papua Barat' },
    { id: 92, region: 'Papua' },
    { id: 93, region: 'Papua Selatan' },
    { id: 94, region: 'Papua Tengah' },
    { id: 95, region: 'Papua Pegunungan' },
    { id: 96, region: 'Papua Barat Daya' }
];

async function setup() {
    try {
        console.log('Setting up rss_source table...');

        // Drop old table if exists and create new one
        await pool.query(`
            DROP TABLE IF EXISTS media_online;
            DROP TABLE IF EXISTS rss_source;
            
            CREATE TABLE rss_source (
                id SERIAL PRIMARY KEY,
                url TEXT NOT NULL,
                region VARCHAR(100) NOT NULL,
                description TEXT,
                is_active BOOLEAN DEFAULT FALSE,
                province_id INTEGER NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('✅ rss_source table created');

        // Insert sample data
        const sampleData = [
            { url: 'https://jakarta.tribunnews.com/news', region: 'Jakarta', description: 'Berita Jakarta dari Tribunnews', is_active: true, province_id: 31 },
            { url: 'https://www.detik.com/jogja/berita', region: 'DI Yogyakarta', description: 'Berita Yogyakarta dari Detik', is_active: true, province_id: 34 },
            { url: 'https://aceh.tribunnews.com/news', region: 'Aceh', description: 'Berita Aceh dari Tribunnews', is_active: false, province_id: 11 }
        ];

        for (const data of sampleData) {
            await pool.query(
                'INSERT INTO rss_source (url, region, description, is_active, province_id) VALUES ($1, $2, $3, $4, $5)',
                [data.url, data.region, data.description, data.is_active, data.province_id]
            );
        }
        console.log('✅ Sample data added');

        // Show data
        const result = await pool.query('SELECT * FROM rss_source');
        console.log('Data in rss_source:', result.rows);

        process.exit(0);
    } catch (error) {
        console.error('❌ Setup failed:', error);
        process.exit(1);
    }
}

setup();
