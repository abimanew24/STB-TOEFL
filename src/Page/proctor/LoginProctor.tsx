import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCheck, Lock, ArrowRight, AlertCircle, Eye, EyeOff, Server } from 'lucide-react';
import api from '../../services/api';

export const LoginProctor: React.FC = () => {
  const navigate = useNavigate();
  const [nomorInduk, setNomorInduk] = useState('admin');
  const [kataSandi, setKataSandi] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberSession, setRememberSession] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await api.post('/auth/login-proctor', {
        nomor_induk: nomorInduk,
        kata_sandi: kataSandi,
      });

      const { token, proctor } = response.data;
      localStorage.setItem('proctor_token', token);
      localStorage.setItem('proctor_info', JSON.stringify(proctor));

      navigate('/proctor/dashboard');
    } catch (err: any) {
      console.error('[PROCTOR LOGIN ERROR]', err);
      let msg = err.response?.data?.message || 'Gagal autentikasi NIP/Password Pengawas.';
      
      // Humanize raw system/SQL errors
      if (typeof msg === 'string') {
        const lowerMsg = msg.toLowerCase();
        if (lowerMsg.includes('duplicate entry')) {
          if (lowerMsg.includes('email')) msg = 'Email ini sudah terdaftar. Silakan gunakan email lain.';
          else msg = 'Data yang Anda masukkan sudah terdaftar di sistem.';
        } else if (lowerMsg.includes('not found') || lowerMsg.includes('invalid') || lowerMsg.includes('wrong')) {
          msg = 'NIP atau Password yang Anda masukkan tidak valid.';
        } else if (lowerMsg.includes('er_') || lowerMsg.includes('sql')) {
          msg = 'Terjadi kendala pada server (Database Error). Silakan periksa koneksi backend.';
        }
      }

      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-emerald-600 via-emerald-700 to-indigo-900 font-sans selection:bg-emerald-600 selection:text-white p-4 sm:p-8 relative overflow-hidden">
      
      {/* Decorative backgrounds */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-400/30 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/20 blur-3xl pointer-events-none"></div>

      <div className="max-w-[1100px] w-full flex flex-col md:flex-row items-center justify-between gap-12 lg:gap-24 relative z-10 py-10">
        
        {/* Left side (Branding & Text) */}
        <div className="w-full md:w-1/2 flex flex-col text-white text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-4 mb-8">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden p-2">
              <img src="/8Tg9xjvN_400x400-removebg-preview.png" alt="Logo Kampus" className="w-full h-full object-contain" />
            </div>
            <span className="text-3xl font-extrabold tracking-tight">STBTOEFL</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Proctoring<br />Administration
          </h1>
          <p className="text-emerald-100 text-base sm:text-lg lg:text-xl max-w-md mx-auto md:mx-0 leading-relaxed mb-8">
            Proctoring Administration Portal. Manage examination sessions, monitor students, and maintain academic integrity securely.
          </p>
        </div>

        {/* Right side (Floating Form Panel) */}
        <div className="w-full md:w-1/2 max-w-md relative">
          {/* Form Container resembling a mobile UI card */}
          <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] p-8 sm:p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] w-full border border-white/50 relative overflow-hidden">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-bold text-slate-800 mb-2 tracking-tight">Welcome Back</h2>
              <p className="text-slate-500 font-medium text-sm md:text-base">Please enter your proctor credentials to login.</p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 text-xs flex items-start gap-3">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <div className="relative">
                  <UserCheck className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={nomorInduk}
                    onChange={(e) => setNomorInduk(e.target.value)}
                    placeholder="NIP / Username Pengawas"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all font-medium"
                  />
                </div>
              </div>

              <div>
                <div className="relative">
                  <Lock className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={kataSandi}
                    onChange={(e) => setKataSandi(e.target.value)}
                    placeholder="Kata Sandi Otorisasi"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-12 py-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center pt-2 pb-2">
                <input
                  type="checkbox"
                  id="rememberSession"
                  checked={rememberSession}
                  onChange={(e) => setRememberSession(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-emerald-600 bg-white focus:ring-emerald-500/20 cursor-pointer"
                />
                <label htmlFor="rememberSession" className="ml-2 text-sm font-medium text-slate-500 cursor-pointer hover:text-slate-700 transition-colors">
                  Remember me
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-4 rounded-2xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span>Memverifikasi Otorisasi...</span>
                ) : (
                  <>
                    <span>Login</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 flex flex-col items-center justify-center gap-2 text-xs font-medium text-slate-400">
              <div>&copy; 2026 SECURE-TOEFL CBT</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
