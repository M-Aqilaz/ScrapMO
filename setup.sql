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

-- Langkah 7: Buat tabel untuk menyimpan RSS Source
CREATE TABLE IF NOT EXISTS rss_source (
    id SERIAL PRIMARY KEY,
    url TEXT NOT NULL,
    region VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT FALSE,
    province_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Langkah 8: Insert contoh RSS Source
INSERT INTO rss_source (url, region, description, is_active, province_id) VALUES 
('https://jakarta.tribunnews.com/news', 'Jakarta', 'Berita Jakarta dari Tribunnews', true, 31),
('https://www.detik.com/jogja/berita', 'DI Yogyakarta', 'Berita Yogyakarta dari Detik', true, 34),
('https://aceh.tribunnews.com/news', 'Aceh', 'Berita Aceh dari Tribunnews', false, 11)
ON CONFLICT DO NOTHING;

-- ============================================
-- Contoh Query yang Berguna
-- ============================================

-- Lihat semua artikel:
-- SELECT * FROM rss_result ORDER BY id DESC;

-- Lihat 10 artikel terbaru:
-- SELECT * FROM rss_result ORDER BY id DESC LIMIT 10;

-- Lihat RSS Source yang aktif:
-- SELECT * FROM rss_source WHERE is_active = TRUE ORDER BY region;

-- Hapus semua artikel:
-- DELETE FROM rss_result;

