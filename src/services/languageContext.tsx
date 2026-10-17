import React, { createContext, useContext, useState, useEffect } from 'react';
import api from './api';

export type Language = 'id' | 'en';

export interface Translations {
  [key: string]: {
    id: string;
    en: string;
  };
}

export const translations: Translations = {
  // Navigation / Tabs
  navSettings: { id: 'Pengaturan', en: 'Settings' },
  tabProfile: { id: 'Profil & Status', en: 'Profile & Status' },
  tabServer: { id: 'Sistem & Jaringan', en: 'System & Network' },
  tabSecurity: { id: 'Keamanan (SEB)', en: 'Security (SEB)' },
  tabAudio: { id: 'Media & Audio', en: 'Media & Audio' },
  tabReport: { id: 'Sertifikat & Nilai', en: 'Certificate & Score' },
  tabUi: { id: 'Tampilan & Bahasa', en: 'Appearance & Language' },

  // System & Network
  serverTitle: { id: 'Sistem & Jaringan', en: 'System & Network' },
  serverDesc: { 
    id: 'Konfigurasi alamat server lokal, binding adapter LAN, dan performa sinkronisasi offline.', 
    en: 'Configure local server address, LAN adapter binding, and offline synchronization performance.' 
  },
  redetectNetwork: { id: 'Deteksi Ulang Jaringan', en: 'Redetect Network' },
  lanIpLabel: { id: 'Alamat IP LAN (Active Bind)', en: 'LAN IP Address (Active Bind)' },
  lanIpSub: { id: 'Adapter aktif server CBT', en: 'Active CBT server adapter' },
  autoInterfaceLabel: { id: 'Pilih Interface Otomatis:', en: 'Auto-Select Interface:' },
  serverPortLabel: { id: 'Port Server Node.js', en: 'Node.js Server Port' },
  serverPortSub: { id: 'Port listening Express.js (Default: 5001)', en: 'Express.js listening port (Default: 5001)' },
  examUrlLabel: { id: 'Tautan Akses Ujian Peserta (LAN / SEB)', en: 'Student Exam Access Link (LAN / SEB)' },
  copyUrl: { id: 'Salin URL', en: 'Copy URL' },
  copied: { id: 'Tersalin!', en: 'Copied!' },
  pingTest: { id: 'Uji Koneksi', en: 'Ping Test' },
  pinging: { id: 'Menguji...', en: 'Testing...' },
  offlineModeTitle: { id: 'Mode Offline Tersendiri', en: 'Standalone Offline Mode' },
  offlineModeDesc: { 
    id: 'Simpan instrumen soal dan jawaban secara penuh di IndexedDB browser peserta ujian (Dexie.js). Ujian tetap dapat berjalan lancar tanpa henti jika jaringan LAN terputus sementara.', 
    en: 'Save exam questions and answers fully in the student browser IndexedDB (Dexie.js). The exam continues smoothly even if the local LAN network disconnects temporarily.' 
  },
  statusActive: { id: 'Aktif', en: 'Active' },
  statusInactive: { id: 'Nonaktif', en: 'Inactive' },
  hostName: { id: 'Nama Host', en: 'Host Name' },
  nodeRuntime: { id: 'Node.js Runtime', en: 'Node.js Runtime' },
  availableRam: { id: 'RAM Tersedia', en: 'Available RAM' },
  serverUptime: { id: 'Uptime Server', en: 'Server Uptime' },
  minutes: { id: 'menit', en: 'minutes' },
  saveNetworkBtn: { id: 'Simpan Pengaturan Jaringan', en: 'Save Network Settings' },
  savingSettings: { id: 'Menyimpan Pengaturan...', en: 'Saving Settings...' },

  // Security (SEB)
  securityTitle: { id: 'Keamanan & Integritas Ujian', en: 'Exam Security & Integrity' },
  securityDesc: { 
    id: 'Aturan Safe Exam Browser (SEB), pencegahan multi-device login, dan proteksi kunci keluar layar.', 
    en: 'Safe Exam Browser (SEB) policies, multi-device login prevention, and quit lock screen protection.' 
  },
  monitorSessionsBtn: { id: 'Pantau Sesi Peserta Aktif', en: 'Monitor Active Student Sessions' },
  sebTitle: { id: 'Wajibkan Safe Exam Browser (SEB)', en: 'Require Safe Exam Browser (SEB)' },
  sebStrictBadge: { id: 'Ketat (SEB Only)', en: 'Strict (SEB Only)' },
  sebFlexibleBadge: { id: 'Fleksibel (Browser Bebas)', en: 'Flexible (Any Browser)' },
  sebDesc: { 
    id: 'Blokir akses ruang ujian dari browser standar (Chrome, Firefox, Edge) melalui validasi hash SEB. Peserta tanpa aplikasi SEB resmi akan ditolak dengan galat HTTP 403.', 
    en: 'Block exam room access from standard browsers (Chrome, Firefox, Edge) using SEB hash validation. Students without official SEB will be rejected with HTTP 403.' 
  },
  sebWarning: { 
    id: 'Mode Ketat Aktif: Pastikan seluruh komputer laboratorium telah diinstal Safe Exam Browser dan membuka berkas konfigurasi .seb.', 
    en: 'Strict Mode Active: Ensure all lab computers have Safe Exam Browser installed and launch via the .seb configuration file.' 
  },
  multiLoginTitle: { id: 'Blokir Multi-Login', en: 'Block Multi-Login' },
  multiLoginActiveBadge: { id: '1 Komputer / NIM', en: '1 Device / Student' },
  multiLoginDisabledBadge: { id: 'Multi-Device Diizinkan', en: 'Multi-Device Allowed' },
  multiLoginDesc: { 
    id: 'Satu NIM peserta tidak diizinkan login atau membuka soal di dua komputer berbeda secara bersamaan. Mencegah pengerjaan ujian oleh pihak ketiga secara remote.', 
    en: 'A student ID is prohibited from logging in or opening questions on two different computers simultaneously, preventing unauthorized remote exam assistance.' 
  },
  quitPasswordTitle: { id: 'Kunci Keluar SEB (Quit Password)', en: 'SEB Quit Password' },
  quitPasswordSub: { id: 'Sandi darurat layar ujian SEB', en: 'Emergency password for SEB exam screen' },
  quitPasswordPlaceholder: { id: 'Masukkan password keluar SEB', en: 'Enter SEB quit password' },
  quitPasswordHint: { 
    id: 'Digunakan oleh dosen pengawas untuk membuka kunci layar SEB peserta jika terjadi kendala teknis (tombol pintas Ctrl + Q).', 
    en: 'Used by the proctor to unlock the student SEB lock screen during technical issues (keyboard shortcut Ctrl + Q).' 
  },
  sebConfigFileTitle: { id: 'Berkas Konfigurasi Klien Laboratorium (.seb)', en: 'Lab Client Configuration File (.seb)' },
  sebConfigFileDesc: { 
    id: 'File pre-configured dengan URL server, LAN IP, dan sandi keluar otomatis.', 
    en: 'Pre-configured file containing server URL, LAN IP, and automatic encrypted quit password.' 
  },
  downloadSebBtn: { id: 'Unduh File Konfigurasi SEB (.seb)', en: 'Download SEB Config File (.seb)' },
  saveSecurityBtn: { id: 'Simpan Pengaturan Keamanan', en: 'Save Security Settings' },

  // Media & Audio
  audioTitle: { id: 'Media & Audio (Section 1)', en: 'Media & Audio (Section 1)' },
  audioDesc: { 
    id: 'Kebijakan pemutaran suara Listening Comprehension, aturan pemutaran 1x, dan optimasi pemuatan berkas audio.', 
    en: 'Listening Comprehension audio playback policies, 1x playback enforcement, and audio caching optimizations.' 
  },
  openAudioBankBtn: { id: 'Buka Bank Audio MP3', en: 'Open MP3 Audio Bank' },
  autoPlayTitle: { id: 'Auto-Play Audio Soal', en: 'Auto-Play Question Audio' },
  autoPlayActiveBadge: { id: 'Otomatis Diputar', en: 'Automatic Play' },
  autoPlayManualBadge: { id: 'Manual Klik Play', en: 'Manual Play Click' },
  autoPlayDesc: { 
    id: 'Audio percakapan/ceramah listening langsung diputar otomatis begitu peserta masuk atau berpindah ke nomor soal (Standar resmi TOEFL ETS).', 
    en: 'Listening conversation/lecture audio plays automatically when the student enters or navigates to a question (Official ETS TOEFL standard).' 
  },
  strictOnePlayTitle: { id: 'Aturan Ketat Pemutaran 1x (Strict 1x Play)', en: 'Strict 1x Play Rule (ETS Official)' },
  strictOnePlayStrictBadge: { id: 'Ketat: 1x Play (Resmi ETS)', en: 'Strict: 1x Play (ETS Standard)' },
  strictOnePlaySimBadge: { id: 'Simulasi: Boleh Diulang', en: 'Practice: Replay Allowed' },
  strictOnePlayDesc: { 
    id: 'Kunci pemutaran hanya dapat didengarkan tepat 1 kali per nomor soal. Peserta tidak dapat menekan jeda (pause) atau mengulang audio. Nonaktifkan opsi ini jika ingin mode latihan/tryout mandiri.', 
    en: 'Audio can only be played strictly once per question. Students cannot pause or replay the audio. Disable this option for practice or simulation tests.' 
  },
  requireAudioCheckTitle: { id: 'Wajibkan Uji Suara Headset (Audio Check)', en: 'Require Headset Sound Check' },
  requireAudioCheckActiveBadge: { id: 'Wajib Uji Suara', en: 'Mandatory Check' },
  requireAudioCheckBypassBadge: { id: 'Bypass / Lewati', en: 'Bypass / Skip' },
  requireAudioCheckDesc: { 
    id: 'Peserta wajib melewati halaman tes headset dan volume sebelum boleh masuk ke petunjuk ujian, memastikan seluruh headset di komputer lab berfungsi dengan jernih.', 
    en: 'Students must complete the headset volume test before proceeding to exam instructions, ensuring all lab headsets work properly.' 
  },
  preloadAudioTitle: { id: 'Pra-Muat Penuh Berkas Audio (Preload Cache)', en: 'Full Audio Preload Cache' },
  preloadAudioActiveBadge: { id: 'Preload Aktif', en: 'Preload Active' },
  preloadAudioStreamBadge: { id: 'Streaming Sesuai Kebutuhan', en: 'On-Demand Streaming' },
  preloadAudioDesc: { 
    id: 'Unduh dan simpan paket audio Section 1 ke memori browser sejak awal untuk mencegah masalah buffering audio jika koneksi LAN lab sedang padat.', 
    en: 'Pre-download Section 1 audio packages into browser memory to eliminate buffering issues during heavy lab network traffic.' 
  },
  audioCatalogBannerTitle: { id: 'Katalog Audio Listening Section 1', en: 'Section 1 Listening Audio Catalog' },
  audioCatalogBannerSub: { 
    id: 'Kelola unggahan berkas MP3, Master Audio 35 Menit, dan Generator TTS', 
    en: 'Manage MP3 uploads, 35-minute Master Audio, and TTS voice generator' 
  },
  manageAudioFilesBtn: { id: 'Kelola Berkas Audio', en: 'Manage Audio Files' },
  saveAudioBtn: { id: 'Simpan Pengaturan Audio', en: 'Save Audio Settings' },

  // Appearance & Language (UI)
  uiTitle: { id: 'Tampilan & Bahasa Antarmuka', en: 'Appearance & System Language' },
  uiDesc: { 
    id: 'Kustomisasi bahasa petunjuk sistem, skala ukuran huruf wacana reading, tema kenyamanan mata, dan pemandu navigasi ujian.', 
    en: 'Customize system instruction language, reading passage font size, eye-care theme, and exam navigation layout.' 
  },
  langSectionTitle: { id: 'Bahasa Petunjuk & Navigasi', en: 'Instruction & Navigation Language' },
  langSectionDesc: { 
    id: 'Pilih bahasa utama yang digunakan pada petunjuk resmi ujian dan tombol antarmuka mahasiswa.', 
    en: 'Select the primary language used for official exam instructions and student UI buttons.' 
  },
  langIdTitle: { id: 'Bahasa Indonesia', en: 'Bahasa Indonesia' },
  langIdDesc: { id: 'Petunjuk resmi dalam Bahasa Indonesia', en: 'Official instructions in Indonesian' },
  langEnTitle: { id: 'English (US)', en: 'English (US)' },
  langEnDesc: { id: 'Standard ETS TOEFL ITP English prompts', en: 'Standard ETS TOEFL ITP English prompts' },

  fontSizeSectionTitle: { id: 'Ukuran Teks Soal & Wacana Reading', en: 'Question & Reading Text Size' },
  fontSizeSectionDesc: { 
    id: 'Sesuaikan ukuran font wacana Section 3 agar mahasiswa nyaman membaca teks akademis panjang tanpa melelahkan mata.', 
    en: 'Adjust Section 3 passage font size so students comfortably read long academic passages without eye strain.' 
  },
  fontNormalTitle: { id: 'Standar (100%)', en: 'Standard (100%)' },
  fontNormalDesc: { id: 'Ukuran default monitor', en: 'Default monitor size' },
  fontMediumTitle: { id: 'Sedang (110%)', en: 'Medium (110%)' },
  fontMediumDesc: { id: 'Lebih nyaman dibaca', en: 'Comfortable reading' },
  fontLargeTitle: { id: 'Besar (125%)', en: 'Large (125%)' },
  fontLargeDesc: { id: 'Ekstra jelas & besar', en: 'Extra clear & large' },
  previewPassageTitle: { id: 'Pratinjau Langsung Wacana Reading:', en: 'Live Reading Passage Preview:' },
  previewPassageSample: { 
    id: '“Bahasa Hawaii adalah rumpun bahasa Polinesia yang mengambil namanya dari pulau terbesar di kepulauan tropis Pasifik Utara tempat bahasa ini berkembang...”', 
    en: '“The Hawaiian language is a Polynesian language that takes its name from Hawaiʻi, the largest island in the tropical North Pacific archipelago where it developed...”' 
  },

  themeSectionTitle: { id: 'Tema Kontras Layar Pengawas & Ujian (Eye-Care)', en: 'Proctor & Exam Eye-Care Contrast Theme' },
  themeSectionDesc: { 
    id: 'Pilih skema warna kontras untuk kenyamanan mata pada seluruh modul/halaman pengawas maupun layar ujian peserta.', 
    en: 'Choose eye-care contrast color scheme applied across all proctor modules and student exam screens.' 
  },
  themeLightTitle: { id: 'Terang Bersih (Light)', en: 'Clean Light' },
  themeLightDesc: { id: 'Standar laboratorium terang', en: 'Standard bright lab monitor' },
  themeWarmTitle: { id: 'Lembut Mata (Sepia)', en: 'Soft Eye-Care (Sepia)' },
  themeWarmDesc: { id: 'Meredakan kelelahan mata', en: 'Reduces reading fatigue' },
  themeDarkTitle: { id: 'Redup Malam (Dark)', en: 'Night Dark' },
  themeDarkDesc: { id: 'Kontras rendah anti-silau', en: 'Low-contrast anti-glare' },

  layoutSectionTitle: { id: 'Pemandu Navigasi Soal', en: 'Question Navigation Guide' },
  gridToggleTitle: { id: 'Tampilkan Kotak Nomor Soal (Grid 1-50)', en: 'Show Question Number Grid (1-50)' },
  gridToggleDesc: { 
    id: 'Sediakan palet nomor soal 1-50 di sidebar agar peserta dapat memantau soal yang sudah dijawab atau ditandai ragu-ragu.', 
    en: 'Display a 1-50 question number palette in the sidebar so students can track answered and flagged questions.' 
  },
  compactToggleTitle: { id: 'Tata Letak Ringkas (Compact Spacing)', en: 'Compact Layout Spacing' },
  compactToggleDesc: { 
    id: 'Merapatkan jarak spasi vertikal pilihan jawaban (A, B, C, D) untuk mengoptimalkan monitor dengan resolusi layar terbatas.', 
    en: 'Condense vertical spacing between answer choices (A, B, C, D) to optimize smaller monitor screens.' 
  },
  saveUiBtn: { id: 'Simpan Pengaturan Tampilan & Bahasa', en: 'Save Appearance & Language Settings' },

  // Placeholders & Toast
  comingSoonTitle: { id: 'Fitur Segera Hadir', en: 'Feature Coming Soon' },
  comingSoonDesc: { 
    id: 'Pengaturan format sertifikat, penandatangan resmi, dan template nilai sedang dalam tahap akhir penyempurnaan.', 
    en: 'Certificate formatting, official signers, and score templates are in the final phase of development.' 
  },
  saveSuccessToast: { 
    id: 'Pengaturan berhasil disimpan dan langsung diterapkan ke seluruh sistem!', 
    en: 'Settings saved successfully and applied instantly across the entire system!' 
  },
  saveErrorToast: { 
    id: 'Gagal menyimpan pengaturan ke server. Periksa hak akses pengawas.', 
    en: 'Failed to save settings to the server. Check proctor authorization.' 
  },

  // Active Sessions Modal
  activeSessionsModalTitle: { id: 'Daftar Sesi Ujian Aktif', en: 'Active Exam Sessions' },
  activeSessionsModalSub: { 
    id: 'Pantau dan kelola peserta yang saat ini sedang login di sistem ujian.', 
    en: 'Monitor and manage students currently logged into the exam system.' 
  },
  noActiveSessions: { id: 'Tidak ada sesi aktif saat ini', en: 'No active sessions at this time' },
  noActiveSessionsSub: { 
    id: 'Belum ada peserta yang sedang login atau mengerjakan ujian.', 
    en: 'No students are currently logged in or taking an exam.' 
  },
  loadingActiveSessions: { id: 'Memuat sesi peserta aktif...', en: 'Loading active student sessions...' },
  resetSessionBtn: { id: 'Reset Sesi', en: 'Reset Session' },
  refreshBtn: { id: 'Segarkan', en: 'Refresh' },
  closeBtn: { id: 'Tutup', en: 'Close' },
  sessionActiveBadge: { id: 'Aktif', en: 'Active' },
  sessionActiveTimeLabel: { id: 'Waktu Aktif:', en: 'Active Time:' },

  // Student Exam Instructions
  examInstSubtitle: { id: 'Petunjuk Resmi Ujian TOEFL ITP', en: 'Official TOEFL ITP Exam Instructions' },
  examInstTitle: { id: 'Petunjuk & Integritas Ujian', en: 'Exam Instructions & Integrity' },
  examInstDesc: { 
    id: 'Harap pahami struktur ujian dan aturan yang berlaku sebelum memulai.', 
    en: 'Please understand the exam structure and rules before starting.' 
  },
  examStructureTitle: { id: 'Struktur Ujian (140 Soal)', en: 'Exam Structure (140 Questions)' },
  sec1ListeningTitle: { id: 'Section 1: Listening', en: 'Section 1: Listening' },
  sec1ListeningDuration: { id: '35 Menit', en: '35 Minutes' },
  sec1ListeningQuestions: { id: '50 Pertanyaan', en: '50 Questions' },
  sec1ListeningDesc: { 
    id: 'Audio akan diputar otomatis satu kali tanpa tombol jeda atau ulang. Pastikan fokus penuh pada percakapan dan monolog.', 
    en: 'Audio will play automatically once without pause or replay. Ensure full focus on conversations and monologues.' 
  },
  sec2StructureTitle: { id: 'Section 2: Structure', en: 'Section 2: Structure' },
  sec2StructureDuration: { id: '25 Menit', en: '25 Minutes' },
  sec2StructureQuestions: { id: '40 Pertanyaan', en: '40 Questions' },
  sec2StructureDesc: { 
    id: 'Menguji kemampuan Anda dalam mengenali tata bahasa baku dan ekspresi tertulis dalam bahasa Inggris formal.', 
    en: 'Tests your ability to recognize standard written grammar and expressions in formal English.' 
  },
  sec3ReadingTitle: { id: 'Section 3: Reading', en: 'Section 3: Reading' },
  sec3ReadingDuration: { id: '55 Menit', en: '55 Minutes' },
  sec3ReadingQuestions: { id: '50 Pertanyaan', en: '50 Questions' },
  sec3ReadingDesc: { 
    id: 'Membaca dan menjawab pertanyaan berdasarkan pemahaman wacana akademik. Layar akan terbagi menjadi dua panel (teks dan soal).', 
    en: 'Read and answer questions based on academic passages. The screen will be split into two panels (passage and questions).' 
  },
  integrityRulesTitle: { id: 'Aturan Integritas', en: 'Integrity Rules' },
  ruleSebLocked: { 
    id: 'Ujian dikunci penuh oleh Safe Exam Browser (SEB). Percobaan keluar aplikasi akan diblokir dan dicatat sebagai pelanggaran.', 
    en: 'The exam is locked within Safe Exam Browser (SEB). Any attempt to exit the application is blocked and recorded as a violation.' 
  },
  ruleAutoSave: { 
    id: 'Jawaban Anda disimpan otomatis ke server setiap beberapa detik (Auto-Save). Anda tidak perlu menekan tombol simpan.', 
    en: 'Your answers are automatically saved to the server every few seconds (Auto-Save). No manual save action is needed.' 
  },
  ruleIndependentSections: { 
    id: 'Waktu per section bersifat independen. Waktu sisa di Section 1 tidak dapat diakumulasi ke Section 2.', 
    en: 'Time for each section is independent. Remaining time in Section 1 cannot be carried over to Section 2.' 
  },
  agreeTermsCheckbox: { 
    id: 'Saya telah membaca, memahami, dan mematuhi seluruh tata tertib yang berlaku.', 
    en: 'I have read, understood, and agreed to abide by all the exam rules and regulations.' 
  },
  startExamBtn: { id: 'Mulai Kerjakan Ujian Sekarang', en: 'Start Exam Now' },
  downloadingExamData: { id: 'Mengunduh Data Ujian...', en: 'Downloading Exam Data...' },

  // Student CBT Interface Keys
  prevQuestionBtn: { id: '← Soal Sebelumnya', en: '← Previous Question' },
  doubtfulBtn: { id: 'Ragu-ragu', en: 'Flag as Doubtful' },
  nextQuestionBtn: { id: 'Soal Berikutnya →', en: 'Next Question →' },
  finishSectionBtn: { id: 'Selesaikan Section', en: 'Finish Section' },
  questionNumberTitle: { id: 'Nomor Soal', en: 'Question Numbers' },
  soalText: { id: 'Soal', en: 'Questions' },
  finishedCount: { id: 'Selesai', en: 'Answered' },
  emptyCount: { id: 'Kosong', en: 'Unanswered' },
  selectedBadge: { id: 'TERPILIH', en: 'SELECTED' },
  listenAudioNarration: { id: 'Dengarkan narator pada audio...', en: 'Listen to the narrator audio...' },
  audioCheckTitle: { id: 'Pemeriksaan Audio', en: 'Audio Check' },
  audioCheckDesc: { 
    id: 'Pasang headphone Anda dan pastikan suara audio uji coba terdengar jelas.', 
    en: 'Wear your headphones and ensure test audio is clearly audible.' 
  },
  playAudioBtn: { id: 'Putar Sampel Suara', en: 'Play Sample Audio' },
  audioTestedSuccess: { id: 'Suara Terdengar Jelas, Lanjutkan', en: 'Audio is Clear, Continue' },
  audioTrouble: { id: 'Suara Tidak Terdengar? Lapor Pengawas', en: 'Cannot Hear? Report to Proctor' },
  loginStudentTitle: { id: 'Portal Masuk Peserta Ujian', en: 'Student Exam Portal Login' },
  nimPlaceholder: { id: 'Nomor Induk Mahasiswa (NIM)', en: 'Student ID Number (NIM)' },
  namePlaceholder: { id: 'Nama Lengkap Mahasiswa', en: 'Full Student Name' },
  tokenPlaceholder: { id: 'Token Ujian (6 Digit)', en: 'Exam Token (6 Digits)' },
  loginBtn: { id: 'Mulai Ujian', en: 'Start Exam' },
  audioPreloadNotice: { id: 'Memuat berkas audio listening ke memori...', en: 'Preloading listening audio into memory...' },
  incompleteAnswersTitle: { id: 'Jawaban Belum Lengkap', en: 'Incomplete Answers' },
  incompleteAnswersDesc: { 
    id: 'Mohon periksa kembali. Anda belum menjawab seluruh pertanyaan pada Section ini. Harap lengkapi semua jawaban sebelum melanjutkan.', 
    en: 'Please check again. You have not answered all questions in this Section. Please complete all answers before proceeding.' 
  },
  backToExamBtn: { id: 'Kembali ke Soal Ujian', en: 'Return to Exam' },
  examPrepTitle: { id: 'Persiapan Ujian', en: 'Exam Preparation' },
  examStartsIn: { id: 'Ujian akan dimulai dalam:', en: 'Exam will start in:' },
  audioListeningTitle: { id: 'Audio Listening', en: 'Listening Audio' },
  audioRunningStatus: { id: 'Sedang memutar audio', en: 'Playing audio' },
  audioCompletedStatus: { id: 'Selesai diputar (Hanya 1x Putar)', en: 'Playback finished (1x Play Only)' },
  audioReadyStatus: { id: 'Siap diputar (1x Play)', en: 'Ready to play (1x Play)' },
  audioReadyReplayStatus: { id: 'Siap diputar (Boleh diulang)', en: 'Ready to play (Replay allowed)' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  setLanguageSilent: (lang: Language) => void;
  t: (key: keyof typeof translations) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'id',
  setLanguage: () => {},
  setLanguageSilent: () => {},
  t: (key) => translations[key]?.id || String(key),
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('stbtoefl_lang');
      if (saved === 'en' || saved === 'id') return saved;
    } catch (e) {}
    return 'id';
  });

  const setLanguage = React.useCallback((lang: Language) => {
    setLanguageState(prev => {
      if (prev === lang) return prev;
      try {
        localStorage.setItem('stbtoefl_lang', lang);
        // Sinkronkan ke backend secara asinkron HANYA saat ada perubahan nyata
        api.post('/system/settings', { language: lang }).catch(() => {});
      } catch (e) {}
      return lang;
    });
  }, []);

  const setLanguageSilent = React.useCallback((lang: Language) => {
    setLanguageState(prev => {
      if (prev === lang) return prev;
      try {
        localStorage.setItem('stbtoefl_lang', lang);
      } catch (e) {}
      return lang;
    });
  }, []);

  // Sinkronkan bahasa secara otomatis dari konfigurasi server pusat
  useEffect(() => {
    api.get('/system/public-config').then(res => {
      if (res.data?.language && (res.data.language === 'id' || res.data.language === 'en')) {
        setLanguageSilent(res.data.language);
      }
    }).catch(() => {});
  }, [setLanguageSilent]);

  const t = React.useCallback((key: keyof typeof translations): string => {
    const entry = translations[key];
    if (!entry) return String(key);
    return entry[language] || entry.id || String(key);
  }, [language]);

  const value = React.useMemo(() => ({ language, setLanguage, setLanguageSilent, t }), [language, setLanguage, setLanguageSilent, t]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

