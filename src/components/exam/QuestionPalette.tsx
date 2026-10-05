import React from 'react';
import { Grid, Bookmark, X } from 'lucide-react';
import type { UserAnswerItem } from '../../services/db';

interface QuestionPaletteProps {
  totalQuestions: number;
  currentIndex: number;
  userAnswersMap: Record<number, UserAnswerItem>;
  questionIds: number[];
  onSelectQuestion: (index: number) => void;
  isOpen: boolean;
  onClose: () => void;
  theme?: 'dark' | 'light';
}

export const QuestionPalette: React.FC<QuestionPaletteProps> = ({
  totalQuestions,
  currentIndex,
  userAnswersMap,
  questionIds,
  onSelectQuestion,
  isOpen,
  onClose,
  theme = 'light',
}) => {
  if (!isOpen) return null;

  const isLight = theme === 'light';
  let answeredCount = 0;
  let flaggedCount = 0;

  questionIds.forEach((qId) => {
    const ans = userAnswersMap[qId];
    if (ans && ans.jawaban_dipilih) answeredCount++;
    if (ans && ans.is_flagged) flaggedCount++;
  });

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div
        className={`w-full max-w-sm h-full flex flex-col p-6 shadow-2xl border-l transition-colors ${
          isLight
            ? 'bg-white border-slate-200 text-slate-900'
            : 'bg-slate-900 border-slate-800 text-white'
        }`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between pb-4 border-b ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
          <div className="flex items-center gap-2 font-bold text-base">
            <Grid className={`w-5 h-5 ${isLight ? 'text-blue-600' : 'text-blue-400'}`} />
            <span>Nomor Soal</span>
          </div>
          <button
            onClick={onClose}
            className={`p-1 rounded-lg transition-colors ${
              isLight ? 'text-slate-400 hover:text-slate-900 hover:bg-slate-100' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Legend */}
        <div className={`py-4 border-b flex items-center justify-around text-xs font-medium ${isLight ? 'border-slate-200 text-slate-600' : 'border-slate-800 text-slate-300'}`}>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-emerald-500"></span>
            <span>Dijawab ({answeredCount})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-amber-500"></span>
            <span>Ragu ({flaggedCount})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`w-3 h-3 rounded ${isLight ? 'bg-slate-200' : 'bg-slate-700'}`}></span>
            <span>Kosong ({totalQuestions - answeredCount})</span>
          </div>
        </div>

        {/* Question Grid */}
        <div className="flex-1 overflow-y-auto py-4">
          <div className="grid grid-cols-5 gap-2.5">
            {questionIds.map((qId, index) => {
              const ans = userAnswersMap[qId];
              const isAnswered = Boolean(ans && ans.jawaban_dipilih);
              const isFlagged = Boolean(ans && ans.is_flagged);
              const isCurrent = index === currentIndex;

              let btnClass = isLight ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200' : 'bg-slate-800 text-slate-300 hover:bg-slate-700';

              if (isFlagged) {
                btnClass = 'bg-amber-500 text-slate-950 font-bold border border-amber-400';
              } else if (isAnswered) {
                btnClass = 'bg-emerald-600 text-white font-bold';
              }

              if (isCurrent) {
                btnClass += isLight
                  ? ' ring-2 ring-blue-600 ring-offset-2 ring-offset-white font-extrabold'
                  : ' ring-2 ring-blue-400 ring-offset-2 ring-offset-slate-900';
              }

              return (
                <button
                  key={qId}
                  onClick={() => {
                    onSelectQuestion(index);
                    onClose();
                  }}
                  className={`relative h-10 rounded-xl flex items-center justify-center text-xs transition-all cursor-pointer ${btnClass}`}
                >
                  <span>{index + 1}</span>
                  {isFlagged && (
                    <Bookmark className="w-2.5 h-2.5 absolute top-1 right-1 fill-slate-950 stroke-none" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className={`pt-4 border-t text-center text-xs ${isLight ? 'border-slate-200 text-slate-500' : 'border-slate-800 text-slate-400'}`}>
          Klik nomor untuk melompat langsung ke soal.
        </div>
      </div>
    </div>
  );
};
