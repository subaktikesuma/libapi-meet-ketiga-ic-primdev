# 📚 Library API

REST API untuk manajemen perpustakaan menggunakan **Express.js**, **Prisma ORM**, dan **PostgreSQL (Supabase)** — dilengkapi autentikasi JWT, otorisasi berbasis role, validasi input, dan dokumentasi Swagger.

## 🛠 Tech Stack

| Layer | Teknologi |
|---|---|
| **Runtime** | Node.js (ES Modules) |
| **Framework** | Express.js v5 |
| **ORM** | Prisma v7 |
| **Database** | PostgreSQL (Supabase) |
| **Auth** | JSON Web Token (JWT) |
| **Hashing** | bcryptjs |
| **Validation** | express-validator |
| **API Docs** | Swagger UI (swagger-jsdoc + swagger-ui-express) |

---

## 📁 Struktur Proyek

```
meet-ketiga/
├── config/
│   ├── database.js              # Konfigurasi Prisma Client
│   └── swagger.js               # Konfigurasi Swagger / OpenAPI
├── controller/
│   ├── index.controller.js      # Barrel export semua controller
│   ├── auth.controller.js       # Logic register & login
│   ├── books.controller.js      # Logic CRUD buku
│   ├── users.controller.js      # Logic CRUD user
│   ├── profiles.controller.js   # Logic CRUD profil
│   ├── categories.controller.js # Logic CRUD kategori
│   └── borrowings.controller.js # Logic CRUD peminjaman
├── middleware/
│   ├── authenticate.js          # Verifikasi JWT token
│   ├── authorize.js             # Cek role (ADMIN / USER)
│   └── validate.js              # Handler express-validator
├── validation/
│   ├── auth.validation.js       # Aturan validasi register & login
│   ├── users.validation.js      # Aturan validasi user
│   ├── books.validation.js      # Aturan validasi buku
│   ├── borrowings.validation.js # Aturan validasi peminjaman
│   ├── profiles.validation.js   # Aturan validasi profil
│   └── categories.validation.js # Aturan validasi kategori
├── routes/
│   ├── index.route.js           # Router utama
│   ├── auth.route.js            # Endpoint autentikasi
│   ├── books.route.js           # Endpoint buku
│   ├── users.route.js           # Endpoint user
│   ├── profiles.route.js        # Endpoint profil
│   ├── categories.route.js      # Endpoint kategori
│   └── borrowings.route.js      # Endpoint peminjaman
├── prisma/
│   └── schema.prisma            # Prisma schema (model database)
├── .github/
│   └── workflows/
│       └── keep-alive.yml       # Cron job agar Supabase tidak pause
├── index.js                     # Entry point aplikasi
├── prisma.config.js             # Konfigurasi Prisma datasource
├── .env                         # Environment variables
└── package.json
```

---

## 🚀 Instalasi & Menjalankan

```bash
# 1. Clone repository
git clone <repo-url>
cd meet-ketiga

# 2. Install dependencies
npm install

# 3. Buat file .env dan isi variabel berikut:
DATABASE_URL="postgresql://<user>:<password>@<host>:5432/<db>"
DIRECT_URL="postgresql://<user>:<password>@<host>:5432/<db>"
JWT_SECRET=ganti_dengan_secret_yang_kuat
JWT_EXPIRES_IN=1d
BCRYPT_SALT_ROUNDS=10

# 4. Jalankan migrasi database
npx prisma migrate dev

# 5. Generate Prisma Client
npx prisma generate

# 6. Jalankan server (development)
npm run dev
```

Server berjalan di `http://localhost:3000`  
Swagger UI tersedia di **`http://localhost:3000/api-docs`**

---

## 🔐 Autentikasi & Otorisasi

API menggunakan **JWT Bearer Token**. Semua endpoint (kecuali `/auth/register` dan `/auth/login`) memerlukan token.

### Alur Autentikasi

```
POST /auth/register  →  Buat akun baru
POST /auth/login     →  Dapatkan JWT token
                         ↓
           Gunakan token di header:
           Authorization: Bearer <token>
```

### Role & Akses

| Endpoint | USER | ADMIN |
|---|:---:|:---:|
| `POST /auth/register` & `POST /auth/login` | ✅ | ✅ |
| `GET /books`, `GET /categories` | ✅ | ✅ |
| `POST/PUT/DELETE /books`, `/categories` | ❌ | ✅ |
| `POST /borrowings` (pinjam buku) | ✅ | ✅ |
| `GET /borrowings/user/:userId` (milik sendiri) | ✅ | ✅ |
| `GET /borrowings` (semua) | ❌ | ✅ |
| `GET/POST/PUT/DELETE /users` | ❌ | ✅ |
| `POST /profiles`, `PUT /profiles/:id` | ✅ | ✅ |
| `DELETE /profiles/:id` | ❌ | ✅ |

---

## 📖 API Endpoints

### 🔑 Auth (Public)

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/auth/register` | Daftar akun baru |
| POST | `/auth/login` | Login → dapat JWT token |

**Request Body — Register:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123",
  "role": "USER"
}
```

**Request Body — Login:**
```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

**Response Login (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": { "id": 1, "name": "John Doe", "email": "john@example.com", "role": "USER" }
}
```

---

### 👤 Users (ADMIN only)

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/users` | Ambil semua user |
| GET | `/users/:id` | Ambil user by ID |
| GET | `/users/:id/profile` | Ambil user beserta profil |
| POST | `/users` | Tambah user baru |
| PUT | `/users/:id` | Update user by ID |
| DELETE | `/users/:id` | Hapus user by ID |

---

### 📚 Books

| Method | Endpoint | Akses | Deskripsi |
|--------|----------|-------|-----------|
| GET | `/books` | USER, ADMIN | Ambil semua buku |
| GET | `/books/:id` | USER, ADMIN | Ambil buku by ID |
| POST | `/books` | ADMIN | Tambah buku baru |
| PUT | `/books/:id` | ADMIN | Update buku by ID |
| DELETE | `/books/:id` | ADMIN | Hapus buku by ID |

**Request Body (POST / PUT):**
```json
{
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "year": 1925,
  "available": true,
  "categoryId": 1
}
```

---

### 🏷 Categories

| Method | Endpoint | Akses | Deskripsi |
|--------|----------|-------|-----------|
| GET | `/categories` | USER, ADMIN | Ambil semua kategori |
| GET | `/categories/:id` | USER, ADMIN | Ambil kategori by ID |
| GET | `/categories/:id/books` | USER, ADMIN | Ambil buku by kategori |
| POST | `/categories` | ADMIN | Tambah kategori baru |
| PUT | `/categories/:id` | ADMIN | Update kategori by ID |
| DELETE | `/categories/:id` | ADMIN | Hapus kategori by ID |

---

### 🪪 Profiles

| Method | Endpoint | Akses | Deskripsi |
|--------|----------|-------|-----------|
| GET | `/profiles` | ADMIN | Ambil semua profil |
| GET | `/profiles/:id` | ADMIN | Ambil profil by ID |
| POST | `/profiles` | USER, ADMIN | Tambah profil |
| PUT | `/profiles/:id` | USER, ADMIN | Update profil |
| DELETE | `/profiles/:id` | ADMIN | Hapus profil |

---

### 📦 Borrowings (Many-to-Many: Users ↔ Books)

| Method | Endpoint | Akses | Deskripsi |
|--------|----------|-------|-----------|
| GET | `/borrowings` | ADMIN | Ambil semua peminjaman |
| GET | `/borrowings/:id` | ADMIN | Ambil peminjaman by ID |
| GET | `/borrowings/user/:userId` | USER (sendiri), ADMIN | Peminjaman milik user |
| POST | `/borrowings` | USER, ADMIN | Pinjam buku |
| PATCH | `/borrowings/:id/return` | USER, ADMIN | Kembalikan buku |
| DELETE | `/borrowings/:id` | ADMIN | Hapus data peminjaman |

**Request Body (POST — pinjam buku):**
```json
{
  "userId": 1,
  "bookId": 2
}
```

> **Catatan:** Saat buku dipinjam, field `available` pada Books otomatis menjadi `false`. Saat dikembalikan, otomatis kembali `true`. Operasi ini berjalan dalam satu **database transaction**.

---

## 🗄 Database Schema

### Relasi

```
Users ──────── 1 ─────── Profiles      (One-to-One)
Categories ─── 1 ─────── * Books       (One-to-Many)
Users ────── * ─ Borrowings ─ * ────── Books  (Many-to-Many via pivot table)
```

### Tabel Borrowings (Pivot Table)

| Field | Type | Keterangan |
|---|---|---|
| id | Int | Primary key, auto-increment |
| userId | Int | FK ke Users |
| bookId | Int | FK ke Books |
| borrow_date | DateTime | Tanggal pinjam (default: now) |
| returned_at | DateTime? | Tanggal kembali (null = belum kembali) |
| createdAt | DateTime | Timestamp otomatis |

---

## 📋 HTTP Response Codes

| Code | Kondisi |
|---|---|
| `200 OK` | Berhasil GET / update / delete |
| `201 Created` | Berhasil membuat resource baru |
| `400 Bad Request` | Input tidak valid / buku sudah dikembalikan |
| `401 Unauthorized` | Token tidak ada atau tidak valid |
| `403 Forbidden` | Role tidak punya akses ke endpoint |
| `404 Not Found` | Resource tidak ditemukan |
| `409 Conflict` | Data sudah ada (email duplikat, profil sudah dibuat, dll) |
| `500 Internal Server Error` | Kesalahan server |

---

## 📝 Validasi Input

Setiap endpoint yang menerima body request divalidasi menggunakan **express-validator**. Jika validasi gagal, response yang dikirim:

```json
{
  "message": "Validation failed",
  "errors": [
    { "field": "email", "message": "Must be a valid email address" },
    { "field": "password", "message": "Password must be at least 6 characters" }
  ]
}
```

---

## 📊 Swagger API Documentation

Dokumentasi interaktif tersedia di:

```
http://localhost:3000/api-docs
```

### Cara Testing via Swagger UI

1. Buka `http://localhost:3000/api-docs`
2. Jalankan **`POST /auth/login`** → copy nilai `token` dari response
3. Klik tombol **🔒 Authorize** di pojok kanan atas
4. Masukkan token → klik **Authorize**
5. Semua endpoint kini bisa ditest langsung dari browser

---

## ⚙️ Scripts

```bash
npm run dev    # Jalankan server dengan nodemon (auto-restart)
npm run start  # Jalankan server production (node)
```

---

## ⚙️ GitHub Actions

Project ini memiliki workflow **keep-alive** yang berjalan secara terjadwal untuk ping database Supabase agar tidak auto-pause pada free tier.

Tambahkan secret `DATABASE_URL` di **Settings → Secrets → Actions** pada repository GitHub.
