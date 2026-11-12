# Kembabershop — Membership & Loyalty

Aplikasi web membership dan loyalitas untuk barbershop. Pelanggan dapat
mendaftar sendiri, mencatat kunjungan cukur lewat QR check-in, dan memantau
progres hadiah. Owner mengelola member, kunjungan, dan reward lewat dashboard.

Dibangun dengan **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS v4**,
**Neon Postgres**, dan **Prisma ORM 7** (driver adapter `@prisma/adapter-pg`).

## Fitur

- Registrasi member mandiri (nomor HP + PIN).
- Kartu member digital dengan ID unik.
- Check-in kunjungan cukur dengan scan QR lewat kamera. Secara default scan
  bisa dilakukan kapan saja tanpa jeda.
- Riwayat kunjungan dan progress loyalitas.
- Reward otomatis: setiap 5 cukur berbayar = 1 cukur gratis (progress berlanjut).
- Penukaran reward oleh owner (tidak bisa dipakai ganda).
- Dashboard owner: statistik, database member, detail member, dan QR check-in.
- UI Bahasa Indonesia, mobile-first, dapat dipasang sebagai PWA.

## Menjalankan

1. Salin environment:

   ```bash
   cp .env.example .env.local
   ```

2. Isi `.env.local`:

   - `DATABASE_URL` — connection string Neon Postgres.
   - `SESSION_SECRET` — string acak minimal 32 karakter.
   - `OWNER_USERNAME` dan `OWNER_PASSWORD` — kredensial dashboard owner.
   - `NEXT_PUBLIC_APP_URL` — URL publik aplikasi (untuk QR di produksi).
   - `CHECKIN_QR_SECRET` — kunci token QR check-in. Ganti nilai ini lalu cetak
     ulang QR jika kode QR bocor.

3. Terapkan migrasi ke database Neon:

   ```bash
   npm run db:deploy
   ```

   Saat mengubah `prisma/schema.prisma`, buat migrasi baru dengan
   `npm run db:migrate`. Client Prisma di-generate otomatis lewat
   `postinstall` atau `npm run db:generate`.

4. Jalankan:

   ```bash
   npm run dev
   ```

5. Buka `http://localhost:3000`.

## Struktur Utama

- `src/app/(customer)` — halaman member: profil, check-in, riwayat.
- `src/app/owner` — login owner dan dashboard manajemen.
- `src/app/api/qr` — generator PNG QR check-in.
- `prisma/schema.prisma` — skema Prisma (`Member`, `Visit`, `Reward`).
- `prisma/migrations` — migrasi SQL database.
- `src/generated/prisma` — Prisma Client hasil generate (tidak di-commit).
- `src/lib/db.ts` — Prisma Client + driver adapter Neon.
- `src/lib/loyalty.ts` — aturan loyalitas & penukaran reward.
- `src/lib/auth.ts` — sesi JWT cookie, hashing PIN, guard role.

## Aturan Loyalitas

- Setiap kunjungan berbayar = 1 poin.
- 5 poin = 1 reward cukur gratis.
- Sisa poin carry-over ke siklus berikutnya (`total berbayar % 5`).
- Reward hanya bisa ditandai terpakai oleh owner.
- Cukur gratis tidak menambah poin.

## Catatan Keamanan

- PIN disimpan sebagai hash bcrypt.
- Sesi memakai cookie `httpOnly` bertanda tangan JWT.
- Kredensial owner berasal dari environment, bukan kode.
- Set `SESSION_SECRET`, `CHECKIN_QR_SECRET`, dan `OWNER_PASSWORD` yang kuat di
  produksi.
- QR check-in bersifat statis dan bisa dicetak. Siapa pun yang memiliki foto QR
  dapat melakukan check-in, jadi jangan bagikan foto QR di luar area toko.
- Secara default check-in tanpa jeda. Untuk mengaktifkan kembali pembatasan,
  set `CHECKIN_COOLDOWN_HOURS=72` dan `CHECKIN_REQUIRE_SHOP_OPEN=true`.
