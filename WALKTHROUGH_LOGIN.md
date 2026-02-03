# Walkthrough: Fitur Login/Logout

Dokumentasi implementasi fitur autentikasi session-based untuk aplikasi News Scraper.

## ✅ Hasil Implementasi

### File Baru yang Dibuat

| File | Deskripsi |
|------|-----------|
| `models/User.js` | Model untuk operasi user dengan bcrypt password verification |
| `controllers/AuthController.js` | Controller untuk login, logout, dan check auth |
| `middleware/authMiddleware.js` | Middleware untuk protect routes |
| `routes/auth.js` | Routes autentikasi |
| `public/login.html` | Halaman login dengan tema cyber |
| `setup_users.js` | Script untuk setup tabel users |

### File yang Dimodifikasi

| File | Perubahan |
|------|-----------|
| `setup.sql` | Tambah tabel `users` |
| `config/index.js` | Tambah session config |
| `index.js` | Tambah express-session middleware |
| `routes/index.js` | Mount auth routes, protect halaman utama |
| `public/index.html` | Tambah tombol logout |

---

## 🔐 Kredensial Default

| Field | Value |
|-------|-------|
| Username | `admin` |
| Password | `admin123` |

---

## 📋 Cara Setup

### 1. Setup Tabel Users

Jalankan script untuk membuat tabel users dan admin user:

```bash
node setup_users.js
```

Output yang diharapkan:
```
Creating users table...
✅ Users table created
✅ Admin user created (username: admin, password: admin123)
```

### 2. Jalankan Aplikasi

```bash
npm start
```

---

## 🧪 Testing

### Verified ✅

1. **API tetap accessible tanpa login** (untuk n8n)
   - `GET /api/v1/articles` → Returns data
   - `GET /health` → Returns `{"status":"ok"}`
   - `GET /auth/check` → Returns `{"authenticated":false}`

2. **Password verification**
   - Login dengan `admin/admin123` → berhasil
   - Model User dapat memverifikasi password dengan bcrypt

---

## 🔄 Flow Autentikasi

```
User akses / → Session ada? 
  → Ya → Tampilkan halaman utama
  → Tidak → Redirect ke /login → Form login → POST /login
      → Credentials valid?
          → Ya → Set session, redirect /
          → Tidak → Tampilkan error

Logout: Klik logout → POST /logout → Destroy session, redirect /login
```

---

## 📌 Catatan Penting

### Menambah User Baru

Untuk menambah user baru, insert langsung ke database:
```sql
-- Gunakan bcrypt untuk hash password
INSERT INTO users (username, password) VALUES ('newuser', '$hash_bcrypt');
```

Atau gunakan script helper:
```javascript
const User = require('./models/User');
await User.create('newuser', 'password123');
```

### API Endpoints Tidak Di-protect

Semua endpoint `/api/v1/*` tidak memerlukan autentikasi agar bisa diakses oleh n8n dengan satu link.

---

## 📂 Struktur File Baru

```
speccomp 03 - Copy/
├── middleware/
│   └── authMiddleware.js     # [NEW]
├── models/
│   ├── Article.js
│   └── User.js               # [NEW]
├── controllers/
│   ├── AuthController.js     # [NEW]
│   └── ...
├── routes/
│   ├── auth.js               # [NEW]
│   └── index.js              # [MODIFIED]
├── public/
│   ├── index.html            # [MODIFIED]
│   └── login.html            # [NEW]
├── setup_users.js            # [NEW] - Helper script
└── ...
```
