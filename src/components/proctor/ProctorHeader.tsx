import React from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

import { useLanguage } from '../../services/languageContext';
import { useTheme } from '../../services/themeContext';

export const ProctorHeader: React.FC = () => {
  const location = useLocation();
  const { language } = useLanguage();
  const { isDark, isWarm } = useTheme();
  const isEn = language === 'en';

  const proctorInfoStr = localStorage.getItem('proctor_info');
  const proctorName = (proctorInfoStr ? JSON.parse(proctorInfoStr)?.nama_lengkap : '') || (isEn ? 'Chief Proctor' : 'Dosen Pengawas Utama');
  const firstName = proctorName.split(' ')[0];

  const isDashboard = location.pathname === '/proctor/dashboard';

  // Sembunyikan sepenuhnya bilah header jika bukan di dashboard agar tampilan bersih tanpa sisa elemen
  if (!isDashboard) {
    return null;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="relative flex items-center justify-between w-full z-50 mb-4 pt-2 px-1 shrink-0"
    >
      <div className="flex flex-col gap-0.5">
        <h1 className={`text-2xl md:text-3xl font-extrabold tracking-tight ${
          isDark ? 'text-white' : isWarm ? 'text-[#3E2723]' : 'text-slate-800'
        }`}>
          {isEn ? 'Live Monitoring Dashboard' : 'Dashboard Live Monitoring'}
        </h1>
        <p className={`font-medium text-xs md:text-sm ${
          isDark ? 'text-slate-400' : isWarm ? 'text-[#795548]' : 'text-slate-500'
        }`}>
          {isEn 
            ? `Welcome back, ${firstName}! Monitor and manage exams in real-time.`
            : `Selamat datang kembali, ${firstName}! Pantau dan kelola ujian secara real-time.`
          }
        </p>
      </div>
    </motion.div>
  );
};
