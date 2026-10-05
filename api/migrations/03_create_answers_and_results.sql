-- ============================================================
-- Migrasi 03: Tabel Log Jawaban Mahasiswa & Rekap Hasil Ujian
-- ============================================================

USE `db_stbtoefl`;

-- ------------------------------------------------------------
-- 1. Tabel Jawaban Mahasiswa (Log Transaksi LWW Auto-Sync)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `jawaban_mahasiswa` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `pengguna_id` SMALLINT UNSIGNED NOT NULL,
  `sesi_id` TINYINT UNSIGNED NOT NULL,
  `soal_id` SMALLINT UNSIGNED NOT NULL,
  `jawaban_dipilih` ENUM('A', 'B', 'C', 'D') DEFAULT NULL,
  `stempel_waktu_klien` BIGINT UNSIGNED NOT NULL COMMENT 'Unix epoch millisecond',
  `diperbarui_pada` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_pengguna_sesi_soal` (`pengguna_id`, `sesi_id`, `soal_id`),
  CONSTRAINT `fk_jawaban_pengguna` FOREIGN KEY (`pengguna_id`) REFERENCES `pengguna` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_jawaban_sesi` FOREIGN KEY (`sesi_id`) REFERENCES `sesi_ujian` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_jawaban_soal` FOREIGN KEY (`soal_id`) REFERENCES `bank_soal` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 2. Tabel Hasil Ujian (Rekapitulasi Skor ETS & CEFR)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `hasil_ujian` (
  `id` SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `pengguna_id` SMALLINT UNSIGNED NOT NULL,
  `sesi_id` TINYINT UNSIGNED NOT NULL,
  `benar_listening` TINYINT UNSIGNED NOT NULL DEFAULT 0,
  `benar_structure` TINYINT UNSIGNED NOT NULL DEFAULT 0,
  `benar_reading` TINYINT UNSIGNED NOT NULL DEFAULT 0,
  `skala_listening` TINYINT UNSIGNED NOT NULL DEFAULT 31,
  `skala_structure` TINYINT UNSIGNED NOT NULL DEFAULT 31,
  `skala_reading` TINYINT UNSIGNED NOT NULL DEFAULT 31,
  `total_skor_toefl` SMALLINT UNSIGNED NOT NULL DEFAULT 310,
  `level_cefr` VARCHAR(2) NOT NULL DEFAULT 'A2',
  `selesai_pada` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_hasil_pengguna_sesi` (`pengguna_id`, `sesi_id`),
  CONSTRAINT `fk_hasil_pengguna` FOREIGN KEY (`pengguna_id`) REFERENCES `pengguna` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_hasil_sesi` FOREIGN KEY (`sesi_id`) REFERENCES `sesi_ujian` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
