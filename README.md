# 🎓 STBTOEFL - Secure TOEFL CBT System

Sistem ujian berbasis komputer (**Computer-Based Test / CBT**) modern untuk pelaksanaan simulasi dan tes resmi **TOEFL ITP** yang dilengkapi dengan proteksi integritas ujian, pemutaran audio berstandar ketat (*Strict 1x Play*), sinkronisasi offline (IndexedDB), serta manajemen ujian lengkap untuk Pengawas (*Proctor*).

---

## 🌟 Fitur Utama

### 🧑‍🎓 Portal Peserta Ujian (Student)
- **Login Terverifikasi**: Validasi NIM terdaftar, nama lengkap, dan Token Sesi Ujian yang aktif.
- **Audio Diagnostic Check**: Pengecekan speaker/headphone sebelum ujian dimulai untuk memastikan kualitas suara.
- **Strict 1x Audio Playback**: Audio listening hanya dapat diputar 1 kali per soal dan otomatis terkunci begitu selesai diputar atau saat berpindah soal.
- **Split Reading View**: Tampilan terbagi (*split view*) antara wacana/teks bacaan panjang dan soal pertanyaan pada Section 3.
- **Offline Sync Queue (Dexie IndexedDB)**: Jawaban tersimpan secara lokal dan otomatis tersinkronisasi ke server jika terjadi gangguan jaringan singkat.
- **Responsive Adaptive UI**: Tampilan adaptif dari layar laptop 14 inci hingga monitor laboratorium 24–27 inci (1080p / 1440p).
- **Laporan Skor Real-time**: Kalkulasi skor konversi TOEFL standar untuk Listening, Structure, dan Reading.

### 👨‍🏫 Portal Pengawas (Proctor / Admin)
- **Dashboard Real-time**: Statistik peserta, sesi aktif, serta ringkasan bank soal.
- **Manajemen Peserta**: Pendaftaran data peserta dan verifikasi kehadiran.
- **Token & Sesi Ujian**: Pembuatan sesi ujian baru, pengaktifan/penonaktifan token, dan broadcast token.
- **Bank Soal & Wacana**:
  - Pengelolaan soal untuk 3 Section (Listening, Structure, Reading).
  - Fitur **Checkbox Batch Delete** (hapus 10+ soal sekaligus atau hapus semua).
  - Preview audio langsung dari daftar soal.
- **Audio Manager**:
  - Multi-upload audio (bisa unggah puluhan file MP3/WAV sekaligus).
  - Cek audio terhubung dengan tombol speaker.
  - Hapus dan reset file audio.
- **Rekap Nilai & Export**: Unduh hasil skor peserta ke format Excel/PDF.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React, Framer Motion, Dexie.js (IndexedDB).
- **Backend API**: Node.js, Express.js, MySQL2, JWT, Multer (Audio Upload), Bcrypt.js.
- **Database**: MySQL / MariaDB (XAMPP).
- **Keamanan**: Integrasi Safe Exam Browser (SEB) Header Hash Verification & JWT Session Guards.

---

## 🚀 Panduan Instalasi & Menjalankan Sistem

### 1. Prasyarat
Pastikan komputer Anda telah terinstal:
- **Node.js** (versi 18.x atau lebih baru) & **npm**
- **XAMPP / MySQL Server**

---

### 2. Setup Database
1. Buka **XAMPP Control Panel** dan nyalakan modul **MySQL** & **Apache**.
2. Buka browser dan akses **phpMyAdmin** (`http://localhost/phpmyadmin`).
3. Buat database baru bernama:
   ```sql
   db_stbtoefl
   ```
4. Pilih tab **Import**, lalu pilih file `db_stbtoefl.sql` yang berada di root folder proyek ini, kemudian klik **Import / Go**.

---

### 3. Konfigurasi Environment (`.env`)
Salin file `.env.example` menjadi `.env` di root folder:

```bash
# Windows PowerShell
copy .env.example .env
```

Pastikan isi `.env` sesuai dengan konfigurasi lokal Anda:
```env
# Server
PORT=5001
NODE_ENV=development

# Database MySQL (Default XAMPP)
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=db_stbtoefl
DB_PORT=3306

# Keamanan & JWT
JWT_SECRET=stbtoefl_jwt_secret_key_2026_secure
SEB_HASH_SECRET=seb_config_key_hash_secret_toefl_cbt
SEB_STRICT=false

# Frontend API URL (Kosongkan jika menggunakan Vite proxy bawaan)
VITE_API_URL=
```

---

### 4. Install Dependencies

Buka terminal di root folder proyek dan jalankan:

```bash
# Install dependency frontend & root
npm install

# Install dependency backend api
cd api
npm install
cd ..
```

---

### 5. Jalankan Aplikasi

Cukup jalankan satu perintah berikut di root folder:

```bash
npm run dev
```

Perintah di atas akan secara otomatis menjalankan:
- **Frontend Vite**: `http://localhost:5173`
- **Backend Express API**: `http://localhost:5001`

---

## 📖 Cara Menggunakan Sistem

### A. Akses Sebagai Pengawas (Proctor / Admin)
1. Buka browser dan kunjungi: **`http://localhost:5173/proctor/login`**
2. Masukkan akun default:
   - **NIP / Username**: `admin` *(atau `199001012026011001`)*
   - **Password**: `admin123`
3. Langkah persiapan ujian:
   - **Buka Menu Token Ujian**: Buat sesi baru dan pastikan status sesi diset **AKTIF**. Catat **Token Ujian** yang muncul (misal: `TOEFL-XXXX`).
   - **Buka Menu Bank Soal & Audio**: Pastikan soal Section 1 (Listening), Section 2 (Structure), dan Section 3 (Reading) sudah terisi beserta audio soalnya.
   - **Buka Menu Peserta**: Pastikan data NIM mahasiswa yang akan ikut ujian sudah terdaftar.

---

### B. Akses Sebagai Peserta Ujian (Student)
1. Buka browser dan kunjungi: **`http://localhost:5173/student/login`**
2. Masukkan data:
   - **NIM**: *(Contoh: NIM yang sudah didaftarkan oleh proctor)*
   - **Nama Lengkap**: *(Harus cocok dengan data terdaftar)*
   - **Email**: Email peserta
   - **Token Ujian**: Masukkan Token Sesi Ujian dari pengawas
3. **Audio Check**: Klik tombol tes audio untuk memastikan suara terdengar jelas, lalu konfirmasi.
4. **Instruksi Ujian**: Baca petunjuk pengerjaan dan tata tertib ujian, lalu klik **Mulai Ujian CBT**.
5. **Pengerjaan Soal**:
   - Audio listening akan diputar otomatis (*1x putar*).
   - Gunakan tombol **Ragu-ragu** untuk menandai soal yang belum yakin.
   - Selesaikan Section 1 ➔ Section 2 ➔ Section 3.
6. **Laporan Nilai**: Setelah ujian selesai, peserta dapat langsung melihat rincian skor konversi TOEFL mereka.

---

## 📁 Struktur Direktori

```text
STBTOEFL/
├── api/                         # Backend Express.js Server
│   ├── controllers/             # Controller logika bisnis (Auth, Soal, Ujian, dll)
│   ├── middleware/              # Auth guard & SEB security header
│   ├── static/audio/            # Direktori penyimpanan file audio soal
│   ├── database.js              # Koneksi MySQL pool
│   └── index.js                 # Entry point server Express
├── src/                         # Frontend React + TypeScript
│   ├── components/              # Komponen UI (AudioPlayer, ReadingView, Header, dll)
│   ├── Page/
│   │   ├── proctor/             # Halaman pengawas (Dashboard, Bank Soal, Audio, Rekap)
│   │   ├── student/             # Halaman peserta (Login, AudioCheck, ExamCBT, Hasil)
│   │   └── error/               # Halaman error & SEB Forbidden
│   ├── services/                # API client & Dexie IndexedDB sync queue
│   ├── App.tsx                  # Routing aplikasi
│   └── main.tsx                 # Entry point React
├── db_stbtoefl.sql              # Dump skema & data awal database MySQL
├── .env.example                 # Contoh template konfigurasi environment
├── package.json                 # Dependency & skrip eksekusi
└── README.md                    # Dokumentasi penggunaan
```

---

## 🛡️ Catatan Keamanan Safe Exam Browser (SEB)
Untuk penggunaan lingkungan ujian resmi laboratorium dengan **Safe Exam Browser (SEB)**:
- Ubah `SEB_STRICT=true` di file `.env`.
- Sistem akan memvalidasi header `X-SafeExamBrowser-RequestHash` dari aplikasi SEB peserta. Peserta yang mengakses melalui browser standar (Chrome/Edge/Firefox) akan otomatis dialihkan ke halaman peringatan.

---

## 📄 Lisensi & Kontribusi
Dikembangkan untuk keperluan Ujian Standar Kemampuan Bahasa Inggris (TOEFL ITP CBT).
Silakan berkontribusi atau laporkan *issue* melalui repository GitHub: [STB-TOEFL](https://github.com/abimanew24/STB-TOEFL).
