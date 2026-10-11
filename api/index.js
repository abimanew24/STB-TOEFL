import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Import Middleware Keamanan
import { verifySebHeader } from './middleware/sebSecurity.js';
import { verifyProctorToken } from './middleware/authProctor.js';
import { verifyStudentToken } from './middleware/authStudent.js';

// Import Controller Logika Bisnis
import { loginStudent, loginProctor } from './controllers/authController.js';
import { getSessions, createSession, toggleSessionStatus, broadcastTokenEmail, getDashboardStats } from './controllers/sessionController.js';
import { getQuestions, createQuestion, getPassages, createPassage, handleAudioUpload, getAudioFiles, deleteAudioFile, clearAllAudioFiles, generateTtsAudio, setMasterAudio, updateQuestion, deleteQuestion, batchDeleteQuestions, updatePassage, deletePassage } from './controllers/questionController.js';
import { prefetchQuestions, syncAnswers, submitExam } from './controllers/examController.js';
import { getStudentScore, getScoreRecap } from './controllers/scoringController.js';

import pool from './database.js';

dotenv.config({ path: path.resolve(process.cwd(), '../.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static Assets Handler (Media Audio MP3 & Sertifikat PDF)
app.use('/static', express.static(path.join(__dirname, 'static')));

// ============================================================
// 1. ROUTE AUTENTIKASI
// ============================================================
app.post('/api/auth/login-student', loginStudent);
app.post('/api/auth/login-proctor', loginProctor);

// ============================================================
// 2. ROUTE MANAJEMEN SESI UJIAN (Portal Pengawas)
// ============================================================
app.get('/api/dashboard/stats', verifyProctorToken, getDashboardStats);
app.get('/api/sessions', verifyProctorToken, getSessions);
app.post('/api/sessions', verifyProctorToken, createSession);
app.patch('/api/sessions/:id/status', verifyProctorToken, toggleSessionStatus);
app.post('/api/sessions/:id/broadcast-email', verifyProctorToken, broadcastTokenEmail);
app.get('/api/users', verifyProctorToken, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM pengguna WHERE peran = "mahasiswa" ORDER BY id DESC');
    res.json(rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
});
app.post('/api/users', verifyProctorToken, async (req, res) => {
  try {
    const { nomor_induk, nama_lengkap, email, kata_sandi } = req.body;
    await pool.query(
      `INSERT INTO pengguna (nomor_induk, nama_lengkap, email, kata_sandi, peran) VALUES (?, ?, ?, ?, 'mahasiswa')`,
      [nomor_induk, nama_lengkap, email, kata_sandi || '123456']
    );
    res.json({ message: 'Peserta berhasil ditambahkan' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});
app.post('/api/users/import', verifyProctorToken, async (req, res) => {
  try {
    const { users } = req.body;
    let count = 0;
    for (const u of users) {
      try {
        await pool.query(
          `INSERT INTO pengguna (nomor_induk, nama_lengkap, email, kata_sandi, peran) VALUES (?, ?, ?, ?, 'mahasiswa') ON DUPLICATE KEY UPDATE nama_lengkap=VALUES(nama_lengkap), email=VALUES(email)`,
          [u.nim, u.name, u.email, '123456']
        );
        count++;
      } catch (e) { /* ignore single row errors */ }
    }
    res.json({ message: `${count} Peserta berhasil diimport` });
  } catch (err) { res.status(500).json({ message: err.message }); }
});
app.delete('/api/users/:id', verifyProctorToken, async (req, res) => {
  try {
    await pool.query('DELETE FROM pengguna WHERE id = ?', [req.params.id]);
    res.json({ message: 'Peserta berhasil dihapus' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ============================================================
// 3. ROUTE BANK SOAL & MEDIA (Portal Pengawas)
// ============================================================
app.get('/api/questions', verifyProctorToken, getQuestions);
app.post('/api/questions', verifyProctorToken, createQuestion);
app.put('/api/questions/:id', verifyProctorToken, updateQuestion);
app.delete('/api/questions/:id', verifyProctorToken, deleteQuestion);
app.post('/api/questions/batch-delete', verifyProctorToken, batchDeleteQuestions);
app.delete('/api/questions/batch', verifyProctorToken, batchDeleteQuestions);
app.get('/api/questions/passages', verifyProctorToken, getPassages);
app.post('/api/questions/passages', verifyProctorToken, createPassage);
app.put('/api/questions/passages/:id', verifyProctorToken, updatePassage);
app.delete('/api/questions/passages/:id', verifyProctorToken, deletePassage);
app.post('/api/questions/upload-audio', verifyProctorToken, handleAudioUpload);
app.get('/api/questions/audio', verifyProctorToken, getAudioFiles);
app.delete('/api/questions/audio', verifyProctorToken, clearAllAudioFiles);
app.delete('/api/questions/audio/:filename', verifyProctorToken, deleteAudioFile);
app.post('/api/questions/tts', verifyProctorToken, generateTtsAudio);
app.put('/api/questions/master-audio', verifyProctorToken, setMasterAudio);

app.post('/api/questions/import', verifyProctorToken, async (req, res) => {
  try {
    const { questions } = req.body;
    let count = 0;
    
    // Group passages and questions
    for (const q of questions) {
      let wacanaId = null;
      if (q.wacana_teks) {
        // Find existing passage or insert new one
        const [existing] = await pool.query('SELECT id FROM wacana_reading WHERE isi_wacana = ? LIMIT 1', [q.wacana_teks.trim()]);
        if (existing.length > 0) {
          wacanaId = existing[0].id;
        } else {
          const [result] = await pool.query('INSERT INTO wacana_reading (judul, isi_wacana) VALUES (?, ?)', ['Wacana Import', q.wacana_teks.trim()]);
          wacanaId = result.insertId;
        }
      }
      
      await pool.query(
        `INSERT INTO bank_soal (nomor_section, nama_bagian, berkas_audio, wacana_id, pertanyaan, pilihan_a, pilihan_b, pilihan_c, pilihan_d, jawaban_benar) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [q.section, q.section === 1 ? 'Part A' : null, q.audio || null, wacanaId, q.pertanyaan || '', q.a, q.b, q.c, q.d, q.jawaban ? q.jawaban.toUpperCase() : 'A']
      );
      count++;
    }
    res.json({ message: `${count} Soal berhasil diimport` });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ============================================================
// 4. ROUTE EXECUTION UJIAN (Mahasiswa & SEB Protected)
// ============================================================
app.get('/api/exam/prefetch', verifySebHeader, verifyStudentToken, prefetchQuestions);
app.post('/api/exam/sync-answers', verifySebHeader, verifyStudentToken, syncAnswers);
app.post('/api/exam/submit', verifySebHeader, verifyStudentToken, submitExam);

// ============================================================
// 5. ROUTE HASIL & REKAPITULASI SKOR
// ============================================================
app.get('/api/scores/student', verifyStudentToken, getStudentScore);
app.get('/api/scores/recap', verifyProctorToken, getScoreRecap);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'SECURE-TOEFL CBT API Server is running',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`[API SERVER] Express running on http://localhost:${PORT}`);
});
