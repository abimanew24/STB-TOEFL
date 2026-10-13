import React from 'react';
import { BookOpen } from 'lucide-react';

interface SplitReadingViewProps {
  passageTitle?: string | null;
  passageText: string;
  children: React.ReactNode;
  fontSize?: 'normal' | 'medium' | 'large';
  theme?: 'light' | 'warm' | 'dark';
}

export const SplitReadingView: React.FC<SplitReadingViewProps> = ({
  passageTitle,
  passageText,
  children,
  fontSize = 'normal',
  theme = 'light',
}) => {
  const fontClass = fontSize === 'large'
    ? 'text-base sm:text-lg lg:text-xl leading-loose'
    : fontSize === 'medium'
    ? 'text-sm sm:text-base lg:text-lg leading-relaxed'
    : 'text-xs sm:text-sm lg:text-base leading-normal';

  const themeClass = theme === 'warm'
    ? 'bg-[#FAF7F0] border-amber-200/80 text-amber-950'
    : theme === 'dark'
    ? 'bg-slate-900 border-slate-800 text-slate-100'
    : 'bg-white border-slate-200/80 text-slate-800';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full flex-1">
      {/* Panel Kiri: Teks Wacana Bacaan */}
      <div className={`lg:col-span-6 rounded-xl lg:rounded-2xl p-6 sm:p-8 flex flex-col shadow-xs overflow-hidden transition-all border ${themeClass}`}>
        <div className="flex items-center gap-2 pb-4 mb-4 border-b border-slate-100/50 text-[#00a67c] font-bold text-sm sm:text-base">
          <BookOpen className="w-5 h-5" />
          <span>{passageTitle || 'Reading Passage'}</span>
        </div>
        <div className={`overflow-y-auto pr-3 space-y-4 font-serif ${fontClass}`}>
          {passageText.split('\n\n').map((paragraph, index) => (
            <p key={index} className="indent-6 text-justify">
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      {/* Panel Kanan: Pertanyaan & Opsi Jawaban */}
      <div className="lg:col-span-6 flex flex-col flex-1">
        {children}
      </div>
    </div>
  );
};
