import React, { useEffect, useState } from 'react';
import { Server, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

export const ProctorHeader: React.FC = () => {
  const location = useLocation();
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  
  const formatTime = (date: Date) => 
    date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const proctorInfoStr = localStorage.getItem('proctor_info');
  const proctorName = (proctorInfoStr ? JSON.parse(proctorInfoStr)?.nama_lengkap : '') || 'Pengawas Utama';
  const firstName = proctorName.split(' ')[0];

  const isDashboard = location.pathname === '/proctor/dashboard';

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`relative flex items-center justify-between w-full z-50 ${isDashboard ? 'mb-4 pt-2' : 'mb-1 pt-1'} px-1 shrink-0`}
    >
      {isDashboard ? (
        <div className="flex flex-col gap-0.5">
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">Dashboard Live Monitoring</h1>
          <p className="text-slate-500 font-medium text-xs md:text-sm">
            Selamat datang kembali, {firstName}! Pantau dan kelola ujian secara real-time.
          </p>
        </div>
      ) : (
        <div />
      )}

      <div className="flex items-center gap-3 md:gap-4 ml-auto">
        {/* LAN Status */}
        <div className="hidden lg:flex items-center gap-2 bg-white/70 backdrop-blur-md text-teal-700 px-3.5 py-1.5 rounded-full text-xs font-bold border border-white/80 shadow-sm">
          <Server className="w-3.5 h-3.5 text-teal-600" />
          <span>LAN: 192.168.1.100</span>
        </div>

        {/* Clock */}
        <div className="hidden md:flex items-center gap-2 text-slate-700 text-xs font-bold font-mono bg-white/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/80 shadow-sm">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          <span>{formatTime(currentTime)}</span>
        </div>

        {/* Profile */}
        <div className="flex items-center gap-2.5 pl-1">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-slate-800">{proctorName}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center font-bold border-2 border-white shadow-sm overflow-hidden cursor-pointer hover:shadow transition-shadow">
            <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${firstName}&backgroundColor=e2e8f0`} alt="Avatar" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
