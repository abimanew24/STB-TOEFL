import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Server, Shield, Volume2, Globe, FileText, ToggleLeft, ToggleRight, Settings
} from 'lucide-react';
import { SidebarProctor } from '../../components/common/SidebarProctor';
import { ProctorHeader } from '../../components/proctor/ProctorHeader';

export const SettingsProctor: React.FC = () => {
  const [activeTab, setActiveTab] = useState('server');
  
  const [toggles, setToggles] = useState({
    sebEnabled: true,
    autoScore: false,
    blockMultiLogin: true,
    offlineMode: false,
    audioAutoPlay: true,
  });

  const toggleSwitch = (key: keyof typeof toggles) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const tabs = [
    { id: 'server', icon: Server, label: 'Sistem & Jaringan' },
    { id: 'security', icon: Shield, label: 'Keamanan (SEB)' },
    { id: 'audio', icon: Volume2, label: 'Media & Audio' },
    { id: 'report', icon: FileText, label: 'Sertifikat & Nilai' },
    { id: 'ui', icon: Globe, label: 'Tampilan & Bahasa' },
  ];

  return (
    <div className="h-screen overflow-hidden bg-[url('/bg-proctor.jpg')] bg-cover bg-center p-4 md:p-6 font-sans text-slate-800 flex gap-6 box-border selection:bg-teal-500/20 relative">
      <SidebarProctor activePath="/proctor/settings" />

      <div className="flex-1 flex flex-col gap-6 max-w-[1400px] mx-auto w-full overflow-hidden relative z-10">
        <ProctorHeader />

        <motion.main
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="flex-1 flex gap-8 overflow-hidden pb-6"
        >
          {/* Left Panel: Tabs */}
          <div className="w-64 shrink-0 flex flex-col gap-2">
            <h2 className="text-3xl font-bold tracking-tight mb-6 px-4">Pengaturan</h2>
            
            {tabs.map((tab) => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-4 px-6 py-4 rounded-[1.5rem] font-bold text-sm transition-all duration-300 ${activeTab === tab.id ? 'bg-white/50 backdrop-blur-md text-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50' : 'text-slate-500 hover:text-slate-800 hover:bg-white/60 border border-transparent'}`}
              >
                <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-emerald-400' : ''}`} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Right Panel: Content */}
          <div className="flex-1 bg-white/60 rounded-[2.5rem] border border-white/40 shadow-inner flex flex-col overflow-hidden relative">
            
            {/* Scrollable container with the cool mask */}
            <div 
              className="flex-1 overflow-y-auto p-10 [&::-webkit-scrollbar]:hidden pb-16"
              style={{ WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 20px, black calc(100% - 20px), transparent)' }}
            >
              <div className="w-full max-w-4xl mx-auto mt-4">
                
                {activeTab === 'server' && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                    <h3 className="text-xl font-bold mb-2 text-slate-800">Sistem & Jaringan</h3>
                    <p className="text-sm text-slate-500 mb-8">Konfigurasi alamat server lokal dan performa sistem.</p>
                    
                    <div className="space-y-6">
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-slate-700">Alamat IP LAN (Active Bind)</label>
                        <input type="text" defaultValue="192.168.1.100" className="bg-white/60 border border-white/50 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-white/50 focus:bg-white/50 backdrop-blur-md transition-all font-mono" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-slate-700">Port Server Node.js</label>
                        <input type="number" defaultValue={5000} className="bg-white/60 border border-white/50 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-white/50 focus:bg-white/50 backdrop-blur-md transition-all font-mono" />
                      </div>
                      <div className="flex items-center justify-between p-5 bg-white/60 border border-white/40 rounded-2xl mt-4">
                        <div>
                          <p className="font-bold">Mode Offline Tersendiri</p>
                          <p className="text-xs text-slate-400 mt-1">Gunakan cache lokal jika jaringan ke server pusat terputus</p>
                        </div>
                        <button onClick={() => toggleSwitch('offlineMode')} className="text-emerald-400">
                          {toggles.offlineMode ? <ToggleRight className="w-10 h-10 text-emerald-400" /> : <ToggleLeft className="w-10 h-10 text-slate-800/30" />}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'security' && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                    <h3 className="text-xl font-bold mb-2 text-slate-800">Keamanan & Integritas Ujian</h3>
                    <p className="text-sm text-slate-500 mb-8">Aturan Safe Exam Browser dan pencegahan kecurangan.</p>
                    
                    <div className="space-y-6">
                      <div className="flex items-center justify-between p-5 bg-white/60 border border-white/40 rounded-2xl">
                        <div>
                          <p className="font-bold">Wajibkan Safe Exam Browser (SEB)</p>
                          <p className="text-xs text-slate-400 mt-1">Blokir akses dari browser standar (Chrome, Firefox, dll)</p>
                        </div>
                        <button onClick={() => toggleSwitch('sebEnabled')} className="text-emerald-400">
                          {toggles.sebEnabled ? <ToggleRight className="w-10 h-10 text-emerald-400" /> : <ToggleLeft className="w-10 h-10 text-slate-800/30" />}
                        </button>
                      </div>
                      <div className="flex items-center justify-between p-5 bg-white/60 border border-white/40 rounded-2xl">
                        <div>
                          <p className="font-bold">Blokir Multi-Login</p>
                          <p className="text-xs text-slate-400 mt-1">Satu peserta tidak boleh login di dua perangkat berbeda</p>
                        </div>
                        <button onClick={() => toggleSwitch('blockMultiLogin')} className="text-emerald-400">
                          {toggles.blockMultiLogin ? <ToggleRight className="w-10 h-10 text-emerald-400" /> : <ToggleLeft className="w-10 h-10 text-slate-800/30" />}
                        </button>
                      </div>
                      <div className="flex flex-col gap-2 pt-4">
                        <label className="text-sm font-bold text-slate-700">Kunci Keluar SEB (Quit Password)</label>
                        <input type="password" defaultValue="qwe1234" className="bg-white/60 border border-white/50 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-white/50 focus:bg-white/50 backdrop-blur-md transition-all font-mono" />
                      </div>
                    </div>
                  </motion.div>
                )}

                {['audio', 'report', 'ui'].includes(activeTab) && (
                   <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center h-[65vh] -mt-10 -ml-8 opacity-50 w-full text-center">
                     <Settings className="w-32 h-32 mb-8 animate-spin" style={{ animationDuration: '4s' }} />
                     <h3 className="text-3xl font-bold mb-4 tracking-tight">Fitur Segera Hadir</h3>
                     <p className="text-lg font-medium text-slate-700 max-w-md mx-auto">Pengaturan panel ini sedang dalam tahap akhir pengembangan. Silakan nantikan pembaruan berikutnya!</p>
                   </motion.div>
                )}

              </div>
            </div>
          </div>

        </motion.main>
      </div>
    </div>
  );
};
