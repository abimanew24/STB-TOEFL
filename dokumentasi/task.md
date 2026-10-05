# 📋 Daftar Tugas & Tracker Pengerjaan: SECURE-TOEFL CBT System

Dokumen ini digunakan untuk melacak kemajuan pengerjaan sistem **SECURE-TOEFL CBT**. Tandai kotak centang `[x]` saat sebuah tugas telah selesai dikerjakan.

---

## 🏗️ Fase 1: Inisialisasi Proyek & Monorepo Infrastructure
- [x] Inisialisasi root `package.json` & script runner `concurrently`
- [x] Konfigurasi `.env` (Port API, DB Credentials, JWT Secret, SEB Hash Key)
- [x] Konfigurasi Vite (`vite.config.ts`), TypeScript (`tsconfig.json`), dan HTML (`index.html`)
- [x] Buat struktur direktori lengkap `/api` (backend) & `/src` (frontend)
- [x] Instalasi dependensi Frontend (`react`, `vite`, `tailwindcss`, `dexie`, `axios`, dll.)
- [x] Instalasi dependensi Backend (`express`, `mysql2`, `jsonwebtoken`, `bcryptjs`, `multer`, dll.)

---

## 🗄️ Fase 2: Basis Data & Migrasi SQL (`db_stbtoefl`)
- [x] Buat berkas migrasi `01_init_users_and_sessions.sql` (tabel `pengguna` & `sesi_ujian`)
- [x] Buat berkas migrasi `02_create_passages_and_questions.sql` (tabel `wacana_reading` & `bank_soal`)
- [x] Buat berkas migrasi `03_create_answers_and_results.sql` (tabel `jawaban_mahasiswa` & `hasil_ujian`)
- [x] Buat berkas migrasi `04_seed_ets_score_conversion.sql` (tabel `konversi_skor` & seed data ETS)
- [x] Implementasi pool koneksi MySQL di `api/database.js`

---

## ⚙️ Fase 3: Backend Express API Development (`/api`)
- [x] **Middleware Keamanan**:
  - [x] `sebSecurity.js` (Validasi header `X-SafeExamBrowser-ConfigKeyHash`)
  - [x] `authProctor.js` (Verifikasi token JWT Pengawas)
  - [x] `authStudent.js` (Validasi sesi aktif NIM + Token Ujian)
- [x] **Controllers & Routes**:
  - [x] `authController.js` (Login Mahasiswa & Login Pengawas)
  - [x] `sessionController.js` (Manajemen Sesi, Generator Token, Broadcast Email)
  - [x] `questionController.js` (CRUD Bank Soal & Upload MP3/Wacana)
  - [x] `examController.js` (Prefetch 140 soal, Simpan Jawaban LWW, Auto-submit)
  - [x] `scoringController.js` (Engine Kalkulasi Skor ETS & Klasifikasi CEFR)

---

## 🎨 Fase 4: Frontend React Development (`/src`)
- [x] **Styling & Core Services**:
  - [x] Setup Tailwind CSS v4 & styling dasar di `index.css`
  - [x] Setup Axios Client (`services/api.ts`)
  - [x] Setup Dexie.js / IndexedDB Store (`services/db.ts`)
  - [x] Setup Offline Sync Queue Engine (`services/syncQueue.ts`)
- [x] **Komponen Ujian Reusable (`/src/components`)**:
  - [x] `StrictAudioPlayer.tsx` (Single-play Web Audio API player tanpa seekbar)
  - [x] `SplitReadingView.tsx` (Tata letak 50/50 wacana & pertanyaan)
  - [x] `QuestionPalette.tsx` (Drawer status nomor soal: dijawab, ragu, kosong)
  - [x] `SectionTimer.tsx` (Timer independen per-section berbasis waktu server)
  - [x] Komponen umum (`Navbar`, `Modal`, `Badge`)
- [x] **Halaman Peserta Ujian (`/src/Page/student`)**:
  - [x] `LoginStudent.tsx` (Input NIM + Token Sesi Ujian)
  - [x] `AudioCheck.tsx` (Uji audio headphone pra-ujian)
  - [x] `ExamInstructions.tsx` (Petunjuk resmi 5 menit)
  - [x] `ExamCBT.tsx` (Workspace ujian 3 section terisolasi)
  - [x] `SectionBreakModal.tsx` (Modal transisi terkunci antar-section)
  - [x] `ResultReport.tsx` (Laporan skor 310–677 & sertifikat kelulusan CEFR)
- [x] **Halaman Portal Pengawas (`/src/Page/proctor`)**:
  - [x] `LoginProctor.tsx` (Autentikasi NIP Pengawas)
  - [x] `DashboardProctor.tsx` (Live monitoring & status integritas SEB)
  - [x] `TokenManager.tsx` (Generator Token & Distribusi Email)
  - [x] `QuestionBank.tsx` (Kelola Bank Soal 140 butir & Audio)
  - [x] `ScoreRecap.tsx` (Rekapitulasi Nilai & Ekspor file Excel)
- [x] **Halaman Error (`/src/Page/error`)**:
  - [x] `SebForbidden.tsx` (Layar 403 jika dibuka di browser umum)

---

## 🧪 Fase 5: Pengujian & Modul Keamanan
- [x] Pengujian Penguncian Browser via Safe Exam Browser (`config_ujian_lab.seb`)
- [x] Pengujian Fitur Offline-First & Auto-sync Jawaban LWW (Simulasi LAN disconnect)
- [x] Pengujian Akurasi Penilaian ETS & Ekspor Excel Rekap Nilai
