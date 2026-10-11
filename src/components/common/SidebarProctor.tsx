import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, LogOut, 
  Key, BookOpen, FileText, MonitorPlay, Command, Users, Music
} from 'lucide-react';

// ... (in SidebarProctorProps...)
interface SidebarProctorProps {
  activePath: string;
}

export const SidebarProctor: React.FC<SidebarProctorProps> = ({ activePath }) => {
  const navigate = useNavigate();
  
  // Ambil state awal dari localStorage agar tidak reset saat pindah halaman
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebar_collapsed');
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    // Simpan state setiap kali berubah
    localStorage.setItem('sidebar_collapsed', JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setIsCollapsed((prev: boolean) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('proctor_token');
    localStorage.removeItem('proctor_info');
    navigate('/proctor/login');
  };

  const navItems = [
    { path: '/proctor/dashboard', icon: MonitorPlay, title: 'Live Monitoring' },
    { path: '/proctor/peserta', icon: Users, title: 'Data Peserta' },
    { path: '/proctor/tokens', icon: Key, title: 'Sesi & Token' },
    { 
      path: '/proctor/bank', 
      icon: BookOpen, 
      title: 'Bank Soal',
      subItems: [
        { path: '/proctor/bank?section=1', title: '1. Listening' },
        { path: '/proctor/bank?section=2', title: '2. Structure' },
        { path: '/proctor/bank?section=3', title: '3. Reading' },
      ]
    },
    { path: '/proctor/recap', icon: FileText, title: 'Laporan & Rekap' },
  ];

  const [expandedItems, setExpandedItems] = useState<string[]>(() => {
    const saved = localStorage.getItem('sidebar_expanded_items');
    if (saved) return JSON.parse(saved);
    const activeItem = navItems.find(item => activePath.split('?')[0] === item.path.split('?')[0] && item.subItems);
    return activeItem ? [activeItem.title] : [];
  });

  useEffect(() => {
    localStorage.setItem('sidebar_expanded_items', JSON.stringify(expandedItems));
  }, [expandedItems]);

  const toggleExpand = (title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCollapsed) setIsCollapsed(false);
    setExpandedItems(prev => 
      prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
    );
  };

  return (
    <motion.aside 
      initial={false}
      animate={{ 
        width: isCollapsed ? '74px' : '260px',
        borderRadius: isCollapsed ? '36px' : '24px',
      }}
      transition={{ type: 'spring', stiffness: 260, damping: 25, mass: 1 }}
      className="bg-white/60 backdrop-blur-3xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.06)] hidden md:flex flex-col shrink-0 overflow-y-auto overflow-x-hidden relative z-10 m-4 py-8 px-3 custom-scrollbar"
    >
      <motion.div 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.95 }}
        className={`flex items-center w-full mb-10 cursor-pointer group shrink-0 ${isCollapsed ? 'justify-center' : 'px-1'}`} 
        onClick={() => setIsCollapsed(!isCollapsed)} 
        title="Toggle Sidebar (Ctrl+B)"
      >
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 overflow-hidden shadow-sm border border-white/60 p-0.5 group-hover:bg-white/80 transition-colors">
          <img src="/8Tg9xjvN_400x400-removebg-preview.png" alt="Logo" className="w-full h-full object-contain" />
        </div>
        <AnimatePresence initial={false}>
          {!isCollapsed && (
            <motion.span 
              initial={{ opacity: 0, width: 0, marginLeft: 0 }}
              animate={{ opacity: 1, width: 'auto', marginLeft: 12 }}
              exit={{ opacity: 0, width: 0, marginLeft: 0 }}
              transition={{ duration: 0.2 }}
              className="text-lg font-bold text-slate-800 tracking-tight whitespace-nowrap overflow-hidden"
            >
              Proctor Menu
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
      
      <div className="flex flex-col gap-3 w-full flex-1 relative">
        <AnimatePresence initial={false}>
          {isCollapsed && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute top-[5%] bottom-[5%] left-1/2 -translate-x-1/2 w-[2px] bg-slate-200/60 -z-10 rounded-full"
            ></motion.div>
          )}
        </AnimatePresence>

        {navItems.map((item) => {
          const isActive = activePath.split('?')[0] === item.path.split('?')[0];
          const isExpanded = expandedItems.includes(item.title);
          const Icon = item.icon;
          
          return (
            <div key={item.title} className="flex flex-col">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={(e) => {
                  if (item.subItems) {
                    toggleExpand(item.title, e);
                  } else {
                    navigate(item.path);
                  }
                }}
                title={item.title}
                className={`h-12 w-full rounded-full flex items-center cursor-pointer transition-all duration-300 group relative ${isCollapsed ? 'justify-center' : 'px-1'} ${
                  isActive && !item.subItems
                    ? 'bg-white text-slate-900 shadow-sm border border-white/60' 
                    : isActive && item.subItems 
                      ? 'text-slate-900 font-bold'
                      : 'text-slate-500 hover:bg-white/40 hover:text-slate-800'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isActive && item.subItems ? 'bg-white shadow-sm border border-white/60' : ''}`}>
                  <Icon className={`w-5 h-5 ${isActive ? 'text-slate-900' : 'text-slate-500 group-hover:text-slate-800'} transition-colors`} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                
                <AnimatePresence initial={false}>
                  {!isCollapsed && (
                    <motion.span 
                      initial={{ opacity: 0, width: 0, marginLeft: 0 }}
                      animate={{ opacity: 1, width: 'auto', marginLeft: 12 }}
                      exit={{ opacity: 0, width: 0, marginLeft: 0 }}
                      transition={{ duration: 0.2 }}
                      className="font-semibold whitespace-nowrap overflow-hidden text-sm flex-1 flex justify-between items-center pr-2"
                    >
                      {item.title}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Sub Items */}
              <AnimatePresence initial={false}>
                {item.subItems && isExpanded && !isCollapsed && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="flex flex-col gap-1 overflow-hidden mt-1 pl-12 pr-2"
                  >
                    {item.subItems.map((sub) => {
                      // We need to parse query string to know if active
                      // For now, let's just make it simple if it matches the current window location
                      const isSubActive = typeof window !== 'undefined' && window.location.search === sub.path.split('?')[1];
                      return (
                        <motion.div
                          key={sub.title}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => navigate(sub.path)}
                          className={`py-2 px-3 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                            isSubActive 
                              ? 'bg-slate-800 text-white shadow-sm' 
                              : 'text-slate-500 hover:text-slate-800 hover:bg-white/60'
                          }`}
                        >
                          {sub.title}
                        </motion.div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col gap-3 w-full mt-auto">
        <motion.div 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/proctor/settings')} 
          className={`h-12 w-full rounded-full flex items-center cursor-pointer transition-all duration-300 group relative ${isCollapsed ? 'justify-center' : 'px-1'} ${
            activePath === '/proctor/settings' 
              ? 'bg-white text-slate-900 shadow-sm border border-white/60' 
              : 'text-slate-500 hover:bg-white/40 hover:text-slate-800'
          }`}
          title="Pengaturan"
        >
          <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0">
            <Settings className={`w-5 h-5 ${activePath === '/proctor/settings' ? 'text-slate-900' : 'text-slate-500 group-hover:text-slate-800'}`} strokeWidth={activePath === '/proctor/settings' ? 2.5 : 2} />
          </div>
          <AnimatePresence initial={false}>
            {!isCollapsed && (
              <motion.span 
                initial={{ opacity: 0, width: 0, marginLeft: 0 }}
                animate={{ opacity: 1, width: 'auto', marginLeft: 12 }}
                exit={{ opacity: 0, width: 0, marginLeft: 0 }}
                transition={{ duration: 0.2 }}
                className="font-semibold whitespace-nowrap overflow-hidden text-sm"
              >
                Settings
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
        
        <motion.div 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout} 
          className={`h-12 w-full rounded-full flex items-center cursor-pointer transition-all duration-300 text-slate-500 hover:bg-rose-50 hover:text-rose-600 group relative ${isCollapsed ? 'justify-center' : 'px-1'}`}
          title="Keluar"
        >
          <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0">
            <LogOut className="w-5 h-5 text-slate-500 group-hover:text-rose-500 transition-colors" strokeWidth={2} />
          </div>
          <AnimatePresence initial={false}>
            {!isCollapsed && (
              <motion.span 
                initial={{ opacity: 0, width: 0, marginLeft: 0 }}
                animate={{ opacity: 1, width: 'auto', marginLeft: 12 }}
                exit={{ opacity: 0, width: 0, marginLeft: 0 }}
                transition={{ duration: 0.2 }}
                className="font-semibold whitespace-nowrap overflow-hidden text-sm"
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.aside>
  );
};



