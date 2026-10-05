import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, ShieldAlert, Clock, ArrowRight, CheckSquare, Headphones, Edit3, BookOpen, AlertCircle } from 'lucide-react';
import { StudentHeader } from '../../components/student/StudentHeader';
import api from '../../services/api';
import { db } from '../../services/db';

export const ExamInstructions: React.FC = () => {
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStartExam = async () => {
    if (!agreed) return;
    setLoading(true);
    setError(null);

    try {
      const response = await api.get('/exam/prefetch');
      const { questions, passages } = response.data;

      if (questions && Array.isArray(questions)) {
        await db.questions.clear();
        await db.questions.bulkAdd(questions);
      }

      if (passages && Array.isArray(passages)) {
        await db.passages.clear();
        await db.passages.bulkAdd(passages);
      }

      navigate('/student/exam');
    } catch (err: any) {
      console.error('[PREFETCH ERROR]', err);
      setError(err.response?.data?.message || 'Gagal mengunduh instrumen soal ujian dari peladen.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans flex flex-col selection:bg-blue-600 selection:text-white">
      <StudentHeader subtitle="Petunjuk Resmi Ujian TOEFL ITP" />

      <main className="flex-1 w-full max-w-7xl mx-auto p-6 md:p-8 lg:p-12 flex flex-col justify-center">
        
        {/* Header Title */}
        <div className="mb-10 text-center md:text-left flex items-center gap-4">
          <div className="hidden md:flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 shadow-sm">
            <FileText className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-[#0F172A]">Petunjuk & Integritas Ujian</h2>
            <p className="text-sm font-medium text-slate-500 mt-1">Harap pahami struktur ujian dan aturan yang berlaku sebelum memulai.</p>
          </div>
        </div>

        {/* 2-Column Desktop Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          
          {/* LEFT COLUMN: Exam Structure */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Struktur Ujian (140 Soal)</h3>
            
            {/* Section 1 */}
            <div className="bg-white border border-[#E2E8F0] p-6 rounded-2xl flex items-start gap-5 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                <Headphones className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h4 className="text-lg font-bold text-[#1E293B]">Section 1: Listening</h4>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 flex items-center gap-1"><Clock className="w-3 h-3"/> 35 Menit</span>
                </div>
                <p className="text-sm font-semibold text-slate-700 mb-1">50 Pertanyaan</p>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Audio akan diputar otomatis satu kali tanpa tombol jeda atau ulang. Pastikan fokus penuh pada percakapan dan monolog.
                </p>
              </div>
            </div>

            {/* Section 2 */}
            <div className="bg-white border border-[#E2E8F0] p-6 rounded-2xl flex items-start gap-5 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                <Edit3 className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h4 className="text-lg font-bold text-[#1E293B]">Section 2: Structure</h4>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 flex items-center gap-1"><Clock className="w-3 h-3"/> 25 Menit</span>
                </div>
                <p className="text-sm font-semibold text-slate-700 mb-1">40 Pertanyaan</p>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Menguji kemampuan Anda dalam mengenali tata bahasa baku dan ekspresi tertulis dalam bahasa Inggris formal.
                </p>
              </div>
            </div>

            {/* Section 3 */}
            <div className="bg-white border border-[#E2E8F0] p-6 rounded-2xl flex items-start gap-5 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h4 className="text-lg font-bold text-[#1E293B]">Section 3: Reading</h4>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 flex items-center gap-1"><Clock className="w-3 h-3"/> 55 Menit</span>
                </div>
                <p className="text-sm font-semibold text-slate-700 mb-1">50 Pertanyaan</p>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Membaca dan menjawab pertanyaan berdasarkan pemahaman wacana akademik. Layar akan terbagi menjadi dua panel (teks dan soal).
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Rules & Actions */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <h3 className="text-sm font-bold text-transparent uppercase tracking-widest mb-2 select-none" aria-hidden="true">
              Spacer
            </h3>
            
            <div className="bg-white border border-[#E2E8F0] p-6 rounded-3xl shadow-sm flex flex-col gap-6 h-full">
              
              <div className="flex items-center gap-2 font-bold text-rose-600">
                <ShieldAlert className="w-5 h-5" />
                <h3 className="text-base uppercase tracking-wider">Aturan Integritas</h3>
              </div>

              <ul className="space-y-4">
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 shrink-0"></div>
                  <p className="text-sm text-slate-600 leading-relaxed">Ujian dikunci penuh oleh <strong className="text-slate-800">Safe Exam Browser (SEB)</strong>. Percobaan keluar aplikasi akan diblokir dan dicatat sebagai pelanggaran.</p>
                </li>
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 shrink-0"></div>
                  <p className="text-sm text-slate-600 leading-relaxed">Jawaban Anda disimpan otomatis ke server setiap beberapa detik (Auto-Save). Anda tidak perlu menekan tombol simpan.</p>
                </li>
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 shrink-0"></div>
                  <p className="text-sm text-slate-600 leading-relaxed">Waktu per *section* bersifat independen. Waktu sisa di Section 1 tidak dapat diakumulasi ke Section 2.</p>
                </li>
              </ul>

              <div className="mt-auto flex flex-col gap-6">
                <div className="h-px w-full bg-slate-100"></div>

                {error && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="w-5 h-5 rounded border-[#E2E8F0] text-blue-600 focus:ring-blue-600 cursor-pointer mt-0.5"
                />
                <span className="text-sm font-semibold text-slate-700 group-hover:text-blue-600 transition-colors leading-relaxed">
                  Saya telah membaca, memahami, dan mematuhi seluruh tata tertib yang berlaku.
                </span>
              </label>

              <button
                onClick={handleStartExam}
                disabled={!agreed || loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-2xl shadow-sm shadow-blue-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span>Mengunduh Data Ujian...</span>
                ) : (
                  <>
                    <span>Mulai Kerjakan Ujian Sekarang</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>
          
        </div>
        </div>
      </main>
    </div>
  );
};
