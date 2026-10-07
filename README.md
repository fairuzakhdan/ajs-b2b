# AJS — B2B Fish Commodity Supply Portal (MVP)

Portal procurement B2B untuk **PT Altisan Jaya Sinergi (AJS)**, supplier
komoditas laut dari hub Muara Baru, Jakarta. Buyer dapat melihat katalog
komoditas, menambah ke cart, dan mengirim *order request*; admin AJS dapat
me-review request serta mengelola stok/ketersediaan produk.

Dibangun sebagai jawaban atas *AJS Developer Challenge Brief* (lihat
`plan/`). Rencana teknis lengkap ada di `plan/IMPLEMENTATION_PLAN.md`.

---

## Tech Stack

| Area | Pilihan |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) + React 19 |
| Database | SQLite via Prisma ORM 7 + driver adapter libSQL (`@prisma/adapter-libsql`) — file lokal untuk dev, Turso untuk production |
| Auth | Session cookie sederhana — JWT (jose) + bcrypt, bukan enterprise auth |
| Mutasi data | Server Actions (`"use server"`) |
| Validasi | Zod |
| Styling | Tailwind CSS 4 |

---

## Menjalankan Secara Lokal

Prasyarat: **Node.js 20+**.

```bash
# 1. Install dependencies
npm install

# 2. Siapkan database SQLite: jalankan migrasi + generate Prisma Client + seed
npx prisma migrate dev

# (jika DB sudah termigrasi tetapi belum ter-seed, jalankan terpisah)
npx prisma db seed

# 3. Jalankan dev server
npm run dev
```

Buka http://localhost:3000.

### Environment Variables

Salin `.env.example` menjadi `.env` lalu sesuaikan nilainya:

```bash
cp .env.example .env
```

Variabel yang dipakai:

```env
# Lokal (SQLite file-based)
DATABASE_URL="file:./prisma/dev.db"
DATABASE_AUTH_TOKEN=""   # kosongkan untuk SQLite lokal
SESSION_SECRET="<random-secret-untuk-signing-jwt-session>"
```

Generate `SESSION_SECRET` acak:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

> `.env` tidak di-commit (lihat `.gitignore`). Hanya `.env.example` yang
> ikut repo. Untuk penggunaan nyata, `SESSION_SECRET` harus di-generate ulang.

---

## Deploy ke Vercel (dengan Turso)

SQLite file-based tidak bisa dipakai di Vercel (filesystem serverless bersifat
ephemeral & read-only). Untuk production, database di-host di **Turso**
(SQLite terdistribusi via libSQL). Kode `lib/db.ts` memakai adapter libSQL yang
sama untuk lokal maupun Turso — cukup berbeda di environment variables.

**1. Buat database Turso** lalu ambil URL + auth token:

```bash
turso db create <nama-db>
turso db show <nama-db> --url        # => libsql://<nama-db>-<org>.turso.io
turso db tokens create <nama-db>     # => auth token
```

**2. Siapkan schema + seed di Turso** (dari lokal, set env sementara):

```bash
# PowerShell
$env:DATABASE_URL="libsql://<nama-db>-<org>.turso.io"
$env:DATABASE_AUTH_TOKEN="<token>"

# buat tabel sesuai prisma/migrations lalu seed
npx prisma db seed
```

> Prisma CLI (`migrate`/`db push`) belum mengenali scheme `libsql://`, jadi
> pembuatan tabel di Turso dilakukan dengan mengeksekusi SQL dari
> `prisma/migrations/<init>/migration.sql` via libSQL client, baru `db seed`.

**3. Set Environment Variables di Vercel** (Project → Settings → Environment
Variables, untuk Production):

| Key | Value |
|---|---|
| `DATABASE_URL` | `libsql://<nama-db>-<org>.turso.io` |
| `DATABASE_AUTH_TOKEN` | token dari Turso |
| `SESSION_SECRET` | di-generate ulang (jangan pakai nilai dev) |

**4. Deploy** — import repo di Vercel. Build command (`prisma generate &&
next build`) sudah terpasang di `package.json`.

> Jangan klik "Add" pada integrasi Storage Vercel bila sudah punya database
> Turso sendiri — itu akan membuat DB baru yang kosong dan menimpa env.

---

## Akun Demo (hasil seed)

| Role | Email | Password |
|---|---|---|
| Buyer | `buyer@demo.ajs.com` | `buyer123` |
| Admin | `admin@ajs.com` | `admin123` |

Seed juga membuat 4 komoditas dummy: Cakalang, Deho, Tuna Fillet, Kerapu.

---

## Alur End-to-End (demo)

1. **Public** — buka `/` dan `/commodities`, lihat detail produk di
   `/commodities/[slug]`.
2. **Login buyer** — `/login` dengan akun buyer → diarahkan ke `/dashboard`.
3. **Request order** — di halaman detail produk, pilih quantity (divalidasi
   terhadap MOQ & stok tersedia) → masuk `/cart`.
4. **Submit** — dari `/cart` kirim *Submit Request Order* → stok produk
   dipotong, cart dikosongkan, order tampil di `/orders` berstatus
   **Requested**.
5. **Login admin** — `/login` dengan akun admin → diarahkan ke `/admin`.
6. **Proses request** — buka detail order di `/admin/orders/[id]`:
   - **Confirm** → status menjadi **Confirmed**.
   - **Reject** → status menjadi **Rejected** dan stok yang sempat dipotong
     dikembalikan.
7. **Kelola stok** — di `/admin/products`, ubah available qty, MOQ, dan
   status stok (Available / Reserved / Unavailable) per produk.

---

## Peta Fitur & Status

| Fitur | Rute | Status |
|---|---|---|
| Homepage publik | `/` | ✅ |
| Commodity catalog | `/commodities` | ✅ |
| Product detail + Request Order | `/commodities/[slug]` | ✅ |
| Login (redirect by role) | `/login` | ✅ |
| Buyer dashboard | `/dashboard` | ✅ |
| Cart (edit qty, remove, submit) | `/cart` | ✅ |
| Riwayat order buyer | `/orders` | ✅ |
| Admin: daftar order + filter status | `/admin` | ✅ |
| Admin: detail order + confirm/reject | `/admin/orders/[id]` | ✅ |
| Admin: kelola stok/availability | `/admin/products` | ✅ |

Proteksi route (`/dashboard`, `/cart`, `/orders`, `/admin/*`) ditangani di
`proxy.ts` (konvensi Next.js 16, menggantikan `middleware`), dengan guard
kedua berbasis role di tiap `layout.tsx` (defense in depth).

---

## Keputusan Teknis & Trade-off

- **SQLite + Prisma (adapter libSQL)** dipilih agar reviewer tidak perlu
  setup server DB eksternal — cukup satu file `prisma/dev.db` untuk lokal.
  Untuk production dipakai **Turso** (libSQL) via adapter yang sama, sehingga
  kode `lib/db.ts` tidak berubah antara lokal dan production.
- **Auth minimal** (session cookie + 2 role BUYER/ADMIN), sesuai brief yang
  menyatakan tidak perlu enterprise authentication. Password tetap di-hash
  dengan bcrypt dan session ditandatangani (JWT).
- **Server Actions** dipakai untuk semua mutasi (cart, order, stok) alih-alih
  membangun REST API terpisah — lebih ringkas untuk MVP.
- **Model stok "reserve on request"**: `availableQty` dipotong saat buyer
  submit request (bukan saat admin confirm), dan dikembalikan jika admin
  reject. Validasi MOQ & stok selalu di-*re-check* di server, tidak percaya
  input client.
- **`stockStatus` terpisah dari `availableQty`** supaya admin bisa menandai
  produk Unavailable/Reserved secara manual, independen dari angka stok.
- **Snapshot nama produk** disimpan di `OrderItem.productNameSnapshot` agar
  histori order tidak berubah bila admin mengubah produk di kemudian hari.

## Yang Sengaja Tidak Dibuat (sesuai brief)

Payment gateway, mobile app, integrasi warehouse/ERP real-time, WhatsApp API,
pricing engine kompleks, RBAC lanjutan, dan security hardening production-grade.
