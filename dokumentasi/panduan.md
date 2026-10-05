# 📖 Panduan Lengkap Operasional & Setup System: SECURE-TOEFL CBT

Dokumen ini berisi panduan alur penggunaan sistem **SECURE-TOEFL CBT System** secara menyeluruh, mulai dari persiapan server lokal, konfigurasi pengunci **Safe Exam Browser (SEB)**, pengaturan tema visual (Gelap/Terang), hingga tata cara operasional untuk **Dosen Pengawas** dan **Peserta Ujian**.

---

## 🛠️ 1. Persiapan Server & Lingkungan Lokal

### A. Persyaratan Perangkat Lunak
* **Node.js**: v18.0.0 atau yang lebih baru.
* **Database**: MySQL Server (via XAMPP / MariaDB) pada port `3306`.
* **Safe Exam Browser (SEB)**: Client versi 3.x+ terpasang pada komputer klien laboratorium.

### B. Langkah Inisialisasi Pertama Kali
1. Pastikan modul MySQL pada **XAMPP Control Panel** telah berstatus **Running**.
2. Jalankan migrasi basis data `db_stbtoefl` dan seed data awal:
   ```bash
   cd api
   npm run migrate
   ```
3. Jalankan server monorepo (Frontend Vite + Backend Express) secara bersamaan:
   ```bash
   # Di root direktori f:\STBTOEFL
   npm run dev
   ```
   * **Frontend Client**: `http://localhost:5173`
   * **Backend Express API**: `http://localhost:5000`

---

## 🛡️ 2. Panduan Setup Safe Exam Browser (SEB)

### A. Apa itu Safe Exam Browser?
Safe Exam Browser (SEB) adalah peramban khusus terisolasi yang mengunci lingkungan komputer peserta saat ujian. SEB mencegah peserta membuka tab baru, menjalankan aplikasi pihak ketiga, atau melakukan kecurangan selama ujian berlangsung.

### B. Cara Penggunaan di Komputer Laboratorium Klien
1. Unduh dan pasang **Safe Exam Browser** dari situs resmi [safeexambrowser.org](https://safeexambrowser.org).
2. Di folder utama proyek, temukan berkas konfigurasi [`config_ujian_lab.seb`](file:///f:/STBTOEFL/config_ujian_lab.seb).
3. **Klik ganda berkas `config_ujian_lab.seb`** pada komputer laboratorium peserta.
4. SEB akan otomatis terbuka dalam mode *Full-Screen Locked* dan mengarahkan tampilan langsung ke antarmuka login ujian: `http://localhost:5173/student/login`.
5. SEB akan mengirimkan header validasi kriptografi `X-SafeExamBrowser-ConfigKeyHash` ke peladen Express untuk mengonfirmasi bahwa peserta berada di browser aman.

> 💡 **Mode Pengujian Dev (Bypass SEB)**:  
> Untuk menguji ruang ujian melalui Google Chrome/Edge biasa tanpa aplikasi SEB, ubah variabel `SEB_STRICT=false` di berkas [`.env`](file:///f:/STBTOEFL/.env).

---

## 🎨 3. Pengaturan Tema Visual (Dark / Light Mode)

Sistem mererapkan strategi desain visual berbasis kenyamanan pengguna:
* **Portal Dosen Pengawas (`/proctor/*`)**:
  * Mendukung **Mode Gelap (Dark)** dan **Mode Terang (Light)**.
  * Pengawas dapat beralih tema kapan saja dengan mengklik ikon **Sun / Moon** di sebelah kanan Navbar.
  * Pilihan tema disimpan secara permanen di `localStorage` (`proctor_theme`).
* **Area Ujian Peserta (`/student/*`)**:
  * Menggunakan **Mode Terang (Light Mode Only)** secara konsisten.
  * Tampilan dirancang menyerupai kertas ujian fisik dengan latar belakang bersih (`bg-slate-50`), teks kontras tinggi, dan panel putih untuk meningkatkan kenyamanan mata peserta selama 115 menit ujian.

---

## 👨‍🏫 4. Panduan Operasional Portal Dosen Pengawas

### A. Login Pengawas
* **URL Login**: `http://localhost:5173/proctor/login`
* **NIP / Username Default**: `admin`
* **Kata Sandi Default**: `admin123`

### B. Alur Kerja Pengawas Ujian
1. **Membuat Sesi Ujian & Token**:
   * Akses menu **Token & Sesi Ujian** (`/proctor/tokens`).
   * Klik tombol **Buat Sesi Ujian Baru** dan masukan nama sesi (misal: *"STBTOEFL Gelombang 1 - Lab 01"*).
   * Sistem akan membangkitkan **Kode Token 6-Digit Acak** (contoh: `AB12CD`).
   * Klik tombol **Toggle Status** untuk mengaktifkan sesi ujian agar dapat diakses oleh mahasiswa.
   * *(Opsional)* Klik **Kirim Email** untuk menyebarkan token ujian secara massal ke email mahasiswa via Nodemailer.
2. **Pengelolaan Bank Soal & Media Audio**:
   * Akses menu **Bank Soal & Audio MP3** (`/proctor/bank`).
   * Pilih section yang ingin dikelola (Section 1 Listening, Section 2 Structure, atau Section 3 Reading).
   * Gunakan tombol **Upload MP3 Audio** untuk mengunggah berkas audio listening ke peladen.
   * Tambahkan atau perbarui 140 butir instrumen soal dan kunci jawaban resmi.
3. **Monitoring & Ekspor Nilai Excel**:
   * Akses menu **Rekapitulasi & Ekspor Excel** (`/proctor/recap`).
   * Pengawas dapat memantau perolehan skor mentah L/S/R, nilai skala ETS 310–677, dan level CEFR (`C1`, `B2`, `B1`, `A2`).
   * Klik tombol **Ekspor Rekap Ke File Excel (.xlsx)** untuk mengunduh laporan rekapitulasi nilai resmi yang dapat dibuka di Microsoft Excel.

---

## 🎓 5. Panduan Alur Peserta Ujian (Mahasiswa)

### A. Alur Pengerjaan Ujian CBT
1. **Login Peserta (`/student/login`)**:
   * Peserta membuka Safe Exam Browser via berkas `config_ujian_lab.seb`.
   * Tampilan dalam **Mode Terang (Light Mode)**. Masukan **NIM**, **Nama Lengkap**, dan **Kode Token 6-Digit** dari pengawas.
2. **Pemeriksaan Headphone Audio (`/student/audio-check`)**:
   * Peserta menguji suara headphone pada pemutar audio *Strict 1x Play*.
   * Centang konfirmasi kelayakan suara audio lalu klik **Lanjut ke Petunjuk Ujian**.
3. **Petunjuk Resmi & Unduh Soal (`/student/instructions`)**:
   * Peserta membaca aturan 3 section ujian TOEFL ITP.
   * Klik **Mulai Kerjakan Ujian Sekarang**. Sistem akan secara otomatis mengunduh (*prefetch*) 140 soal ke penyimpanan lokal klien IndexedDB (Dexie.js).
4. **Workspace Ujian CBT 3 Section (`/student/exam`)**:
   * **Section 1: Listening (50 Soal, 35 Menit)**: Audio diputar 1x tanpa seekbar/rewind.
   * **Section 2: Structure (40 Soal, 25 Menit)**: Pilihan ganda tata bahasa.
   * **Section 3: Reading (50 Soal, 55 Menit)**: Tata letak *split-screen* 50/50 wacana bacaan di panel kiri dan soal di panel kanan.
   * Jawaban tersimpan otomatis per interval 10 detik ke peladen (*Last-Write-Wins Auto Sync*).
   * Fitur **Ragu-ragu (Flag)** dan **Daftar Nomor Soal (Palette Drawer 1–140)** tersedia untuk navigasi cepat.
5. **Laporan Skor & CEFR (`/student/result`)**:
   * Pasca-submit, mesin kalkulasi peladen menghitung total skor ekuasi baku ETS (310–677) dan menetapkan klasifikasi kompetensi CEFR.
   * Peserta dapat melihat rincian skor dan pratinjau sertifikat digital.

---

## 🧪 6. Verifikasi & Troubleshooting Teknis

### A. Menjalankan Skrip Test Otomatis
Untuk memverifikasi koneksi database MySQL, integritas 7 tabel `db_stbtoefl`, dan rumus matematis konversi skor ETS:
```bash
cd api
node test-system.js
```

### B. Daftar Berkas Spesifikasi & Dokumentasi
* [dokumentasi/tech.md](file:///f:/STBTOEFL/dokumentasi/tech.md): Spesifikasi arsitektur & teknologi monorepo.
* [dokumentasi/db.md](file:///f:/STBTOEFL/dokumentasi/db.md): Skema 7 tabel MySQL & kamus data.
* [dokumentasi/task.md](file:///f:/STBTOEFL/dokumentasi/task.md): Tracker tugas pengerjaan (Selesai 100%).
* [config_ujian_lab.seb](file:///f:/STBTOEFL/config_ujian_lab.seb): Berkas konfigurasi Safe Exam Browser.
