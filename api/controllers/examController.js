import pool from '../database.js';
import { calculateAndStoreScore } from './scoringController.js';

/**
 * GET /api/exam/prefetch
 * Mengambil 140 butir soal & wacana untuk disimpan di IndexedDB Dexie.js milik klien.
 * Kunci jawaban (`jawaban_benar`) disembunyikan demi integritas ujian.
 */
export async function prefetchQuestions(req, res) {
  try {
    const [questions] = await pool.query(
      `SELECT b.id, b.nomor_section, b.nama_bagian, b.wacana_id, b.berkas_audio,
              b.pertanyaan, b.pilihan_a, b.pilihan_b, b.pilihan_c, b.pilihan_d
       FROM bank_soal b
       ORDER BY b.nomor_section ASC, b.id ASC`
    );

    const [passages] = await pool.query(
      `SELECT id, judul, isi_wacana FROM wacana_reading ORDER BY id ASC`
    );

    return res.json({
      total_soal: questions.length,
      questions,
      passages
    });
  } catch (error) {
    console.error('[EXAM PREFETCH ERROR]', error);
    return res.status(500).json({ error: 'Server Error', message: error.message });
  }
}

/**
 * POST /api/exam/sync-answers
 * Auto-save & sync transaksi antrean jawaban mahasiswa dari klien ke MySQL peladen.
 * Menggunakan teknik Last-Write-Wins (LWW) dengan komparasi stempel_waktu_klien (epoch ms).
 */
export async function syncAnswers(req, res) {
  try {
    const { answers } = req.body; // Array of { soal_id, jawaban_dipilih, stempel_waktu_klien }
    const studentId = req.user.id;
    const sesiId = req.user.sesi_id;

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ error: 'Validasi Gagal', message: 'Daftar transaksi jawaban tidak boleh kosong.' });
    }

    let syncedCount = 0;

    for (const item of answers) {
      const { soal_id, jawaban_dipilih, stempel_waktu_klien } = item;

      if (!soal_id || !stempel_waktu_klien) continue;

      // Upsert dengan logika Last-Write-Wins (LWW)
      await pool.query(
        `INSERT INTO jawaban_mahasiswa 
           (pengguna_id, sesi_id, soal_id, jawaban_dipilih, stempel_waktu_klien)
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           jawaban_dipilih = IF(VALUES(stempel_waktu_klien) >= stempel_waktu_klien, VALUES(jawaban_dipilih), jawaban_dipilih),
           stempel_waktu_klien = IF(VALUES(stempel_waktu_klien) >= stempel_waktu_klien, VALUES(stempel_waktu_klien), stempel_waktu_klien)`,
        [studentId, sesiId, soal_id, jawaban_dipilih || null, stempel_waktu_klien]
      );

      syncedCount++;
    }

    return res.json({
      message: `Berhasil meresolusi & sinkronisasi ${syncedCount} jawaban.`,
      synced_count: syncedCount
    });
  } catch (error) {
    console.error('[SYNC ANSWERS ERROR]', error);
    return res.status(500).json({ error: 'Server Error', message: error.message });
  }
}

/**
 * POST /api/exam/submit
 * Final submit ujian oleh mahasiswa, memicu mesin kalkulasi skor ETS resmi
 */
export async function submitExam(req, res) {
  try {
    const studentId = req.user.id;
    const sesiId = req.user.sesi_id;

    // 1. Eksekusi kalkulasi skor
    const result = await calculateAndStoreScore(studentId, sesiId);

    return res.json({
      message: 'Ujian TOEFL berhasil diselesaikan. Skor Anda telah tercatat!',
      result
    });
  } catch (error) {
    console.error('[SUBMIT EXAM ERROR]', error);
    return res.status(500).json({ error: 'Server Error', message: error.message });
  }
}
