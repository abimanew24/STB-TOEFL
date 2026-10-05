import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, ChevronLeft, ChevronRight, Grid, Send, AlertCircle } from 'lucide-react';
import { db, type QuestionItem, type PassageItem, type UserAnswerItem } from '../../services/db';
import { startAutoSync, stopAutoSync, flushSyncQueue } from '../../services/syncQueue';
import { StrictAudioPlayer } from '../../components/exam/StrictAudioPlayer';
import { SplitReadingView } from '../../components/exam/SplitReadingView';
import { QuestionPalette } from '../../components/exam/QuestionPalette';
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
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [breakModalOpen, setBreakModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    setUserAnswersMap((prev) => ({
      ...prev,
      [soalId]: updatedItem,
    }));

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

    setUserAnswersMap((prev) => ({
      ...prev,
      [soalId]: updatedItem,
    }));

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

  const handleNextSection = () => {
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
      localStorage.setItem('student_result', JSON.stringify(res.data.result));
      navigate('/student/result');
    } catch (err: any) {
      console.error('[FINAL SUBMIT ERROR]', err);
      alert(err.response?.data?.message || 'Gagal mengirimkan lembar ujian. Mengalihkan ke hasil...');
      navigate('/student/result');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentQuestion = questions[currentIndex];
  const currentAnswer = currentQuestion ? userAnswersMap[currentQuestion.id] : null;

  const sectionAudio = React.useMemo(() => {
    if (activeSection !== 1) return null;
    const qWithAudio = questions.find(q => q.berkas_audio);
    const audio = qWithAudio?.berkas_audio;
    if (!audio) return null;
    if (audio.startsWith('http') || audio.startsWith('/')) {
      return audio;
    }
    return `/static/audio/${audio}`;
  }, [questions, activeSection]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* Light Mode Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center font-bold text-sm">
            S{activeSection}
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
              {getSectionName(activeSection)}
            </h1>
            <p className="text-[11px] text-slate-500">
              Peserta: {studentInfo?.nama_lengkap || 'Mahasiswa'} ({studentInfo?.nomor_induk || ''})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <SectionTimer
            durationSeconds={getSectionDuration()}
            onTimeUp={handleNextSection}
            sectionName={getSectionName(activeSection)}
            theme="light"
          />

          <button
            onClick={() => setIsPaletteOpen(true)}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-semibold transition-all cursor-pointer"
          >
            <Grid className="w-4 h-4 text-blue-600" />
            <span className="hidden sm:inline">Daftar Soal</span>
          </button>
        </div>
      </header>

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 flex flex-col justify-center">
        {questions.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
            <AlertCircle className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-bounce" />
            <h3 className="text-lg font-bold text-slate-900">Memuat Instrumen Soal Ujian...</h3>
            <p className="text-xs text-slate-500 mt-1">Mengambil 140 soal dari penyimpanan lokal IndexedDB.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {activeSection === 1 && sectionAudio && (
              <StrictAudioPlayer audioSrc={sectionAudio} />
            )}

            {activeSection === 3 && currentQuestion && currentQuestion.wacana_id && passages[currentQuestion.wacana_id] ? (
              <SplitReadingView
                passageTitle={passages[currentQuestion.wacana_id].judul}
                passageText={passages[currentQuestion.wacana_id].isi_wacana}
              >
                <QuestionPanelLight
                  question={currentQuestion}
                  currentIndex={currentIndex}
                  currentAnswer={currentAnswer}
                  onSelectOption={handleSelectOption}
                  onToggleFlag={handleToggleFlag}
                />
              </SplitReadingView>
            ) : (
              <QuestionPanelLight
                question={currentQuestion}
                currentIndex={currentIndex}
                currentAnswer={currentAnswer}
                onSelectOption={handleSelectOption}
                onToggleFlag={handleToggleFlag}
              />
            )}
          </div>
        )}
      </main>

      {/* Light Mode Footer Navigation Bar */}
      <footer className="sticky bottom-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 sm:px-6 py-3.5 flex items-center justify-between shadow-lg">
        <button
          onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
          disabled={currentIndex === 0}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs sm:text-sm font-semibold transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Sebelumnya</span>
        </button>

        <div className="text-xs text-slate-500 font-mono">
          Soal <strong className="text-slate-900">{currentIndex + 1}</strong> dari{' '}
          <strong className="text-slate-900">{questions.length}</strong>
        </div>

        {currentIndex < questions.length - 1 ? (
          <button
            onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 text-xs sm:text-sm font-semibold transition-all cursor-pointer"
          >
            <span>Berikutnya</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleNextSection}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 text-xs sm:text-sm font-bold transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>{activeSection < 3 ? 'Selesaikan Section Ini' : 'Kumpulkan Lembar Ujian'}</span>
          </button>
        )}
      </footer>

      {/* Drawer Palette */}
      <QuestionPalette
        totalQuestions={questions.length}
        currentIndex={currentIndex}
        userAnswersMap={userAnswersMap}
        questionIds={questions.map((q) => q.id)}
        onSelectQuestion={(idx) => setCurrentIndex(idx)}
        isOpen={isPaletteOpen}
        onClose={() => setIsPaletteOpen(false)}
        theme="light"
      />

      {/* Break Modal */}
      <SectionBreakModal
        isOpen={breakModalOpen}
        completedSection={activeSection}
        nextSectionName={getSectionName(activeSection + 1)}
        onProceed={handleProceedFromBreak}
      />
    </div>
  );
};

interface QuestionPanelLightProps {
  question: QuestionItem;
  currentIndex: number;
  currentAnswer: UserAnswerItem | null;
  onSelectOption: (option: string) => void;
  onToggleFlag: () => void;
}

const QuestionPanelLight: React.FC<QuestionPanelLightProps> = ({
  question,
  currentIndex,
  currentAnswer,
  onSelectOption,
  onToggleFlag,
}) => {
  if (!question) return null;

  const options = [
    { letter: 'A', text: question.pilihan_a },
    { letter: 'B', text: question.pilihan_b },
    { letter: 'C', text: question.pilihan_c },
    { letter: 'D', text: question.pilihan_d },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between min-h-[450px]">
      <div>
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200">
          <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-xl border border-blue-200">
            Pertanyaan #{currentIndex + 1}
          </span>

          <button
            onClick={onToggleFlag}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              currentAnswer?.is_flagged
                ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-xs'
                : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${currentAnswer?.is_flagged ? 'fill-slate-950' : ''}`} />
            <span>Ragu-ragu</span>
          </button>
        </div>

        <div className="text-base sm:text-lg font-semibold text-slate-900 leading-relaxed mb-8">
          {question.pertanyaan || <span className="text-slate-400 italic font-normal">Dengarkan narator pada audio untuk mengetahui pertanyaan soal ini.</span>}
        </div>

        <div className="space-y-3">
          {options.map((opt) => {
            const isSelected = currentAnswer?.jawaban_dipilih === opt.letter;
            return (
              <div
                key={opt.letter}
                onClick={() => onSelectOption(opt.letter)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-4 ${
                  isSelected
                    ? 'bg-blue-50/90 border-blue-500 text-blue-950 font-medium shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 transition-all ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-white text-slate-600 border border-slate-300'
                  }`}
                >
                  {opt.letter}
                </div>
                <div className="text-sm sm:text-base">{opt.text}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
