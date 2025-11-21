# Job Portal Application

## i. Project Overview

Aplikasi Job Portal adalah platform berbasis web untuk mengelola lowongan pekerjaan dan lamaran kandidat. Aplikasi ini menyediakan fitur untuk admin dalam mengelola job posting, kategori pekerjaan, dan kandidat, serta fitur untuk user dalam mencari dan melamar pekerjaan.

**Fitur Utama:**
- Manajemen lowongan pekerjaan (CRUD)
- Sistem kategori pekerjaan
- Form aplikasi lamaran dengan webcam capture
- Autentikasi dan otorisasi user
- Dashboard admin untuk mengelola kandidat
- Integrasi dengan Supabase untuk backend dan storage

## ii. Tech Stack Used

**Frontend:**
- React 18.2.0
- TypeScript 5.0.2
- Vite 4.4.5
- React Router DOM 6.16.0
- Ant Design 5.9.1
- Formik 2.4.4 + Yup 1.2.0 (Form validation)

**Backend & Database:**
- Supabase (Backend as a Service)
- Supabase JS Client 2.84.0

**Additional Libraries:**
- MediaPipe (Hand tracking & gesture recognition)
- LocalForage (Client-side storage)
- Match Sorter (Filtering & sorting)

**Development Tools:**
- ESLint
- TypeScript ESLint

## iii. How to Run Locally

### Prerequisites
- Node.js (v16 atau lebih tinggi)
- npm atau yarn
- Akun Supabase (untuk backend)

### Installation Steps

1. Clone repository ini:
```bash
git clone <repository-url>
cd <project-folder>
```

2. Install dependencies:
```bash
npm install
```

3. Setup environment variables:
   - Copy file `.env.example` menjadi `.env`
   - Isi variabel environment dengan kredensial Supabase Anda:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Setup database Supabase:
   - Buka Supabase dashboard
   - Jalankan SQL schema dari file `supabase-schema.sql`
   - Lihat `SUPABASE_SETUP.md` untuk panduan lengkap

5. Jalankan development server:
```bash
npm run dev
```

6. Buka browser dan akses:
```
http://localhost:5173
```
7. Login
Admin
Email : admin@example.com
Password : Admin123

User
Email : user@example.com
Password : User1234

### Available Scripts

- `npm run dev` - Menjalankan development server
- `npm run build` - Build aplikasi untuk production
- `npm run preview` - Preview build production
- `npm run lint` - Menjalankan ESLint untuk check code quality
