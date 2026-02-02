# Universal News Scraper

Aplikasi web scraper untuk mengambil artikel berita dan menyimpan ke database PostgreSQL.

## 📋 Prasyarat

Sebelum menginstall, pastikan laptop sudah terinstall:

1. **Node.js** (versi 16.0.0 atau lebih baru)
   - Download: https://nodejs.org/
   - Cek versi: `node --version`

2. **PostgreSQL** (versi 12 atau lebih baru)
   - Download: https://www.postgresql.org/download/
   - Cek versi: `psql --version`

3. **Git** (opsional, untuk clone repository)
   - Download: https://git-scm.com/

---

## 🚀 Langkah Instalasi

### Step 1: Copy/Clone Project

**Opsi A - Copy Manual:**
```
Salin seluruh folder project ke laptop tujuan
```

**Opsi B - Clone dari Git (jika ada repository):**
```bash
git clone <repository-url>
cd speccomp-03
```

---

### Step 2: Install Dependencies

Buka terminal/command prompt di folder project, lalu jalankan:

```bash
npm install
```

> ⏳ Proses ini akan menginstall semua package yang diperlukan (puppeteer, express, pg, dll)

---

### Step 3: Setup Database PostgreSQL

#### 3.1 Buat Database

Buka **pgAdmin** atau **psql**, lalu jalankan:

```sql
CREATE DATABASE n8n_db;
```

#### 3.2 Buat Tabel

Setelah database dibuat, hubungkan ke database `n8n_db`, lalu jalankan:

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

> 💡 Atau jalankan file `setup.sql` yang sudah disediakan

---

### Step 4: Konfigurasi Environment

Buat file `.env` di root folder project dengan isi:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=n8n_db
DB_USER=postgres
DB_PASSWORD=password_postgresql_anda

# CORS (opsional)
ALLOWED_ORIGINS=http://localhost:3001
```

> ⚠️ **Penting:** Ganti `DB_PASSWORD` dengan password PostgreSQL Anda!

---

### Step 5: Jalankan Aplikasi

```bash
npm start
```

Atau untuk development:
```bash
npm run dev
```

---

### Step 6: Akses Aplikasi

Buka browser dan akses:

```
http://localhost:3001
```

---

## ✅ Verifikasi Instalasi

Jika berhasil, Anda akan melihat di terminal:

```
✅ Database connected successfully!
🌍 Environment: development
🚀 Server running on port 3001
```

---

## 🔧 Troubleshooting

### Error: Database connection failed

1. Pastikan PostgreSQL sudah berjalan
2. Cek username dan password di file `.env`
3. Pastikan database `n8n_db` sudah dibuat

### Error: Port already in use

Ganti PORT di file `.env`:
```env
PORT=3002
```

### Error: Puppeteer failed to launch

Install Chromium dependencies (Linux):
```bash
sudo apt-get install -y libgbm-dev
```

Untuk Windows, Puppeteer biasanya download Chromium otomatis.

---

## 📁 Struktur Project

```
speccomp-03/
├── config/           # Konfigurasi database & environment
├── controllers/      # Logic controller API
├── models/           # Model database
├── routes/           # Definisi routes API
├── services/         # Business logic & scraper
├── public/           # Static files (HTML, CSS)
├── index.js          # Entry point aplikasi
├── package.json      # Dependencies & scripts
├── setup.sql         # Script setup database
└── .env              # Environment variables (buat manual)
```

---

## 📝 Scripts Tersedia

| Command | Deskripsi |
|---------|-----------|
| `npm start` | Jalankan aplikasi |
| `npm run dev` | Mode development |
| `npm run pm2:start` | Jalankan dengan PM2 |
| `npm run pm2:stop` | Stop PM2 |
| `npm run pm2:logs` | Lihat logs PM2 |

---

## 📞 Bantuan

Jika mengalami masalah, cek:
1. File `API_DOCS.md` untuk dokumentasi API
2. File `TUTORIAL.md` untuk panduan penggunaan
3. File `DEPLOYMENT.md` untuk panduan deployment

