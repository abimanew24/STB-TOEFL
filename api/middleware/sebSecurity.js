import crypto from 'crypto';
import { readStoredSettings } from '../controllers/systemController.js';

/**
 * Middleware untuk memvalidasi header X-SafeExamBrowser-ConfigKeyHash dari Safe Exam Browser (SEB).
 * Mencegah pengaksesan ruang ujian dari browser umum (Chrome/Edge/Firefox).
 */
export function verifySebHeader(req, res, next) {
  const settings = readStoredSettings();
  const isSebStrict = settings.sebEnabled || process.env.SEB_STRICT === 'true';

  // Jika SEB tidak diwajibkan oleh pengawas, izinkan akses dari browser biasa
  if (!isSebStrict) {
    return next();
  }

  const sebConfigHashHeader = req.headers['x-safeexambrowser-configkeyhash'];
  const sebRequestHash = req.headers['x-safeexambrowser-requesthash'];
  const userAgent = req.headers['user-agent'] || '';
  const isSebAgent = userAgent.includes('SafeExamBrowser') || userAgent.includes('SEB/');

  // Periksa apakah request dikirim oleh aplikasi SEB yang sah
  if (!sebConfigHashHeader && !sebRequestHash && !isSebAgent) {
    return res.status(403).json({
      error: 'Akses Ditolak (SEB Forbidden)',
      message: 'Ujian hanya dapat diakses melalui aplikasi Safe Exam Browser (SEB) resmi yang telah dikonfigurasi oleh pengawas laboratorium.',
      code: 'SEB_HEADER_MISSING'
    });
  }

  next();
}
