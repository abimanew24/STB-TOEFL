import jwt from 'jsonwebtoken';

/**
 * Middleware untuk memverifikasi JWT Token khusus Dosen Pengawas/Administrator.
 */
export function verifyProctorToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Autentikasi Gagal',
      message: 'Token otorisasi pengawas tidak ditemukan.'
    });
  }

  const token = authHeader.split(' ')[1];
  const jwtSecret = process.env.JWT_SECRET || 'stbtoefl_jwt_secret_key_2026_secure';

  try {
    const decoded = jwt.verify(token, jwtSecret);
    if (decoded.peran !== 'pengawas') {
      return res.status(403).json({
        error: 'Akses Ditolak',
        message: 'Hanya Pengawas/Admin yang diizinkan mengakses fitur ini.'
      });
    }

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      error: 'Token Tidak Valid',
      message: 'Sesi pengawas telah berakhir atau token tidak valid. Silakan login kembali.'
    });
  }
}
