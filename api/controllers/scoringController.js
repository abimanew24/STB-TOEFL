import pool from '../database.js';

/**
 * Tentukan Klasifikasi Level CEFR Berdasarkan Total Skor TOEFL ITP Level 1
 */
function getCefrLevel(totalScore) {
  if (totalScore >= 627) return 'C1';
  if (totalScore >= 543) return 'B2';
  if (totalScore >= 460) return 'B1';
  return 'A2';
}

/**
 * Logika Bisnis Penilaian Resmi ETS TOEFL ITP Level 1
 */
export async function calculateAndStoreScore(studentId, sesiId) {
  // 1. Ambil seluruh jawaban mahasiswa pada sesi ini
  const [userAnswers] = await pool.query(
    `SELECT j.soal_id, j.jawaban_dipilih, b.nomor_section, b.jawaban_benar 
     FROM jawaban_mahasiswa j
     JOIN bank_soal b ON j.soal_id = b.id
     WHERE j.pengguna_id = ? AND j.sesi_id = ?`,
    [studentId, sesiId]
  );

  // 2. Hitung jumlah jawaban benar per section
  let benarL = 0; // Section 1 Listening (Maks 50)
  let benarS = 0; // Section 2 Structure (Maks 40)
  let benarR = 0; // Section 3 Reading (Maks 50)

  for (const item of userAnswers) {
    if (item.jawaban_dipilih && item.jawaban_dipilih.toUpperCase() === item.jawaban_benar.toUpperCase()) {
      if (item.nomor_section === 1) benarL++;
      else if (item.nomor_section === 2) benarS++;
      else if (item.nomor_section === 3) benarR++;
    }
  }

  // 3. Matriks Lookup nilai skala dari tabel `konversi_skor`
  const [scaleLRows] = await pool.query(
    `SELECT skala_listening FROM konversi_skor WHERE skor_mentah = ? LIMIT 1`,
    [Math.min(benarL, 50)]
  );
  const [scaleSRows] = await pool.query(
    `SELECT skala_structure FROM konversi_skor WHERE skor_mentah = ? LIMIT 1`,
    [Math.min(benarS, 50)]
  );
  const [scaleRRows] = await pool.query(
    `SELECT skala_reading FROM konversi_skor WHERE skor_mentah = ? LIMIT 1`,
    [Math.min(benarR, 50)]
  );

  const skalaL = scaleLRows.length > 0 ? scaleLRows[0].skala_listening : 31;
  const skalaS = scaleSRows.length > 0 ? scaleSRows[0].skala_structure : 31;
  const skalaR = scaleRRows.length > 0 ? scaleRRows[0].skala_reading : 31;

  // 4. Hitung Total Skor TOEFL Resmi ETS: Round(((Scaled L + Scaled S + Scaled R) * 10) / 3)
  const totalSkorToefl = Math.round(((skalaL + skalaS + skalaR) * 10) / 3);
  const levelCefr = getCefrLevel(totalSkorToefl);

  // 5. Upsert ke tabel `hasil_ujian`
  await pool.query(
    `INSERT INTO hasil_ujian 
       (pengguna_id, sesi_id, benar_listening, benar_structure, benar_reading,
        skala_listening, skala_structure, skala_reading, total_skor_toefl, level_cefr)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       benar_listening = VALUES(benar_listening),
       benar_structure = VALUES(benar_structure),
       benar_reading = VALUES(benar_reading),
       skala_listening = VALUES(skala_listening),
       skala_structure = VALUES(skala_structure),
       skala_reading = VALUES(skala_reading),
       total_skor_toefl = VALUES(total_skor_toefl),
       level_cefr = VALUES(level_cefr),
       selesai_pada = CURRENT_TIMESTAMP`,
    [studentId, sesiId, benarL, benarS, benarR, skalaL, skalaS, skalaR, totalSkorToefl, levelCefr]
  );

  return {
    pengguna_id: studentId,
    sesi_id: sesiId,
    skor_mentah: {
      listening: benarL,
      structure: benarS,
      reading: benarR
    },
    skala: {
      listening: skalaL,
      structure: skalaS,
      reading: skalaR
    },
    total_skor_toefl: totalSkorToefl,
    level_cefr: levelCefr
  };
}

/**
 * GET /api/scores/student
 * Mengambil hasil skor ujian milik mahasiswa yang sedang login
 */
export async function getStudentScore(req, res) {
  try {
    const studentId = req.user.id;
    const sesiId = req.user.sesi_id;

    const [rows] = await pool.query(
      `SELECT h.*, p.nama_lengkap, p.nomor_induk, s.nama_sesi 
       FROM hasil_ujian h
       JOIN pengguna p ON h.pengguna_id = p.id
       JOIN sesi_ujian s ON h.sesi_id = s.id
       WHERE h.pengguna_id = ? AND h.sesi_id = ? LIMIT 1`,
      [studentId, sesiId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Nilai Belum Ada', message: 'Hasil ujian Anda belum terekam.' });
    }

    return res.json(rows[0]);
  } catch (error) {
    console.error('[GET STUDENT SCORE ERROR]', error);
    return res.status(500).json({ error: 'Server Error', message: error.message });
  }
}

/**
 * GET /api/scores/recap
 * Mengambil rekapitulasi nilai seluruh mahasiswa untuk portal pengawas (Ekspor Excel)
 */
export async function getScoreRecap(req, res) {
  try {
    const { sesi_id } = req.query;
    let query = `
      SELECT h.*, p.nomor_induk, p.nama_lengkap, p.email,
             COALESCE(s.nama_sesi, 'Sesi 1') as nama_sesi,
             COALESCE(h.sesi_id, p.sesi_id, 1) as sesi_id
      FROM hasil_ujian h
      JOIN pengguna p ON h.pengguna_id = p.id
      LEFT JOIN sesi_ujian s ON (h.sesi_id = s.id OR (h.sesi_id IS NULL AND p.sesi_id = s.id))
    `;
    const params = [];

    if (sesi_id && sesi_id !== 'all' && sesi_id !== 'Semua') {
      query += ` WHERE (h.sesi_id = ? OR (h.sesi_id IS NULL AND p.sesi_id = ?))`;
      params.push(parseInt(sesi_id, 10), parseInt(sesi_id, 10));
    }

    query += ` ORDER BY h.total_skor_toefl DESC`;

    const [rows] = await pool.query(query, params);
    return res.json(rows);
  } catch (error) {
    console.error('[GET SCORE RECAP ERROR]', error);
    return res.status(500).json({ error: 'Server Error', message: error.message });
  }
}

/**
 * DELETE /api/scores/:id
 * Menghapus rekap hasil ujian mahasiswa (misal jika ingin reset/hapus hasil ujian)
 */
export async function deleteScoreRecord(req, res) {
  try {
    const { id } = req.params;

    // Ambil data hasil ujian terlebih dahulu
    const [rows] = await pool.query(`SELECT * FROM hasil_ujian WHERE id = ?`, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Hasil ujian tidak ditemukan' });
    }
    const record = rows[0];

    // Hapus juga jawaban pada sesi terkait jika ada
    if (record.pengguna_id && record.sesi_id) {
      await pool.query(
        `DELETE FROM jawaban_mahasiswa WHERE pengguna_id = ? AND sesi_id = ?`,
        [record.pengguna_id, record.sesi_id]
      );
    }

    // Hapus data hasil ujian
    await pool.query(`DELETE FROM hasil_ujian WHERE id = ?`, [id]);

    return res.json({ message: 'Hasil ujian berhasil dihapus' });
  } catch (error) {
    console.error('[DELETE SCORE ERROR]', error);
    return res.status(500).json({ error: 'Server Error', message: error.message });
  }
}
