import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, ChevronLeft, ChevronRight, Grid, Send, AlertCircle, Check, Loader2 } from 'lucide-react';
import { db, type QuestionItem, type PassageItem, type UserAnswerItem } from '../../services/db';
import { startAutoSync, stopAutoSync, flushSyncQueue } from '../../services/syncQueue';
import { StrictAudioPlayer } from '../../components/exam/StrictAudioPlayer';
import { SplitReadingView } from '../../components/exam/SplitReadingView';
import { SectionTimer } from '../../components/exam/SectionTimer';
import { SectionBreakModal } from './SectionBreakModal';
import api from '../../services/api';

export const ExamCBT: React.FC = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<number>(1);
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [passages, setPassages] = useState<Record<number, PassageItem>>({});
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswersMap, setUserAnswersMap] = useState<Record<number, UserAnswerItem>>({});
  const [breakModalOpen, setBreakModalOpen] = useState(false);
  const [incompleteModalOpen, setIncompleteModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(3);
  
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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-[#00a67c] selection:text-white">
      {/* Header Matches Design exactly */}
      <header className="sticky top-0 z-40 bg-[#00a67c] text-white px-6 py-4 flex flex-col md:flex-row items-center justify-between shadow-md gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-widest uppercase">STBTOEFL</span>
          <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded border border-white/50 tracking-wider">
            SEB LOCKED
          </span>
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

        <div className="text-right hidden md:block">
          <p className="text-sm font-bold">{studentInfo?.nama_lengkap || 'Budi Santoso'}</p>
          <p className="text-[11px] text-emerald-200">
            NIM: {studentInfo?.nomor_induk || '21010042'} • Ruang Lab Utama
          </p>
        </div>
      </header>

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col lg:flex-row w-full max-w-[1720px] 2xl:max-w-[1880px] mx-auto p-4 sm:p-6 lg:p-8 2xl:px-10 gap-6 lg:gap-8 items-stretch">
        {/* Left Column */}
        <main className="flex-1 flex flex-col gap-6 min-w-0 justify-between">
          {questions.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
              <AlertCircle className="w-12 h-12 text-[#00a67c] mx-auto mb-4 animate-bounce" />
              <h3 className="text-lg font-bold text-slate-900">Memuat Instrumen Soal Ujian...</h3>
            </div>
          ) : (
            <>
              {activeSection === 1 && currentQuestionAudio && (
                <StrictAudioPlayer 
                  key={currentQuestion?.id || currentIndex}
                  audioSrc={currentQuestionAudio} 
                  autoPlay={countdown === null} 
                  questionNumber={currentIndex + 1}
                  partName={currentQuestion?.nama_bagian}
                  isAlreadyPlayed={Boolean(currentQuestion && playedAudioMap[currentQuestion.id])}
                  onEnded={() => {
                    if (currentQuestion?.id) {
                      markAudioAsPlayed(currentQuestion.id);
                    }
                  }}
                />
              )}
              {activeSection === 3 && currentQuestion && currentQuestion.wacana_id && passages[currentQuestion.wacana_id] ? (
                <SplitReadingView passageTitle={passages[currentQuestion.wacana_id].judul} passageText={passages[currentQuestion.wacana_id].isi_wacana}>
                  <QuestionPanelLight question={currentQuestion} currentIndex={currentIndex} currentAnswer={currentAnswer} onSelectOption={handleSelectOption} />
                </SplitReadingView>
              ) : (
                <QuestionPanelLight question={currentQuestion} currentIndex={currentIndex} currentAnswer={currentAnswer} onSelectOption={handleSelectOption} />
              )}
              
              {/* Footer navigation */}
              <div className="flex items-center justify-between gap-3 mt-4 pt-2">
                <button
                  onClick={() => handleNavigateToQuestion(Math.max(0, currentIndex - 1))}
                  disabled={currentIndex === 0}
                  className="px-5 sm:px-8 py-3 rounded-xl text-sm sm:text-base font-semibold transition-all bg-white text-slate-600 border border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 shadow-xs"
                >
                  ← Soal Sebelumnya
                </button>
                <button
                  onClick={handleToggleFlag}
                  className={`px-6 sm:px-10 py-3 rounded-xl text-sm sm:text-base font-semibold transition-all border ${
                    currentAnswer?.is_flagged ? 'border-[#f59e0b] text-[#f59e0b] bg-amber-50 shadow-xs ring-2 ring-amber-300/40' : 'border-[#f59e0b] text-[#f59e0b] hover:bg-amber-50/60 bg-white shadow-xs'
                  }`}
                >
                  Ragu-ragu
                </button>
                {currentIndex < questions.length - 1 ? (
                  <button
                    onClick={() => handleNavigateToQuestion(Math.min(questions.length - 1, currentIndex + 1))}
                    className="px-6 sm:px-9 py-3 rounded-xl text-sm sm:text-base font-semibold transition-all bg-[#00a67c] hover:bg-[#008f6b] text-white shadow-sm hover:shadow"
                  >
                    Soal Berikutnya →
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
                    className="px-6 sm:px-9 py-3 rounded-xl text-sm sm:text-base font-semibold transition-all bg-[#00a67c] hover:bg-[#008f6b] text-white shadow-sm hover:shadow"
                  >
                    Selesaikan Section →
                  </button>
                )}
              </div>
            </>
          )}
        </main>

        {/* Right Sidebar */}
        <aside className="w-full lg:w-[340px] xl:w-[380px] 2xl:w-[420px] shrink-0 bg-white border border-slate-200/80 shadow-xs rounded-xl lg:rounded-2xl p-5 lg:p-6 flex flex-col justify-between h-fit lg:sticky lg:top-[90px] transition-all">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-800">Nomor Soal</h2>
            <p className="text-xs sm:text-sm text-slate-500 mb-4">{getSectionName(activeSection)} ({totalQCount} Soal)</p>
            
            <div className="flex rounded-lg bg-emerald-50/80 mb-5 text-sm p-3 border border-emerald-100">
               <div className="flex-1 text-center font-bold text-emerald-700 border-r border-emerald-200/60">{answeredCount} Selesai</div>
               <div className="flex-1 text-center font-medium text-slate-500">{totalQCount - answeredCount} Kosong</div>
            </div>

            <div className="grid grid-cols-5 gap-2 lg:gap-2.5 mb-6 max-h-[500px] overflow-y-auto pr-1">
              {questions.map((q, index) => {
                const ans = userAnswersMap[q.id];
                const isAnswered = Boolean(ans && ans.jawaban_dipilih);
                const isFlagged = Boolean(ans && ans.is_flagged);
                const isCurrent = index === currentIndex;

                let btnClass = 'bg-white border border-slate-200 text-slate-600 hover:border-slate-400';
                if (isFlagged) {
                  btnClass = 'bg-amber-500 text-white font-bold border-amber-500 shadow-xs';
                } else if (isAnswered) {
                  btnClass = 'bg-[#00a67c] text-white font-bold border-[#00a67c] shadow-xs';
                }
                
                if (isCurrent && !isAnswered && !isFlagged) {
                  btnClass = 'bg-white border-2 border-[#00a67c] text-[#00a67c] font-bold shadow-xs';
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
            className="w-full py-3.5 rounded-xl bg-emerald-50 hover:bg-emerald-100/90 border border-emerald-200 text-[#00a67c] font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-[0.99]"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <span>Selesaikan Section {activeSection}</span>
            )}
          </button>
        </aside>
      </div>

      <SectionBreakModal isOpen={breakModalOpen} completedSection={activeSection} nextSectionName={getSectionName(activeSection + 1)} onProceed={handleProceedFromBreak} />

      {/* Incomplete Answers Modal */}
      {incompleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-emerald-100 flex flex-col items-center text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mb-6">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Jawaban Belum Lengkap</h3>
            <p className="text-slate-500 mb-8 leading-relaxed">
              Mohon periksa kembali. Anda belum menjawab seluruh pertanyaan pada Section ini. Harap lengkapi semua jawaban sebelum melanjutkan ke tahap berikutnya.
            </p>
            <button
              onClick={() => setIncompleteModalOpen(false)}
              className="w-full py-3.5 bg-[#00a67c] hover:bg-[#008f6b] text-white font-bold rounded-xl shadow-md shadow-emerald-500/20 transition-all active:scale-[0.98]"
            >
              Kembali ke Soal Ujian
            </button>
          </div>
        </div>
      )}

      {countdown !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-10 max-w-sm w-full shadow-2xl border border-emerald-100 flex flex-col items-center text-center animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-slate-800 mb-2">Persiapan Ujian</h3>
            <p className="text-sm text-slate-500 mb-6">Ujian akan dimulai dalam:</p>
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
}

const QuestionPanelLight: React.FC<QuestionPanelLightProps> = ({ question, currentIndex, currentAnswer, onSelectOption }) => {
  if (!question) return null;

  const options = [
    { letter: 'A', text: question.pilihan_a },
    { letter: 'B', text: question.pilihan_b },
    { letter: 'C', text: question.pilihan_c },
    { letter: 'D', text: question.pilihan_d },
  ];

  return (
    <div className="bg-white rounded-xl lg:rounded-2xl p-6 sm:p-8 lg:p-10 shadow-xs border border-slate-200/80 flex flex-col flex-1 justify-between min-h-[400px] lg:min-h-[460px] transition-all">
      <div className="mb-6">
        <span className="inline-block text-xs sm:text-sm font-bold text-[#00a67c] bg-white px-3.5 py-1.5 rounded-lg border-2 border-[#00a67c] mb-5 tracking-wide shadow-xs">
          SOAL NO. {currentIndex + 1}
        </span>
        <div className="text-base sm:text-lg lg:text-xl font-semibold text-slate-800 leading-relaxed mb-6 lg:mb-8">
          {question.pertanyaan || <span className="text-slate-400 italic font-normal">Dengarkan narator pada audio...</span>}
        </div>
      </div>

      <div className="space-y-3 sm:space-y-4 mt-auto">
        {options.map((opt) => {
          const isSelected = currentAnswer?.jawaban_dipilih === opt.letter;
          return (
            <div
              key={opt.letter}
              onClick={() => onSelectOption(opt.letter)}
              className={`relative p-4 sm:p-5 rounded-xl border-2 transition-all cursor-pointer flex items-center gap-4 sm:gap-5 ${
                isSelected
                  ? 'bg-emerald-50/70 border-[#00a67c] text-slate-900 shadow-xs ring-1 ring-[#00a67c]'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50/50'
              }`}
            >
              <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-sm sm:text-base font-bold shrink-0 transition-colors ${
                isSelected ? 'bg-[#00a67c] text-white shadow-xs' : 'bg-slate-100 text-slate-500'
              }`}>
                {opt.letter}
              </div>
              <div className="text-sm sm:text-base lg:text-lg flex-1 font-medium">{opt.text}</div>
              {isSelected && (
                <div className="hidden sm:flex text-xs font-bold text-[#00a67c] items-center gap-1.5 border border-[#00a67c] bg-white px-2.5 py-1 rounded-md shadow-xs">
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
