# Rencana Implementasi — AJS B2B Fish Commodity Supply Portal (MVP)

Dokumen ini adalah rencana teknis untuk membangun MVP sesuai brief di
`AJS_Developer_Challenge_Brief_B2B_Fish_Portal_Simple.docx`, di atas project
Next.js yang sudah ada (scaffold `create-next-app`, Next.js 16.3.8, React 19,
Tailwind 4, TypeScript, App Router).

---

## 1. Arsitektur & Stack Teknis

| Area | Pilihan | Alasan |
|---|---|---|
| Framework | Next.js App Router (existing) | Sudah ada, didukung brief sebagai salah satu opsi stack. |
| Database | **SQLite + Prisma ORM** | Relasional (Product ↔ OrderItem ↔ Order ↔ Buyer), file-based → reviewer tidak perlu setup server DB eksternal. `npx prisma migrate dev` + seed script cukup. |
| Auth | **Session cookie sederhana** (bukan NextAuth) | Brief: "tidak perlu enterprise authentication". Cukup: hash password (bcrypt) + signed session cookie (iron-session atau implementasi JWT ringan) berisi `{ userId, role }`. |
| Mutasi data | **Server Actions** (`"use server"`) | Native Next.js App Router, hindari bikin REST API layer terpisah untuk cart/order/stock — lebih cepat untuk MVP 1-2 hari. |
| Cart | **Persisted di DB per buyer** (tabel `CartItem`), bukan hanya localStorage | Brief minta Buyer Dashboard menampilkan ringkasan cart — perlu persist antar sesi/device, dan sejalan dgn semantik B2B (bukan sekadar UI state). |
| Styling | Tailwind 4 (existing) | Sudah terpasang, cukup untuk MVP UI yang bersih. |
| Validasi | Zod | Validasi input Server Action (qty, MOQ, dsb) sebelum sentuh DB. |

**Trade-off yang akan dijelaskan ke reviewer:** SQLite dipilih demi kemudahan setup, bukan untuk skala produksi. Auth sengaja minimal (bukan RBAC lengkap) sesuai scope brief. Tidak ada payment/ERP/WhatsApp integration — sesuai larangan brief di bagian "Yang Tidak Perlu Dibuat".

---

## 2. Data Model (Prisma Schema)

```prisma
// prisma/schema.prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

generator client {
  provider = "prisma-client-js"
}

enum Role {
  BUYER
  ADMIN
}

enum StockStatus {
  AVAILABLE
  RESERVED
  UNAVAILABLE
}

enum OrderStatus {
  REQUESTED
  CONFIRMED
  REJECTED
}

model User {
  id           String      @id @default(cuid())
  email        String      @unique
  passwordHash String
  name         String
  companyName  String?     // relevan utk B2B buyer
  role         Role
  createdAt    DateTime    @default(now())

  cartItems    CartItem[]
  orders       Order[]
}

model Product {
  id            String      @id @default(cuid())
  name          String
  slug          String      @unique
  origin        String      // e.g. "Muara Baru"
  grade         String      // e.g. "A", "Premium"
  condition     String      // e.g. "Frozen"
  description   String
  imageUrl      String
  availableQty  Float       // dalam KG
  moq           Float       // minimum order quantity, KG
  stockStatus   StockStatus @default(AVAILABLE)
  price         Float?      // opsional, dummy pricing
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt

  cartItems     CartItem[]
  orderItems    OrderItem[]
}

model CartItem {
  id         String   @id @default(cuid())
  userId     String
  productId  String
  quantity   Float
  createdAt  DateTime @default(now())

  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  product    Product  @relation(fields: [productId], references: [id], onDelete: Cascade)

  @@unique([userId, productId]) // 1 produk = 1 baris cart per buyer
}

model Order {
  id         String      @id @default(cuid())
  buyerId    String
  status     OrderStatus @default(REQUESTED)
  note       String?
  createdAt  DateTime    @default(now())
  updatedAt  DateTime    @updatedAt

  buyer      User        @relation(fields: [buyerId], references: [id])
  items      OrderItem[]
}

model OrderItem {
  id         String   @id @default(cuid())
  orderId    String
  productId  String
  quantity   Float
  // snapshot nama & grade saat order dibuat, agar histori tidak berubah
  // jika admin edit produk di kemudian hari
  productNameSnapshot String

  order      Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  product    Product  @relation(fields: [productId], references: [id])
}
```

**Business rules yang dienkode di level Server Action (bukan hanya UI):**
- Qty di cart/order **tidak boleh > `availableQty`** produk saat request dikirim (re-validasi di server, bukan percaya input client).
- Qty **tidak boleh < `moq`**.
- Saat `Order` dibuat dari cart: cart buyer dikosongkan, `availableQty` produk **dikurangi** (atau dipindah ke "Reserved" — pilih salah satu, direkomendasikan: kurangi `availableQty` langsung agar simple, karena brief tidak minta reservasi kompleks).
- Admin **confirm** → status jadi `CONFIRMED` (stock tetap terpotong). Admin **reject** → status `REJECTED` dan stock dikembalikan (`availableQty += qty` tiap item).
- `stockStatus` field terpisah dari angka `availableQty` supaya admin bisa toggle manual Available/Unavailable independen dari jumlah (sesuai brief: "Stock harus memiliki status minimal Available/Reserved atau Available/Unavailable").

---

## 3. Struktur Routing / Folder App Next.js

```
app/
├── layout.tsx                      # root layout (sudah ada, akan disesuaikan)
├── page.tsx                        # [A] Homepage publik
├── globals.css
│
├── commodities/
│   ├── page.tsx                    # [B] Commodity Catalog (list produk)
│   └── [slug]/
│       └── page.tsx                # [C] Product Detail
│
├── login/
│   └── page.tsx                    # [D] Buyer/Admin Login (form sama, redirect by role)
│
├── (buyer)/                        # route group — dilindungi middleware/layout check session role=BUYER
│   ├── layout.tsx                  # cek session, redirect ke /login jika bukan buyer
│   ├── dashboard/
│   │   └── page.tsx                # [E] Buyer Dashboard (ringkasan availability, cart, order status)
│   ├── cart/
│   │   └── page.tsx                # [F] Cart page
│   └── orders/
│       └── page.tsx                # riwayat order request buyer
│
├── (admin)/                        # route group — dilindungi, role=ADMIN
│   ├── layout.tsx
│   └── admin/
│       ├── page.tsx                # [H] Admin dashboard: list order request
│       ├── orders/
│       │   └── [id]/page.tsx       # detail order + action confirm/reject
│       └── products/
│           └── page.tsx            # [H] kelola stock/availability produk
│
├── actions/                        # Server Actions
│   ├── auth.ts                     # login, logout
│   ├── cart.ts                     # addToCart, updateQty, removeFromCart
│   ├── order.ts                    # submitOrderRequest, confirmOrder, rejectOrder
│   └── product.ts                  # updateStock (admin)
│
└── api/                            # (opsional, hanya jika perlu endpoint non-Server-Action)

lib/
├── db.ts                           # Prisma client singleton
├── session.ts                      # getSession, createSession, destroySession (cookie)
└── validation.ts                   # Zod schemas

prisma/
├── schema.prisma
└── seed.ts                         # 4 produk dummy + 1 akun buyer + 1 akun admin

middleware.ts                       # redirect berdasarkan session+role untuk /dashboard, /cart, /admin/*
```

Catatan desain routing:
- Route groups `(buyer)` dan `(admin)` dipakai supaya tiap grup punya `layout.tsx` sendiri untuk guard akses, tanpa mempengaruhi URL path.
- `middleware.ts` melakukan pengecekan cepat (ada/tidaknya session cookie) sebelum request masuk ke layout, sebagai lapis pertama; pengecekan role granular tetap dilakukan di `layout.tsx`/Server Component masing-masing grup.

---

## 4. Breakdown Fitur A–H → Task Implementasi Bertahap

Urutan disusun agar setiap tahap menghasilkan sesuatu yang bisa di-demo (incremental, selalu dalam keadaan jalan), mengikuti urutan skenario demo di brief.

**Tahap 0 — Fondasi (prasyarat semua fitur)**
1. Install & konfigurasi Prisma + SQLite, buat `schema.prisma` sesuai §2.
2. Tulis `prisma/seed.ts`: 4 produk dummy (Cakalang, Deho, Tuna Fillet, Kerapu) + 1 user BUYER + 1 user ADMIN (password demo).
3. `lib/db.ts` (Prisma client singleton), `lib/session.ts` (cookie session: create/get/destroy, hash password dgn bcrypt).
4. `middleware.ts` dasar untuk proteksi route `/dashboard`, `/cart`, `/orders`, `/admin/*`.

**Tahap 1 — Public Website (A, B, C)**
5. `app/page.tsx` — Homepage: headline AJS, ringkasan capability, 3-4 komoditas utama (card), CTA "Daftar/Login sebagai Buyer".
6. `app/commodities/page.tsx` — Catalog: grid produk dari DB (foto, nama, grade, origin, availability badge).
7. `app/commodities/[slug]/page.tsx` — Detail: foto besar, deskripsi, spec lengkap, available qty, MOQ, tombol **"Request Order"** (bukan Buy Now) → kalau belum login, redirect ke `/login`.

**Tahap 2 — Auth (D)**
8. `app/login/page.tsx` + `actions/auth.ts` (`login`, `logout`): form email/password sederhana, validasi, set session cookie, redirect sesuai role (`BUYER` → `/dashboard`, `ADMIN` → `/admin`).

**Tahap 3 — Cart & Dashboard (E, F)**
9. `actions/cart.ts`: `addToCart(productId, qty)` dengan validasi `qty >= moq && qty <= availableQty` (Zod + query ulang stock terbaru di server).
10. `app/(buyer)/cart/page.tsx`: list item cart, edit qty, remove, ringkasan total qty/berat, tombol "Submit Request Order".
11. `app/(buyer)/dashboard/page.tsx`: ringkasan — jumlah item di cart, status order terakhir, quick links ke catalog.

**Tahap 4 — Order Request (G)**
12. `actions/order.ts`: `submitOrderRequest()` — convert semua cart item buyer jadi 1 `Order` + `OrderItem[]`, status `REQUESTED`, kurangi `availableQty` produk, kosongkan cart (transaction Prisma agar atomic).
13. `app/(buyer)/orders/page.tsx`: riwayat order buyer dengan status (Requested/Confirmed/Rejected).

**Tahap 5 — Admin (H)**
14. `app/(admin)/admin/page.tsx`: list semua order request (terbaru dulu), filter by status.
15. `app/(admin)/admin/orders/[id]/page.tsx` + action `confirmOrder`/`rejectOrder` di `actions/order.ts` — reject akan mengembalikan stock.
16. `app/(admin)/admin/products/page.tsx` + action `updateStock` di `actions/product.ts` — admin ubah `availableQty`/`stockStatus` per produk.

**Tahap 6 — Polish (sesuai sisa waktu, prioritas rendah)**
17. Responsive check (mobile breakpoint Tailwind) untuk catalog & cart.
18. Empty states & error handling (misal qty > stock saat submit → tampilkan pesan jelas).
19. README: cara run (`npm install`, `npx prisma migrate dev`, `npx prisma db seed`, `npm run dev`), demo account buyer/admin.
20. Catatan 1 halaman: status selesai/belum + keputusan teknis (sesuai Deliverables brief).

Prioritas jika waktu terbatas: Tahap 0–4 adalah **jalur kritis** (menghasilkan end-to-end flow sesuai Acceptance Criteria #9: "minimal ada satu end-to-end flow yang benar-benar berjalan"). Tahap 5 (Admin) wajib karena ada di Acceptance Criteria. Tahap 6 opsional/best-effort.

---

## 5. Pemetaan ke Acceptance Criteria Brief

| Acceptance Criteria | Dipenuhi oleh |
|---|---|
| Buka tanpa setup rumit | SQLite file-based + seed script, 1 command run |
| Lihat daftar komoditas & detail produk | Tahap 1 |
| Login sebagai buyer | Tahap 2 |
| Pilih qty & masuk cart | Tahap 3 |
| Kirim order request | Tahap 4 |
| Admin lihat request | Tahap 5 (#14) |
| Admin ubah stock/availability | Tahap 5 (#16) |
| UI mudah dipahami | Tahap 1 & 6, styling konsisten Tailwind |
| End-to-end flow jalan | Tahap 0–4 sebagai jalur kritis |

---

## 6. Yang Sengaja Tidak Dibuat (sesuai brief §7)
Payment gateway, mobile app, integrasi warehouse real-time, ERP/accounting, WhatsApp API, pricing engine kompleks, role/permission lanjutan (hanya 2 role: BUYER/ADMIN), security hardening production-grade, AI/ML forecasting.
