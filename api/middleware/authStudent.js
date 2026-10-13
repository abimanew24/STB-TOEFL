import jwt from 'jsonwebtoken';
import { readStoredSettings } from '../controllers/systemController.js';
import { getActiveSession, touchActiveSession } from '../services/activeSessionManager.js';

/**
 * Middleware untuk memverifikasi JWT Token sesi Ujian Mahasiswa.
 */
export function verifyStudentToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Autentikasi Gagal',
      message: 'Token sesi mahasiswa tidak ditemukan.'
    });
  }

  const token = authHeader.split(' ')[1];
  const jwtSecret = process.env.JWT_SECRET || 'stbtoefl_jwt_secret_key_2026_secure';

  try {
    const decoded = jwt.verify(token, jwtSecret);
    if (decoded.peran !== 'mahasiswa') {
      return res.status(403).json({
        error: 'Akses Ditolak',
        message: 'Token tidak valid untuk sesi ujian mahasiswa.'
      });
    }

    // Validasi aturan Blokir Multi-Login jika diaktifkan pengawas
    const settings = readStoredSettings();
    if (settings.blockMultiLogin && decoded.nomor_induk) {
      const activeSession = getActiveSession(decoded.nomor_induk);
      if (activeSession && activeSession.token && activeSession.token !== token) {
        return res.status(401).json({
          error: 'Sesi Telah Digantikan',
          code: 'SESSION_SUPERSEDED',
          message: 'Akun Anda telah login di komputer/perangkat lain. Sesi pada perangkat ini telah dinonaktifkan demi integritas ujian.'
        });
      }
      touchActiveSession(decoded.nomor_induk);
    }

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      error: 'Sesi Berakhir',
      message: 'Sesi ujian Anda telah kadaluarsa. Silakan masukan NIM dan Token Ujian kembali.'
    });
  }
}
