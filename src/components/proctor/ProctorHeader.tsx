import React, { useEffect, useState } from 'react';
import { Server, Clock, Search, Bell } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

export const ProctorHeader: React.FC = () => {
  const location = useLocation();
  // Time state
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  
  const formatTime = (date: Date) => 
    date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  // Proctor Info
  const proctorInfoStr = localStorage.getItem('proctor_info');
  const proctorName = (proctorInfoStr ? JSON.parse(proctorInfoStr)?.nama_lengkap : '') || 'Pengawas Utama';
  const firstName = proctorName.split(' ')[0];

  const getPageTitle = () => {
    if (location.pathname.includes('peserta')) return 'Data Peserta';
    if (location.pathname.includes('tokens')) return 'Sesi & Token';
    if (location.pathname.includes('bank')) return 'Bank Soal';
    if (location.pathname.includes('recap')) return 'Laporan & Rekap';
    if (location.pathname.includes('settings')) return 'Pengaturan';
    return 'Dashboard';
  };

  const getPageSubtitle = () => {
    if (location.pathname.includes('peserta')) return 'Kelola daftar peserta ujian, import data, dan perbarui informasi secara manual.';
    if (location.pathname.includes('tokens')) return 'Kelola daftar sesi aktif dan berikan token akses ke peserta ujian.';
    if (location.pathname.includes('bank')) return 'Manajemen daftar pertanyaan, kunci jawaban, dan konfigurasi soal ujian.';
    if (location.pathname.includes('recap')) return 'Tinjau hasil ujian yang telah selesai, analisis nilai, dan cetak sertifikat.';
    if (location.pathname.includes('settings')) return 'Sesuaikan preferensi sistem, keamanan akses, dan fitur aplikasi CBT.';
    return `Selamat datang kembali, ${firstName}! Pantau dan kelola ujian secara real-time.`;
  };

  return (
    <motion.div 
      initial={getPageTitle() === 'Dashboard' ? { opacity: 0, y: -15 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="relative flex items-end justify-between w-full z-50 mb-8 pt-4 px-2 shrink-0"
    >
      <div className="flex flex-col gap-1.5">
         <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">{getPageTitle()}</h1>
         <p className="text-slate-500 font-medium text-sm">
           {getPageSubtitle()}
         </p>
      </div>
      <div className="flex items-center gap-3 md:gap-5">
         {/* LAN Status */}
         <div className="hidden lg:flex items-center gap-2 bg-white/40 backdrop-blur-md text-teal-700 px-4 py-2 rounded-2xl text-sm font-bold border border-white/60 shadow-sm">
           <Server className="w-4 h-4" />
           LAN: 192.168.1.100
         </div>

         {/* Clock */}
         <div className="hidden md:flex items-center gap-2 text-slate-700 text-sm font-bold font-mono bg-white/40 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/60 shadow-sm">
           <Clock className="w-4 h-4 text-slate-500" />
           {formatTime(currentTime)}
         </div>


         {/* Profile */}
         <div className="flex items-center gap-3 pl-2">
           <div className="text-right hidden sm:block">
             <p className="text-sm font-bold text-slate-800">{proctorName}</p>
           </div>
           <div className="w-11 h-11 rounded-full bg-slate-200 flex items-center justify-center font-bold border-2 border-white shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
             <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${firstName}&backgroundColor=e2e8f0`} alt="Avatar" className="w-full h-full object-cover" />
           </div>
         </div>
      </div>
    </motion.div>
  );
};



