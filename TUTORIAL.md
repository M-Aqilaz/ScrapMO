# Tutorial: Menghubungkan PostgreSQL dengan Aplikasi News Scraper

Tutorial lengkap dalam Bahasa Indonesia untuk mengintegrasikan database PostgreSQL dengan aplikasi web scraper berita.

---

## Daftar Isi

1. [Persyaratan Sistem](#1-persyaratan-sistem)
2. [Instalasi PostgreSQL](#2-instalasi-postgresql)
3. [Setup Database](#3-setup-database)
4. [Konfigurasi Aplikasi](#4-konfigurasi-aplikasi)
5. [Menjalankan Aplikasi](#5-menjalankan-aplikasi)
6. [Penggunaan Aplikasi](#6-penggunaan-aplikasi)
7. [Troubleshooting](#7-troubleshooting)

---

## 1. Persyaratan Sistem

Sebelum memulai, pastikan Anda memiliki:

- **Node.js** versi 16 atau lebih baru
- **npm** (otomatis terinstall bersama Node.js)
- **PostgreSQL** versi 12 atau lebih baru
- **Koneksi internet** untuk scraping

### Cek Versi Node.js

Buka Command Prompt atau PowerShell, ketik:

```bash
node --version
npm --version
```

Jika belum terinstall, download dari: https://nodejs.org/

---

## 2. Instalasi PostgreSQL

### Langkah 2.1: Download PostgreSQL

1. Kunjungi: https://www.postgresql.org/download/windows/
2. Klik **"Download the installer"**
3. Pilih versi terbaru (contoh: PostgreSQL 16.x)
4. Download file installer (.exe)

### Langkah 2.2: Install PostgreSQL

1. Jalankan file installer yang sudah didownload
2. Ikuti wizard instalasi:
   - Pilih lokasi instalasi (default: `C:\Program Files\PostgreSQL\16`)
   - **PENTING:** Pada layar "Password", masukkan password yang **mudah diingat**
   - Catat password ini! Anda akan membutuhkannya nanti
   - Port default: `5432` (biarkan default)
   - Locale: Default
3. Tunggu proses instalasi selesai
4. Jangan centang "Stack Builder" saat instalasi selesai

### Langkah 2.3: Verifikasi Instalasi

1. Buka **Windows Search** (tekan tombol Windows)
2. Ketik **"pgAdmin 4"** dan buka aplikasinya
3. Jika pgAdmin terbuka dengan baik, PostgreSQL sudah terinstall

---

## 3. Setup Database

### Opsi A: Menggunakan pgAdmin (Visual/GUI)

#### Langkah 3.1: Buka pgAdmin

1. Buka **pgAdmin 4** dari Start Menu
2. Saat pertama kali, Anda akan diminta membuat "master password" untuk pgAdmin
3. Di panel kiri, klik **Servers** > **PostgreSQL 16** (atau versi Anda)
4. Masukkan password PostgreSQL yang Anda buat saat instalasi

#### Langkah 3.2: Buat Database Baru

1. Klik kanan pada **Databases**
2. Pilih **Create** > **Database...**
3. Isi:
   - **Database**: `n8n_db`
   - Biarkan setting lain default
4. Klik **Save**

#### Langkah 3.3: Buat Tabel

1. Klik kanan pada database `n8n_db`
2. Pilih **Query Tool**
3. Copy-paste script berikut:

```sql
CREATE TABLE IF NOT EXISTS rss_result (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    url TEXT NOT NULL,
    publish_date VARCHAR(100),
    content_snippet TEXT
);

CREATE INDEX IF NOT EXISTS idx_rss_result_id 
ON rss_result(id DESC);
```

4. Klik tombol **Execute** (ikon ▶ atau tekan F5)
5. Jika berhasil, akan muncul pesan "Query returned successfully"

---

### Opsi B: Menggunakan Command Line (psql)

#### Langkah 3.1: Buka psql

1. Buka **SQL Shell (psql)** dari Start Menu
2. Tekan Enter untuk setiap prompt (gunakan default), masukkan password saat diminta

#### Langkah 3.2: Buat Database dan Tabel

```sql
-- Buat database
CREATE DATABASE n8n_db;

-- Pindah ke database baru
\c n8n_db

-- Buat tabel
CREATE TABLE IF NOT EXISTS rss_result (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    url TEXT NOT NULL,
    publish_date VARCHAR(100),
    content_snippet TEXT
);
```

---

## 4. Konfigurasi Aplikasi

### Langkah 4.1: Edit File Konfigurasi Database

1. Buka folder aplikasi: `speccomp 02 - Copyin`
2. Buka file `db.config.js` dengan text editor (Notepad, VS Code, dll)
3. Ubah nilai `password` sesuai password PostgreSQL Anda:

```javascript
module.exports = {
    host: 'localhost',
    port: 5432,
    database: 'n8n_db',
    user: 'postgres',
    password: 'GANTI_DENGAN_PASSWORD_ANDA',  // <-- Ubah ini!
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
};
```

4. Simpan file

### Langkah 4.2: Install Dependencies

Buka Command Prompt atau PowerShell di folder aplikasi:

```bash
cd "C:\Users\ASUS TUF\Downloads\coba\speccomp 02 - Copyin"
npm install
```

Tunggu sampai proses instalasi selesai.

---

## 5. Menjalankan Aplikasi

### Langkah 5.1: Start Server

```bash
npm start
```

Jika berhasil, akan muncul pesan:

```
Server running on http://localhost:3001
Database connected successfully!
```

### Langkah 5.2: Buka Aplikasi

1. Buka browser (Chrome, Firefox, Edge)
2. Kunjungi: http://localhost:3001

---

## 6. Penggunaan Aplikasi

### Scraping dan Simpan ke Database

1. Masukkan **URL sumber berita** (contoh: `https://aceh.tribunnews.com/news`)
2. Pilih **Tanggal Mulai** dan **Tanggal Akhir**
3. Klik tombol **"Simpan ke Database"**
4. Tunggu proses scraping selesai (1-2 menit)
5. Jika berhasil, akan muncul pesan sukses

### Melihat Data di Database

1. Klik tombol **"Lihat Data"** di aplikasi web untuk melihat data langsung
2. Atau buka pgAdmin dan jalankan query:

```sql
SELECT * FROM rss_result ORDER BY id DESC LIMIT 20;
```

---

## 7. Troubleshooting

### Error: "Connection refused" atau "ECONNREFUSED"

**Penyebab:** PostgreSQL tidak berjalan

**Solusi:**
1. Buka **Windows Services** (ketik `services.msc` di Run)
2. Cari service bernama **"postgresql-x64-16"** (atau versi Anda)
3. Klik kanan > **Start**

---

### Error: "password authentication failed"

**Penyebab:** Password di `db.config.js` tidak sesuai

**Solusi:**
1. Pastikan password di `db.config.js` sama persis dengan password PostgreSQL
2. Perhatikan huruf besar/kecil (case-sensitive)

---

### Error: "database 'n8n_db' does not exist"

**Penyebab:** Database belum dibuat

**Solusi:**
Ikuti langkah **Setup Database** di atas untuk membuat database `n8n_db`

---

### Error: "relation 'rss_result' does not exist"

**Penyebab:** Tabel belum dibuat

**Solusi:**
Jalankan script SQL untuk membuat tabel (lihat Langkah 3.3)

---

### Puppeteer Error: "Failed to launch browser"

**Penyebab:** Chrome/Chromium tidak bisa dijalankan

**Solusi:**
1. Pastikan tidak ada antivirus yang memblokir
2. Jalankan command prompt sebagai **Administrator**
3. Install ulang puppeteer: `npm install puppeteer`

---

## Struktur Tabel rss_result

| Kolom | Tipe | Deskripsi |
|-------|------|-----------|
| id | SERIAL | ID unik (auto-increment) |
| title | VARCHAR(500) | Judul berita |
| url | TEXT | URL artikel |
| publish_date | VARCHAR(100) | Tanggal terbit |
| content_snippet | TEXT | Cuplikan konten |

---

## Selesai! 🎉

Aplikasi Anda sekarang sudah terhubung dengan PostgreSQL. Semua hasil scraping akan tersimpan di database dan bisa diakses kapan saja.

Jika ada pertanyaan atau masalah, silakan hubungi pengembang.
