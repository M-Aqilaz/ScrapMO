// Setup media_online table
const pool = require('./config/database');

async function setupMediaTable() {
    try {
        console.log('Creating media_online table...');

        // Create table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS media_online (
                id SERIAL PRIMARY KEY,
                nama VARCHAR(100) NOT NULL,
                url TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ media_online table created');

        // Insert sample data
        await pool.query(`
            INSERT INTO media_online (nama, url) VALUES 
            ('Tribunnews Jakarta', 'https://jakarta.tribunnews.com/news'),
            ('Detik Jogja', 'https://www.detik.com/jogja/berita'),
            ('Kompas', 'https://www.kompas.com/tag/berita-terkini')
            ON CONFLICT DO NOTHING
        `);
        console.log('✅ Sample media added');

        // Verify
        const result = await pool.query('SELECT * FROM media_online');
        console.log('Media in database:', result.rows);

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

setupMediaTable();
