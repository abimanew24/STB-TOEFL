-- ============================================================
-- Migrasi 07: Tambah Kolom sesi_id pada Tabel Pengguna
-- ============================================================

USE `db_stbtoefl`;

ALTER TABLE `pengguna` 
  ADD COLUMN `sesi_id` INT UNSIGNED NULL AFTER `peran`,
  ADD KEY `fk_pengguna_sesi` (`sesi_id`),
  ADD CONSTRAINT `fk_pengguna_sesi_ujian` 
    FOREIGN KEY (`sesi_id`) 
    REFERENCES `sesi_ujian` (`id`) 
    ON DELETE SET NULL 
    ON UPDATE CASCADE;
