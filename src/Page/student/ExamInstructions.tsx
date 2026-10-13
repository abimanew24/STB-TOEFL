import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, ShieldAlert, Clock, ArrowRight, CheckSquare, Headphones, Edit3, BookOpen, AlertCircle } from 'lucide-react';
import { StudentHeader } from '../../components/student/StudentHeader';
import api from '../../services/api';
import { db } from '../../services/db';
import { useLanguage } from '../../services/languageContext';

export const ExamInstructions: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
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

      // Hubungkan Pengaturan Proctor: Preload Semua Audio Listening ke Cache Browser
      try {
        const cfgRes = await api.get('/system/public-config');
        if (cfgRes.data?.preloadAllAudio && questions && Array.isArray(questions)) {
          const audioFiles = questions
            .filter((q: any) => q.berkas_audio)
            .map((q: any) => {
              let f = String(q.berkas_audio).trim();
              if (!/\.[a-zA-Z0-9]+$/.test(f)) f = `${f}.wav`;
              return f.startsWith('http') || f.startsWith('/') ? f : `/static/audio/${f}`;
            });
          
          // Cache semua file audio di latar belakang agar audio Section 1 instan
          Promise.allSettled(audioFiles.map((src: string) => fetch(src, { cache: 'force-cache' }))).catch(() => {});
        }
      } catch (e) {
        // Abaikan error preload non-blocking
      }

      localStorage.removeItem('stbtoefl_played_audios');
      navigate('/student/exam');
    } catch (err: any) {
      console.error('[PREFETCH ERROR]', err);
      // Jika mode offline aktif dan cache Dexie sudah tersedia, izinkan peserta melanjutkan ujian
      try {
        const cachedCount = await db.questions.count();
        if (cachedCount > 0) {
          navigate('/student/exam');
          return;
        }
      } catch (cacheErr) {
        // Abaikan dan lempar error jaringan biasa
      }
      setError(err.response?.data?.message || 'Gagal mengunduh instrumen soal ujian dari peladen.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans flex flex-col selection:bg-emerald-600 selection:text-white">
      <StudentHeader subtitle={t('examInstSubtitle')} />

      <main className="flex-1 w-full max-w-7xl mx-auto p-6 md:p-8 lg:p-12 flex flex-col justify-center">
        
        {/* Header Title */}
        <div className="mb-10 text-center md:text-left flex items-center gap-4">
          <div className="hidden md:flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm">
            <FileText className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-[#0F172A]">{t('examInstTitle')}</h2>
            <p className="text-sm font-medium text-slate-500 mt-1">{t('examInstDesc')}</p>
          </div>
        </div>

        {/* 2-Column Desktop Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          
          {/* LEFT COLUMN: Exam Structure */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">{t('examStructureTitle')}</h3>
            
            {/* Section 1 */}
            <div className="bg-white border border-[#E2E8F0] p-6 rounded-2xl flex items-start gap-5 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                <Headphones className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h4 className="text-lg font-bold text-[#1E293B]">{t('sec1ListeningTitle')}</h4>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 flex items-center gap-1"><Clock className="w-3 h-3"/> {t('sec1ListeningDuration')}</span>
                </div>
                <p className="text-sm font-semibold text-slate-700 mb-1">{t('sec1ListeningQuestions')}</p>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {t('sec1ListeningDesc')}
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
                  <h4 className="text-lg font-bold text-[#1E293B]">{t('sec2StructureTitle')}</h4>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 flex items-center gap-1"><Clock className="w-3 h-3"/> {t('sec2StructureDuration')}</span>
                </div>
                <p className="text-sm font-semibold text-slate-700 mb-1">{t('sec2StructureQuestions')}</p>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {t('sec2StructureDesc')}
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
                  <h4 className="text-lg font-bold text-[#1E293B]">{t('sec3ReadingTitle')}</h4>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 flex items-center gap-1"><Clock className="w-3 h-3"/> {t('sec3ReadingDuration')}</span>
                </div>
                <p className="text-sm font-semibold text-slate-700 mb-1">{t('sec3ReadingQuestions')}</p>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {t('sec3ReadingDesc')}
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
                <h3 className="text-base uppercase tracking-wider">{t('integrityRulesTitle')}</h3>
              </div>

              <ul className="space-y-4">
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 shrink-0"></div>
                  <p className="text-sm text-slate-600 leading-relaxed">{t('ruleSebLocked')}</p>
                </li>
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 shrink-0"></div>
                  <p className="text-sm text-slate-600 leading-relaxed">{t('ruleAutoSave')}</p>
                </li>
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 shrink-0"></div>
                  <p className="text-sm text-slate-600 leading-relaxed">{t('ruleIndependentSections')}</p>
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
                  className="w-5 h-5 rounded border-[#E2E8F0] text-emerald-600 focus:ring-emerald-600 cursor-pointer mt-0.5"
                />
                <span className="text-sm font-semibold text-slate-700 group-hover:text-emerald-600 transition-colors leading-relaxed">
                  {t('agreeTermsCheckbox')}
                </span>
              </label>

              <button
                onClick={handleStartExam}
                disabled={!agreed || loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-6 rounded-2xl shadow-sm shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span>{t('downloadingExamData')}</span>
                ) : (
                  <>
                    <span>{t('startExamBtn')}</span>
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
