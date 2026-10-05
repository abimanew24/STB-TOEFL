-- ============================================================
-- Migrasi 04: Tabel & Seed Data Matriks Konversi Skor Resmi ETS
-- ============================================================

USE `db_stbtoefl`;

-- ------------------------------------------------------------
-- Tabel Konversi Skor Matriks Baku ETS
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `konversi_skor` (
  `skor_mentah` TINYINT UNSIGNED NOT NULL,
  `skala_listening` TINYINT UNSIGNED NOT NULL,
  `skala_structure` TINYINT UNSIGNED NOT NULL,
  `skala_reading` TINYINT UNSIGNED NOT NULL,
  PRIMARY KEY (`skor_mentah`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Seed Dataset Ekuasi Baku ETS TOEFL ITP Level 1 (Skor Mentah 0 - 50)
-- ------------------------------------------------------------
INSERT INTO `konversi_skor` (`skor_mentah`, `skala_listening`, `skala_structure`, `skala_reading`) VALUES
(0,  31, 31, 31),
(1,  31, 31, 31),
(2,  31, 31, 31),
(3,  32, 31, 31),
(4,  32, 33, 31),
(5,  33, 34, 31),
(6,  34, 35, 31),
(7,  35, 36, 31),
(8,  37, 37, 31),
(9,  38, 38, 32),
(10, 39, 40, 33),
(11, 41, 40, 35),
(12, 42, 41, 37),
(13, 43, 42, 38),
(14, 44, 43, 40),
(15, 45, 44, 41),
(16, 46, 45, 43),
(17, 47, 46, 44),
(18, 48, 47, 45),
(19, 49, 48, 46),
(20, 50, 49, 47),
(21, 51, 50, 48),
(22, 52, 51, 49),
(23, 52, 52, 50),
(24, 53, 53, 51),
(25, 54, 54, 52),
(26, 54, 55, 52),
(27, 55, 56, 53),
(28, 55, 57, 54),
(29, 56, 58, 54),
(30, 57, 59, 55),
(31, 57, 60, 56),
(32, 58, 61, 56),
(33, 58, 63, 57),
(34, 59, 65, 58),
(35, 60, 67, 59),
(36, 61, 68, 60),
(37, 62, 68, 61),
(38, 63, 68, 62),
(39, 64, 68, 63),
(40, 65, 68, 64),
(41, 66, 68, 65),
(42, 67, 68, 65),
(43, 68, 68, 66),
(44, 68, 68, 67),
(45, 68, 68, 67),
(46, 68, 68, 67),
(47, 68, 68, 67),
(48, 68, 68, 67),
(49, 68, 68, 67),
(50, 68, 68, 67)
ON DUPLICATE KEY UPDATE 
  `skala_listening` = VALUES(`skala_listening`),
  `skala_structure` = VALUES(`skala_structure`),
  `skala_reading` = VALUES(`skala_reading`);
