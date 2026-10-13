// Pengelola Sesi Aktif Peserta (In-Memory Session Registry untuk Fitur Blokir Multi-Login)
const activeStudentSessions = new Map();

/**
 * Mengambil sesi aktif berdasarkan NIM mahasiswa
 */
export function getActiveSession(nomorInduk) {
  if (!nomorInduk) return null;
  return activeStudentSessions.get(String(nomorInduk).trim());
}

/**
 * Mendaftarkan atau memperbarui sesi aktif mahasiswa
 */
export function setActiveSession(nomorInduk, sessionData) {
  if (!nomorInduk) return;
  activeStudentSessions.set(String(nomorInduk).trim(), {
    ...sessionData,
    lastSeen: Date.now()
  });
}

/**
 * Memperbarui waktu aktivitas terakhir
 */
export function touchActiveSession(nomorInduk) {
  if (!nomorInduk) return;
  const session = activeStudentSessions.get(String(nomorInduk).trim());
  if (session) {
    session.lastSeen = Date.now();
  }
}

/**
 * Menghapus sesi aktif (Logout, Submit Ujian, atau Reset oleh Pengawas)
 */
export function removeActiveSession(nomorInduk) {
  if (!nomorInduk) return false;
  return activeStudentSessions.delete(String(nomorInduk).trim());
}

/**
 * Mengambil daftar seluruh sesi mahasiswa yang sedang aktif
 */
export function getAllActiveSessions() {
  const result = [];
  const now = Date.now();
  const TIMEOUT_MS = 60 * 60 * 1000; // 1 jam

  for (const [nim, data] of activeStudentSessions.entries()) {
    if (now - data.lastSeen < TIMEOUT_MS) {
      result.push({
        nomorInduk: nim,
        ...data
      });
    } else {
      // Bersihkan sesi usang
      activeStudentSessions.delete(nim);
    }
  }

  return result;
}
