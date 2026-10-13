import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Server, Shield, Volume2, Globe, FileText, ToggleLeft, ToggleRight, Settings,
  Check, Copy, RefreshCw, Activity, Cpu, HardDrive, Wifi, Save, CheckCircle2,
  AlertCircle, ExternalLink, Radio, Laptop, Eye, EyeOff, Download, Users,
  UserX, ShieldCheck, KeyRound, Lock, Unlock, X, Headphones, Music, PlayCircle,
  RotateCcw, Sliders, Palette, Type, LayoutGrid, Sun, Moon, Coffee, Languages, Sparkles
} from 'lucide-react';
import { SidebarProctor } from '../../components/common/SidebarProctor';
import { ProctorHeader } from '../../components/proctor/ProctorHeader';
import api from '../../services/api';
import { useLanguage } from '../../services/languageContext';

interface NetworkInterface {
  name: string;
  address: string;
  netmask: string;
  mac: string;
  internal: boolean;
  type: 'wifi' | 'ethernet' | 'loopback';
}

interface SystemInfo {
  hostname: string;
  platform: string;
  release: string;
  nodeVersion: string;
  uptimeSeconds: number;
  totalMemoryMB: number;
  freeMemoryMB: number;
  cpuModel: string;
}

interface ActiveStudentSession {
  nomorInduk: string;
  ip: string;
  userAgent?: string;
  loginTime: number;
  lastSeen: number;
}

export const SettingsProctor: React.FC = () => {
  const navigate = useNavigate();
  const { language, setLanguage, setLanguageSilent, t } = useLanguage();
  const [activeTab, setActiveTab] = useState('server');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Network & Server State
  const [serverIp, setServerIp] = useState('127.0.0.1');
  const [serverPort, setServerPort] = useState<number | string>(5001);
  const [networkInterfaces, setNetworkInterfaces] = useState<NetworkInterface[]>([]);
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);

  // Toggle, Audio & Security Settings
  const [toggles, setToggles] = useState({
    sebEnabled: false,
    autoScore: false,
    blockMultiLogin: true,
    offlineMode: localStorage.getItem('stbtoefl_offline_mode') === 'true',
    audioAutoPlay: true,
    strictOnePlay: true,
    requireAudioCheck: true,
    preloadAllAudio: true,
  });
  const [sebQuitPassword, setSebQuitPassword] = useState('qwe1234');
  const [showQuitPassword, setShowQuitPassword] = useState(false);
  const [copiedPassword, setCopiedPassword] = useState(false);

  // UI & Language State
  const [examFontSize, setExamFontSize] = useState<'normal' | 'medium' | 'large'>(() => {
    return (localStorage.getItem('stbtoefl_font_size') as any) || 'normal';
  });
  const [examTheme, setExamTheme] = useState<'light' | 'warm' | 'dark'>(() => {
    return (localStorage.getItem('stbtoefl_theme') as any) || 'light';
  });
  const [showQuestionGrid, setShowQuestionGrid] = useState(true);
  const [compactView, setCompactView] = useState(false);

  // Active Sessions Monitoring
  const [activeSessions, setActiveSessions] = useState<ActiveStudentSession[]>([]);
  const [showSessionsModal, setShowSessionsModal] = useState(false);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [resettingNim, setResettingNim] = useState<string | null>(null);

  // Ping & Copy feedback
  const [isPinging, setIsPinging] = useState(false);
  const [pingLatency, setPingLatency] = useState<number | null>(null);
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Load Settings from Server
  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await api.get('/system/settings');
      const { settings, networkInterfaces, systemInfo: sysInfo, recommendedIp } = res.data;

      if (settings) {
        setServerIp(settings.serverIp || recommendedIp || '127.0.0.1');
        setServerPort(settings.serverPort || 5001);
        setToggles(prev => ({
          ...prev,
          offlineMode: Boolean(settings.offlineMode),
          sebEnabled: Boolean(settings.sebEnabled),
          blockMultiLogin: settings.blockMultiLogin !== undefined ? Boolean(settings.blockMultiLogin) : true,
          audioAutoPlay: settings.audioAutoPlay !== undefined ? Boolean(settings.audioAutoPlay) : true,
          strictOnePlay: settings.strictOnePlay !== undefined ? Boolean(settings.strictOnePlay) : true,
          requireAudioCheck: settings.requireAudioCheck !== undefined ? Boolean(settings.requireAudioCheck) : true,
          preloadAllAudio: settings.preloadAllAudio !== undefined ? Boolean(settings.preloadAllAudio) : true,
        }));
        if (settings.sebQuitPassword) {
          setSebQuitPassword(settings.sebQuitPassword);
        }
        // Hanya update state lokal jika berbeda, JANGAN trigger POST balik ke server
        if (settings.language && (settings.language === 'id' || settings.language === 'en') && settings.language !== language) {
          setLanguageSilent(settings.language as 'id' | 'en');
        }
        if (settings.examFontSize) setExamFontSize(settings.examFontSize as 'normal' | 'medium' | 'large');
        if (settings.examTheme) setExamTheme(settings.examTheme as 'light' | 'warm' | 'dark');
        if (settings.showQuestionGrid !== undefined) setShowQuestionGrid(Boolean(settings.showQuestionGrid));
        if (settings.compactView !== undefined) setCompactView(Boolean(settings.compactView));
      }

      if (networkInterfaces) {
        setNetworkInterfaces(networkInterfaces);
      }
      if (sysInfo) {
        setSystemInfo(sysInfo);
      }
    } catch (err: any) {
      console.warn('[SETTINGS LOAD ERROR]', err);
      try {
        const pubRes = await api.get('/system/public-config');
        if (pubRes.data) {
          setServerIp(pubRes.data.serverIp || '127.0.0.1');
          setServerPort(pubRes.data.serverPort || 5001);
          setToggles(prev => ({
            ...prev,
            offlineMode: Boolean(pubRes.data.offlineMode),
            sebEnabled: Boolean(pubRes.data.sebEnabled),
            audioAutoPlay: pubRes.data.audioAutoPlay !== undefined ? Boolean(pubRes.data.audioAutoPlay) : true,
            strictOnePlay: pubRes.data.strictOnePlay !== undefined ? Boolean(pubRes.data.strictOnePlay) : true,
            requireAudioCheck: pubRes.data.requireAudioCheck !== undefined ? Boolean(pubRes.data.requireAudioCheck) : true,
            preloadAllAudio: pubRes.data.preloadAllAudio !== undefined ? Boolean(pubRes.data.preloadAllAudio) : true,
          }));
        }
      } catch (e) {
        // Fallback catch
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchActiveSessions = async () => {
    try {
      setLoadingSessions(true);
      const res = await api.get('/system/active-sessions');
      if (Array.isArray(res.data)) {
        setActiveSessions(res.data);
      }
    } catch (err) {
      console.error('[FETCH ACTIVE SESSIONS ERROR]', err);
    } finally {
      setLoadingSessions(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const toggleSwitch = (key: keyof typeof toggles) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Save Settings to Backend
  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      setSaveStatus(null);

      const payload = {
        serverIp: serverIp.trim(),
        serverPort: parseInt(String(serverPort), 10) || 5001,
        offlineMode: toggles.offlineMode,
        sebEnabled: toggles.sebEnabled,
        blockMultiLogin: toggles.blockMultiLogin,
        sebQuitPassword: sebQuitPassword.trim(),
        audioAutoPlay: toggles.audioAutoPlay,
        strictOnePlay: toggles.strictOnePlay,
        requireAudioCheck: toggles.requireAudioCheck,
        preloadAllAudio: toggles.preloadAllAudio,
        language,
        examFontSize,
        examTheme,
        showQuestionGrid,
        compactView,
      };

      const res = await api.post('/system/settings', payload);

      if (res.data?.success) {
        localStorage.setItem('stbtoefl_offline_mode', String(toggles.offlineMode));
        localStorage.setItem('stbtoefl_lang', language);
        localStorage.setItem('stbtoefl_font_size', examFontSize);
        localStorage.setItem('stbtoefl_theme', examTheme);
        setSaveStatus({
          type: 'success',
          message: t('saveSuccessToast')
        });
      } else {
        setSaveStatus({
          type: 'success',
          message: t('saveSuccessToast')
        });
      }

      setTimeout(() => setSaveStatus(null), 4000);
    } catch (err: any) {
      console.error('[SAVE SETTINGS ERROR]', err);
      setSaveStatus({
        type: 'error',
        message: err.response?.data?.message || t('saveErrorToast')
      });
    } finally {
      setSaving(false);
    }
  };

  // Instant Theme Switcher & Auto-Sync
  const handleThemeChange = async (newTheme: 'light' | 'warm' | 'dark') => {
    setExamTheme(newTheme);
    localStorage.setItem('stbtoefl_theme', newTheme);
    try {
      await api.post('/system/settings', {
        serverIp: serverIp.trim(),
        serverPort: parseInt(String(serverPort), 10) || 5001,
        offlineMode: toggles.offlineMode,
        sebEnabled: toggles.sebEnabled,
        blockMultiLogin: toggles.blockMultiLogin,
        sebQuitPassword: sebQuitPassword.trim(),
        audioAutoPlay: toggles.audioAutoPlay,
        strictOnePlay: toggles.strictOnePlay,
        requireAudioCheck: toggles.requireAudioCheck,
        preloadAllAudio: toggles.preloadAllAudio,
        language,
        examFontSize,
        examTheme: newTheme,
        showQuestionGrid,
        compactView,
      });
      setSaveStatus({
        type: 'success',
        message: newTheme === 'warm' 
          ? 'Tema Lembut Mata (Sepia) aktif! Latar hangat diterapkan pada layar ujian.'
          : newTheme === 'dark' 
          ? 'Tema Redup Malam (Dark) aktif! Latar gelap anti-silau diterapkan.'
          : 'Tema Terang Bersih (Light) aktif! Standar ruang lab diterapkan.'
      });
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (e) {
      console.warn('[THEME SAVE ERROR]', e);
    }
  };

  // Reset Student Session
  const handleResetSession = async (nim: string) => {
    try {
      setResettingNim(nim);
      await api.post('/system/reset-session', { nomorInduk: nim });
      await fetchActiveSessions();
      setSaveStatus({
        type: 'success',
        message: `Sesi login mahasiswa dengan NIM ${nim} berhasil di-reset.`
      });
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err: any) {
      setSaveStatus({
        type: 'error',
        message: 'Gagal melakukan reset sesi mahasiswa.'
      });
    } finally {
      setResettingNim(null);
    }
  };

  // Download Safe Exam Browser (.seb) config file
  const handleDownloadSebConfig = async () => {
    try {
      const res = await api.get('/system/download-seb-config', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/seb' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `stbtoefl_lab_${serverIp.replace(/\./g, '_')}.seb`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('[SEB DOWNLOAD ERROR]', err);
      setSaveStatus({
        type: 'error',
        message: 'Gagal mengunduh berkas konfigurasi SEB.'
      });
    }
  };

  // Test Server Latency (Ping)
  const handlePingTest = async () => {
    try {
      setIsPinging(true);
      const start = performance.now();
      await api.get('/system/ping');
      const end = performance.now();
      setPingLatency(Math.round(end - start));
    } catch (err) {
      setPingLatency(-1);
    } finally {
      setIsPinging(false);
    }
  };

  // Copy Exam Access URL (Gunakan port client frontend tempat peserta ujian membuka login)
  const clientPort = window.location.port || '5173';
  const examUrl = `http://${serverIp || 'localhost'}:${clientPort}`;
  const handleCopyUrl = () => {
    navigator.clipboard.writeText(examUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2500);
  };

  // Copy Quit Password
  const handleCopyPassword = () => {
    navigator.clipboard.writeText(sebQuitPassword);
    setCopiedPassword(true);
    setTimeout(() => setCopiedPassword(false), 2500);
  };

  const tabs = [
    { id: 'server', icon: Server, label: t('tabServer') },
    { id: 'security', icon: Shield, label: t('tabSecurity') },
    { id: 'audio', icon: Volume2, label: t('tabAudio') },
    { id: 'ui', icon: Globe, label: t('tabUi') },
  ];

  return (
    <div className="h-screen overflow-hidden bg-[url('/bg-proctor.jpg')] bg-cover bg-center p-4 md:p-6 font-sans text-slate-800 flex gap-6 box-border selection:bg-teal-500/20 relative">
      <SidebarProctor activePath="/proctor/settings" />

      <div className="flex-1 flex flex-col gap-6 max-w-[1400px] mx-auto w-full overflow-hidden relative z-10">
        <ProctorHeader />

        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15 }}
          className="flex-1 flex gap-8 overflow-hidden pb-6"
        >
          {/* Left Panel: Tabs */}
          <div className="w-64 shrink-0 flex flex-col gap-2">
            <h2 className="text-3xl font-bold tracking-tight mb-6 px-4">{t('navSettings')}</h2>
            
            {tabs.map((tab) => (
              <button 
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSaveStatus(null);
                }}
                className={`flex items-center gap-4 px-6 py-4 rounded-[1.5rem] font-bold text-sm transition-all duration-300 ${activeTab === tab.id ? 'bg-white/50 backdrop-blur-md text-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50' : 'text-slate-500 hover:text-slate-800 hover:bg-white/60 border border-transparent'}`}
              >
                <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-emerald-500' : ''}`} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Right Panel: Content */}
          <div className="flex-1 bg-white/60 rounded-[2.5rem] border border-white/40 shadow-inner flex flex-col overflow-hidden relative">
            
            {/* Scrollable container */}
            <div className="flex-1 overflow-y-auto p-8 md:p-10 [&::-webkit-scrollbar]:hidden pb-20">
              <div className="w-full max-w-4xl mx-auto">
                
                {/* Feedback Notification Toast */}
                <AnimatePresence>
                  {saveStatus && (
                    <motion.div
                      initial={{ opacity: 0, y: -15, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.98 }}
                      className={`mb-6 p-4 rounded-2xl flex items-center gap-3 backdrop-blur-md border ${
                        saveStatus.type === 'success'
                          ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-900'
                          : 'bg-rose-500/15 border-rose-500/30 text-rose-900'
                      }`}
                    >
                      {saveStatus.type === 'success' ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                      )}
                      <p className="text-sm font-semibold">{saveStatus.message}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* TAB 1: SISTEM & JARINGAN */}
                {activeTab === 'server' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                      <div>
                        <h3 className="text-2xl font-bold text-slate-800">{t('serverTitle')}</h3>
                        <p className="text-sm text-slate-500 mt-1">{t('serverDesc')}</p>
                      </div>
                      <button
                        onClick={fetchSettings}
                        disabled={loading}
                        className="self-start sm:self-auto flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/50 border border-white/60 hover:bg-white text-slate-700 transition-all shadow-sm cursor-pointer"
                        title="Segarkan deteksi adapter jaringan"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                        {t('redetectNetwork')}
                      </button>
                    </div>

                    <div className="space-y-6">
                      
                      {/* Alamat IP LAN Card */}
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                            <Wifi className="w-4 h-4 text-emerald-600" />
                            {t('lanIpLabel')}
                          </label>
                          <span className="text-xs text-slate-500 font-medium">{t('lanIpSub')}</span>
                        </div>
                        
                        <input 
                          type="text" 
                          value={serverIp}
                          onChange={(e) => setServerIp(e.target.value)}
                          placeholder="e.g. 192.168.1.100"
                          className="bg-white/70 border border-white/60 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:bg-white backdrop-blur-md transition-all font-mono text-base shadow-sm font-semibold" 
                        />

                        {/* Network Interface Chips */}
                        {networkInterfaces.length > 0 && (
                          <div className="mt-1 flex flex-wrap items-center gap-2">
                            <span className="text-xs text-slate-500 font-medium">{t('autoInterfaceLabel')}</span>
                            {networkInterfaces.map((iface, idx) => (
                              <button
                                key={`${iface.name}-${idx}`}
                                type="button"
                                onClick={() => setServerIp(iface.address)}
                                className={`text-xs px-2.5 py-1 rounded-lg border font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
                                  serverIp === iface.address
                                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-800 font-bold'
                                    : 'bg-white/40 border-white/60 text-slate-600 hover:bg-white hover:text-slate-800'
                                }`}
                              >
                                {iface.type === 'wifi' ? <Wifi className="w-3 h-3 text-emerald-600" /> : <Radio className="w-3 h-3 text-slate-500" />}
                                <span>{iface.name}:</span>
                                <span>{iface.address}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Port Server Node.js */}
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                            <Server className="w-4 h-4 text-emerald-600" />
                            {t('serverPortLabel')}
                          </label>
                          <span className="text-xs text-slate-500 font-medium">{t('serverPortSub')}</span>
                        </div>
                        <input 
                          type="number" 
                          value={serverPort}
                          onChange={(e) => setServerPort(e.target.value)}
                          placeholder="5001"
                          className="bg-white/70 border border-white/60 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:bg-white backdrop-blur-md transition-all font-mono text-base shadow-sm font-semibold" 
                        />
                      </div>

                      {/* Live CBT Exam URL Banner */}
                      <div className="p-5 rounded-2xl bg-white/70 border border-white/60 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3.5">
                          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 shrink-0">
                            <Laptop className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-xs uppercase tracking-wider font-bold text-slate-500">{t('examUrlLabel')}</p>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 border border-emerald-500/30">
                                Port Web: {clientPort}
                              </span>
                            </div>
                            <p className="text-base font-mono font-bold text-slate-800 tracking-tight select-all">{examUrl}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={handleCopyUrl}
                            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
                          >
                            {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            {copiedUrl ? t('copied') : t('copyUrl')}
                          </button>

                          <a
                            href={examUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-500/10 border border-teal-500/30 hover:bg-teal-500/20 text-teal-800 text-xs font-bold transition-all active:scale-95"
                          >
                            <ExternalLink className="w-3.5 h-3.5 text-teal-600" />
                            Buka Portal
                          </a>

                          <button
                            type="button"
                            onClick={handlePingTest}
                            disabled={isPinging}
                            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 hover:bg-emerald-500/25 text-emerald-800 text-xs font-bold transition-all active:scale-95 cursor-pointer"
                          >
                            <Activity className={`w-3.5 h-3.5 text-emerald-600 ${isPinging ? 'animate-pulse' : ''}`} />
                            {isPinging ? t('pinging') : pingLatency !== null ? `${pingLatency} ms` : t('pingTest')}
                          </button>
                        </div>
                      </div>

                      {/* Mode Offline Tersendiri Toggle */}
                      <div className="flex items-center justify-between p-5 bg-white/60 border border-white/50 rounded-2xl transition-all hover:bg-white/70">
                        <div className="pr-4">
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-slate-800">{t('offlineModeTitle')}</p>
                            <span className={`text-[10px] uppercase font-black px-2 py-0.5 rounded-full ${
                              toggles.offlineMode 
                                ? 'bg-emerald-500/20 text-emerald-700 border border-emerald-500/30' 
                                : 'bg-slate-200/60 text-slate-500'
                            }`}>
                              {toggles.offlineMode ? t('statusActive') : t('statusInactive')}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1 max-w-xl">
                            {t('offlineModeDesc')}
                          </p>
                        </div>
                        <button 
                          type="button"
                          onClick={() => toggleSwitch('offlineMode')} 
                          className="shrink-0 transition-transform active:scale-95 focus:outline-none cursor-pointer"
                          title="Klik untuk mengaktifkan/menonaktifkan mode offline"
                        >
                          {toggles.offlineMode ? (
                            <ToggleRight className="w-12 h-12 text-emerald-500 transition-colors" />
                          ) : (
                            <ToggleLeft className="w-12 h-12 text-slate-400 hover:text-slate-500 transition-colors" />
                          )}
                        </button>
                      </div>

                      {/* Server Hardware Metrics Card */}
                      {systemInfo && (
                        <div className="p-5 rounded-2xl bg-white/40 border border-white/40 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                          <div>
                            <span className="text-slate-400 block font-medium">{t('hostName')}</span>
                            <span className="font-mono font-bold text-slate-700 truncate block">{systemInfo.hostname}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block font-medium">{t('nodeRuntime')}</span>
                            <span className="font-mono font-bold text-slate-700">{systemInfo.nodeVersion}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block font-medium">{t('availableRam')}</span>
                            <span className="font-bold text-slate-700">{systemInfo.freeMemoryMB} / {systemInfo.totalMemoryMB} MB</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block font-medium">{t('serverUptime')}</span>
                            <span className="font-bold text-slate-700">{Math.floor(systemInfo.uptimeSeconds / 60)} {t('minutes')}</span>
                          </div>
                        </div>
                      )}

                      {/* Simpan Pengaturan Button */}
                      <div className="pt-4 flex justify-end">
                        <button
                          type="button"
                          onClick={handleSaveSettings}
                          disabled={saving}
                          className="flex items-center gap-2 px-8 py-3.5 rounded-2xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-[0_8px_20px_rgb(16,185,129,0.25)] transition-all duration-200 active:scale-98 disabled:opacity-60 cursor-pointer"
                        >
                          {saving ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin" />
                              <span>{t('savingSettings')}</span>
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4" />
                              <span>{t('saveNetworkBtn')}</span>
                            </>
                          )}
                        </button>
                      </div>

                    </div>
                  </motion.div>
                )}

                {/* TAB 2: KEAMANAN (SEB) */}
                {activeTab === 'security' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                      <div>
                        <h3 className="text-2xl font-bold text-slate-800">{t('securityTitle')}</h3>
                        <p className="text-sm text-slate-500 mt-1">{t('securityDesc')}</p>
                      </div>
                      
                      {/* Tombol Pantau Sesi Aktif */}
                      <button
                        type="button"
                        onClick={() => {
                          fetchActiveSessions();
                          setShowSessionsModal(true);
                        }}
                        className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-white/70 border border-white/60 hover:bg-white text-slate-800 transition-all shadow-sm cursor-pointer active:scale-95"
                      >
                        <Users className="w-4 h-4 text-emerald-600" />
                        {t('monitorSessionsBtn')}
                      </button>
                    </div>
                    
                    <div className="space-y-6">
                      
                      {/* 1. WAJIBKAN SEB CARD */}
                      <div className="p-5 bg-white/60 border border-white/50 rounded-2xl transition-all hover:bg-white/70">
                        <div className="flex items-center justify-between">
                          <div className="pr-4">
                            <div className="flex items-center gap-2">
                              <ShieldCheck className="w-5 h-5 text-emerald-600" />
                              <p className="font-bold text-slate-800">{t('sebTitle')}</p>
                              <span className={`text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full ${
                                toggles.sebEnabled 
                                  ? 'bg-rose-500/20 text-rose-700 border border-rose-500/30' 
                                  : 'bg-emerald-500/15 text-emerald-700 border border-emerald-500/30'
                              }`}>
                                {toggles.sebEnabled ? t('sebStrictBadge') : t('sebFlexibleBadge')}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-1 max-w-xl">
                              {t('sebDesc')}
                            </p>
                          </div>
                          
                          <button 
                            type="button"
                            onClick={() => toggleSwitch('sebEnabled')} 
                            className="shrink-0 transition-transform active:scale-95 focus:outline-none cursor-pointer"
                            title="Klik untuk mengaktifkan/menonaktifkan kewajiban SEB"
                          >
                            {toggles.sebEnabled ? (
                              <ToggleRight className="w-12 h-12 text-emerald-500 transition-colors" />
                            ) : (
                              <ToggleLeft className="w-12 h-12 text-slate-400 hover:text-slate-500 transition-colors" />
                            )}
                          </button>
                        </div>

                        {/* Indikator Peringatan Saat SEB Aktif */}
                        {toggles.sebEnabled && (
                          <div className="mt-3.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center gap-2.5 text-xs text-amber-900">
                            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                            <span>
                              {t('sebWarning')}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* 2. BLOKIR MULTI-LOGIN CARD */}
                      <div className="p-5 bg-white/60 border border-white/50 rounded-2xl transition-all hover:bg-white/70">
                        <div className="flex items-center justify-between">
                          <div className="pr-4">
                            <div className="flex items-center gap-2">
                              <Lock className="w-5 h-5 text-emerald-600" />
                              <p className="font-bold text-slate-800">{t('multiLoginTitle')}</p>
                              <span className={`text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full ${
                                toggles.blockMultiLogin 
                                  ? 'bg-emerald-500/20 text-emerald-700 border border-emerald-500/30' 
                                  : 'bg-slate-200 text-slate-600'
                              }`}>
                                {toggles.blockMultiLogin ? t('multiLoginActiveBadge') : t('multiLoginDisabledBadge')}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-1 max-w-xl">
                              {t('multiLoginDesc')}
                            </p>
                          </div>
                          
                          <button 
                            type="button"
                            onClick={() => toggleSwitch('blockMultiLogin')} 
                            className="shrink-0 transition-transform active:scale-95 focus:outline-none cursor-pointer"
                            title="Klik untuk mengaktifkan/menonaktifkan blokir multi-login"
                          >
                            {toggles.blockMultiLogin ? (
                              <ToggleRight className="w-12 h-12 text-emerald-500 transition-colors" />
                            ) : (
                              <ToggleLeft className="w-12 h-12 text-slate-400 hover:text-slate-500 transition-colors" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* 3. KUNCI KELUAR SEB (QUIT PASSWORD) & UNDUH SEB */}
                      <div className="p-6 bg-white/60 border border-white/50 rounded-2xl space-y-4">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center justify-between">
                            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                              <KeyRound className="w-4 h-4 text-emerald-600" />
                              {t('quitPasswordTitle')}
                            </label>
                            <span className="text-xs text-slate-500 font-medium">{t('quitPasswordSub')}</span>
                          </div>

                          <div className="relative flex items-center">
                            <input 
                              type={showQuitPassword ? 'text' : 'password'}
                              value={sebQuitPassword}
                              onChange={(e) => setSebQuitPassword(e.target.value)}
                              placeholder={t('quitPasswordPlaceholder')}
                              className="w-full bg-white/80 border border-white/60 rounded-xl px-4 py-3.5 pr-28 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:bg-white backdrop-blur-md transition-all font-mono font-bold tracking-wider text-base shadow-sm" 
                            />
                            
                            <div className="absolute right-2 flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => setShowQuitPassword(!showQuitPassword)}
                                className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100/80 transition-all cursor-pointer"
                                title={showQuitPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                              >
                                {showQuitPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>

                              <button
                                type="button"
                                onClick={handleCopyPassword}
                                className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100/80 transition-all cursor-pointer"
                                title="Salin password ke clipboard"
                              >
                                {copiedPassword ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                              </button>
                            </div>
                          </div>

                          <p className="text-xs text-slate-500 leading-relaxed">
                            {t('quitPasswordHint')}
                          </p>
                        </div>

                        {/* Download SEB Configuration File Button */}
                        <div className="pt-2 border-t border-slate-200/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <p className="text-xs font-bold text-slate-700">{t('sebConfigFileTitle')}</p>
                            <p className="text-[11px] text-slate-500">{t('sebConfigFileDesc')}</p>
                          </div>

                          <button
                            type="button"
                            onClick={handleDownloadSebConfig}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 hover:bg-emerald-500/25 transition-all shadow-sm active:scale-95 cursor-pointer shrink-0"
                          >
                            <Download className="w-4 h-4 text-emerald-600" />
                            {t('downloadSebBtn')}
                          </button>
                        </div>
                      </div>

                      {/* Simpan Pengaturan Keamanan Button */}
                      <div className="pt-4 flex justify-end">
                        <button
                          type="button"
                          onClick={handleSaveSettings}
                          disabled={saving}
                          className="flex items-center gap-2 px-8 py-3.5 rounded-2xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-[0_8px_20px_rgb(16,185,129,0.25)] transition-all duration-200 active:scale-98 disabled:opacity-60 cursor-pointer"
                        >
                          {saving ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin" />
                              <span>{t('savingSettings')}</span>
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4" />
                              <span>{t('saveSecurityBtn')}</span>
                            </>
                          )}
                        </button>
                      </div>

                    </div>
                  </motion.div>
                )}

                {/* TAB 3: MEDIA & AUDIO */}
                {activeTab === 'audio' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                      <div>
                        <h3 className="text-2xl font-bold text-slate-800">{t('audioTitle')}</h3>
                        <p className="text-sm text-slate-500 mt-1">{t('audioDesc')}</p>
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => navigate('/proctor/audio')}
                        className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-white/70 border border-white/60 hover:bg-white text-slate-800 transition-all shadow-sm cursor-pointer active:scale-95"
                      >
                        <Music className="w-4 h-4 text-emerald-600" />
                        {t('openAudioBankBtn')}
                      </button>
                    </div>

                    <div className="space-y-6">

                      {/* 1. AUTO PLAY AUDIO */}
                      <div className="p-5 bg-white/60 border border-white/50 rounded-2xl transition-all hover:bg-white/70">
                        <div className="flex items-center justify-between">
                          <div className="pr-4">
                            <div className="flex items-center gap-2">
                              <PlayCircle className="w-5 h-5 text-emerald-600" />
                              <p className="font-bold text-slate-800">{t('autoPlayTitle')}</p>
                              <span className={`text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full ${
                                toggles.audioAutoPlay 
                                  ? 'bg-emerald-500/20 text-emerald-700 border border-emerald-500/30' 
                                  : 'bg-slate-200 text-slate-600'
                              }`}>
                                {toggles.audioAutoPlay ? t('autoPlayActiveBadge') : t('autoPlayManualBadge')}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-1 max-w-xl">
                              {t('autoPlayDesc')}
                            </p>
                          </div>
                          
                          <button 
                            type="button"
                            onClick={() => toggleSwitch('audioAutoPlay')} 
                            className="shrink-0 transition-transform active:scale-95 focus:outline-none cursor-pointer"
                            title="Klik untuk mengaktifkan/menonaktifkan auto-play"
                          >
                            {toggles.audioAutoPlay ? (
                              <ToggleRight className="w-12 h-12 text-emerald-500 transition-colors" />
                            ) : (
                              <ToggleLeft className="w-12 h-12 text-slate-400 hover:text-slate-500 transition-colors" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* 2. STRICT 1X PLAY */}
                      <div className="p-5 bg-white/60 border border-white/50 rounded-2xl transition-all hover:bg-white/70">
                        <div className="flex items-center justify-between">
                          <div className="pr-4">
                            <div className="flex items-center gap-2">
                              <RotateCcw className="w-5 h-5 text-emerald-600" />
                              <p className="font-bold text-slate-800">{t('strictOnePlayTitle')}</p>
                              <span className={`text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full ${
                                toggles.strictOnePlay 
                                  ? 'bg-emerald-500/20 text-emerald-700 border border-emerald-500/30' 
                                  : 'bg-amber-500/20 text-amber-700 border border-amber-500/30'
                              }`}>
                                {toggles.strictOnePlay ? t('strictOnePlayStrictBadge') : t('strictOnePlaySimBadge')}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-1 max-w-xl">
                              {t('strictOnePlayDesc')}
                            </p>
                          </div>
                          
                          <button 
                            type="button"
                            onClick={() => toggleSwitch('strictOnePlay')} 
                            className="shrink-0 transition-transform active:scale-95 focus:outline-none cursor-pointer"
                            title="Klik untuk mengaktifkan/menonaktifkan batas pemutaran 1x"
                          >
                            {toggles.strictOnePlay ? (
                              <ToggleRight className="w-12 h-12 text-emerald-500 transition-colors" />
                            ) : (
                              <ToggleLeft className="w-12 h-12 text-slate-400 hover:text-slate-500 transition-colors" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* 3. WAJIBKAN AUDIO CHECK HEADSET */}
                      <div className="p-5 bg-white/60 border border-white/50 rounded-2xl transition-all hover:bg-white/70">
                        <div className="flex items-center justify-between">
                          <div className="pr-4">
                            <div className="flex items-center gap-2">
                              <Headphones className="w-5 h-5 text-emerald-600" />
                              <p className="font-bold text-slate-800">{t('requireAudioCheckTitle')}</p>
                              <span className={`text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full ${
                                toggles.requireAudioCheck 
                                  ? 'bg-emerald-500/20 text-emerald-700 border border-emerald-500/30' 
                                  : 'bg-slate-200 text-slate-600'
                              }`}>
                                {toggles.requireAudioCheck ? t('requireAudioCheckActiveBadge') : t('requireAudioCheckBypassBadge')}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-1 max-w-xl">
                              {t('requireAudioCheckDesc')}
                            </p>
                          </div>
                          
                          <button 
                            type="button"
                            onClick={() => toggleSwitch('requireAudioCheck')} 
                            className="shrink-0 transition-transform active:scale-95 focus:outline-none cursor-pointer"
                            title="Klik untuk mengaktifkan/menonaktifkan audio check wajib"
                          >
                            {toggles.requireAudioCheck ? (
                              <ToggleRight className="w-12 h-12 text-emerald-500 transition-colors" />
                            ) : (
                              <ToggleLeft className="w-12 h-12 text-slate-400 hover:text-slate-500 transition-colors" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* 4. PRELOAD ALL AUDIO CACHE */}
                      <div className="p-5 bg-white/60 border border-white/50 rounded-2xl transition-all hover:bg-white/70">
                        <div className="flex items-center justify-between">
                          <div className="pr-4">
                            <div className="flex items-center gap-2">
                              <Sliders className="w-5 h-5 text-emerald-600" />
                              <p className="font-bold text-slate-800">{t('preloadAudioTitle')}</p>
                              <span className={`text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full ${
                                toggles.preloadAllAudio 
                                  ? 'bg-emerald-500/20 text-emerald-700 border border-emerald-500/30' 
                                  : 'bg-slate-200 text-slate-600'
                              }`}>
                                {toggles.preloadAllAudio ? t('preloadAudioActiveBadge') : t('preloadAudioStreamBadge')}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-1 max-w-xl">
                              {t('preloadAudioDesc')}
                            </p>
                          </div>
                          
                          <button 
                            type="button"
                            onClick={() => toggleSwitch('preloadAllAudio')} 
                            className="shrink-0 transition-transform active:scale-95 focus:outline-none cursor-pointer"
                            title="Klik untuk mengaktifkan/menonaktifkan preload audio"
                          >
                            {toggles.preloadAllAudio ? (
                              <ToggleRight className="w-12 h-12 text-emerald-500 transition-colors" />
                            ) : (
                              <ToggleLeft className="w-12 h-12 text-slate-400 hover:text-slate-500 transition-colors" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* BANNER KE KELOLA AUDIO */}
                      <div className="p-5 rounded-2xl bg-white/70 border border-white/60 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3.5">
                          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 shrink-0">
                            <Volume2 className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-wider font-bold text-slate-500">{t('audioCatalogBannerTitle')}</p>
                            <p className="text-sm font-bold text-slate-800">{t('audioCatalogBannerSub')}</p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => navigate('/proctor/audio')}
                          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 transition-all shadow-sm active:scale-95 cursor-pointer shrink-0"
                        >
                          <span>{t('manageAudioFilesBtn')}</span>
                          <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                        </button>
                      </div>

                      {/* Simpan Pengaturan Audio Button */}
                      <div className="pt-4 flex justify-end">
                        <button
                          type="button"
                          onClick={handleSaveSettings}
                          disabled={saving}
                          className="flex items-center gap-2 px-8 py-3.5 rounded-2xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-[0_8px_20px_rgb(16,185,129,0.25)] transition-all duration-200 active:scale-98 disabled:opacity-60 cursor-pointer"
                        >
                          {saving ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin" />
                              <span>{t('savingSettings')}</span>
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4" />
                              <span>{t('saveAudioBtn')}</span>
                            </>
                          )}
                        </button>
                      </div>

                    </div>
                  </motion.div>
                )}

                {/* TAB 4: TAMPILAN & BAHASA */}
                {activeTab === 'ui' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }}>
                    <div className="mb-8">
                      <h3 className="text-2xl font-bold text-slate-800">{t('uiTitle')}</h3>
                      <p className="text-sm text-slate-500 mt-1">{t('uiDesc')}</p>
                    </div>

                    <div className="space-y-6">

                      {/* 1. BAHASA SISTEM */}
                      <div className="p-6 bg-white/60 border border-white/50 rounded-2xl space-y-4">
                        <div className="flex items-center gap-2">
                          <Languages className="w-5 h-5 text-emerald-600" />
                          <h4 className="font-bold text-slate-800">{t('langSectionTitle')}</h4>
                        </div>
                        <p className="text-xs text-slate-500">{t('langSectionDesc')}</p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                          {/* Bahasa Indonesia */}
                          <button
                            type="button"
                            onClick={() => setLanguage('id')}
                            className={`p-4 rounded-xl border text-left transition-all flex items-start justify-between cursor-pointer ${
                              language === 'id'
                                ? 'bg-emerald-500/15 border-emerald-500/40 shadow-sm'
                                : 'bg-white/40 border-white/60 hover:bg-white hover:border-slate-200'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">🇮🇩</span>
                              <div>
                                <p className="font-bold text-slate-800 text-sm">{t('langIdTitle')}</p>
                                <p className="text-xs text-slate-500 mt-0.5">{t('langIdDesc')}</p>
                              </div>
                            </div>
                            {language === 'id' && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
                          </button>

                          {/* English */}
                          <button
                            type="button"
                            onClick={() => setLanguage('en')}
                            className={`p-4 rounded-xl border text-left transition-all flex items-start justify-between cursor-pointer ${
                              language === 'en'
                                ? 'bg-emerald-500/15 border-emerald-500/40 shadow-sm'
                                : 'bg-white/40 border-white/60 hover:bg-white hover:border-slate-200'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">🇬🇧</span>
                              <div>
                                <p className="font-bold text-slate-800 text-sm">{t('langEnTitle')}</p>
                                <p className="text-xs text-slate-500 mt-0.5">{t('langEnDesc')}</p>
                              </div>
                            </div>
                            {language === 'en' && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
                          </button>
                        </div>
                      </div>

                      {/* 2. SKALA UKURAN HURUF SOAL & WACANA */}
                      <div className="p-6 bg-white/60 border border-white/50 rounded-2xl space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Type className="w-5 h-5 text-emerald-600" />
                            <h4 className="font-bold text-slate-800">{t('fontSizeSectionTitle')}</h4>
                          </div>
                          <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-500/15 px-2.5 py-0.5 rounded-lg">
                            {examFontSize === 'normal' ? t('fontNormalTitle') : examFontSize === 'medium' ? t('fontMediumTitle') : t('fontLargeTitle')}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">{t('fontSizeSectionDesc')}</p>

                        <div className="grid grid-cols-3 gap-3 pt-1">
                          {[
                            { id: 'normal', label: t('fontNormalTitle'), desc: t('fontNormalDesc') },
                            { id: 'medium', label: t('fontMediumTitle'), desc: t('fontMediumDesc') },
                            { id: 'large', label: t('fontLargeTitle'), desc: t('fontLargeDesc') }
                          ].map((f) => (
                            <button
                              key={f.id}
                              type="button"
                              onClick={() => setExamFontSize(f.id as any)}
                              className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                                examFontSize === f.id
                                    ? 'bg-emerald-500/15 border-emerald-500/40 font-bold text-emerald-900 shadow-sm'
                                    : 'bg-white/40 border-white/60 text-slate-700 hover:bg-white'
                              }`}
                            >
                              <p className="text-xs font-bold">{f.label}</p>
                              <p className="text-[10px] text-slate-500 mt-0.5">{f.desc}</p>
                            </button>
                          ))}
                        </div>

                        {/* Live Font Size Preview */}
                        <div className="p-4 rounded-xl bg-white/80 border border-slate-200/60 shadow-xs">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">{t('previewPassageTitle')}</span>
                          <p className={`text-slate-800 leading-relaxed transition-all ${
                            examFontSize === 'normal' ? 'text-sm' : examFontSize === 'medium' ? 'text-base' : 'text-lg'
                          }`}>
                            {t('previewPassageSample')}
                          </p>
                        </div>
                      </div>

                      {/* 3. TEMA WARNA & KENYAMANAN MATA */}
                      <div className="p-6 bg-white/60 border border-white/50 rounded-2xl space-y-4">
                        <div className="flex items-center gap-2">
                          <Palette className="w-5 h-5 text-emerald-600" />
                          <h4 className="font-bold text-slate-800">{t('themeSectionTitle')}</h4>
                        </div>
                        <p className="text-xs text-slate-500">{t('themeSectionDesc')}</p>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                          {/* Light */}
                          <button
                            type="button"
                            onClick={() => handleThemeChange('light')}
                            className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between h-28 ${
                              examTheme === 'light'
                                ? 'bg-white border-emerald-500/60 shadow-md ring-2 ring-emerald-400/40'
                                : 'bg-white/60 border-white/70 hover:bg-white'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <Sun className="w-5 h-5 text-amber-500" />
                              {examTheme === 'light' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                            </div>
                            <div>
                              <p className="font-bold text-slate-800 text-xs">{t('themeLightTitle')}</p>
                              <p className="text-[10px] text-slate-500">{t('themeLightDesc')}</p>
                            </div>
                          </button>

                          {/* Warm / Sepia */}
                          <button
                            type="button"
                            onClick={() => handleThemeChange('warm')}
                            className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between h-28 ${
                              examTheme === 'warm'
                                ? 'bg-[#FDFBF7] border-amber-600/50 shadow-md ring-2 ring-amber-400/40'
                                : 'bg-[#FAF7F0]/70 border-amber-200/60 hover:bg-[#FAF7F0]'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <Coffee className="w-5 h-5 text-amber-700" />
                              {examTheme === 'warm' && <CheckCircle2 className="w-4 h-4 text-amber-700" />}
                            </div>
                            <div>
                              <p className="font-bold text-amber-900 text-xs">{t('themeWarmTitle')}</p>
                              <p className="text-[10px] text-amber-700/70">{t('themeWarmDesc')}</p>
                            </div>
                          </button>

                          {/* Dark */}
                          <button
                            type="button"
                            onClick={() => handleThemeChange('dark')}
                            className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between h-28 ${
                              examTheme === 'dark'
                                ? 'bg-slate-900 border-slate-700 shadow-md ring-2 ring-slate-600 text-white'
                                : 'bg-slate-800/80 border-slate-700 hover:bg-slate-900 text-white'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <Moon className="w-5 h-5 text-indigo-400" />
                              {examTheme === 'dark' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                            </div>
                            <div>
                              <p className="font-bold text-white text-xs">{t('themeDarkTitle')}</p>
                              <p className="text-[10px] text-slate-400">{t('themeDarkDesc')}</p>
                            </div>
                          </button>
                        </div>

                        {/* Live Mini Preview Box of the Exam Theme */}
                        <div className="pt-2">
                          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2.5 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                            Pratinjau Langsung Layar Ujian Peserta ({examTheme === 'warm' ? 'Lembut Mata / Sepia' : examTheme === 'dark' ? 'Redup Malam / Dark' : 'Terang Bersih / Light'}):
                          </p>

                          <div className={`p-4 sm:p-5 rounded-xl border transition-all duration-300 shadow-xs ${
                            examTheme === 'warm'
                              ? 'bg-[#FAF7F0] border-[#E2D9CC] text-[#3E2723]'
                              : examTheme === 'dark'
                              ? 'bg-[#0F172A] border-slate-700 text-slate-100'
                              : 'bg-white border-slate-200 text-slate-800'
                          }`}>
                            <div className="flex items-center justify-between mb-3 pb-2 border-b border-current/10">
                              <span className={`text-[10px] font-black px-2.5 py-1 rounded-md border tracking-wider ${
                                examTheme === 'warm'
                                  ? 'text-[#8D5B4C] bg-[#FDFBF7] border-[#8D5B4C]'
                                  : examTheme === 'dark'
                                  ? 'text-emerald-400 bg-slate-900 border-emerald-500'
                                  : 'text-[#00a67c] bg-white border-[#00a67c]'
                              }`}>
                                SOAL NO. 1
                              </span>
                              <span className="text-[10px] opacity-70 font-mono">Structure & Written Expression</span>
                            </div>

                            <p className="text-xs sm:text-sm font-semibold mb-3 leading-relaxed">
                              The results of the test _______ yesterday were satisfactory to the proctor team.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                              <div className={`p-2.5 rounded-lg border flex items-center gap-2.5 font-medium ${
                                examTheme === 'warm'
                                  ? 'bg-[#ECE2D4] border-[#8D5B4C] text-[#2C1810]'
                                  : examTheme === 'dark'
                                  ? 'bg-emerald-950/60 border-emerald-500 text-white'
                                  : 'bg-emerald-50/70 border-[#00a67c] text-slate-900'
                              }`}>
                                <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                                  examTheme === 'warm' ? 'bg-[#8D5B4C] text-white' : examTheme === 'dark' ? 'bg-emerald-600 text-white' : 'bg-[#00a67c] text-white'
                                }`}>A</span>
                                <span>received</span>
                                <CheckCircle2 className="w-3.5 h-3.5 ml-auto text-emerald-500" />
                              </div>

                              <div className={`p-2.5 rounded-lg border flex items-center gap-2.5 opacity-80 ${
                                examTheme === 'warm'
                                  ? 'bg-[#FDFBF7] border-[#E5DACD] text-[#4E342E]'
                                  : examTheme === 'dark'
                                  ? 'bg-slate-800/60 border-slate-700 text-slate-300'
                                  : 'bg-white border-slate-200 text-slate-700'
                              }`}>
                                <span className="w-5 h-5 rounded-full bg-black/5 flex items-center justify-center font-bold text-[10px]">B</span>
                                <span>receiving</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 4. PREFERENSI NAVIGASI SOAL */}
                      <div className="p-6 bg-white/60 border border-white/50 rounded-2xl space-y-4">
                        <div className="flex items-center gap-2">
                          <LayoutGrid className="w-5 h-5 text-emerald-600" />
                          <h4 className="font-bold text-slate-800">{t('layoutSectionTitle')}</h4>
                        </div>
                        
                        <div className="flex items-center justify-between pt-1">
                          <div className="pr-4">
                            <p className="font-bold text-sm text-slate-800">{t('gridToggleTitle')}</p>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {t('gridToggleDesc')}
                            </p>
                          </div>
                          <button 
                            type="button"
                            onClick={() => setShowQuestionGrid(!showQuestionGrid)}
                            className="shrink-0 transition-transform active:scale-95 focus:outline-none cursor-pointer"
                          >
                            {showQuestionGrid ? (
                              <ToggleRight className="w-12 h-12 text-emerald-500 transition-colors" />
                            ) : (
                              <ToggleLeft className="w-12 h-12 text-slate-400 hover:text-slate-500 transition-colors" />
                            )}
                          </button>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-slate-200/50">
                          <div className="pr-4">
                            <p className="font-bold text-sm text-slate-800">{t('compactToggleTitle')}</p>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {t('compactToggleDesc')}
                            </p>
                          </div>
                          <button 
                            type="button"
                            onClick={() => setCompactView(!compactView)}
                            className="shrink-0 transition-transform active:scale-95 focus:outline-none cursor-pointer"
                          >
                            {compactView ? (
                              <ToggleRight className="w-12 h-12 text-emerald-500 transition-colors" />
                            ) : (
                              <ToggleLeft className="w-12 h-12 text-slate-400 hover:text-slate-500 transition-colors" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Simpan Pengaturan Tampilan & Bahasa Button */}
                      <div className="pt-4 flex justify-end">
                        <button
                          type="button"
                          onClick={handleSaveSettings}
                          disabled={saving}
                          className="flex items-center gap-2 px-8 py-3.5 rounded-2xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-[0_8px_20px_rgb(16,185,129,0.25)] transition-all duration-200 active:scale-98 disabled:opacity-60 cursor-pointer"
                        >
                          {saving ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin" />
                              <span>{t('savingSettings')}</span>
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4" />
                              <span>{t('saveUiBtn')}</span>
                            </>
                          )}
                        </button>
                      </div>

                    </div>
                  </motion.div>
                )}

              </div>
            </div>
          </div>

        </motion.main>
      </div>

      {/* MODAL PANTAU & RESET SESI MAHASISWA */}
      <AnimatePresence>
        {showSessionsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-2xl bg-white/95 rounded-3xl p-6 md:p-8 shadow-2xl border border-white/60 flex flex-col max-h-[85vh] overflow-hidden"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-800">{t('activeSessionsModalTitle')}</h4>
                    <p className="text-xs text-slate-500">{t('activeSessionsModalSub')}</p>
                  </div>
                </div>

                <button
                  onClick={() => setShowSessionsModal(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* List of active sessions */}
              <div className="flex-1 overflow-y-auto py-4 space-y-3">
                {loadingSessions ? (
                  <div className="py-12 flex flex-col items-center justify-center text-slate-400">
                    <RefreshCw className="w-8 h-8 animate-spin mb-3 text-emerald-500" />
                    <p className="text-sm">{t('loadingActiveSessions')}</p>
                  </div>
                ) : activeSessions.length === 0 ? (
                  <div className="py-12 text-center text-slate-400">
                    <UserX className="w-12 h-12 mx-auto mb-3 opacity-40" />
                    <p className="text-sm font-semibold">{t('noActiveSessions')}</p>
                    <p className="text-xs mt-1">{t('noActiveSessionsSub')}</p>
                  </div>
                ) : (
                  activeSessions.map((session) => (
                    <div
                      key={session.nomorInduk}
                      className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/60 flex items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-800 text-sm">{session.nomorInduk}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold">{t('sessionActiveBadge')}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          IP: <span className="font-mono font-semibold text-slate-700">{session.ip}</span> • {t('sessionActiveTimeLabel')} {new Date(session.lastSeen).toLocaleTimeString()}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleResetSession(session.nomorInduk)}
                        disabled={resettingNim === session.nomorInduk}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-rose-500/10 border border-rose-500/25 text-rose-700 hover:bg-rose-500/20 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                        title="Reset sesi agar peserta dapat login kembali di komputer lain"
                      >
                        {resettingNim === session.nomorInduk ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <UserX className="w-3.5 h-3.5" />
                        )}
                        <span>{t('resetSessionBtn')}</span>
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={fetchActiveSessions}
                  disabled={loadingSessions}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingSessions ? 'animate-spin' : ''}`} />
                  <span>{t('refreshBtn')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowSessionsModal(false)}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer"
                >
                  {t('closeBtn')}
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SettingsProctor;
