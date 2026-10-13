import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../database.js';
import { readStoredSettings } from './systemController.js';
import { getActiveSession, setActiveSession } from '../services/activeSessionManager.js';

const JWT_SECRET = process.env.JWT_SECRET || 'stbtoefl_jwt_secret_key_2026_secure';

/**
 * Login Mahasiswa Peserta Ujian (NIM + Token Ujian + Nama Lengkap)
 */
export async function loginStudent(req, res) {
  try {
    const { nomor_induk, nama_lengkap, email, token_ujian } = req.body;

    if (!nomor_induk || !nama_lengkap || !email || !token_ujian) {
      return res.status(400).json({
        error: 'Data Tidak Lengkap',
        message: 'NIM, Nama Lengkap, Email, dan Token Ujian wajib diisi.'
      });
    }

    // 1. Periksa ketersediaan dan status aktif token sesi ujian
    const [sessions] = await pool.query(
      `SELECT * FROM sesi_ujian WHERE UPPER(token) = UPPER(?) LIMIT 1`,
      [token_ujian.trim()]
    );

    if (sessions.length === 0) {
      return res.status(404).json({
        error: 'Token Tidak Ditemukan',
        message: 'Token ujian yang Anda masukkan tidak valid.'
      });
    }

    const session = sessions[0];
    if (!session.status_aktif) {
      return res.status(403).json({
        error: 'Sesi Belum Aktif',
        message: 'Sesi ujian belum diaktifkan oleh pengawas laboratorium.'
      });
    }

    // 2. Periksa apakah akun mahasiswa sudah didaftarkan oleh panitia di tabel `pengguna`
    let [users] = await pool.query(
      `SELECT * FROM pengguna WHERE nomor_induk = ? AND peran = 'mahasiswa' LIMIT 1`,
      [nomor_induk.trim()]
    );

    if (users.length === 0) {
      return res.status(401).json({
        error: 'Peserta Tidak Terdaftar',
        message: 'NIM Anda belum didaftarkan oleh panitia. Anda tidak diizinkan mengikuti ujian.'
      });
    }

    const student = users[0];

    // Validasi kecocokan Nama Lengkap (case-insensitive)
    if (student.nama_lengkap.toLowerCase() !== nama_lengkap.trim().toLowerCase()) {
      return res.status(401).json({
        error: 'Data Tidak Cocok',
        message: 'Nama Lengkap tidak sesuai dengan database panitia. Periksa kembali ejaan nama Anda.'
      });
    }

    // Validasi kecocokan Email
    if (student.email && student.email.toLowerCase() !== email.trim().toLowerCase()) {
      return res.status(401).json({
        error: 'Data Tidak Cocok',
        message: 'Email yang Anda masukkan tidak sesuai dengan database panitia.'
      });
    }

    const userId = student.id;
    const studentEmail = student.email;

    // 3. Penjaga Ujian Ganda: Periksa apakah mahasiswa sudah pernah menyelesaikan ujian pada sesi ini
    const [existingResults] = await pool.query(
      `SELECT * FROM hasil_ujian WHERE pengguna_id = ? AND sesi_id = ? LIMIT 1`,
      [userId, session.id]
    );

    if (existingResults.length > 0) {
      return res.status(403).json({
        error: 'Ujian Sudah Selesai',
        message: 'Anda telah menyelesaikan ujian pada sesi ini. Nilai Anda sudah terekam.',
        result: existingResults[0]
      });
    }

    // 4. Blokir Multi-Login: Cek apakah mahasiswa sedang aktif di komputer lain
    const settings = readStoredSettings();
    const clientIp = req.ip || req.connection?.remoteAddress || '127.0.0.1';
    const existingSession = getActiveSession(nomor_induk.trim());

    if (settings.blockMultiLogin && existingSession) {
      const isExpired = (Date.now() - existingSession.lastSeen) > 30 * 60 * 1000;
      if (!isExpired) {
        return res.status(403).json({
          error: 'Multi-Login Ditolak',
          code: 'MULTI_LOGIN_BLOCKED',
          message: `NIM ${nomor_induk.trim()} terdeteksi sedang aktif di perangkat lain (${existingSession.ip || 'Komputer Lab'}). Multi-login diblokir demi integritas ujian. Minta pengawas untuk melakukan reset sesi jika Anda berpindah komputer.`
        });
      }
    }

    // 5. Generate JWT Token untuk Mahasiswa
    const payload = {
      id: userId,
      nomor_induk: nomor_induk.trim(),
      nama_lengkap: nama_lengkap.trim(),
      email: studentEmail,
      peran: 'mahasiswa',
      sesi_id: session.id,
      nama_sesi: session.nama_sesi
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '6h' });

    // Daftarkan sesi aktif mahasiswa
    setActiveSession(nomor_induk.trim(), {
      studentId: userId,
      token,
      ip: clientIp,
      userAgent: req.headers['user-agent'] || '',
      loginTime: Date.now(),
      lastSeen: Date.now()
    });

    return res.json({
      message: 'Login Ujian Mahasiswa Berhasil',
      token,
      student: payload,
      session: {
        id: session.id,
        nama_sesi: session.nama_sesi,
        status_aktif: Boolean(session.status_aktif)
      }
    });
  } catch (error) {
    console.error('[AUTH STUDENT ERROR]', error);
    return res.status(500).json({ error: 'Server Error', message: error.message });
  }
}

/**
 * Login Dosen Pengawas / Admin (NIP & Password Bcrypt)
 */
export async function loginProctor(req, res) {
  try {
    const { nomor_induk, kata_sandi } = req.body;

    if (!nomor_induk || !kata_sandi) {
      return res.status(400).json({
        error: 'Data Tidak Lengkap',
        message: 'NIP Pengawas dan Kata Sandi wajib diisi.'
      });
    }

    // Cari pengguna pengawas
    const [users] = await pool.query(
      `SELECT * FROM pengguna WHERE nomor_induk = ? AND peran = 'pengawas' LIMIT 1`,
      [nomor_induk.trim()]
    );

    // Jika belum ada akun pengawas sama sekali di DB, buat akun pengawas default (Seed Auto-Admin)
    if (users.length === 0) {
      const [allProctors] = await pool.query(`SELECT COUNT(*) as count FROM pengguna WHERE peran = 'pengawas'`);
      if (allProctors[0].count === 0 && (nomor_induk === 'admin' || nomor_induk === '199001012026011001')) {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        const [insertRes] = await pool.query(
          `INSERT INTO pengguna (nomor_induk, nama_lengkap, email, kata_sandi, peran) 
           VALUES (?, 'Dosen Pengawas Utama', 'proctor@stbtoefl.ac.id', ?, 'pengawas')`,
          [nomor_induk.trim(), hashedPassword]
        );
        users.push({
          id: insertRes.insertId,
          nomor_induk: nomor_induk.trim(),
          nama_lengkap: 'Dosen Pengawas Utama',
          email: 'proctor@stbtoefl.ac.id',
          kata_sandi: hashedPassword,
          peran: 'pengawas'
        });
      } else {
        return res.status(401).json({
          error: 'Autentikasi Gagal',
          message: 'NIP Pengawas tidak terdaftar.'
        });
      }
    }

    const proctor = users[0];
    const isPasswordValid = await bcrypt.compare(kata_sandi, proctor.kata_sandi);

    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Autentikasi Gagal',
        message: 'Kata sandi yang Anda masukkan salah.'
      });
    }

    // Generate JWT Token untuk Pengawas
    const payload = {
      id: proctor.id,
      nomor_induk: proctor.nomor_induk,
      nama_lengkap: proctor.nama_lengkap,
      email: proctor.email,
      peran: 'pengawas'
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '12h' });

    return res.json({
      message: 'Login Portal Pengawas Berhasil',
      token,
      proctor: payload
    });
  } catch (error) {
    console.error('[AUTH PROCTOR ERROR]', error);
    return res.status(500).json({ error: 'Server Error', message: error.message });
  }
}
