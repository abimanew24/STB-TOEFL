-- ============================================================
-- Migrasi 05: Seed Sample Bank Soal & Wacana Reading TOEFL ITP
-- ============================================================

USE `db_stbtoefl`;

-- 1. Insert Sample Wacana Reading
INSERT INTO `wacana_reading` (`id`, `judul`, `isi_wacana`) VALUES
(1, 'The Origin of Solar Systems & Planetary Nebulae', 
'The solar system consists of the Sun and everything bound to it by gravity – the planets Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune; dwarf planets such as Pluto; dozens of moons; and millions of asteroids, comets, and meteoroids.\n\nAstronomers believe the solar system formed about 4.6 billion years ago from a dense cloud of interstellar gas and dust. The cloud collapsed, possibly due to the shockwave of a nearby exploding star, called a supernova. When this dust cloud collapsed, it formed a solar nebula – a spinning, swirling disk of material.\n\nAt the center, gravity pulled more and more material in. Eventually, the pressure at the core was so great that hydrogen atoms began to combine and form helium, releasing a tremendous amount of energy. With that, our Sun was born, and it eventually amassed more than 99% of the available matter.')
ON DUPLICATE KEY UPDATE `judul` = VALUES(`judul`), `isi_wacana` = VALUES(`isi_wacana`);

-- 2. Insert Sample Bank Soal Section 1 Listening
INSERT INTO `bank_soal` (`id`, `nomor_section`, `nama_bagian`, `berkas_audio`, `pertanyaan`, `pilihan_a`, `pilihan_b`, `pilihan_c`, `pilihan_d`, `jawaban_benar`) VALUES
(1, 1, 'Part A', 'sample-listening-parta-1.mp3', 'What does the man imply about the biology project?', 'He has already finished it.', 'He needs more time to complete it.', 'He prefers to work alone.', 'He forgot about the deadline.', 'B'),
(2, 1, 'Part A', 'sample-listening-parta-2.mp3', 'What will the woman probably do next?', 'Go to the library to study.', 'Return the books to the professor.', 'Call her classmate immediately.', 'Buy a new laptop.', 'A'),
(3, 1, 'Part B', 'sample-listening-partb-1.mp3', 'What are the speakers mainly discussing?', 'The history of ancient architecture.', 'The requirements for a campus scholarship.', 'The environmental impact of urban expansion.', 'The schedule for upcoming final exams.', 'C'),
(4, 1, 'Part C', 'sample-listening-partc-1.mp3', 'According to the lecture, what is the main purpose of photosynthesis?', 'To absorb oxygen from the atmosphere.', 'To convert solar energy into chemical energy.', 'To release carbon dioxide into the soil.', 'To prevent plants from freezing in winter.', 'B')
ON DUPLICATE KEY UPDATE `pertanyaan` = VALUES(`pertanyaan`);

-- 3. Insert Sample Bank Soal Section 2 Structure
INSERT INTO `bank_soal` (`id`, `nomor_section`, `nama_bagian`, `pertanyaan`, `pilihan_a`, `pilihan_b`, `pilihan_c`, `pilihan_d`, `jawaban_benar`) VALUES
(5, 2, NULL, 'The giant panda, which is an endangered species, ________ primarily on bamboo shoots.', 'feed', 'feeds', 'feeding', 'has fed', 'B'),
(6, 2, NULL, 'Not only ________ the exam with high honors, but she also secured a full scholarship.', 'she passed', 'did she pass', 'passed she', 'she did pass', 'B'),
(7, 2, NULL, 'Aerodynamic principles explain ________ airplanes are able to generate lift during takeoff.', 'how', 'that', 'which', 'what', 'A'),
(8, 2, NULL, 'Unlike most other mammals, kangaroos ________ their young in pouches until they mature.', 'carry', 'carries', 'carrying', 'carried', 'A')
ON DUPLICATE KEY UPDATE `pertanyaan` = VALUES(`pertanyaan`);

-- 4. Insert Sample Bank Soal Section 3 Reading
INSERT INTO `bank_soal` (`id`, `nomor_section`, `nama_bagian`, `wacana_id`, `pertanyaan`, `pilihan_a`, `pilihan_b`, `pilihan_c`, `pilihan_d`, `jawaban_benar`) VALUES
(9, 3, NULL, 1, 'According to paragraph 1, approximately how long ago did the solar system form?', '4.6 million years ago', '4.6 billion years ago', '99 billion years ago', '14 billion years ago', 'B'),
(10, 3, NULL, 1, 'The word "collapsed" in paragraph 2 is closest in meaning to:', 'expanded rapidly', 'fell inward suddenly', 'rotated slowly', 'disappeared completely', 'B'),
(11, 3, NULL, 1, 'What percentage of available matter did the Sun amass at the center?', 'Less than 10%', 'Exactly 50%', 'More than 99%', 'Around 75%', 'C')
ON DUPLICATE KEY UPDATE `pertanyaan` = VALUES(`pertanyaan`);
