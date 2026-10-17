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

---

## 🚀 Fase 6: Penyempurnaan Fitur, Integritas Anti-Cheating & Standarisasi CBT
- [x] **Audit & Standardisasi Struktur Basis Data (`db_stbtoefl`)**:
  - [x] Perlebar kolom `email` menjadi `VARCHAR(255)` (standar RFC 5321)
  - [x] Perlebar `kata_sandi` menjadi `VARCHAR(255)` (dukungan hash khusus: Argon2id/bcrypt)
  - [x] Standarisasi `nomor_induk` menjadi `VARCHAR(30)` untuk variasi format NIM/NIP
  - [x] Mitigasi bottleneck: konversi ID ke `INT UNSIGNED` pada `sesi_ujian`, `wacana_reading`, `bank_soal`, `hasil_ujian`, dan `BIGINT UNSIGNED` pada `jawaban_mahasiswa`
  - [x] Perlebar opsi jawaban `pilihan_a` - `pilihan_d` ke `TEXT` untuk wacana kalimat panjang
- [x] **Modul Integritas Anti-Cheating (Client-Side Protection)**:
  - [x] Implementasi **Tab-Switch & Blur Detection** pada `ExamCBT.tsx` (catat pelanggaran beralih tab/aplikasi)
  - [x] Modal peringatan pelanggaran interaktif dengan counter batas sebelum auto-submit paksa
  - [x] Proteksi konfirmasi `beforeunload` saat ujian berjalan untuk mencegah refresh/tutup tab tidak sengaja
- [x] **Fitur Interaksi CBT Mahasiswa**:
  - [x] Fitur penandaan soal **Ragu-Ragu (Bookmark/Flagging)** dengan warna kuning/amber pada kisi nomor soal
- [x] **Laporan Kelulusan & Sertifikat Digital Mahasiswa (`ResultReport.tsx`)**:
  - [x] Rincian nilai transparan (Listening, Structure, Reading, CEFR Level, Total Skor ETS)
  - [x] Fitur **Unduh / Cetak Sertifikat Kelulusan Resmi (PDF)** format A4 landscape & QR Code verifikasi
- [x] **Manajemen & Pemulihan Sistem Pengawas (`SettingsProctor.tsx`)**:
  - [x] Endpoint backend `GET /api/system/backup-db` untuk unduh SQL Dump cadangan instan
  - [x] Tombol *Download Backup Database (.sql)* pada portal pengaturan pengawas

---

## 🔮 Fase 7: Roadmap Tugas Tambahan & Peningkatan Sistem (Agenda Lanjutan / Besok)

### 1. 🛡️ Pengawasan & Integritas Ujian Lanjutan
- [ ] **Sinkronisasi Log Pelanggaran Real-time**: Kirim event pelanggaran tab-switch ke server dan tampilkan pada tabel live proctoring pengawas.
- [ ] **Mode Layar Penuh Wajib (Fullscreen Enforcement)**: Paksa mode fullscreen saat ujian dimulai, catat event saat peserta keluar dari fullscreen (*Esc key*).
- [ ] **Proteksi Inspect & Shortcut Browser**: Nonaktifkan klik kanan (*context menu*), tombol F12, Ctrl+Shift+I, dan Ctrl+U pada mode browser standar.
- [ ] **Dual Monitor & Multi-Window Prevention**: Deteksi penggunaan display sekunder atau pembagian layar (*split screen*).

### 2. 📡 Live Monitoring & Real-time Proctoring (SSE / WebSocket)
- [ ] **Integrasi Server-Sent Events (SSE) / WebSocket**: Ganti polling berkala dengan koneksi push real-time dua arah.
- [ ] **Live Participant Status Badge**: Tampilkan status mahasiswa (Online, Disconnected, Sedang Ujian, Selesai) dengan indikator visual dinamis.
- [ ] **Real-time Progress Tracker**: Tampilkan nomor soal aktif dan section pengerjaan terkini setiap peserta secara langsung di dashboard pengawas.
- [ ] **Broadcast Pesan Pengawas**: Fitur mengirim notifikasi / instruksi instan dari pengawas ke seluruh layar peserta ujian.
- [ ] **Aksi Paksa Pengawas (Force-Submit / Kick)**: Tombol aksi bagi pengawas untuk menghentikan sesi atau mengumpulkan paksa ujian peserta yang terindikasi curang.

### 3. 🎲 Engine Pengacakan Soal & Pilihan Jawaban (*Randomization*)
- [ ] **Shuffle Pilihan Jawaban (A, B, C, D)**: Pengacakan urutan opsi jawaban per peserta dengan pemetaan (*mapping*) kunci jawaban otomatis di backend.
- [ ] **Shuffle Urutan Butir Soal**: Pengacakan urutan nomor soal per section (khusus Section 2 & Section 3) tanpa merusak grup soal wacana reading.

### 4. 🎓 Sertifikasi, QR Code Publik & Analisis Hasil
- [ ] **Halaman Verifikasi Publik Sertifikat (`/verify/:id`)**: Rute publik untuk memindai QR Code sertifikat dan menampilkan keabsahan nilai secara resmi bagi kampus/perusahaan.
- [ ] **Dynamic QR Code Generator**: Sematkan QR code yang mengarah ke link verifikasi resmi langsung ke dalam dokumen PDF sertifikat.
- [ ] **Kustomisasi Header & Tanda Tangan Sertifikat**: Formulir untuk mengatur nama dekan/rektor, NIP, serta tanda tangan digital pada sertifikat.
- [ ] **Analisis Butir Soal (Item Analysis)**: Perhitungan statistik tingkat kesukaran soal (*difficulty index*) dan daya beda (*discrimination index*) untuk evaluasi bank soal.

### 5. ☁️ Cloud Deployment & Produksi
- [ ] **Setup Cloud Database MySQL (TiDB Cloud Serverless / Railway)**: Migrasi skema `db_stbtoefl` ke database cloud online.
- [ ] **Konfigurasi SSL Connection Driver**: Aktifkan flag `ssl: { rejectUnauthorized: true }` pada konfigurasi pool `api/database.js`.
- [ ] **Migrasi Asset Audio ke Cloud Storage**: Hubungkan media audio listening dengan CDN/Storage eksternal (Supabase Storage / Cloudinary) agar siap untuk serverless Vercel.
- [ ] **Konfigurasi Vercel Deployment**: Buat file `vercel.json` untuk routing rewrite Frontend & Serverless Functions.


