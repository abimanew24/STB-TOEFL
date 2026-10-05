import pool from '../database.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Setup Multer Storage untuk Audio Uploads
const audioStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../static/audio');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname) || '.mp3';
    cb(null, `audio-${uniqueSuffix}${ext}`);
  }
});

export const uploadAudioMiddleware = multer({
  storage: audioStorage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('audio/') || file.originalname.endsWith('.mp3')) {
      cb(null, true);
    } else {
      cb(new Error('Hanya berkas audio MP3 yang diperbolehkan.'));
    }
  }
}).single('audio');

/**
 * GET /api/questions
 * Mengambil daftar soal (bisa difilter per nomor_section)
 */
export async function getQuestions(req, res) {
  try {
    const { section } = req.query;
    let query = `
      SELECT b.*, w.judul as wacana_judul, w.isi_wacana 
      FROM bank_soal b 
      LEFT JOIN wacana_reading w ON b.wacana_id = w.id
    `;
    const params = [];

    if (section) {
      query += ` WHERE b.nomor_section = ?`;
      params.push(parseInt(section, 10));
    }

    query += ` ORDER BY b.nomor_section ASC, b.id ASC`;

    const [rows] = await pool.query(query, params);
    return res.json(rows);
  } catch (error) {
    console.error('[GET QUESTIONS ERROR]', error);
    return res.status(500).json({ error: 'Server Error', message: error.message });
  }
}

/**
 * POST /api/questions
 * Menambahkan butir soal baru
 */
export async function createQuestion(req, res) {
  try {
    const {
      nomor_section,
      nama_bagian,
      wacana_id,
      berkas_audio,
      pertanyaan,
      pilihan_a,
      pilihan_b,
      pilihan_c,
      pilihan_d,
      jawaban_benar
    } = req.body;

    if (!nomor_section || !pertanyaan || !pilihan_a || !pilihan_b || !pilihan_c || !pilihan_d || !jawaban_benar) {
      return res.status(400).json({ error: 'Validasi Gagal', message: 'Semua Opsi dan Pertanyaan wajib diisi.' });
    }

    const [result] = await pool.query(
      `INSERT INTO bank_soal 
       (nomor_section, nama_bagian, wacana_id, berkas_audio, pertanyaan, pilihan_a, pilihan_b, pilihan_c, pilihan_d, jawaban_benar)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        parseInt(nomor_section, 10),
        nama_bagian || null,
        wacana_id ? parseInt(wacana_id, 10) : null,
        berkas_audio || null,
        pertanyaan.trim(),
        pilihan_a.trim(),
        pilihan_b.trim(),
        pilihan_c.trim(),
        pilihan_d.trim(),
        jawaban_benar.toUpperCase()
      ]
    );

    return res.status(201).json({
      message: 'Soal berhasil ditambahkan ke bank soal.',
      id: result.insertId
    });
  } catch (error) {
    console.error('[CREATE QUESTION ERROR]', error);
    return res.status(500).json({ error: 'Server Error', message: error.message });
  }
}

/**
 * GET /api/questions/passages
 * Mengambil seluruh wacana bacaan untuk Section 3 Reading
 */
export async function getPassages(req, res) {
  try {
    const [rows] = await pool.query(`SELECT * FROM wacana_reading ORDER BY id ASC`);
    return res.json(rows);
  } catch (error) {
    console.error('[GET PASSAGES ERROR]', error);
    return res.status(500).json({ error: 'Server Error', message: error.message });
  }
}

/**
 * POST /api/questions/passages
 * Menambah wacana bacaan baru
 */
export async function createPassage(req, res) {
  try {
    const { judul, isi_wacana } = req.body;

    if (!isi_wacana) {
      return res.status(400).json({ error: 'Validasi Gagal', message: 'Isi wacana bacaan tidak boleh kosong.' });
    }

    const [result] = await pool.query(
      `INSERT INTO wacana_reading (judul, isi_wacana) VALUES (?, ?)`,
      [judul ? judul.trim() : null, isi_wacana.trim()]
    );

    return res.status(201).json({
      message: 'Wacana reading berhasil ditambahkan.',
      id: result.insertId
    });
  } catch (error) {
    console.error('[CREATE PASSAGE ERROR]', error);
    return res.status(500).json({ error: 'Server Error', message: error.message });
  }
}

/**
 * POST /api/questions/upload-audio
 * Upload MP3 audio listening via Multer
 */
export function handleAudioUpload(req, res) {
  uploadAudioMiddleware(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: 'Upload Audio Gagal', message: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'Upload Audio Gagal', message: 'Tidak ada berkas audio yang diunggah.' });
    }

    return res.json({
      message: 'Unggah berkas audio listening sukses.',
      filename: req.file.filename,
      url: `/static/audio/${req.file.filename}`
    });
  });
}

export async function updateQuestion(req, res) {
  try {
    const { id } = req.params;
    const {
      nomor_section,
      wacana_id,
      berkas_audio,
      pertanyaan,
      pilihan_a,
      pilihan_b,
      pilihan_c,
      pilihan_d,
      jawaban_benar
    } = req.body;

    await pool.query(
      `UPDATE bank_soal SET 
       nomor_section = ?, wacana_id = ?, berkas_audio = ?, pertanyaan = ?, pilihan_a = ?, pilihan_b = ?, pilihan_c = ?, pilihan_d = ?, jawaban_benar = ?
       WHERE id = ?`,
      [
        parseInt(nomor_section, 10),
        wacana_id ? parseInt(wacana_id, 10) : null,
        berkas_audio !== undefined ? berkas_audio : null,
        pertanyaan.trim(),
        pilihan_a.trim(),
        pilihan_b.trim(),
        pilihan_c.trim(),
        pilihan_d.trim(),
        jawaban_benar.toUpperCase(),
        id
      ]
    );
    return res.json({ message: 'Soal berhasil diperbarui.' });
  } catch (error) {
    return res.status(500).json({ error: 'Server Error', message: error.message });
  }
}

export async function deleteQuestion(req, res) {
  try {
    await pool.query('DELETE FROM bank_soal WHERE id = ?', [req.params.id]);
    return res.json({ message: 'Soal berhasil dihapus.' });
  } catch (error) {
    return res.status(500).json({ error: 'Server Error', message: error.message });
  }
}

export async function updatePassage(req, res) {
  try {
    const { id } = req.params;
    const { teks_wacana } = req.body;
    await pool.query('UPDATE wacana_reading SET isi_wacana = ? WHERE id = ?', [teks_wacana.trim(), id]);
    return res.json({ message: 'Wacana berhasil diperbarui.' });
  } catch (error) {
    return res.status(500).json({ error: 'Server Error', message: error.message });
  }
}

export async function deletePassage(req, res) {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM bank_soal WHERE wacana_id = ?', [id]); // cascade delete questions
    await pool.query('DELETE FROM wacana_reading WHERE id = ?', [id]);
    return res.json({ message: 'Wacana berhasil dihapus.' });
  } catch (error) {
    return res.status(500).json({ error: 'Server Error', message: error.message });
  }
}
