# Rekap Tech Stack, Arsitektur, dan Struktur Direktori: SECURE-TOEFL CBT System

Dokumen ini berisi spesifikasi teknis, arsitektur sistem, aturan bisnis penilaian, dan struktur direktori resmi untuk sistem **SECURE-TOEFL (Computer-Based Testing Terstandarisasi Berbasis Safe Exam Browser & Local Area Network)**[cite: 2, 7].

---

## 📌 1. Gambaran Umum Sistem (System Overview)

- **Nama Sistem**: SECURE-TOEFL (Secure Assessment Framework for English Proficiency Test).
- **Bentuk Asesmen**: Emulasi resmi TOEFL ITP® Level 1 (140 butir soal, alokasi 115 menit, rentang skor 310–677).
- **Model Topologi Jaringan**: Semi-Daring Berbasis Peladen Lokal (*Localhost / On-Premises LAN*) untuk menjamin *zero latency* pemuatan audio dan soal.
- **Arsitektur Perangkat Lunak**: **Modular Monolith** dalam format Single-Root Monorepo.
  - Antarmuka Frontend (`/src`) dan API Backend (`/api`) berada di repositori yang sama.
  - Proxy otomatis diatur via Vite (`vite.config.ts`) agar pemanggilan `/api` dan aset statis `/static` diarahkan ke peladen Express.
- **Lapisan Keamanan**: Akses peserta dikunci penuh melalui **Safe Exam Browser (SEB)** dengan validasi kriptografi sisi peladen via `X-SafeExamBrowser-ConfigKeyHash`.

---

## 🛠️ 2. Tech Stack & Dependencies

### **Frontend (UI & Client-Side Engine)**
- **Core Framework**: React 19 (`react`, `react-dom`)[cite: 7]
- **Language**: TypeScript 5.7+ (`typescript`)[cite: 7]
- **Build Tool / Bundler**: Vite 6 (`vite`, `@vitejs/plugin-react`)[cite: 7]
- **Styling & Layout**: Tailwind CSS v4 (`tailwindcss`, `@tailwindcss/vite`)[cite: 7]
- **Routing**: React Router DOM v7 (`react-router-dom`)[cite: 7]
- **Icon Set**: Lucide React (`lucide-react`)[cite: 7]
- **Animation**: Framer Motion (`framer-motion`)[cite: 7]
- **Offline Storage**: Dexie.js / IndexedDB API (Penyimpanan lokal 140 soal dan *auto-save* jawaban)
- **Media Engine**: HTML5 Web Audio API (Strict single-play, disable seekbar)
- **Data Export**: SheetJS XLSX (`xlsx`) untuk ekspor rekapitulasi nilai mahasiswa[cite: 7]
- **HTTP Client**: Axios (`axios`)[cite: 7]

### **Backend (API & Server-Side Security)**
- **Runtime**: Node.js (ES Modules)[cite: 7]
- **Web Framework**: Express v4 (`express`)[cite: 7]
- **Database Driver**: MySQL 2 (`mysql2`) dengan Connection Pooling via XAMPP[cite: 7]
- **Security & Integrity**: 
  - `crypto` (Validasi SHA-256 ConfigKeyHash dari Safe Exam Browser)
  - JWT (`jsonwebtoken`) & Hash Password (`bcryptjs`) untuk portal Pengawas[cite: 7]
- **File Handling**: Multer (`multer`) untuk pengunggahan master audio listening dan berkas wacana bacaan[cite: 3, 7]
- **Utilities**: `uuid`, `dotenv`, `cors`, `nodemailer` (Distribusi token ujian ke email mahasiswa)[cite: 3, 7]

### **Dev & Automation Tools**
- **Concurrently**: Menjalankan frontend dan backend secara paralel melalui perintah `npm run dev`[cite: 7].
- **Nodemon**: Auto-restart server Express saat ada perubahan kode di folder `/api`[cite: 7].

---

## 📁 3. Struktur Directory & Folder

```text
toefl-cbt/
├── .env                             # Port, DB credentials, JWT Secret, SEB Secret Key[cite: 7]
├── .gitignore                       # Git ignore rules[cite: 7]
├── README.md                        # Dokumentasi ringkas proyek[cite: 7]
├── tech.md                          # [FILE INI] Spesifikasi arsitektur & panduan sistem[cite: 7]
├── index.html                       # Entry point HTML Vite[cite: 7]
├── package.json                     # Root dependencies & concurrently runner script[cite: 7]
├── tsconfig.json                    # Konfigurasi TypeScript[cite: 7]
├── vite.config.ts                   # Konfigurasi proxy Vite ke backend port 5000[cite: 7]
├── config_ujian_lab.seb             # Berkas konfigurasi terenkripsi Safe Exam Browser[cite: 2]
│
├── api/                             # ===== BACKEND EXPRESS API =====[cite: 7]
│   ├── package.json                 # Dependencies khusus backend[cite: 7]
│   ├── index.js                     # Entry point Express, CORS, middleware loader[cite: 7]
│   ├── database.js                  # Setup MySQL2 Connection Pool[cite: 7]
│   │
│   ├── middleware/                  # Lapisan Filter & Keamanan
│   │   ├── sebSecurity.js           # Verifikasi header X-SafeExamBrowser-ConfigKeyHash[cite: 2]
│   │   ├── authProctor.js           # Verifikasi token JWT Pengawas/Admin[cite: 7]
│   │   └── authStudent.js           # Validasi sesi aktif NIM + Token ujian mahasiswa[cite: 2]
│   │
│   ├── controllers/                 # Logika Bisnis & Penilaian
│   │   ├── authController.js        # Autentikasi Mahasiswa & Pengawas[cite: 3]
│   │   ├── sessionController.js     # Manajemen Sesi, Generator Token, Broadcast Email[cite: 3]
│   │   ├── examController.js        # Prefetch 140 soal, simpan jawaban (LWW), auto-submit[cite: 1, 2]
│   │   ├── scoringController.js     # Engine ekuasi skor resmi ETS & klasifikasi CEFR[cite: 1, 2]
│   │   └── questionController.js    # CRUD Bank Soal, teks wacana, dan unggah MP3[cite: 3]
│   │
│   ├── migrations/                  # Skema SQL Bertahap[cite: 7]
│   │   ├── 01_init_users_and_sessions.sql[cite: 3]
│   │   ├── 02_create_passages_and_questions.sql[cite: 3]
│   │   ├── 03_create_answers_and_results.sql[cite: 2]
│   │   └── 04_seed_ets_score_conversion.sql[cite: 1, 2]
│   │
│   └── static/                      # Penyimpanan berkas statis lokal[cite: 7]
│       ├── audio/                   # Berkas audio listening terkompresi (Part A, B, C)[cite: 1, 2]
│       └── certificates/            # Berkas PDF sertifikat digital ber-QR Code[cite: 2, 3]
│
├── src/                             # ===== FRONTEND REACT 19 APP =====[cite: 7]
│   ├── main.tsx                     # Entry point React[cite: 7]
│   ├── App.tsx                      # Root Router & pembagian rute Mahasiswa/Pengawas[cite: 7]
│   ├── index.css                    # Tailwind CSS v4 directives & styling font modern[cite: 7]
│   │
│   ├── Page/                        # Antarmuka Layar Aplikasi[cite: 7]
│   │   ├── student/                 # Area Ujian Peserta (Khusus via SEB)[cite: 2]
│   │   │   ├── LoginStudent.tsx     # Login NIM + Input Token Ujian[cite: 2, 3]
│   │   │   ├── AudioCheck.tsx       # Uji kelayakan suara headphone pra-ujian[cite: 2]
│   │   │   ├── ExamInstructions.tsx # Petunjuk resmi 5 menit non-timer
│   │   │   ├── ExamCBT.tsx          # Workspace ujian 3 section terisolasi[cite: 1, 2, 6]
│   │   │   ├── SectionBreakModal.tsx# Transisi terkunci antar-section[cite: 6]
│   │   │   └── ResultReport.tsx     # Laporan skor 310–677 & sertifikat kelulusan CEFR[cite: 1, 2]
│   │   │
│   │   ├── proctor/                 # Portal Pengawas (Bisa dibuka via Chrome/Edge)[cite: 2, 3]
│   │   │   ├── LoginProctor.tsx     # Autentikasi NIP Pengawas[cite: 3]
│   │   │   ├── DashboardProctor.tsx # Live monitoring pengerjaan & status integritas SEB[cite: 2, 3]
│   │   │   ├── TokenManager.tsx     # Generator token ujian & kirim email massal[cite: 3]
│   │   │   ├── QuestionBank.tsx     # Pengelolaan bank soal 140 butir & audio[cite: 1, 3]
│   │   │   └── ScoreRecap.tsx       # Rekapitulasi nilai & ekspor ke file Excel[cite: 3, 7]
│   │   │
│   │   └── error/
│   │       └── SebForbidden.tsx     # Layar 403 jika dibuka di peramban umum[cite: 2]
│   │
│   ├── components/                  # Komponen Reusable[cite: 7]
│   │   ├── exam/
│   │   │   ├── StrictAudioPlayer.tsx# Pemutar audio 1x jalan, tanpa seekbar/rewind[cite: 1, 2, 5]
│   │   │   ├── SplitReadingView.tsx # Tata letak 50/50 teks wacana & pertanyaan[cite: 1, 2]
│   │   │   ├── QuestionPalette.tsx  # Laci nomor (sudah dijawab, ragu-ragu, kosong)[cite: 2]
│   │   │   └── SectionTimer.tsx     # Timer independen per-section berbasis waktu server
│   │   │
│   │   └── common/
│   │       ├── Navbar.tsx[cite: 7]
│   │       ├── Modal.tsx[cite: 7]
│   │       └── Badge.tsx
│   │
│   └── services/                    # Konektivitas & Offline-First Engine
│       ├── api.ts                   # Axios client dengan request interceptor[cite: 7]
│       ├── db.ts                    # Instance IndexedDB (Dexie.js) penampung soal & jawaban[cite: 2]
│       └── syncQueue.ts             # Background sync antrean transaksi jawaban (LWW)[cite: 2]
│
└── docs/                            # Dokumentasi Pendukung Sidang / Pengujian[cite: 7]
    ├── flowchart_sdlc.png
    ├── flowchart_operasional.png
    └── skema_database.sql[cite: 7]