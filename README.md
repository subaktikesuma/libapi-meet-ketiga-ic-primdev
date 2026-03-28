# 📚 Library API

REST API sederhana untuk manajemen perpustakaan (buku & pengguna) menggunakan **Express.js**, **Prisma ORM**, dan **PostgreSQL (Supabase)**.

## 🛠 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js v5
- **ORM:** Prisma v7
- **Database:** PostgreSQL (Supabase)
- **Authentication:** bcrypt (password hashing)

## 📁 Struktur Proyek

```
meet-ketiga/
├── config/
│   └── database.js          # Konfigurasi Prisma Client
├── controller/
│   ├── index.controller.js  # Barrel export semua controller
│   ├── books.controller.js  # Logic CRUD buku
│   └── users.controller.js  # Logic CRUD user
├── routes/
│   ├── index.route.js       # Router utama
│   ├── books.route.js       # Routing endpoint buku
│   └── users.route.js       # Routing endpoint user
├── prisma/
│   └── schema.prisma        # Prisma schema (model database)
├── .github/
│   └── workflows/
│       └── keep-alive.yml   # Cron job agar Supabase tidak pause
├── index.js                 # Entry point aplikasi
├── prisma.config.js         # Konfigurasi Prisma datasource
├── .env                     # Environment variables
└── package.json
```

## 🚀 Instalasi

```bash
# Clone repository
git clone <repo-url>
cd meet-ketiga

# Install dependencies
npm install

# Setup environment variables
# Buat file .env dengan isi:
DATABASE_URL="postgresql://<user>:<password>@<host>:6543/<db>?pgbouncer=true"
DIRECT_URL="postgresql://<user>:<password>@<host>:5432/<db>"

# Push schema ke database
npx prisma db push

# Generate Prisma Client
npx prisma generate

# Jalankan server
npx nodemon index.js
```

Server akan berjalan di `http://localhost:3000`

## 📖 API Endpoints

### Root

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET    | `/`      | Welcome message |

---

### 📚 Books

| Method | Endpoint     | Deskripsi            |
|--------|--------------|----------------------|
| GET    | `/books`     | Ambil semua buku     |
| GET    | `/books/:id` | Ambil buku by ID     |
| POST   | `/books`     | Tambah buku baru     |
| PUT    | `/books/:id` | Update buku by ID    |
| DELETE | `/books/:id` | Hapus buku by ID     |

#### Request Body (POST / PUT)

```json
{
  "title": "Judul Buku",
  "author": "Nama Penulis",
  "year": 2025,
  "available": true
}
```

---

### 👤 Users

| Method | Endpoint     | Deskripsi            |
|--------|--------------|----------------------|
| GET    | `/users`     | Ambil semua user     |
| GET    | `/users/:id` | Ambil user by ID     |
| POST   | `/users`     | Tambah user baru     |
| PUT    | `/users/:id` | Update user by ID    |
| DELETE | `/users/:id` | Hapus user by ID     |

#### Request Body (POST / PUT)

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "USER"
}
```

> **Note:** Password otomatis di-hash menggunakan bcrypt sebelum disimpan ke database.

---

## 🗄 Database Schema

### Users

| Field     | Type     | Keterangan             |
|-----------|----------|------------------------|
| id        | Int      | Primary key, auto-increment |
| name      | String   | Nama user              |
| email     | String   | Email (unique)         |
| password  | String   | Password (hashed, max 255) |
| role      | String   | Default: `"USER"`      |
| createdAt | DateTime | Timestamp otomatis     |

### Books

| Field     | Type     | Keterangan             |
|-----------|----------|------------------------|
| id        | Int      | Primary key, auto-increment |
| title     | String   | Judul buku             |
| author    | String   | Penulis buku           |
| year      | Int      | Tahun terbit           |
| available | Boolean  | Default: `true`        |
| createdAt | DateTime | Timestamp otomatis     |

## ⚙️ GitHub Actions

Project ini memiliki workflow **keep-alive** yang berjalan setiap 5 menit untuk ping database Supabase agar tidak auto-pause pada free tier.

Tambahkan secret `DATABASE_URL` di **Settings → Secrets → Actions** pada repository GitHub.
