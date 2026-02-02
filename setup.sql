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

-- ============================================
-- Contoh Query yang Berguna
-- ============================================

-- Lihat semua artikel:
-- SELECT * FROM rss_result ORDER BY id DESC;

-- Lihat 10 artikel terbaru:
-- SELECT * FROM rss_result ORDER BY id DESC LIMIT 10;

-- Hapus semua artikel:
-- DELETE FROM rss_result;
