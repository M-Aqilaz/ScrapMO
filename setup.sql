-- ============================================
-- Script Setup Database untuk News Scraper
-- ============================================
-- Jalankan script ini di PostgreSQL untuk membuat
-- database dan tabel yang diperlukan.
--
-- Cara menjalankan:
-- 1. Buka psql atau pgAdmin
-- 2. Jalankan perintah di bawah ini satu per satu
-- ============================================

-- Langkah 1: Buat database (jalankan di psql atau pgAdmin)
-- Catatan: Anda harus terhubung ke database 'postgres' dulu
CREATE DATABASE n8n_db;

-- Langkah 2: Hubungkan ke database n8n_db
-- Di psql: \c n8n_db
-- Di pgAdmin: klik kanan database > Query Tool

-- Langkah 3: Buat tabel untuk menyimpan artikel berita
CREATE TABLE IF NOT EXISTS rss_result (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    url TEXT NOT NULL,
    publish_date VARCHAR(100),
    content_snippet TEXT
);

-- Langkah 4: Buat index untuk performa query yang lebih baik
CREATE INDEX IF NOT EXISTS idx_rss_result_id 
ON rss_result(id DESC);

-- Langkah 5: Buat tabel untuk menyimpan data user
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Langkah 6: Insert default admin user
-- Password: admin123 (sudah di-hash dengan bcrypt)
INSERT INTO users (username, password) VALUES 
('admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi')
ON CONFLICT (username) DO NOTHING;

-- Langkah 7: Buat tabel untuk menyimpan daftar media online
CREATE TABLE IF NOT EXISTS media_online (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Langkah 8: Insert contoh media (opsional)
INSERT INTO media_online (nama, url) VALUES 
('Tribunnews Jakarta', 'https://jakarta.tribunnews.com/news'),
('Detik Jogja', 'https://www.detik.com/jogja/berita'),
('Kompas', 'https://www.kompas.com/tag/berita-terkini')
ON CONFLICT DO NOTHING;

-- ============================================
-- Contoh Query yang Berguna
-- ============================================

-- Lihat semua artikel:
-- SELECT * FROM rss_result ORDER BY id DESC;

-- Lihat 10 artikel terbaru:
-- SELECT * FROM rss_result ORDER BY id DESC LIMIT 10;

-- Hapus semua artikel:
-- DELETE FROM rss_result;
