# Panduan Deployment / Hosting

Panduan lengkap untuk meng-hosting aplikasi News Scraper ke berbagai platform.

---

## File Konfigurasi yang Tersedia

| File | Kegunaan |
|------|----------|
| `.env.example` | Template environment variables |
| `.htaccess` | Apache reverse proxy (cPanel) |
| `ecosystem.config.js` | PM2 process manager |
| `Procfile` | Heroku/Railway/Render |

---

## Opsi 1: VPS / Cloud Server (Recommended)

### Langkah-langkah:

1. **SSH ke server**
   ```bash
   ssh user@your-server-ip
   ```

2. **Install Node.js & PM2**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs
   sudo npm install -g pm2
   ```

3. **Install PostgreSQL**
   ```bash
   sudo apt install postgresql postgresql-contrib
   sudo -u postgres psql
   CREATE DATABASE n8n_db;
   \q
   ```

4. **Clone/Upload aplikasi**
   ```bash
   git clone <your-repo> /var/www/news-scraper
   cd /var/www/news-scraper
   npm install
   ```

5. **Konfigurasi Environment**
   ```bash
   cp .env.example .env
   nano .env  # Edit sesuai konfigurasi server
   ```

6. **Jalankan dengan PM2**
   ```bash
   pm2 start ecosystem.config.js --env production
   pm2 save
   pm2 startup
   ```

7. **Setup Nginx (Reverse Proxy)**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;

       location / {
           proxy_pass http://localhost:3001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

---

## Opsi 2: Platform Cloud (Heroku/Railway/Render)

### Railway (Gratis)

1. Buat akun di https://railway.app
2. Connect GitHub repository
3. Add PostgreSQL service
4. Set environment variables:
   - `DB_HOST` = (dari Railway PostgreSQL)
   - `DB_PORT` = 5432
   - `DB_NAME` = railway (atau nama db dari Railway)
   - `DB_USER` = (dari Railway PostgreSQL)
   - `DB_PASSWORD` = (dari Railway PostgreSQL)
5. Deploy otomatis!

### Render

1. Buat akun di https://render.com
2. Create new Web Service
3. Connect repository
4. Add PostgreSQL database
5. Set environment variables seperti Railway

---

## Opsi 3: cPanel/Shared Hosting

> ⚠️ **Catatan:** Tidak semua shared hosting mendukung Node.js

### Jika hosting mendukung Node.js:

1. Upload folder aplikasi via File Manager / FTP
2. Buka Terminal di cPanel
3. Jalankan:
   ```bash
   cd ~/public_html/news-scraper  # atau path aplikasi
   npm install
   ```
4. Setup Node.js Application di cPanel
5. Upload file `.htaccess` ke folder aplikasi

---

## Environment Variables

| Variable | Deskripsi | Contoh |
|----------|-----------|--------|
| `PORT` | Port server | `3001` |
| `NODE_ENV` | Environment | `production` |
| `DB_HOST` | Host database | `localhost` |
| `DB_PORT` | Port PostgreSQL | `5432` |
| `DB_NAME` | Nama database | `n8n_db` |
| `DB_USER` | Username DB | `postgres` |
| `DB_PASSWORD` | Password DB | `your_password` |
| `ALLOWED_ORIGINS` | CORS whitelist | `https://yourdomain.com` |

---

## Troubleshooting

### Error: EADDRINUSE (Port already in use)
```bash
# Cari proses yang menggunakan port
lsof -i :3001
# Kill proses
kill -9 <PID>
```

### Error: Connection refused ke database
- Pastikan PostgreSQL berjalan
- Cek firewall tidak memblokir port 5432
- Verifikasi credentials di file `.env`

### Puppeteer tidak berjalan
```bash
# Install dependencies Chromium di Linux
sudo apt install -y chromium-browser
# Atau install dependencies
sudo apt install -y gconf-service libasound2 libatk1.0-0 libcups2 libdbus-1-3 libgconf-2-4 libgtk-3-0 libnspr4 libnss3 libx11-xcb1 libxcomposite1 libxdamage1 libxrandr2 xdg-utils
```

---

## Selesai! 🎉

Aplikasi Anda sekarang siap untuk di-hosting!
