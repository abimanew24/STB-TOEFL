import os from 'os';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { removeActiveSession, getAllActiveSessions } from '../services/activeSessionManager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CONFIG_FILE = path.join(__dirname, '../config/system_settings.json');

// Pastikan direktori config tersedia
function ensureConfigDir() {
  const dir = path.dirname(CONFIG_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Mendeteksi semua interface jaringan IPv4 pada host
export function detectNetworkInterfaces() {
  const interfaces = os.networkInterfaces();
  const results = [];

  for (const [name, addrs] of Object.entries(interfaces)) {
    if (!addrs) continue;
    for (const addr of addrs) {
      if (addr.family === 'IPv4' || addr.family === 4) {
        results.push({
          name,
          address: addr.address,
          netmask: addr.netmask,
          mac: addr.mac,
          internal: addr.internal,
          type: addr.internal ? 'loopback' : (name.toLowerCase().includes('wi-fi') || name.toLowerCase().includes('wlan') ? 'wifi' : 'ethernet')
        });
      }
    }
  }

  // Cari IP rekomendasi LAN (non-internal, dimulai dari 192.168.* atau 10.* atau 172.*)
  const lanCandidate = results.find(i => !i.internal && (i.address.startsWith('192.168.') || i.address.startsWith('10.') || i.address.startsWith('172.')));
  const defaultIp = lanCandidate ? lanCandidate.address : (results.find(i => !i.internal)?.address || '127.0.0.1');

  return { interfaces, list: results, defaultIp };
}

// Membaca pengaturan dari file JSON atau inisialisasi default
export function readStoredSettings() {
  ensureConfigDir();
  const { defaultIp } = detectNetworkInterfaces();
  const currentPort = parseInt(process.env.PORT || '5001', 10);

  const defaultSettings = {
    serverIp: defaultIp,
    serverPort: currentPort,
    offlineMode: false,
    sebEnabled: process.env.SEB_STRICT === 'true',
    blockMultiLogin: true,
    sebQuitPassword: 'qwe1234',
    audioAutoPlay: true,
    strictOnePlay: true,
    requireAudioCheck: true,
    preloadAllAudio: true,
    language: 'id',
    examFontSize: 'normal',
    examTheme: 'light',
    showQuestionGrid: true,
    compactView: false,
    updatedAt: new Date().toISOString()
  };

  if (!fs.existsSync(CONFIG_FILE)) {
    try {
      fs.writeFileSync(CONFIG_FILE, JSON.stringify(defaultSettings, null, 2), 'utf8');
      return defaultSettings;
    } catch (e) {
      return defaultSettings;
    }
  }

  try {
    const raw = fs.readFileSync(CONFIG_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return { ...defaultSettings, ...parsed };
  } catch (err) {
    console.error('[CONFIG READ ERROR]', err);
    return defaultSettings;
  }
}

// GET /api/system/settings
export async function getSystemSettings(req, res) {
  try {
    const settings = readStoredSettings();
    const network = detectNetworkInterfaces();

    const systemInfo = {
      hostname: os.hostname(),
      platform: os.platform(),
      release: os.release(),
      nodeVersion: process.version,
      uptimeSeconds: Math.floor(os.uptime()),
      totalMemoryMB: Math.round(os.totalmem() / (1024 * 1024)),
      freeMemoryMB: Math.round(os.freemem() / (1024 * 1024)),
      cpuModel: os.cpus()[0]?.model || 'Processor Multi-Core'
    };

    return res.json({
      settings,
      networkInterfaces: network.list,
      recommendedIp: network.defaultIp,
      systemInfo
    });
  } catch (error) {
    console.error('[GET SYSTEM SETTINGS ERROR]', error);
    return res.status(500).json({ error: 'Server Error', message: error.message });
  }
}

// POST /api/system/settings
export async function saveSystemSettings(req, res) {
  try {
    const incoming = req.body;
    ensureConfigDir();
    const current = readStoredSettings();

    const updated = {
      ...current,
      serverIp: incoming.serverIp ? String(incoming.serverIp).trim() : current.serverIp,
      serverPort: incoming.serverPort ? parseInt(incoming.serverPort, 10) : current.serverPort,
      offlineMode: typeof incoming.offlineMode === 'boolean' ? incoming.offlineMode : current.offlineMode,
      sebEnabled: typeof incoming.sebEnabled === 'boolean' ? incoming.sebEnabled : current.sebEnabled,
      blockMultiLogin: typeof incoming.blockMultiLogin === 'boolean' ? incoming.blockMultiLogin : current.blockMultiLogin,
      sebQuitPassword: incoming.sebQuitPassword ? String(incoming.sebQuitPassword) : current.sebQuitPassword,
      audioAutoPlay: typeof incoming.audioAutoPlay === 'boolean' ? incoming.audioAutoPlay : current.audioAutoPlay,
      strictOnePlay: typeof incoming.strictOnePlay === 'boolean' ? incoming.strictOnePlay : current.strictOnePlay,
      requireAudioCheck: typeof incoming.requireAudioCheck === 'boolean' ? incoming.requireAudioCheck : current.requireAudioCheck,
      preloadAllAudio: typeof incoming.preloadAllAudio === 'boolean' ? incoming.preloadAllAudio : current.preloadAllAudio,
      language: incoming.language ? String(incoming.language) : current.language,
      examFontSize: incoming.examFontSize ? String(incoming.examFontSize) : current.examFontSize,
      examTheme: incoming.examTheme ? String(incoming.examTheme) : current.examTheme,
      showQuestionGrid: typeof incoming.showQuestionGrid === 'boolean' ? incoming.showQuestionGrid : current.showQuestionGrid,
      compactView: typeof incoming.compactView === 'boolean' ? incoming.compactView : current.compactView,
      updatedAt: new Date().toISOString()
    };

    fs.writeFileSync(CONFIG_FILE, JSON.stringify(updated, null, 2), 'utf8');

    // Sinkronkan ke environment runtime
    process.env.SEB_STRICT = updated.sebEnabled ? 'true' : 'false';

    return res.json({
      success: true,
      message: 'Pengaturan sistem, tampilan & bahasa berhasil disimpan',
      settings: updated
    });
  } catch (error) {
    console.error('[SAVE SYSTEM SETTINGS ERROR]', error);
    return res.status(500).json({ error: 'Server Error', message: error.message });
  }
}

// GET /api/system/public-config (Dapat diakses oleh klien ujian mahasiswa)
export async function getPublicConfig(req, res) {
  try {
    const settings = readStoredSettings();
    return res.json({
      offlineMode: Boolean(settings.offlineMode),
      sebEnabled: Boolean(settings.sebEnabled),
      serverIp: settings.serverIp,
      serverPort: settings.serverPort,
      audioAutoPlay: settings.audioAutoPlay !== undefined ? Boolean(settings.audioAutoPlay) : true,
      strictOnePlay: settings.strictOnePlay !== undefined ? Boolean(settings.strictOnePlay) : true,
      requireAudioCheck: settings.requireAudioCheck !== undefined ? Boolean(settings.requireAudioCheck) : true,
      preloadAllAudio: settings.preloadAllAudio !== undefined ? Boolean(settings.preloadAllAudio) : true,
      language: settings.language || 'id',
      examFontSize: settings.examFontSize || 'normal',
      examTheme: settings.examTheme || 'light',
      showQuestionGrid: settings.showQuestionGrid !== undefined ? Boolean(settings.showQuestionGrid) : true,
      compactView: settings.compactView !== undefined ? Boolean(settings.compactView) : false,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Server Error', message: error.message });
  }
}

// GET /api/system/ping (Untuk tes latensi & konektivitas jaringan)
export async function pingSystem(req, res) {
  return res.json({
    ok: true,
    timestamp: Date.now()
  });
}

// POST /api/system/reset-session (Reset sesi mahasiswa yang terblokir multi-login)
export async function resetStudentSession(req, res) {
  try {
    const { nomorInduk } = req.body;
    if (!nomorInduk) {
      return res.status(400).json({ error: 'NIM wajib diisi' });
    }
    const removed = removeActiveSession(nomorInduk);
    return res.json({
      success: true,
      message: removed ? `Sesi peserta ${nomorInduk} berhasil di-reset.` : `Tidak ditemukan sesi aktif untuk NIM ${nomorInduk}.`
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// GET /api/system/active-sessions (Pantau sesi peserta aktif)
export async function getActiveSessionsController(req, res) {
  try {
    const sessions = getAllActiveSessions();
    return res.json(sessions);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// GET /api/system/download-seb-config (Unduh file konfigurasi SEB siap pakai)
export async function downloadSebConfigFile(req, res) {
  try {
    const settings = readStoredSettings();
    const serverIp = settings.serverIp || 'localhost';
    
    // Tentukan port web client tempat siswa membuka antarmuka ujian
    let targetPort = 5173;
    if (req.headers.referer) {
      try {
        const refUrl = new URL(req.headers.referer);
        if (refUrl.port) targetPort = refUrl.port;
      } catch (e) {}
    } else if (process.env.NODE_ENV === 'production') {
      targetPort = settings.serverPort || 5001;
    }

    const quitPassword = settings.sebQuitPassword || 'qwe1234';
    const hashedQuitPassword = crypto.createHash('sha256').update(quitPassword).digest('hex');

    const sebXml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>originURL</key>
    <string>http://${serverIp}:${targetPort}/student/login</string>
    <key>startURL</key>
    <string>http://${serverIp}:${targetPort}/student/login</string>
    <key>quitURL</key>
    <string>http://${serverIp}:${targetPort}/student/login</string>
    <key>hashedQuitPassword</key>
    <string>${hashedQuitPassword}</string>
    <key>allowPreferencesWindow</key>
    <false/>
    <key>allowQuit</key>
    <true/>
    <key>browserWindowAllowReload</key>
    <true/>
    <key>browserWindowShowURL</key>
    <integer>0</integer>
    <key>enableAltEsc</key>
    <false/>
    <key>enableAltF4</key>
    <false/>
    <key>enableAltTab</key>
    <false/>
    <key>enableCtrlEsc</key>
    <false/>
    <key>enableEsc</key>
    <false/>
    <key>enableF1</key>
    <false/>
    <key>enableF2</key>
    <false/>
    <key>enableF3</key>
    <false/>
    <key>enableF4</key>
    <false/>
    <key>enableF5</key>
    <false/>
    <key>enablePrintScreen</key>
    <false/>
    <key>enableStartMenu</key>
    <false/>
</dict>
</plist>`;

    res.setHeader('Content-Type', 'application/seb; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="stbtoefl_exam.seb"');
    return res.send(sebXml);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
