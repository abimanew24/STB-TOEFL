-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 06 Okt 2026 pada 01.27
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_stbtoefl`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `bank_soal`
--

CREATE TABLE `bank_soal` (
  `id` smallint(5) UNSIGNED NOT NULL,
  `nomor_section` tinyint(3) UNSIGNED NOT NULL COMMENT '1=Listening, 2=Structure, 3=Reading',
  `nama_bagian` varchar(10) DEFAULT NULL COMMENT 'Part A, Part B, Part C',
  `wacana_id` tinyint(3) UNSIGNED DEFAULT NULL,
  `berkas_audio` varchar(100) DEFAULT NULL COMMENT 'Audio MP3 untuk Section 1',
  `pertanyaan` text NOT NULL,
  `pilihan_a` varchar(200) NOT NULL,
  `pilihan_b` varchar(200) NOT NULL,
  `pilihan_c` varchar(200) NOT NULL,
  `pilihan_d` varchar(200) NOT NULL,
  `jawaban_benar` enum('A','B','C','D') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `bank_soal`
--

INSERT INTO `bank_soal` (`id`, `nomor_section`, `nama_bagian`, `wacana_id`, `berkas_audio`, `pertanyaan`, `pilihan_a`, `pilihan_b`, `pilihan_c`, `pilihan_d`, `jawaban_benar`) VALUES
(15, 2, NULL, 2, '(kosong)', 'Neither the teacher nor the students ______ present in the auditorium yesterday.', 'was', 'were', 'are', 'is', 'B'),
(16, 2, NULL, 2, '(kosong)', 'Although ______ hard all morning, the engine refused to start.', 'tried', 'trying', 'he tried', 'was trying', 'C'),
(17, 2, NULL, 2, '(kosong)', 'Not until the end of the nineteenth century ______ widely used for illumination.', 'electricity became', 'became electricity', 'did electricity become', 'electricity was', 'C'),
(18, 3, NULL, 3, '(kosong)', 'What is the main topic of the passage?', 'The history of planetary science', 'The exploration and environment of Mars', 'Liquid water on other planets', 'Future human settlements in space', 'B'),
(19, 3, NULL, 3, '(kosong)', 'The word \"prevalent\" in the passage is closest in meaning to ______', 'widespread', 'rare', 'hazardous', 'invisible', 'A'),
(20, 3, NULL, 3, '(kosong)', 'According to the passage, Mars gets its reddish appearance from ______', 'robotic equipment', 'thin clouds', 'iron oxide', 'high temperatures', 'C'),
(22, 1, 'Part A', NULL, '/static/audio/audio-1791207632971-521429768.mp3', 'What does the woman imply?', 'She has already distributed the report.', 'The report is currently being printed.', 'She needs the man to print the report.', 'The presentation has been delayed.', 'B'),
(23, 1, 'Part A', NULL, 'audio.mp3', 'What is the man\'s problem?', 'He doesn\'t understand the reading material.', 'He thinks the assignment is too short.', 'He lacks enough time to finish the assignment.', 'He lost Professor Harris\'s syllabus.', 'C'),
(24, 1, 'Part A', NULL, 'audio.mp3', 'What will the woman most likely do?', 'Pay the extra five hundred dollars immediately.', 'Reconsider moving into the downtown apartment.', 'Ask the landlord to lower the monthly rent.', 'Move into the apartment earlier than planned.', 'B'),
(25, 1, 'Part A', NULL, 'audio.mp3', 'Why does the professor mention sea urchins?', 'To explain why kelp forests are growing too rapidly.', 'To describe the primary food source of keystone species.', 'To illustrate what happens when a keystone species is absent.', 'To argue that sea otters are an invasive species.', 'C'),
(26, 1, 'Part A', NULL, 'audio.mp3', 'What does the man suggest they do?', 'Wait for the traffic to clear up.', 'Turn back and go home.', 'Find an alternative route.', 'Check the opening act\'s schedule.', 'C');

-- --------------------------------------------------------

--
-- Struktur dari tabel `hasil_ujian`
--

CREATE TABLE `hasil_ujian` (
  `id` smallint(5) UNSIGNED NOT NULL,
  `pengguna_id` smallint(5) UNSIGNED NOT NULL,
  `sesi_id` tinyint(3) UNSIGNED NOT NULL,
  `benar_listening` tinyint(3) UNSIGNED NOT NULL DEFAULT 0,
  `benar_structure` tinyint(3) UNSIGNED NOT NULL DEFAULT 0,
  `benar_reading` tinyint(3) UNSIGNED NOT NULL DEFAULT 0,
  `skala_listening` tinyint(3) UNSIGNED NOT NULL DEFAULT 31,
  `skala_structure` tinyint(3) UNSIGNED NOT NULL DEFAULT 31,
  `skala_reading` tinyint(3) UNSIGNED NOT NULL DEFAULT 31,
  `total_skor_toefl` smallint(5) UNSIGNED NOT NULL DEFAULT 310,
  `level_cefr` varchar(2) NOT NULL DEFAULT 'A2',
  `selesai_pada` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `hasil_ujian`
--

INSERT INTO `hasil_ujian` (`id`, `pengguna_id`, `sesi_id`, `benar_listening`, `benar_structure`, `benar_reading`, `skala_listening`, `skala_structure`, `skala_reading`, `total_skor_toefl`, `level_cefr`, `selesai_pada`) VALUES
(4, 5, 2, 0, 0, 0, 31, 31, 31, 310, 'A2', '2026-09-25 13:58:08'),
(5, 6, 2, 1, 1, 0, 31, 31, 31, 310, 'A2', '2026-09-25 13:58:30'),
(9, 27, 2, 1, 0, 0, 31, 31, 31, 310, 'A2', '2026-10-05 11:22:00'),
(10, 29, 2, 0, 1, 2, 31, 31, 31, 310, 'A2', '2026-10-05 13:50:16'),
(11, 30, 2, 1, 0, 0, 31, 31, 31, 310, 'A2', '2026-10-05 13:53:42');

-- --------------------------------------------------------

--
-- Struktur dari tabel `jawaban_mahasiswa`
--

CREATE TABLE `jawaban_mahasiswa` (
  `id` int(10) UNSIGNED NOT NULL,
  `pengguna_id` smallint(5) UNSIGNED NOT NULL,
  `sesi_id` tinyint(3) UNSIGNED NOT NULL,
  `soal_id` smallint(5) UNSIGNED NOT NULL,
  `jawaban_dipilih` enum('A','B','C','D') DEFAULT NULL,
  `stempel_waktu_klien` bigint(20) UNSIGNED NOT NULL COMMENT 'Unix epoch millisecond',
  `diperbarui_pada` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `jawaban_mahasiswa`
--

INSERT INTO `jawaban_mahasiswa` (`id`, `pengguna_id`, `sesi_id`, `soal_id`, `jawaban_dipilih`, `stempel_waktu_klien`, `diperbarui_pada`) VALUES
(64, 27, 2, 15, 'A', 1791199308641, '2026-10-05 11:21:48'),
(66, 27, 2, 16, 'A', 1791199310129, '2026-10-05 11:21:50'),
(67, 27, 2, 17, 'A', 1791199311753, '2026-10-05 11:21:51'),
(68, 27, 2, 18, 'A', 1791199314713, '2026-10-05 11:21:54'),
(69, 27, 2, 19, 'B', 1791199316761, '2026-10-05 11:21:56'),
(70, 27, 2, 20, 'B', 1791199318881, '2026-10-05 11:21:58'),
(71, 29, 2, 22, 'A', 1791208021144, '2026-10-05 13:47:01'),
(72, 29, 2, 23, 'A', 1791208033047, '2026-10-05 13:47:13'),
(73, 29, 2, 24, 'A', 1791208055279, '2026-10-05 13:47:35'),
(74, 29, 2, 25, 'B', 1791208114119, '2026-10-05 13:48:34'),
(76, 29, 2, 26, 'A', 1791208137623, '2026-10-05 13:48:57'),
(77, 29, 2, 15, 'C', 1791208184383, '2026-10-05 13:49:44'),
(81, 29, 2, 16, 'C', 1791208204799, '2026-10-05 13:50:04'),
(83, 29, 2, 17, 'B', 1791208209224, '2026-10-05 13:50:09'),
(84, 29, 2, 18, 'B', 1791208212591, '2026-10-05 13:50:12'),
(85, 29, 2, 19, 'B', 1791208214551, '2026-10-05 13:50:14'),
(86, 29, 2, 20, 'C', 1791208215800, '2026-10-05 13:50:15'),
(87, 30, 2, 22, 'B', 1791208388424, '2026-10-05 13:53:08'),
(90, 30, 2, 15, 'A', 1791208411167, '2026-10-05 13:53:31'),
(94, 30, 2, 18, 'A', 1791208418823, '2026-10-05 13:53:38');

-- --------------------------------------------------------

--
-- Struktur dari tabel `konversi_skor`
--

CREATE TABLE `konversi_skor` (
  `skor_mentah` tinyint(3) UNSIGNED NOT NULL,
  `skala_listening` tinyint(3) UNSIGNED NOT NULL,
  `skala_structure` tinyint(3) UNSIGNED NOT NULL,
  `skala_reading` tinyint(3) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `konversi_skor`
--

INSERT INTO `konversi_skor` (`skor_mentah`, `skala_listening`, `skala_structure`, `skala_reading`) VALUES
(0, 31, 31, 31),
(1, 31, 31, 31),
(2, 31, 31, 31),
(3, 32, 31, 31),
(4, 32, 33, 31),
(5, 33, 34, 31),
(6, 34, 35, 31),
(7, 35, 36, 31),
(8, 37, 37, 31),
(9, 38, 38, 32),
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
(50, 68, 68, 67);

-- --------------------------------------------------------

--
-- Struktur dari tabel `pengguna`
--

CREATE TABLE `pengguna` (
  `id` smallint(5) UNSIGNED NOT NULL,
  `nomor_induk` varchar(18) NOT NULL,
  `nama_lengkap` varchar(80) NOT NULL,
  `email` varchar(100) NOT NULL,
  `kata_sandi` varchar(60) NOT NULL,
  `peran` enum('mahasiswa','pengawas') NOT NULL DEFAULT 'mahasiswa',
  `dibuat_pada` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `pengguna`
--

INSERT INTO `pengguna` (`id`, `nomor_induk`, `nama_lengkap`, `email`, `kata_sandi`, `peran`, `dibuat_pada`) VALUES
(1, 'admin', 'Dosen Pengawas Utama', 'proctor@stbtoefl.ac.id', '$2b$10$Hi.D5pkeZsmg4lPQteCJh.kn9mWRfzYzbgQ.8x2Km0YvzkB/jnTl6', 'pengawas', '2026-09-21 13:02:05'),
(5, '298329047', 'yazid', '298329047@student.stbtoefl.ac.id', '$2b$10$ItJ1XRIMjqQFpDfiTxU3hOZ8CxOBwnLY0lU/jFLab6cm3H6yZfRCC', 'mahasiswa', '2026-09-25 13:38:56'),
(6, '07654321', 'kiman', '07654321@student.stbtoefl.ac.id', '$2b$10$/LMJxtyAF1t5Dch8.NMyU.Y7r3.1WV5cuD49rAq1WjatYX9gzgPCa', 'mahasiswa', '2026-09-25 13:43:57'),
(17, '20230001', 'Budi Santoso', 'budi@student.ac.id', '123456', 'mahasiswa', '2026-10-04 02:38:30'),
(18, '20230002', 'Siti Nurhaliza', 'siti.nurhaliza@student.ac.id', '123456', 'mahasiswa', '2026-10-04 02:38:30'),
(19, '20230003', 'Ahmad Fauzi', 'ahmad.fauzi@student.ac.id', '123456', 'mahasiswa', '2026-10-04 02:38:30'),
(20, '20230004', 'Dewi Lestari', 'dewi.lestari@student.ac.id', '123456', 'mahasiswa', '2026-10-04 02:38:30'),
(21, '20230005', 'Rian Pratama', 'rian.pratama@student.ac.id', '123456', 'mahasiswa', '2026-10-04 02:38:30'),
(22, '20230006', 'Putri Anggraini', 'putri.anggraini@student.ac.id', '123456', 'mahasiswa', '2026-10-04 02:38:30'),
(23, '20230007', 'Dimas Setiawan', 'dimas.setiawan@student.ac.id', '123456', 'mahasiswa', '2026-10-04 02:38:30'),
(24, '20230008', 'Anisa Rahmawati', 'anisa.rahma@student.ac.id', '123456', 'mahasiswa', '2026-10-04 02:38:30'),
(25, '20230009', 'Fajar Hidayat', 'fajar.hidayat@student.ac.id', '123456', 'mahasiswa', '2026-10-04 02:38:30'),
(26, '20230010', 'Nadia Maharani', 'nadia.maharani@student.ac.id', '123456', 'mahasiswa', '2026-10-04 02:38:30'),
(27, '123456', 'maman', '123456@student.stbtoefl.ac.id', '$2b$10$AD546X1da2A1L.ylK7ZNVOvtlxbCqyCyPfry.KA.HFUudbSPFI/cG', 'mahasiswa', '2026-10-05 11:16:49'),
(28, '087654321', 'surya', '087654321@student.stbtoefl.ac.id', '$2b$10$qi6V7Y8nCVNu08gtv8pd9.m71yvJapmTaJu4W3ZDrDKPVZF3PwBoa', 'mahasiswa', '2026-10-05 13:27:20'),
(29, '242443', 'ami', '242443@student.stbtoefl.ac.id', '$2b$10$H19wsLhJNziovm2XmVsOuOur8o8j3oS2MA7y3jwDY88WlaE79Bb3y', 'mahasiswa', '2026-10-05 13:45:44'),
(30, '141414', 'toni', '141414@student.stbtoefl.ac.id', '$2b$10$q6xw60G1r/hGqQea.Em.AOwIBuyPFnSw9tgH9tUQb5yXff7RsAQJ6', 'mahasiswa', '2026-10-05 13:52:40');

-- --------------------------------------------------------

--
-- Struktur dari tabel `sesi_ujian`
--

CREATE TABLE `sesi_ujian` (
  `id` tinyint(3) UNSIGNED NOT NULL,
  `nama_sesi` varchar(60) NOT NULL,
  `token` varchar(6) NOT NULL,
  `status_aktif` tinyint(1) NOT NULL DEFAULT 0,
  `waktu_mulai` datetime DEFAULT NULL,
  `waktu_selesai` datetime DEFAULT NULL,
  `dibuat_pada` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `sesi_ujian`
--

INSERT INTO `sesi_ujian` (`id`, `nama_sesi`, `token`, `status_aktif`, `waktu_mulai`, `waktu_selesai`, `dibuat_pada`) VALUES
(1, 'Gelombang 1 LAB 2', 'EGZWBR', 0, NULL, NULL, '2026-09-21 13:08:22'),
(2, 'Lab1', 'KZ7SV4', 1, NULL, NULL, '2026-09-23 14:29:58');

-- --------------------------------------------------------

--
-- Struktur dari tabel `wacana_reading`
--

CREATE TABLE `wacana_reading` (
  `id` tinyint(3) UNSIGNED NOT NULL,
  `judul` varchar(100) DEFAULT NULL,
  `isi_wacana` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `wacana_reading`
--

INSERT INTO `wacana_reading` (`id`, `judul`, `isi_wacana`) VALUES
(2, 'Wacana Import', 'tes 1'),
(3, 'Wacana Import', 'Mars is the fourth planet from the Sun and the second-smallest planet in the Solar System. Often referred to as the Red Planet due to iron oxide prevalent on its surface, Mars has a thin atmosphere composed primarily of carbon dioxide. Recent robotic missions have discovered evidence that liquid water once flowed across its surface.');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `bank_soal`
--
ALTER TABLE `bank_soal`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_bank_soal_section` (`nomor_section`),
  ADD KEY `fk_bank_soal_wacana` (`wacana_id`);

--
-- Indeks untuk tabel `hasil_ujian`
--
ALTER TABLE `hasil_ujian`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_hasil_pengguna_sesi` (`pengguna_id`,`sesi_id`),
  ADD KEY `fk_hasil_sesi` (`sesi_id`);

--
-- Indeks untuk tabel `jawaban_mahasiswa`
--
ALTER TABLE `jawaban_mahasiswa`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_pengguna_sesi_soal` (`pengguna_id`,`sesi_id`,`soal_id`),
  ADD KEY `fk_jawaban_sesi` (`sesi_id`),
  ADD KEY `fk_jawaban_soal` (`soal_id`);

--
-- Indeks untuk tabel `konversi_skor`
--
ALTER TABLE `konversi_skor`
  ADD PRIMARY KEY (`skor_mentah`);

--
-- Indeks untuk tabel `pengguna`
--
ALTER TABLE `pengguna`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_pengguna_nomor_induk` (`nomor_induk`),
  ADD UNIQUE KEY `uq_pengguna_email` (`email`);

--
-- Indeks untuk tabel `sesi_ujian`
--
ALTER TABLE `sesi_ujian`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_sesi_token` (`token`);

--
-- Indeks untuk tabel `wacana_reading`
--
ALTER TABLE `wacana_reading`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `bank_soal`
--
ALTER TABLE `bank_soal`
  MODIFY `id` smallint(5) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT untuk tabel `hasil_ujian`
--
ALTER TABLE `hasil_ujian`
  MODIFY `id` smallint(5) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT untuk tabel `jawaban_mahasiswa`
--
ALTER TABLE `jawaban_mahasiswa`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=101;

--
-- AUTO_INCREMENT untuk tabel `pengguna`
--
ALTER TABLE `pengguna`
  MODIFY `id` smallint(5) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT untuk tabel `sesi_ujian`
--
ALTER TABLE `sesi_ujian`
  MODIFY `id` tinyint(3) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `wacana_reading`
--
ALTER TABLE `wacana_reading`
  MODIFY `id` tinyint(3) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `bank_soal`
--
ALTER TABLE `bank_soal`
  ADD CONSTRAINT `fk_bank_soal_wacana` FOREIGN KEY (`wacana_id`) REFERENCES `wacana_reading` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `hasil_ujian`
--
ALTER TABLE `hasil_ujian`
  ADD CONSTRAINT `fk_hasil_pengguna` FOREIGN KEY (`pengguna_id`) REFERENCES `pengguna` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_hasil_sesi` FOREIGN KEY (`sesi_id`) REFERENCES `sesi_ujian` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `jawaban_mahasiswa`
--
ALTER TABLE `jawaban_mahasiswa`
  ADD CONSTRAINT `fk_jawaban_pengguna` FOREIGN KEY (`pengguna_id`) REFERENCES `pengguna` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_jawaban_sesi` FOREIGN KEY (`sesi_id`) REFERENCES `sesi_ujian` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_jawaban_soal` FOREIGN KEY (`soal_id`) REFERENCES `bank_soal` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
