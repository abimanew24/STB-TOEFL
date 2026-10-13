import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, ChevronLeft, ChevronRight, Grid, Send, AlertCircle, Check, Loader2, LayoutGrid } from 'lucide-react';
import { db, type QuestionItem, type PassageItem, type UserAnswerItem } from '../../services/db';
import { startAutoSync, stopAutoSync, flushSyncQueue } from '../../services/syncQueue';
import { StrictAudioPlayer } from '../../components/exam/StrictAudioPlayer';
import { SplitReadingView } from '../../components/exam/SplitReadingView';
import { SectionTimer } from '../../components/exam/SectionTimer';
import { SectionBreakModal } from './SectionBreakModal';
import api from '../../services/api';
import { useLanguage } from '../../services/languageContext';

export const ExamCBT: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [activeSection, setActiveSection] = useState<number>(1);
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [passages, setPassages] = useState<Record<number, PassageItem>>({});
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswersMap, setUserAnswersMap] = useState<Record<number, UserAnswerItem>>({});
  const [breakModalOpen, setBreakModalOpen] = useState(false);
  const [incompleteModalOpen, setIncompleteModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(3);
  const [manualGridOpen, setManualGridOpen] = useState<boolean>(false);
  
  // Track audio play state per-question in Section 1 (Strict 1x Play yang persisten)
  const [playedAudioMap, setPlayedAudioMap] = useState<Record<number, boolean>>(() => {
    try {
      const saved = localStorage.getItem('stbtoefl_played_audios');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const markAudioAsPlayed = useCallback((qId: number) => {
    setPlayedAudioMap((prev) => {
      if (prev[qId]) return prev;
      const updated = { ...prev, [qId]: true };
      try {
        localStorage.setItem('stbtoefl_played_audios', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  }, []);

  const studentInfoStr = localStorage.getItem('student_info');
  const studentInfo = studentInfoStr ? JSON.parse(studentInfoStr) : null;

  const [examUiSettings, setExamUiSettings] = useState({
    audioAutoPlay: true,
    strictOnePlay: true,
    examFontSize: 'normal' as 'normal' | 'medium' | 'large',
    examTheme: 'light' as 'light' | 'warm' | 'dark',
    showQuestionGrid: true,
    compactView: false,
    offlineMode: false,
  });

  useEffect(() => {
    api.get('/system/public-config').then((res) => {
      if (res.data) {
        setExamUiSettings({
          audioAutoPlay: res.data.audioAutoPlay !== undefined ? Boolean(res.data.audioAutoPlay) : true,
          strictOnePlay: res.data.strictOnePlay !== undefined ? Boolean(res.data.strictOnePlay) : true,
          examFontSize: (res.data.examFontSize || 'normal') as any,
          examTheme: (res.data.examTheme || 'light') as any,
          showQuestionGrid: res.data.showQuestionGrid !== undefined ? Boolean(res.data.showQuestionGrid) : true,
          compactView: res.data.compactView !== undefined ? Boolean(res.data.compactView) : false,
          offlineMode: res.data.offlineMode !== undefined ? Boolean(res.data.offlineMode) : false,
        });
      }
    }).catch(() => {});
  }, []);

  const loadExamData = useCallback(async () => {
    try {
      const allQ = await db.questions.where('nomor_section').equals(activeSection).toArray();
      setQuestions(allQ);
      setCurrentIndex(0);

      if (activeSection === 3) {
        const allPassages = await db.passages.toArray();
        const pMap: Record<number, PassageItem> = {};
        allPassages.forEach((p) => {
          pMap[p.id] = p;
        });
        setPassages(pMap);
      }

      const allAns = await db.userAnswers.toArray();
      const ansMap: Record<number, UserAnswerItem> = {};
      allAns.forEach((a) => {
        ansMap[a.soal_id] = a;
      });
      setUserAnswersMap(ansMap);
    } catch (err) {
      console.error('[LOAD EXAM DATA ERROR]', err);
    }
  }, [activeSection]);

  useEffect(() => {
    loadExamData();
    startAutoSync(10000);

    return () => {
      stopAutoSync();
    };
  }, [loadExamData]);

  useEffect(() => {
    setCountdown(3);
  }, [activeSection]);

  useEffect(() => {
    if (countdown === null) return;
    
    if (countdown > 1) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 1) {
      const timer = setTimeout(() => setCountdown(null), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Anti-Back Navigation & Prevent Refresh/Close
  useEffect(() => {
    // Prevent Back Button
    const preventBack = () => {
      window.history.pushState(null, '', window.location.href);
    };
    
    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', preventBack);

    // Prevent Page Refresh / Close Tab
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = ''; 
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('popstate', preventBack);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const handleSelectOption = async (optionLetter: string) => {
    if (!currentQuestion) return;

    const soalId = currentQuestion.id;
    const existing = userAnswersMap[soalId];

    const updatedItem: UserAnswerItem = {
      soal_id: soalId,
      jawaban_dipilih: optionLetter,
      is_flagged: existing ? existing.is_flagged : false,
      stempel_waktu_klien: Date.now(),
      synced: 0,
    };

    await db.userAnswers.put(updatedItem, soalId);
    setUserAnswersMap((prev) => ({ ...prev, [soalId]: updatedItem }));
    flushSyncQueue();
  };

  const handleToggleFlag = async () => {
    if (!currentQuestion) return;

    const soalId = currentQuestion.id;
    const existing = userAnswersMap[soalId];

    const updatedItem: UserAnswerItem = {
      soal_id: soalId,
      jawaban_dipilih: existing ? existing.jawaban_dipilih : null,
      is_flagged: existing ? !existing.is_flagged : true,
      stempel_waktu_klien: Date.now(),
      synced: 0,
    };

    await db.userAnswers.put(updatedItem, soalId);
    setUserAnswersMap((prev) => ({ ...prev, [soalId]: updatedItem }));
    flushSyncQueue();
  };

  const getSectionDuration = () => {
    if (activeSection === 1) return 35 * 60;
    if (activeSection === 2) return 25 * 60;
    return 55 * 60;
  };

  const getSectionName = (secNum: number) => {
    if (secNum === 1) return 'Section 1: Listening Comprehension';
    if (secNum === 2) return 'Section 2: Structure & Written Expression';
    return 'Section 3: Reading Comprehension';
  };

  const handleNextSection = (isTimeUp: boolean = false) => {
    if (!isTimeUp) {
      const allAnswered = questions.every(q => {
        const ans = userAnswersMap[q.id]?.jawaban_dipilih;
        return ans && ans.trim() !== "";
      });
      if (!allAnswered) {
        setIncompleteModalOpen(true);
        return;
      }
    }

    if (activeSection === 1 || activeSection === 2) {
      setBreakModalOpen(true);
    } else {
      handleFinalSubmit();
    }
  };

  const handleProceedFromBreak = () => {
    setBreakModalOpen(false);
    setActiveSection((prev) => prev + 1);
  };

  const handleFinalSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      await flushSyncQueue();
      const res = await api.post('/exam/submit');
      localStorage.removeItem('stbtoefl_played_audios');
      localStorage.setItem('student_result', JSON.stringify(res.data.result));
      navigate('/student/result');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal mengirimkan lembar ujian. Mengalihkan ke hasil...');
      localStorage.removeItem('stbtoefl_played_audios');
      navigate('/student/result');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentQuestion = questions[currentIndex];
  const currentAnswer = currentQuestion ? userAnswersMap[currentQuestion.id] : null;

  // Navigasi soal yang otomatis mengunci audio jika berpindah (sekali putar, jika ke next ya sudah wasalam)
  const handleNavigateToQuestion = (targetIndex: number) => {
    if (targetIndex === currentIndex) return;
    if (activeSection === 1 && currentQuestion?.id) {
      markAudioAsPlayed(currentQuestion.id);
    }
    setCurrentIndex(targetIndex);
  };

  // Audio khusus per nomor soal aktif (1 soal = 1 audio)
  const currentQuestionAudio = React.useMemo(() => {
    if (activeSection !== 1 || !currentQuestion?.berkas_audio) return null;
    let audio = String(currentQuestion.berkas_audio).trim();
    if (!audio) return null;
    if (audio.startsWith('http') || audio.startsWith('/')) return audio;
    if (!/\.[a-zA-Z0-9]+$/.test(audio)) {
      audio = `${audio}.wav`;
    }
    return `/static/audio/${audio}`;
  }, [currentQuestion, activeSection]);

  const answeredCount = Object.values(userAnswersMap).filter(a => a.jawaban_dipilih && questions.some(q => q.id === a.soal_id)).length;
  const totalQCount = questions.length;

  const theme = examUiSettings.examTheme || 'light';

  const pageThemeClass = theme === 'warm'
    ? 'bg-[#F5EFEB] text-[#3E2723]'
    : theme === 'dark'
    ? 'bg-[#0B1120] text-slate-100'
    : 'bg-slate-50 text-slate-900';

  const sidebarThemeClass = theme === 'warm'
    ? 'bg-[#FAF7F0] border-[#E2D9CC] text-[#3E2723]'
    : theme === 'dark'
    ? 'bg-[#1E293B] border-slate-700 text-slate-100'
    : 'bg-white border-slate-200/80';

  const sidebarTitleClass = theme === 'dark' ? 'text-white' : theme === 'warm' ? 'text-[#3E2723]' : 'text-slate-800';
  const sidebarSubClass = theme === 'dark' ? 'text-slate-400' : theme === 'warm' ? 'text-[#795548]' : 'text-slate-500';

  const summaryThemeClass = theme === 'warm'
    ? 'bg-[#EFE8DD] border-[#DDD1C0] text-[#5D4037]'
    : theme === 'dark'
    ? 'bg-[#0F172A] border-slate-700 text-slate-300'
    : 'bg-emerald-50/80 border-emerald-100 text-emerald-700';

  const prevBtnClass = theme === 'warm'
    ? 'bg-[#FAF7F0] text-[#5D4037] border-[#DDD1C0] hover:bg-[#F5EFEB]'
    : theme === 'dark'
    ? 'bg-[#1E293B] text-slate-200 border-slate-700 hover:bg-slate-800'
    : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50';

  const flagBtnClass = theme === 'dark'
    ? (currentAnswer?.is_flagged ? 'border-amber-400 text-amber-300 bg-amber-950/50 shadow-xs ring-2 ring-amber-400/40' : 'border-amber-500/70 text-amber-400 hover:bg-slate-800 bg-[#1E293B] shadow-xs')
    : theme === 'warm'
    ? (currentAnswer?.is_flagged ? 'border-[#B45309] text-[#B45309] bg-amber-100/60 shadow-xs ring-2 ring-amber-400/40' : 'border-[#D97706] text-[#B45309] hover:bg-amber-100/40 bg-[#FAF7F0] shadow-xs')
    : (currentAnswer?.is_flagged ? 'border-[#f59e0b] text-[#f59e0b] bg-amber-50 shadow-xs ring-2 ring-amber-300/40' : 'border-[#f59e0b] text-[#f59e0b] hover:bg-amber-50/60 bg-white shadow-xs');

  const finishSectionBtnClass = theme === 'dark'
    ? 'bg-emerald-950/60 hover:bg-emerald-900/80 border-emerald-700/60 text-emerald-300'
    : theme === 'warm'
    ? 'bg-[#ECE2D4] hover:bg-[#E2D4C3] border-[#D7C4AF] text-[#6D4C41]'
    : 'bg-emerald-50 hover:bg-emerald-100/90 border-emerald-200 text-[#00a67c]';

  return (
    <div className={`min-h-screen flex flex-col font-sans selection:bg-[#00a67c] selection:text-white transition-colors duration-200 ${pageThemeClass}`}>
      {/* Header Matches Design exactly */}
      <header className="sticky top-0 z-40 bg-[#00a67c] text-white px-6 py-4 flex flex-col md:flex-row items-center justify-between shadow-md gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-widest uppercase">STBTOEFL</span>
          <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded border border-white/50 tracking-wider">
            SEB LOCKED
          </span>
          {examUiSettings.offlineMode && (
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded border border-emerald-300/60 bg-emerald-700/60 tracking-wider">
              OFFLINE CACHED
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-sm md:text-base font-medium">{getSectionName(activeSection)}</span>
          <div className="flex items-center gap-2 border border-emerald-400 rounded-md px-3 py-1.5 bg-transparent">
            {/* simple icon */}
            <svg className="w-4 h-4 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span className="font-mono font-bold text-lg tracking-wider">
               <SectionTimer
                  durationSeconds={getSectionDuration()}
                  onTimeUp={() => handleNextSection(true)}
                  sectionName={getSectionName(activeSection)}
                  theme="transparent"
                  isPaused={countdown !== null}
                />
            </span>
          </div>
        </div>

        <div className="text-right flex items-center gap-3">
          {!examUiSettings.showQuestionGrid && (
            <button
              type="button"
              onClick={() => setManualGridOpen(!manualGridOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700/80 hover:bg-emerald-800 text-white text-xs font-bold border border-emerald-400/50 transition-all cursor-pointer shadow-xs"
              title="Buka / Tutup Palet Nomor Soal"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>{manualGridOpen ? 'Tutup Palet' : 'Palet Soal'}</span>
            </button>
          )}

          <div className="hidden md:block">
            <p className="text-sm font-bold">{studentInfo?.nama_lengkap || 'Peserta'}</p>
            <p className="text-[11px] text-emerald-200">
              NIM: {studentInfo?.nomor_induk || '21010042'} • Ruang Lab Utama
            </p>
          </div>
        </div>
      </header>

      {/* Main Content Workspace */}
      <div className={`flex-1 flex flex-col lg:flex-row w-full max-w-[1720px] 2xl:max-w-[1880px] mx-auto items-stretch transition-all ${
        examUiSettings.compactView 
          ? 'p-2 sm:p-4 lg:p-4 gap-4' 
          : 'p-4 sm:p-6 lg:p-8 2xl:px-10 gap-6 lg:gap-8'
      }`}>
        {/* Left Column */}
        <main className="flex-1 flex flex-col gap-6 min-w-0 justify-between">
          {questions.length === 0 ? (
            <div className={`text-center py-20 rounded-3xl border p-8 shadow-sm ${sidebarThemeClass}`}>
              <AlertCircle className="w-12 h-12 text-[#00a67c] mx-auto mb-4 animate-bounce" />
              <h3 className={`text-lg font-bold ${sidebarTitleClass}`}>Memuat Instrumen Soal Ujian...</h3>
            </div>
          ) : (
            <>
              {activeSection === 1 && currentQuestionAudio && (
                <StrictAudioPlayer 
                  key={currentQuestion?.id || currentIndex}
                  audioSrc={currentQuestionAudio} 
                  autoPlay={examUiSettings.audioAutoPlay && countdown === null} 
                  questionNumber={currentIndex + 1}
                  partName={currentQuestion?.nama_bagian}
                  isAlreadyPlayed={Boolean(currentQuestion && playedAudioMap[currentQuestion.id])}
                  allowReplay={!examUiSettings.strictOnePlay}
                  theme={theme}
                  onEnded={() => {
                    if (currentQuestion?.id) {
                      markAudioAsPlayed(currentQuestion.id);
                    }
                  }}
                />
              )}
              {activeSection === 3 && currentQuestion && currentQuestion.wacana_id && passages[currentQuestion.wacana_id] ? (
                <SplitReadingView 
                  passageTitle={passages[currentQuestion.wacana_id].judul} 
                  passageText={passages[currentQuestion.wacana_id].isi_wacana}
                  fontSize={examUiSettings.examFontSize}
                  theme={theme}
                >
                  <QuestionPanelLight 
                    question={currentQuestion} 
                    currentIndex={currentIndex} 
                    currentAnswer={currentAnswer} 
                    onSelectOption={handleSelectOption} 
                    theme={theme}
                    fontSize={examUiSettings.examFontSize}
                    compact={examUiSettings.compactView}
                  />
                </SplitReadingView>
              ) : (
                <QuestionPanelLight 
                  question={currentQuestion} 
                  currentIndex={currentIndex} 
                  currentAnswer={currentAnswer} 
                  onSelectOption={handleSelectOption} 
                  theme={theme}
                  fontSize={examUiSettings.examFontSize}
                  compact={examUiSettings.compactView}
                />
              )}
              
              {/* Footer navigation */}
              <div className="flex items-center justify-between gap-3 mt-4 pt-2">
                <button
                  onClick={() => handleNavigateToQuestion(Math.max(0, currentIndex - 1))}
                  disabled={currentIndex === 0}
                  className={`px-5 sm:px-8 py-3 rounded-xl text-sm sm:text-base font-semibold transition-all border disabled:opacity-40 disabled:cursor-not-allowed shadow-xs cursor-pointer ${prevBtnClass}`}
                >
                  {t('prevQuestionBtn')}
                </button>
                <button
                  onClick={handleToggleFlag}
                  className={`px-6 sm:px-10 py-3 rounded-xl text-sm sm:text-base font-semibold transition-all border cursor-pointer ${flagBtnClass}`}
                >
                  {t('doubtfulBtn')}
                </button>
                {currentIndex < questions.length - 1 ? (
                  <button
                    onClick={() => handleNavigateToQuestion(Math.min(questions.length - 1, currentIndex + 1))}
                    className="px-6 sm:px-9 py-3 rounded-xl text-sm sm:text-base font-semibold transition-all bg-[#00a67c] hover:bg-[#008f6b] text-white shadow-sm hover:shadow cursor-pointer"
                  >
                    {t('nextQuestionBtn')}
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      if (activeSection === 1 && currentQuestion?.id) {
                        markAudioAsPlayed(currentQuestion.id);
                      }
                      handleNextSection(false);
                    }}
                    disabled={isSubmitting}
                    className="px-6 sm:px-9 py-3 rounded-xl text-sm sm:text-base font-semibold transition-all bg-[#00a67c] hover:bg-[#008f6b] text-white shadow-sm hover:shadow cursor-pointer"
                  >
                    {t('finishSectionBtn')} →
                  </button>
                )}
              </div>
            </>
          )}
        </main>

        {/* Right Sidebar (Dikontrol oleh Pengaturan showQuestionGrid & compactView) */}
        {(examUiSettings.showQuestionGrid || manualGridOpen) && (
          <aside className={`w-full lg:w-[340px] xl:w-[380px] 2xl:w-[420px] shrink-0 border shadow-xs rounded-xl lg:rounded-2xl p-5 lg:p-6 flex flex-col justify-between h-fit lg:sticky lg:top-[90px] transition-all ${sidebarThemeClass}`}>
            <div>
              <h2 className={`text-base sm:text-lg font-bold ${sidebarTitleClass}`}>{t('questionNumberTitle')}</h2>
              <p className={`text-xs sm:text-sm mb-4 ${sidebarSubClass}`}>{getSectionName(activeSection)} ({totalQCount} {t('soalText')})</p>
              
              <div className={`flex rounded-lg mb-5 text-sm p-3 border ${summaryThemeClass}`}>
                 <div className="flex-1 text-center font-bold border-r border-current/20">{answeredCount} {t('finishedCount')}</div>
                 <div className="flex-1 text-center font-medium opacity-80">{totalQCount - answeredCount} {t('emptyCount')}</div>
              </div>

            <div className="grid grid-cols-5 gap-2 lg:gap-2.5 mb-6 max-h-[500px] overflow-y-auto pr-1">
              {questions.map((q, index) => {
                const ans = userAnswersMap[q.id];
                const isAnswered = Boolean(ans && ans.jawaban_dipilih);
                const isFlagged = Boolean(ans && ans.is_flagged);
                const isCurrent = index === currentIndex;

                let btnClass = theme === 'dark'
                  ? 'bg-[#0F172A] border border-slate-700 text-slate-300 hover:border-slate-500'
                  : theme === 'warm'
                  ? 'bg-[#FDFBF7] border border-[#E5DACD] text-[#5D4037] hover:border-[#8D5B4C]'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-400';

                if (isFlagged) {
                  btnClass = 'bg-amber-500 text-white font-bold border-amber-500 shadow-xs';
                } else if (isAnswered) {
                  btnClass = 'bg-[#00a67c] text-white font-bold border-[#00a67c] shadow-xs';
                }
                
                if (isCurrent && !isAnswered && !isFlagged) {
                  btnClass = theme === 'dark'
                    ? 'bg-[#0F172A] border-2 border-emerald-400 text-emerald-400 font-bold shadow-xs'
                    : theme === 'warm'
                    ? 'bg-[#FAF7F0] border-2 border-[#8D5B4C] text-[#8D5B4C] font-bold shadow-xs'
                    : 'bg-white border-2 border-[#00a67c] text-[#00a67c] font-bold shadow-xs';
                } else if (isCurrent) {
                  btnClass += ' ring-2 ring-offset-2 ring-[#00a67c] font-black scale-105';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => handleNavigateToQuestion(index)}
                    className={`h-10 sm:h-11 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center justify-center cursor-pointer ${btnClass}`}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => {
              if (activeSection === 1 && currentQuestion?.id) {
                markAudioAsPlayed(currentQuestion.id);
              }
              handleNextSection(false);
            }}
            disabled={isSubmitting}
            className={`w-full py-3.5 rounded-xl border font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-[0.99] ${finishSectionBtnClass}`}
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <span>{t('finishSectionBtn')} {activeSection}</span>
            )}
          </button>
        </aside>
        )}
      </div>

      <SectionBreakModal isOpen={breakModalOpen} completedSection={activeSection} nextSectionName={getSectionName(activeSection + 1)} onProceed={handleProceedFromBreak} />

      {/* Incomplete Answers Modal */}
      {incompleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-emerald-100 flex flex-col items-center text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mb-6">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">{t('incompleteAnswersTitle')}</h3>
            <p className="text-slate-500 mb-8 leading-relaxed">
              {t('incompleteAnswersDesc')}
            </p>
            <button
              onClick={() => setIncompleteModalOpen(false)}
              className="w-full py-3.5 bg-[#00a67c] hover:bg-[#008f6b] text-white font-bold rounded-xl shadow-md shadow-emerald-500/20 transition-all active:scale-[0.98] cursor-pointer"
            >
              {t('backToExamBtn')}
            </button>
          </div>
        </div>
      )}

      {countdown !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-10 max-w-sm w-full shadow-2xl border border-emerald-100 flex flex-col items-center text-center animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-slate-800 mb-2">{t('examPrepTitle')}</h3>
            <p className="text-sm text-slate-500 mb-6">{t('examStartsIn')}</p>
            <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center text-4xl font-bold tabular-nums">
              {countdown}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface QuestionPanelLightProps {
  question: QuestionItem;
  currentIndex: number;
  currentAnswer: UserAnswerItem | null;
  onSelectOption: (option: string) => void;
  theme?: 'light' | 'warm' | 'dark';
  fontSize?: 'normal' | 'medium' | 'large';
  compact?: boolean;
}

const QuestionPanelLight: React.FC<QuestionPanelLightProps> = ({ 
  question, 
  currentIndex, 
  currentAnswer, 
  onSelectOption,
  theme = 'light',
  fontSize = 'normal',
  compact = false
}) => {
  if (!question) return null;

  const options = [
    { letter: 'A', text: question.pilihan_a },
    { letter: 'B', text: question.pilihan_b },
    { letter: 'C', text: question.pilihan_c },
    { letter: 'D', text: question.pilihan_d },
  ];

  const panelTheme = theme === 'warm'
    ? 'bg-[#FAF7F0] border-[#E2D9CC] text-[#3E2723]'
    : theme === 'dark'
    ? 'bg-[#1E293B] border-slate-700 text-slate-100'
    : 'bg-white border-slate-200/80 text-slate-800';

  const badgeTheme = theme === 'warm'
    ? 'text-[#8D5B4C] bg-[#FAF7F0] border-2 border-[#8D5B4C]'
    : theme === 'dark'
    ? 'text-emerald-400 bg-[#0F172A] border-2 border-emerald-500'
    : 'text-[#00a67c] bg-white border-2 border-[#00a67c]';

  const questionTextClass = fontSize === 'large'
    ? 'text-lg sm:text-xl lg:text-2xl font-semibold leading-relaxed mb-4 lg:mb-6'
    : fontSize === 'medium'
    ? 'text-base sm:text-lg lg:text-xl font-semibold leading-relaxed mb-4 lg:mb-6'
    : 'text-sm sm:text-base lg:text-lg font-semibold leading-relaxed mb-4 lg:mb-6';

  const optionTextClass = fontSize === 'large'
    ? 'text-base sm:text-lg lg:text-xl'
    : fontSize === 'medium'
    ? 'text-sm sm:text-base lg:text-lg'
    : 'text-xs sm:text-sm lg:text-base';

  const panelPadding = compact 
    ? 'p-4 sm:p-6 lg:p-6 min-h-[340px] lg:min-h-[380px]' 
    : 'p-6 sm:p-8 lg:p-10 min-h-[400px] lg:min-h-[460px]';

  const optionPadding = compact 
    ? 'p-3 sm:p-3.5 rounded-lg gap-3 sm:gap-4' 
    : 'p-4 sm:p-5 rounded-xl gap-4 sm:gap-5';

  const optionCircle = compact
    ? 'w-8 h-8 sm:w-9 sm:h-9 text-xs sm:text-sm'
    : 'w-9 h-9 sm:w-11 sm:h-11 text-sm sm:text-base';

  const optionSpacing = compact ? 'space-y-2.5 sm:space-y-3' : 'space-y-3 sm:space-y-4';

  return (
    <div className={`rounded-xl lg:rounded-2xl shadow-xs border flex flex-col flex-1 justify-between transition-all ${panelPadding} ${panelTheme}`}>
      <div className={compact ? 'mb-4' : 'mb-6'}>
        <span className={`inline-block text-xs sm:text-sm font-bold px-3 py-1 rounded-lg mb-3 tracking-wide shadow-xs ${badgeTheme}`}>
          SOAL NO. {currentIndex + 1}
        </span>
        <div className={questionTextClass}>
          {question.pertanyaan || <span className="text-slate-400 italic font-normal">Dengarkan narator pada audio...</span>}
        </div>
      </div>

      <div className={`${optionSpacing} mt-auto`}>
        {options.map((opt) => {
          const isSelected = currentAnswer?.jawaban_dipilih === opt.letter;
          
          let optContainer = 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50/50';
          let letterClass = 'bg-slate-100 text-slate-500';

          if (theme === 'warm') {
            if (isSelected) {
              optContainer = 'bg-[#ECE2D4] border-[#8D5B4C] text-[#2C1810] shadow-xs ring-1 ring-[#8D5B4C]';
              letterClass = 'bg-[#8D5B4C] text-white shadow-xs';
            } else {
              optContainer = 'bg-[#FDFBF7] border-[#E5DACD] text-[#4E342E] hover:border-[#D7CCC8] hover:bg-[#F5EFEB]';
              letterClass = 'bg-[#EFE8DD] text-[#795548]';
            }
          } else if (theme === 'dark') {
            if (isSelected) {
              optContainer = 'bg-emerald-950/60 border-emerald-500 text-white shadow-xs ring-1 ring-emerald-500';
              letterClass = 'bg-emerald-600 text-white shadow-xs';
            } else {
              optContainer = 'bg-[#0F172A] border-slate-700 text-slate-200 hover:border-slate-600 hover:bg-slate-800';
              letterClass = 'bg-slate-800 text-slate-400';
            }
          } else {
            if (isSelected) {
              optContainer = 'bg-emerald-50/70 border-[#00a67c] text-slate-900 shadow-xs ring-1 ring-[#00a67c]';
              letterClass = 'bg-[#00a67c] text-white shadow-xs';
            } else {
              optContainer = 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50/50';
              letterClass = 'bg-slate-100 text-slate-500';
            }
          }

          return (
            <div
              key={opt.letter}
              onClick={() => onSelectOption(opt.letter)}
              className={`relative border-2 transition-all cursor-pointer flex items-center ${optionPadding} ${optContainer}`}
            >
              <div className={`rounded-full flex items-center justify-center font-bold shrink-0 transition-colors ${optionCircle} ${letterClass}`}>
                {opt.letter}
              </div>
              <div className={`flex-1 font-medium ${optionTextClass}`}>{opt.text}</div>
              {isSelected && (
                <div className={`hidden sm:flex text-xs font-bold items-center gap-1.5 border px-2.5 py-1 rounded-md shadow-xs ${
                  theme === 'dark' 
                    ? 'text-emerald-400 border-emerald-500 bg-[#0F172A]' 
                    : theme === 'warm'
                    ? 'text-[#8D5B4C] border-[#8D5B4C] bg-[#FAF7F0]'
                    : 'text-[#00a67c] border-[#00a67c] bg-white'
                }`}>
                  <Check className="w-3.5 h-3.5 stroke-[3]" /> TERPILIH
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

