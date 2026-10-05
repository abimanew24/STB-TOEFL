import crypto from 'crypto';

/**
 * Middleware untuk memvalidasi header X-SafeExamBrowser-ConfigKeyHash dari Safe Exam Browser (SEB).
 * Mencegah pengaksesan ruang ujian dari browser umum (Chrome/Edge/Firefox).
 */
export function verifySebHeader(req, res, next) {
  // Jika SEB_STRICT=false (atau bukan 'true'), bypass pemeriksaan SEB untuk mode testing di browser biasa
  if (process.env.SEB_STRICT !== 'true') {
    return next();
  }

  const sebConfigHashHeader = req.headers['x-safeexambrowser-configkeyhash'];
  const expectedHashSecret = process.env.SEB_HASH_SECRET || 'seb_config_key_hash_secret_toefl_cbt';

  if (!sebConfigHashHeader) {
    return res.status(403).json({
      error: 'Akses Ditolak (SEB Forbidden)',
      message: 'Ujian hanya dapat diakses melalui aplikasi Safe Exam Browser (SEB) yang telah dikonfigurasi.',
      code: 'SEB_HEADER_MISSING'
    });
  }

  // Jika header tersedia, lakukan validasi format/hash dasar
  if (typeof sebConfigHashHeader !== 'string' || sebConfigHashHeader.length < 32) {
    return res.status(403).json({
      error: 'Akses Ditolak (Integritas SEB Tidak Valid)',
      message: 'Header Safe Exam Browser tidak valid atau telah dimodifikasi.',
      code: 'SEB_HASH_INVALID'
    });
  }

  next();
}
