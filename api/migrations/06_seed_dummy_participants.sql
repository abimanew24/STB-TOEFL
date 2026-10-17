-- ============================================================
-- Migrasi 06: Data Dummy Peserta Ujian (Mahasiswa)
-- ============================================================

USE `db_stbtoefl`;

INSERT INTO `pengguna` (`nomor_induk`, `nama_lengkap`, `email`, `kata_sandi`, `peran`)
VALUES
  ('220101001', 'Ahmad Fauzi Rahman', 'ahmad.fauzi@student.ac.id', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'mahasiswa'),
  ('220101002', 'Siti Nur Aisyah', 'siti.aisyah@student.ac.id', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'mahasiswa'),
  ('220101003', 'Bima Satria Pratama', 'bima.satria@student.ac.id', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'mahasiswa'),
  ('220101004', 'Dewi Lestari Putri', 'dewi.lestari@student.ac.id', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'mahasiswa'),
  ('220101005', 'Rian Hidayatulloh', 'rian.hidayat@student.ac.id', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'mahasiswa'),
  ('220101006', 'Anisa Rahmawati', 'anisa.rahma@student.ac.id', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'mahasiswa'),
  ('220101007', 'Dimas Bagus Wicaksono', 'dimas.bagus@student.ac.id', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'mahasiswa'),
  ('220101008', 'Putri Ayu Wandira', 'putri.ayu@student.ac.id', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'mahasiswa'),
  ('220101009', 'Fajar Nugroho Saputra', 'fajar.nugroho@student.ac.id', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'mahasiswa'),
  ('220101010', 'Nabila Zahra Khairunnisa', 'nabila.zahra@student.ac.id', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'mahasiswa'),
  ('220101011', 'Muhammad Rizky Ramadhan', 'rizky.ramadhan@student.ac.id', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'mahasiswa'),
  ('220101012', 'Indah Permatasari', 'indah.permata@student.ac.id', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'mahasiswa'),
  ('220101013', 'Eko Prasetyo Utomo', 'eko.prasetyo@student.ac.id', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'mahasiswa'),
  ('220101014', 'Larasati Dwi Anggraeni', 'larasati.dwi@student.ac.id', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'mahasiswa'),
  ('220101015', 'Bayu Aji Pamungkas', 'bayu.aji@student.ac.id', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'mahasiswa'),
  ('220101016', 'Maya Anggraini', 'maya.anggraini@student.ac.id', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'mahasiswa'),
  ('220101017', 'Gilang Ramadhan', 'gilang.ramadhan@student.ac.id', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'mahasiswa'),
  ('220101018', 'Fitri Handayani', 'fitri.handayani@student.ac.id', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'mahasiswa'),
  ('220101019', 'Arif Wibowo Kusuma', 'arif.wibowo@student.ac.id', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'mahasiswa'),
  ('220101020', 'Tia Nurhasanah', 'tia.nurhasanah@student.ac.id', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'mahasiswa'),
  ('220101021', 'Yoga Pratama Hendrawan', 'yoga.pratama@student.ac.id', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'mahasiswa'),
  ('220101022', 'Zahra Amelia Santoso', 'zahra.amelia@student.ac.id', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'mahasiswa'),
  ('220101023', 'Kevin Christian Wijaya', 'kevin.wijaya@student.ac.id', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'mahasiswa'),
  ('220101024', 'Nadine Aurelia', 'nadine.aurelia@student.ac.id', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'mahasiswa'),
  ('220101025', 'Rangga Arya Sena', 'rangga.sena@student.ac.id', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'mahasiswa')
ON DUPLICATE KEY UPDATE 
  `nama_lengkap` = VALUES(`nama_lengkap`), 
  `email` = VALUES(`email`);
