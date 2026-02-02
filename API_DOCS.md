# REST API Documentation

Dokumentasi API untuk integrasi dengan n8n dan automation tools lainnya.

**Base URL:** `http://your-domain.com/api/v1`

---

## Endpoints

### 📖 GET /api/v1/articles

Mengambil daftar artikel dengan filter, pagination, dan search.

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | number | 50 | Jumlah data (max: 500) |
| `offset` | number | 0 | Skip data untuk pagination |
| `search` | string | - | Cari berdasarkan judul |
| `from_id` | number | - | Ambil data dengan id > from_id (incremental sync) |
| `format` | string | full | `full` atau `simple` |

**Example Request:**
```
GET /api/v1/articles?limit=10&search=jokowi
```

**Response:**
```json
{
  "success": true,
  "meta": {
    "total": 150,
    "limit": 10,
    "offset": 0,
    "returned": 10,
    "has_more": true
  },
  "data": [
    {
      "id": 1,
      "title": "Judul Berita",
      "url": "https://example.com/berita",
      "publish_date": "02-02-2026 10:00",
      "content_snippet": "Cuplikan konten..."
    }
  ]
}
```

---

### 📖 GET /api/v1/articles/:id

Mengambil satu artikel berdasarkan ID.

**Example Request:**
```
GET /api/v1/articles/1
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Judul Berita",
    "url": "https://example.com/berita",
    "publish_date": "02-02-2026 10:00",
    "content_snippet": "Cuplikan konten..."
  }
}
```

---

### 📖 GET /api/v1/latest

Mengambil artikel terbaru (untuk n8n polling trigger).

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `count` | number | 10 | Jumlah artikel (max: 100) |

**Response:**
```json
{
  "success": true,
  "count": 10,
  "last_id": 150,
  "data": [...]
}
```

---

### ✏️ POST /api/v1/articles

Menambah artikel baru.

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "title": "Judul Berita",
  "url": "https://example.com/berita",
  "publish_date": "02-02-2026",
  "content_snippet": "Cuplikan konten..."
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Article created",
  "data": {
    "id": 151,
    "title": "Judul Berita",
    ...
  }
}
```

---

### ✏️ POST /api/v1/articles/bulk

Menambah beberapa artikel sekaligus (max 100).

**Body:**
```json
{
  "articles": [
    {
      "title": "Berita 1",
      "url": "https://example.com/1",
      "publish_date": "02-02-2026"
    },
    {
      "title": "Berita 2",
      "url": "https://example.com/2"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "2 articles created, 0 skipped",
  "inserted": 2,
  "skipped": 0,
  "data": [...]
}
```

---

### 🗑️ DELETE /api/v1/articles/:id

Menghapus artikel berdasarkan ID.

**Example Request:**
```
DELETE /api/v1/articles/1
```

**Response:**
```json
{
  "success": true,
  "message": "Article deleted",
  "deleted": { ... }
}
```

---

### 📦 GET /api/v1/export

Export semua data dalam format JSON (untuk backup).

**Response:**
```json
{
  "success": true,
  "exported_at": "2026-02-02T04:30:00.000Z",
  "total": 150,
  "data": [...]
}
```

---

## Contoh Penggunaan di n8n

### 1. HTTP Request Node - Ambil Artikel

```
Method: GET
URL: http://your-domain.com/api/v1/articles?limit=50
```

### 2. HTTP Request Node - Incremental Sync

Gunakan `from_id` untuk mengambil data baru saja:

```
Method: GET
URL: http://your-domain.com/api/v1/articles?from_id={{$node.lastId}}
```

### 3. HTTP Request Node - Tambah Artikel

```
Method: POST
URL: http://your-domain.com/api/v1/articles
Headers: Content-Type: application/json
Body:
{
  "title": "{{$json.title}}",
  "url": "{{$json.url}}",
  "publish_date": "{{$json.date}}"
}
```

### 4. Polling Trigger (Cron + HTTP)

1. Tambahkan **Cron** node (setiap 5 menit)
2. Sambungkan ke **HTTP Request** node:
   - URL: `http://your-domain.com/api/v1/latest?count=10`
3. Simpan `last_id` ke workflow static data
4. Filter artikel baru dengan **IF** node

---

## Error Responses

| Status | Meaning |
|--------|---------|
| 400 | Bad Request (parameter tidak valid) |
| 404 | Not Found (artikel tidak ditemukan) |
| 409 | Conflict (URL sudah ada) |
| 500 | Server Error |

**Error Format:**
```json
{
  "success": false,
  "error": "Error message here"
}
```
