import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, CheckCircle2, ShieldCheck, Clock, FileText, BellRing } from 'lucide-react';
import { StudentHeader } from '../../components/student/StudentHeader';
import api from '../../services/api';

export const ResultReport: React.FC = () => {
  const navigate = useNavigate();
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const cachedRes = localStorage.getItem('student_result');
        if (cachedRes) {
          try {
            const parsed = JSON.parse(cachedRes);
            if (parsed) {
              setResult(parsed);
              setLoading(false);
              return;
            }
          } catch {
            // fallback
          }
        }

        const response = await api.get('/scores/student');
        setResult(response.data);
      } catch (err) {
        console.error('[FETCH RESULT ERROR]', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, []);

  const studentInfoStr = localStorage.getItem('student_info');
  const studentInfo = studentInfoStr ? JSON.parse(studentInfoStr) : null;

  const handleLogout = () => {
    localStorage.removeItem('student_token');
    localStorage.removeItem('student_info');
    localStorage.removeItem('student_result');
    navigate('/student/login');
  };

  const currentDate = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const currentTime = new Date().toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100/70 text-slate-900 flex flex-col font-sans">
      <StudentHeader subtitle="Konfirmasi Penyelesaian Ujian" />

      <main className="flex-1 max-w-2xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col justify-center">
        {loading ? (
          <div className="text-center py-20 bg-white rounded-3xl p-12 border border-slate-200 shadow-sm">
            <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-sm font-semibold text-slate-600">Menyimpan dan mengamankan lembar jawaban Anda...</p>
          </div>
        ) : (
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-xl shadow-slate-200/50 flex flex-col items-center text-center">
            
            {/* Success Icon Pill */}
            <div className="w-20 h-20 rounded-full bg-teal-50 border-4 border-teal-100 flex items-center justify-center text-teal-700 mb-5 shadow-sm">
              <CheckCircle2 className="w-10 h-10 stroke-[2.2]" />
            </div>

            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200 text-xs font-bold uppercase tracking-wider mb-4">
              <ShieldCheck className="w-4 h-4" />
              <span>Lembar Jawaban Berhasil Terkirim</span>
            </div>

            {/* Candidate Info */}
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-1">
              {(result?.nama_lengkap || studentInfo?.nama_lengkap || 'Peserta Ujian').toUpperCase()}
            </h1>
            <p className="text-sm font-semibold text-slate-500 mb-6">
              NIM: {result?.nomor_induk || studentInfo?.nomor_induk || '-'} • Sesi: {result?.nama_sesi || 'TOEFL ITP CBT'}
            </p>

            {/* Notification / Announcement Card */}
            <div className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl p-5 sm:p-6 mb-6 text-left">
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0 mt-0.5">
                  <BellRing className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800 mb-1">
                    Ujian Anda Telah Selesai
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Anda telah menyelesaikan seluruh rangkaian tugas dan butir soal ujian dengan baik. Seluruh lembar jawaban Anda telah tersimpan secara aman di sistem.
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-2 font-medium">
                    Hasil dan rekapitulasi nilai akan diverifikasi terlebih dahulu oleh <span className="font-semibold text-slate-800">Dosen Pengampu / Pengawas Ujian</span>. Nilai resmi akan dikirim dan diumumkan pada jadwal pengumuman berikutnya.
                  </p>
                </div>
              </div>
            </div>

            {/* Session Summary Metadata */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 text-left">
              <div className="bg-white border border-slate-200/70 rounded-xl p-3.5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Waktu Selesai</div>
                  <div className="text-xs font-bold text-slate-700">{currentDate}, {currentTime} WIB</div>
                </div>
              </div>

              <div className="bg-white border border-slate-200/70 rounded-xl p-3.5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Status Lembar Ujian</div>
                  <div className="text-xs font-bold text-emerald-700">Terkunci & Terverifikasi</div>
                </div>
              </div>
            </div>

            {/* Logout Action Button */}
            <div className="w-full max-w-sm flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold shadow-lg shadow-teal-700/20 transition-all active:scale-98 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Selesai & Keluar dari Sistem</span>
              </button>
              <p className="text-[11px] text-slate-400 font-medium mt-1">
                Silakan keluar dari sistem sebelum meninggalkan ruang ujian.
              </p>
            </div>

          </div>
        )}
      </main>
    </div>
  );
};
