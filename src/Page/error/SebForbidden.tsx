import React from 'react';
import { ShieldAlert, AlertTriangle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const SebForbidden: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-6">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-rose-500/10 text-rose-400 border border-rose-500/30">
          <ShieldAlert className="w-10 h-10" />
        </div>

        <div>
          <span className="text-[10px] uppercase font-bold px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
            HTTP 403 Access Denied
          </span>
          <h2 className="text-2xl font-bold text-white mt-3">Akses Ditolak (SEB Required)</h2>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            Halaman ujian **SECURE-TOEFL CBT** hanya dapat diakses melalui aplikasi **Safe Exam Browser (SEB)** yang telah terverifikasi.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left text-xs text-slate-300 space-y-2">
          <div className="flex items-center gap-2 font-semibold text-amber-400">
            <AlertTriangle className="w-4 h-4" />
            <span>Petunjuk Pengawas:</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-slate-400">
            <li>Tutup browser standar (Chrome/Edge/Firefox).</li>
            <li>Buka berkas konfigurasi laboratorium <code>config_ujian_lab.seb</code>.</li>
            <li>Masukan sandi awal SEB yang diberikan pengawas di laboratorium.</li>
          </ul>
        </div>

        <button
          onClick={() => navigate('/student/login')}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-all cursor-pointer border border-slate-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Halaman Utama</span>
        </button>
      </div>
    </div>
  );
};
