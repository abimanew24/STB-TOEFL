import React from 'react';
import { ShieldCheck, LogOut, User, Sun, Moon } from 'lucide-react';

interface NavbarProps {
  title?: string;
  subtitle?: string;
  userName?: string;
  userRole?: 'mahasiswa' | 'pengawas';
  theme?: 'dark' | 'light' | 'emerald';
  onToggleTheme?: () => void;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  title = 'SECURE-TOEFL CBT',
  subtitle,
  userName,
  userRole,
  theme = 'dark',
  onToggleTheme,
  onLogout,
}) => {
  const isLight = theme === 'light';
  const isEmerald = theme === 'emerald';

  return (
    <header
      className={`sticky top-0 z-40 w-full px-4 lg:px-8 py-4 flex items-center justify-between shadow-md transition-colors ${
        isEmerald
          ? 'bg-[#00a67c] border-transparent text-white'
          : isLight
          ? 'bg-white/90 backdrop-blur-md border-b border-slate-200 text-slate-900 shadow-slate-200/50'
          : 'bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white shadow-slate-950/50'
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`flex items-center justify-center w-10 h-10 rounded-xl border ${
            isEmerald
              ? 'bg-white/10 text-white border-white/20'
              : isLight
              ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
              : 'bg-indigo-600/20 text-indigo-400 border-indigo-500/30'
          }`}
        >
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h1 className={`text-lg font-bold tracking-tight flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
            {title}
            <span
              className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded-md border tracking-wider ${
                isEmerald
                  ? 'bg-transparent text-white border-white/50'
                  : isLight
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
              }`}
            >
              SEB Secured
            </span>
          </h1>
          {subtitle && <p className={`text-xs ${isEmerald ? 'text-emerald-100' : isLight ? 'text-slate-500' : 'text-slate-400'}`}>{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {onToggleTheme && (
          <button
            onClick={onToggleTheme}
            title={isLight ? 'Beralih ke Mode Gelap' : 'Beralih ke Mode Terang'}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              isEmerald
                ? 'bg-white/10 hover:bg-white/20 text-white border-white/20'
                : isLight
                ? 'bg-slate-100 hover:bg-slate-200 text-amber-600 border-slate-300'
                : 'bg-slate-800 hover:bg-slate-700 text-amber-400 border-slate-700'
            }`}
          >
            {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>
        )}

        {userName && (
          <div
            className={`hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-xl border ${
              isEmerald
                ? 'bg-transparent border-transparent text-white'
                : isLight
                ? 'bg-slate-100/80 border-slate-200 text-slate-800'
                : 'bg-slate-800/80 border-slate-700/60 text-slate-200'
            }`}
          >
            {!isEmerald && <User className={`w-4 h-4 ${isLight ? 'text-emerald-600' : 'text-indigo-400'}`} />}
            <div className="text-right">
              <p className="text-xs font-bold leading-none">{userName}</p>
              {userRole && (
                <span className={`text-[10px] capitalize ${isEmerald ? 'text-emerald-100' : isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  {userRole}
                </span>
              )}
            </div>
          </div>
        )}

        {onLogout && (
          <button
            onClick={onLogout}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              isEmerald
                ? 'bg-rose-500 hover:bg-rose-600 text-white border-rose-500'
                : isLight
                ? 'bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100'
                : 'bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/20'
            }`}
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar</span>
          </button>
        )}
      </div>
    </header>
  );
};
