import pool from '../database.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import gTTS from 'gtts';

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
    const ext = path.extname(file.originalname) || '.mp3';
    // Preserve original filename if readable (e.g. "question 18")
    const rawName = path.parse(file.originalname).name.replace(/[^a-zA-Z0-9_\-\s]/g, '').trim() || 'audio';
    const uploadDir = path.join(__dirname, '../static/audio');
    let finalName = `${rawName}${ext}`;
    if (fs.existsSync(path.join(uploadDir, finalName))) {
      finalName = `${rawName}-${Date.now()}${ext}`;
    }
    cb(null, finalName);
  }
});

export const uploadAudioMiddleware = multer({
  storage: audioStorage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB max per file
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('audio/') || /\.(mp3|wav|ogg|m4a|aac|flac)$/i.test(file.originalname)) {
      cb(null, true);
    } else {
      cb(new Error('Hanya berkas audio (MP3, WAV, dsb.) yang diperbolehkan.'));
    }
  }
}).array('audio', 100);

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

    const [rows] = await pool.query(query, params);

    const uploadDir = path.join(__dirname, '../static/audio');
    const diskFiles = fs.existsSync(uploadDir) ? fs.readdirSync(uploadDir) : [];

    const enrichedRows = rows.map(q => {
      if (!q.berkas_audio) {
        return { ...q, audio_url: null, audio_filename: null, audio_exists: false };
      }
      const raw = String(q.berkas_audio).trim();
      const baseClean = path.basename(raw);
      const nameNoExt = path.parse(baseClean).name.toLowerCase();

      // Check if file exists directly on disk or matches base name
      const matched = diskFiles.find(f => {
        if (f.toLowerCase() === baseClean.toLowerCase()) return true;
        return path.parse(f).name.toLowerCase() === nameNoExt;
      });

      if (matched) {
        return {
          ...q,
          audio_url: `/static/audio/${matched}`,
          audio_filename: matched,
          audio_exists: true
        };
      }

      return {
        ...q,
        audio_url: raw.startsWith('http') || raw.startsWith('/') ? raw : `/static/audio/${raw}`,
        audio_filename: baseClean,
        audio_exists: false
      };
    });

    return res.json(enrichedRows);
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
    const uploadedFiles = req.files || (req.file ? [req.file] : []);
    if (!uploadedFiles || uploadedFiles.length === 0) {
      return res.status(400).json({ error: 'Upload Audio Gagal', message: 'Tidak ada berkas audio yang diunggah.' });
    }

    const fileList = uploadedFiles.map(file => ({
      filename: file.filename,
      url: `/static/audio/${file.filename}`,
      size: file.size
    }));

    return res.json({
      message: `Berhasil mengunggah ${fileList.length} berkas audio.`,
      count: fileList.length,
      files: fileList,
      filename: fileList[0].filename,
      url: fileList[0].url
    });
  });
}

/**
 * GET /api/questions/audio
 * Get all uploaded audio files with question usage stats
 */
export async function getAudioFiles(req, res) {
  const uploadDir = path.join(__dirname, '../static/audio');
  if (!fs.existsSync(uploadDir)) {
    return res.json([]);
  }

  try {
    const files = fs.readdirSync(uploadDir);
    const audioFiles = files.filter(file => /\.(mp3|wav|ogg|m4a|aac|flac)$/i.test(file));

    // Get question usage stats from bank_soal
    const [usageRows] = await pool.query(
      `SELECT berkas_audio, COUNT(*) as count, GROUP_CONCAT(id ORDER BY id ASC) as question_ids 
       FROM bank_soal 
       WHERE berkas_audio IS NOT NULL 
       GROUP BY berkas_audio`
    );

    const usageMap = {};
    for (const row of usageRows) {
      if (row.berkas_audio) {
        const raw = String(row.berkas_audio).trim();
        const base = path.parse(path.basename(raw)).name.toLowerCase();
        const data = {
          count: row.count,
          questionIds: row.question_ids ? row.question_ids.split(',').map(Number) : []
        };
        usageMap[raw] = data;
        usageMap[path.basename(raw)] = data;
        usageMap[`/static/audio/${path.basename(raw)}`] = data;
        usageMap[base] = data;
      }
    }

    const result = audioFiles.map(file => {
      const filePath = path.join(uploadDir, file);
      const stats = fs.statSync(filePath);
      const baseName = path.parse(file).name.toLowerCase();
      const usage = usageMap[file] || usageMap[`/static/audio/${file}`] || usageMap[baseName] || { count: 0, questionIds: [] };

      return {
        filename: file,
        url: `/static/audio/${file}`,
        size: stats.size,
        createdAt: stats.birthtime,
        usedCount: usage.count,
        questionIds: usage.questionIds
      };
    }).sort((a, b) => b.createdAt - a.createdAt);

    return res.json(result);
  } catch (err) {
    console.error('[GET AUDIO FILES ERROR]', err);
    return res.status(500).json({ error: 'Gagal membaca direktori audio', message: err.message });
  }
}

/**
 * DELETE /api/questions/audio/:filename
 * Menghapus berkas audio dari disk
 */
export async function deleteAudioFile(req, res) {
  try {
    const { filename } = req.params;
    const safeFilename = path.basename(filename);
    const filePath = path.join(__dirname, '../static/audio', safeFilename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File tidak ditemukan', message: 'Berkas audio tidak ada di server.' });
    }

    // Periksa apakah audio sedang digunakan dalam butir soal
    const [inUse] = await pool.query(
      `SELECT id, nomor_section FROM bank_soal WHERE berkas_audio = ? OR berkas_audio = ?`,
      [safeFilename, `/static/audio/${safeFilename}`]
    );

    const force = req.query.force === 'true';
    if (inUse.length > 0 && !force) {
      return res.status(409).json({
        error: 'File sedang digunakan',
        message: `File ini masih digunakan pada ${inUse.length} butir soal (ID: ${inUse.map(q => q.id).join(', ')}). Gunakan opsi hapus paksa jika ingin tetap menghapus.`,
        questionIds: inUse.map(q => q.id)
      });
    }

    // Jika force, kosongkan field berkas_audio pada soal-soal terkait
    if (inUse.length > 0 && force) {
      await pool.query(
        `UPDATE bank_soal SET berkas_audio = NULL WHERE berkas_audio = ? OR berkas_audio = ?`,
        [safeFilename, `/static/audio/${safeFilename}`]
      );
    }

    fs.unlinkSync(filePath);
    return res.json({ 
      message: `Berkas audio ${safeFilename} berhasil dihapus.${inUse.length > 0 ? ` Relasi pada ${inUse.length} butir soal telah dilepas.` : ''}`,
      filename: safeFilename 
    });
  } catch (error) {
    console.error('[DELETE AUDIO ERROR]', error);
    return res.status(500).json({ error: 'Server Error', message: error.message });
  }
}

/**
 * DELETE /api/questions/audio
 * Kosongkan seluruh berkas audio dari direktori
 */
export async function clearAllAudioFiles(req, res) {
  try {
    const uploadDir = path.join(__dirname, '../static/audio');
    if (!fs.existsSync(uploadDir)) {
      return res.json({ message: 'Direktori audio sudah kosong.', count: 0 });
    }

    const files = fs.readdirSync(uploadDir).filter(f => /\.(mp3|wav|ogg|m4a|aac|flac)$/i.test(f));
    let deletedCount = 0;
    for (const f of files) {
      try {
        fs.unlinkSync(path.join(uploadDir, f));
        deletedCount++;
      } catch (err) {
        console.error(`Gagal menghapus file ${f}:`, err);
      }
    }

    return res.json({ 
      message: `Berhasil mengosongkan ${deletedCount} berkas audio dari server.`,
      count: deletedCount 
    });
  } catch (error) {
    console.error('[CLEAR ALL AUDIO ERROR]', error);
    return res.status(500).json({ error: 'Server Error', message: error.message });
  }
}

/**
 * POST /api/questions/tts
 * Generate file audio MP3 dari teks bahasa Inggris TOEFL menggunakan Google TTS
 */
export async function generateTtsAudio(req, res) {
  try {
    const { text, filename } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Validasi Gagal', message: 'Teks naskah/script percakapan tidak boleh kosong.' });
    }

    const uploadDir = path.join(__dirname, '../static/audio');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    let cleanName = filename ? filename.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '-') : '';
    if (!cleanName) {
      cleanName = `tts-${Date.now()}`;
    }
    if (!cleanName.endsWith('.mp3')) {
      cleanName += '.mp3';
    }

    const filePath = path.join(uploadDir, cleanName);
    const speech = new gTTS(text.trim(), 'en');

    speech.save(filePath, (err) => {
      if (err) {
        console.error('[TTS GENERATE ERROR]', err);
        return res.status(500).json({ error: 'Gagal membuat file audio', message: err.message });
      }

      const stats = fs.statSync(filePath);
      return res.status(201).json({
        message: `Audio MP3 (${cleanName}) berhasil digenerate dari teks script!`,
        filename: cleanName,
        url: `/static/audio/${cleanName}`,
        size: stats.size,
        createdAt: stats.birthtime,
        usedCount: 0,
        questionIds: []
      });
    });
  } catch (error) {
    console.error('[TTS ERROR]', error);
    return res.status(500).json({ error: 'Server Error', message: error.message });
  }
}

/**
 * PUT /api/questions/master-audio
 * Setel atau kosongkan master audio untuk seluruh soal Section 1
 */
export async function setMasterAudio(req, res) {
  try {
    const { berkas_audio } = req.body;
    await pool.query('UPDATE bank_soal SET berkas_audio = ? WHERE nomor_section = 1', [berkas_audio || null]);
    return res.json({ message: 'Master audio Section 1 berhasil diperbarui.', berkas_audio: berkas_audio || null });
  } catch (err) {
    console.error('[SET MASTER AUDIO ERROR]', err);
    return res.status(500).json({ error: 'Server Error', message: err.message });
  }
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

export async function batchDeleteQuestions(req, res) {
  try {
    const { ids, section } = req.body;
    if (Array.isArray(ids) && ids.length > 0) {
      const [result] = await pool.query('DELETE FROM bank_soal WHERE id IN (?)', [ids]);
      return res.json({ message: `Berhasil menghapus ${result.affectedRows} butir soal.`, count: result.affectedRows });
    } else if (section) {
      const [result] = await pool.query('DELETE FROM bank_soal WHERE nomor_section = ?', [parseInt(section, 10)]);
      return res.json({ message: `Berhasil menghapus seluruh butir soal Section ${section} (${result.affectedRows} soal).`, count: result.affectedRows });
    }
    return res.status(400).json({ error: 'Parameter tidak valid', message: 'Harap sediakan daftar ID soal atau nomor section.' });
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
