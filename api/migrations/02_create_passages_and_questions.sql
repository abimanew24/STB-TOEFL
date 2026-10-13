-- ============================================================
-- Migrasi 02: Tabel Wacana Reading & Bank Soal (140 Butir TOEFL)
-- ============================================================

USE `db_stbtoefl`;

-- ------------------------------------------------------------
-- 1. Tabel Wacana Reading (Teks Panjang Section 3 Reading)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `wacana_reading` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `judul` VARCHAR(255) DEFAULT NULL,
  `isi_wacana` TEXT NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 2. Tabel Bank Soal (Konsolidasi Section 1, 2, dan 3)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `bank_soal` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nomor_section` TINYINT UNSIGNED NOT NULL COMMENT '1=Listening, 2=Structure, 3=Reading',
  `nama_bagian` VARCHAR(30) DEFAULT NULL COMMENT 'Part A, Part B, Part C',
  `wacana_id` INT UNSIGNED DEFAULT NULL,
  `berkas_audio` VARCHAR(255) DEFAULT NULL COMMENT 'Audio MP3 untuk Section 1',
  `pertanyaan` TEXT NOT NULL,
  `pilihan_a` TEXT NOT NULL,
  `pilihan_b` TEXT NOT NULL,
  `pilihan_c` TEXT NOT NULL,
  `pilihan_d` TEXT NOT NULL,
  `jawaban_benar` ENUM('A', 'B', 'C', 'D') NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_bank_soal_section` (`nomor_section`),
  CONSTRAINT `fk_bank_soal_wacana` 
    FOREIGN KEY (`wacana_id`) 
    REFERENCES `wacana_reading` (`id`) 
    ON DELETE SET NULL 
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
