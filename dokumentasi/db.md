# Dokumentasi Skema & Desain Basis Data: STBTOEFL CBT System

Dokumen ini berisi spesifikasi arsitektur data, kamus data, diagram relasi entitas (ERD), strategi optimasi efisiensi memori RAM, serta skrip DDL (*Data Definition Language*) dan DML (*Data Manipulation Language*) untuk database **`db_stbtoefl`**[cite: 2, 7].

---

## 📌 1. Gambaran Umum & Konsep Perancangan

Basis data **`db_stbtoefl`** dirancang khusus untuk mendukung operasional sistem asesmen mandiri *Computer-Based Testing* (CBT) setara TOEFL ITP® Level 1 pada topologi semi-daring berbasis peladen lokal (*Localhost LAN via XAMPP*)[cite: 2, 7].

### Prinsip Utama Perancangan:
1. **Efisiensi Memori Tingkat Tinggi (*Low-Footprint Storage*)**: 
   * Meniadakan penggunaan tipe data berlebih seperti `INT` (4 byte) pada kolom data berskala kecil[cite: 2].
   * Menggunakan `TINYINT UNSIGNED` (1 byte, jangkauan 0–255) untuk pengenal sesi, nomor bagian ujian (1–3), skor mentah (0–50), dan nilai skala ETS (31–68)[cite: 1, 2, 4].
   * Menggunakan `SMALLINT UNSIGNED` (2 byte, jangkauan 0–65.535) untuk ID pengguna, ID bank soal, dan akumulasi total skor TOEFL (310–677)[cite: 1, 2].
   * Membatasi ukuran `VARCHAR` secara terukur (seperti `nomor_induk` dibatasi 18 karakter untuk menampung NIM 8–14 digit atau NIP pengawas 18 digit) guna menekan alokasi memori *buffer pool* InnoDB[cite: 3].
2. **Normalisasi Terpadu Tanpa Redundansi**: 
   * Menggabungkan seluruh bank soal ke dalam satu tabel `bank_soal` dengan filter `nomor_section`[cite: 2]. Desain ini meniadakan pemecahan tabel berulang (`tb_soal_sec1`, `tb_soal_sec2`, `tb_soal_sec3`) yang memboroskan koneksi basis data[cite: 3].
3. **Idempotensi & Penanganan Konkurensi**:
   * Menerapkan batasan kunci unik gabungan (*composite unique key*) pada tabel jawaban mahasiswa agar proses sinkronisasi dari IndexedDB klien bersifat idempoten dan mematuhi logika *Last-Write-Wins* (LWW)[cite: 2].

---

## 🗂️ 2. Entitas & Kamus Data (Data Dictionary)

### 1. Tabel `pengguna`
Menyimpan identitas akun mahasiswa peserta ujian dan dosen pengawas/administrator[cite: 3].
* **`id`** (`SMALLINT UNSIGNED`, Primary Key, Auto Increment): Identifikator unik pengguna (kapasitas hingga 65.535 entri).
* **`nomor_induk`** (`VARCHAR(18)`, Unique, Not Null): NIM mahasiswa atau NIP pengawas[cite: 3].
* **`nama_lengkap`** (`VARCHAR(80)`, Not Null): Nama lengkap pemilik akun.
* **`email`** (`VARCHAR(100)`, Unique, Not Null): Alamat email aktif untuk distribusi token dan pengiriman sertifikat nilai[cite: 3].
* **`kata_sandi`** (`VARCHAR(60)`, Not Null): Hash kata sandi terenkripsi menggunakan algoritma Bcrypt (60 karakter)[cite: 7].
* **`peran`** (`ENUM('mahasiswa', 'pengawas')`, Default `'mahasiswa'`): Hak otorisasi dalam sistem.
* **`dibuat_pada`** (`TIMESTAMP`, Default `CURRENT_TIMESTAMP`): Waktu pencatatan akun[cite: 3].

### 2. Tabel `sesi_ujian`
Mengelola jadwal ujian dan gerbang token aktifasi sesi di laboratorium kampus[cite: 2, 3].
* **`id`** (`TINYINT UNSIGNED`, Primary Key, Auto Increment): Identifikator unik sesi ujian (kapasitas 255 sesi).
* **`nama_sesi`** (`VARCHAR(60)`, Not Null): Nama atau label sesi (contoh: "STBTOEFL Gelombang 1 - Lab 01").
* **`token`** (`VARCHAR(6)`, Unique, Not Null): Kode verifikasi 6 karakter acak yang dibangkitkan pengawas[cite: 2, 3].
* **`status_aktif`** (`BOOLEAN`, Default `FALSE`): Menentukan apakah sesi ujian sedang dapat diakses oleh peserta[cite: 2].
* **`waktu_mulai`** (`DATETIME`, Nullable): Waktu dimulainya sesi pengerjaan[cite: 2].
* **`waktu_selesai`** (`DATETIME`, Nullable): Batas akhir penutupan sesi ujian[cite: 2].
* **`dibuat_pada`** (`TIMESTAMP`, Default `CURRENT_TIMESTAMP`).

### 3. Tabel `wacana_reading`
Menampung teks bacaan akademik panjang untuk Section 3 Reading Comprehension[cite: 1, 2, 3].
* **`id`** (`TINYINT UNSIGNED`, Primary Key, Auto Increment): Identifikator teks wacana bacaan.
* **`judul`** (`VARCHAR(100)`, Nullable): Topik atau tajuk wacana bacaan.
* **`isi_wacana`** (`TEXT`, Not Null): Teks artikel bacaan utuh yang disajikan pada panel kiri tata letak *split-screen*[cite: 2].

### 4. Tabel `bank_soal`
Menampung seluruh butir instrumen ujian (140 butir pertanyaan TOEFL ITP Level 1)[cite: 1, 2].
* **`id`** (`SMALLINT UNSIGNED`, Primary Key, Auto Increment): Identifikator unik pertanyaan.
* **`nomor_section`** (`TINYINT UNSIGNED`, Not Null): Bagian ujian (`1` = Listening, `2` = Structure, `3` = Reading)[cite: 1, 2].
* **`nama_bagian`** (`VARCHAR(10)`, Nullable): Sub-bagian tes (contoh: `'Part A'`, `'Part B'`, `'Part C'`)[cite: 1].
* **`wacana_id`** (`TINYINT UNSIGNED`, Nullable, Foreign Key): Referensi relasi ke `wacana_reading.id` (hanya aktif pada Section 3)[cite: 3].
* **`berkas_audio`** (`VARCHAR(100)`, Nullable): Nama berkas audio MP3 (hanya aktif pada Section 1)[cite: 1, 2, 3].
* **`pertanyaan`** (`TEXT`, Not Null): Teks butir pertanyaan atau instruksi soal[cite: 1].
* **`pilihan_a`** (`VARCHAR(200)`, Not Null): Teks opsi jawaban A[cite: 1].
* **`pilihan_b`** (`VARCHAR(200)`, Not Null): Teks opsi jawaban B[cite: 1].
* **`pilihan_c`** (`VARCHAR(200)`, Not Null): Teks opsi jawaban C[cite: 1].
* **`pilihan_d`** (`VARCHAR(200)`, Not Null): Teks opsi jawaban D[cite: 1].
* **`jawaban_benar`** (`ENUM('A', 'B', 'C', 'D')`, Not Null): Kunci jawaban resmi.

### 5. Tabel `jawaban_mahasiswa`
Mencatat rekaman transmisi jawaban mahasiswa per butir soal (*lightweight transaction table*)[cite: 2].
* **`id`** (`INT UNSIGNED`, Primary Key, Auto Increment): Identifikator log transaksi jawaban.
* **`pengguna_id`** (`SMALLINT UNSIGNED`, Foreign Key ke `pengguna.id`)[cite: 2].
* **`sesi_id`** (`TINYINT UNSIGNED`, Foreign Key ke `sesi_ujian.id`)[cite: 2].
* **`soal_id`** (`SMALLINT UNSIGNED`, Foreign Key ke `bank_soal.id`)[cite: 2].
* **`jawaban_dipilih`** (`ENUM('A', 'B', 'C', 'D')`, Nullable): Opsi jawaban yang dipilih mahasiswa[cite: 2].
* **`stempel_waktu_klien`** (`BIGINT UNSIGNED`, Not Null): Unix epoch waktu perangkat klien dalam milidetik untuk resolusi konflik *Last-Write-Wins*[cite: 2].
* **`diperbarui_pada`** (`TIMESTAMP`, Default `CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`).
* **Batasan Unik**: `UNIQUE KEY uq_pengguna_sesi_soal (pengguna_id, sesi_id, soal_id)` (mencegah data jawaban ganda pada soal yang sama)[cite: 2].

### 6. Tabel `konversi_skor`
Tabel matriks ekuasi baku ETS Volume 3 untuk memetakan jumlah jawaban benar ke nilai skala[cite: 1, 2, 4].
* **`skor_mentah`** (`TINYINT UNSIGNED`, Primary Key): Total jawaban benar (rentang 0 hingga 50)[cite: 1, 2, 4].
* **`skala_listening`** (`TINYINT UNSIGNED`, Not Null): Nilai skala Section 1 Listening (rentang 31–68)[cite: 1, 2, 4].
* **`skala_structure`** (`TINYINT UNSIGNED`, Not Null): Nilai skala Section 2 Structure (rentang 31–68)[cite: 1, 2, 4].
* **`skala_reading`** (`TINYINT UNSIGNED`, Not Null): Nilai skala Section 3 Reading (rentang 31–67)[cite: 1, 2, 4].

### 7. Tabel `hasil_ujian`
Menyimpan ringkasan pencapaian akhir peserta pasca-eksekusi mesin penilaian peladen[cite: 2, 3].
* **`id`** (`SMALLINT UNSIGNED`, Primary Key, Auto Increment): Identifikator rekap hasil.
* **`pengguna_id`** (`SMALLINT UNSIGNED`, Foreign Key ke `pengguna.id`)[cite: 2].
* **`sesi_id`** (`TINYINT UNSIGNED`, Foreign Key ke `sesi_ujian.id`)[cite: 2].
* **`benar_listening`** (`TINYINT UNSIGNED`, Not Null): Skor mentah Listening (maksimal 50)[cite: 1, 2, 4].
* **`benar_structure`** (`TINYINT UNSIGNED`, Not Null): Skor mentah Structure (maksimal 40)[cite: 1, 2, 4].
* **`benar_reading`** (`TINYINT UNSIGNED`, Not Null): Skor mentah Reading (maksimal 50)[cite: 1, 2, 4].
* **`skala_listening`** (`TINYINT UNSIGNED`, Not Null): Nilai skala Listening hasil lookup matriks[cite: 1, 2, 4].
* **`skala_structure`** (`TINYINT UNSIGNED`, Not Null): Nilai skala Structure hasil lookup matriks[cite: 1, 2, 4].
* **`skala_reading`** (`TINYINT UNSIGNED`, Not Null): Nilai skala Reading hasil lookup matriks[cite: 1, 2, 4].
* **`total_skor_toefl`** (`SMALLINT UNSIGNED`, Not Null): Total skor resmi ETS: $\frac{(\text{Scaled L} + \text{Scaled S} + \text{Scaled R}) \times 10}{3}$ (rentang 310–677)[cite: 1, 2, 4].
* **`level_cefr`** (`VARCHAR(2)`, Not Null): Klasifikasi kompetensi internasional (`'A2'`, `'B1'`, `'B2'`, atau `'C1'`)[cite: 2].
* **`selesai_pada`** (`TIMESTAMP`, Default `CURRENT_TIMESTAMP`)[cite: 2].
* **Batasan Unik**: `UNIQUE KEY uq_hasil_pengguna_sesi (pengguna_id, sesi_id)`[cite: 2].

---

## 🔗 3. Diagram Relasi Entitas (ERD Relational Model)

```text
  ┌────────────────────────┐
  │     wacana_reading     │
  ├────────────────────────┤
  │ PK  id                 │◄────────┐
  │     judul              │         │ (1:N)
  │     isi_wacana         │         │
  └────────────────────────┘         │
                                     │
  ┌────────────────────────┐         │
  │       bank_soal        │         │
  ├────────────────────────┤         │
  │ PK  id                 │         │
  │     nomor_section      │         │
  │     nama_bagian        │         │
  │ FK  wacana_id          ├─────────┘
  │     berkas_audio       │
  │     pertanyaan         │
  │     pilihan_a..d       │
  │     jawaban_benar      │
  └──────────┬─────────────┘
             │ (1:N)
             ▼
  ┌────────────────────────┐          ┌────────────────────────┐
  │   jawaban_mahasiswa    │          │        pengguna        │
  ├────────────────────────┤          ├────────────────────────┤
  │ PK  id                 │          │ PK  id                 │◄───────┐
  │ FK  pengguna_id        ├─────────►│     nomor_induk (NIM)  │        │
  │ FK  sesi_id            ├───┐      │     nama_lengkap       │        │
  │ FK  soal_id            │   │      │     email              │        │
  │     jawaban_dipilih    │   │      │     kata_sandi         │        │
  │     stempel_waktu_klien│   │      │     peran              │        │
  └────────────────────────┘   │      └────────────────────────┘        │
                               │                                        │ (1:N)
                               │                                        │
  ┌────────────────────────┐   │      ┌────────────────────────┐        │
  │       sesi_ujian       │   │      │      hasil_ujian       │        │
  ├────────────────────────┤   │      ├────────────────────────┤        │
  │ PK  id                 │◄──┴─────►│ PK  id                 │        │
  │     nama_sesi          │   (1:N)  │ FK  pengguna_id        ├────────┘
  │     token (6 Digit)    │          │ FK  sesi_id            │
  │     status_aktif       │          │     benar_l, s, r      │
  │     waktu_mulai..akhir │          │     skala_l, s, r      │
  └────────────────────────┘          │     total_skor_toefl   │
                                      │     level_cefr         │
  ┌────────────────────────┐          └────────────────────────┘
  │     konversi_skor      │
  ├────────────────────────┤
  │ PK  skor_mentah (0-50) │
  │     skala_listening    │
  │     skala_structure    │
  │     skala_reading      │
  └────────────────────────┘