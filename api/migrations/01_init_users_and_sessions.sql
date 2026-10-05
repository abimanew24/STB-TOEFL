-- ============================================================
-- Migrasi 01: Inisialisasi Database, Tabel Pengguna & Sesi Ujian
-- ============================================================

CREATE DATABASE IF NOT EXISTS `db_stbtoefl` 
  DEFAULT CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;

USE `db_stbtoefl`;

-- ------------------------------------------------------------
-- 1. Tabel Pengguna (Mahasiswa & Dosen Pengawas)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `pengguna` (
  `id` SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nomor_induk` VARCHAR(18) NOT NULL,
  `nama_lengkap` VARCHAR(80) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `kata_sandi` VARCHAR(60) NOT NULL,
  `peran` ENUM('mahasiswa', 'pengawas') NOT NULL DEFAULT 'mahasiswa',
  `dibuat_pada` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_pengguna_nomor_induk` (`nomor_induk`),
  UNIQUE KEY `uq_pengguna_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 2. Tabel Sesi Ujian (Jadwal & Gerbang Token Ujian)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `sesi_ujian` (
  `id` TINYINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nama_sesi` VARCHAR(60) NOT NULL,
  `token` VARCHAR(6) NOT NULL,
  `status_aktif` TINYINT(1) NOT NULL DEFAULT 0,
  `waktu_mulai` DATETIME DEFAULT NULL,
  `waktu_selesai` DATETIME DEFAULT NULL,
  `dibuat_pada` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_sesi_token` (`token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
