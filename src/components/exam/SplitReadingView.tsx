import React from 'react';
import { BookOpen } from 'lucide-react';

interface SplitReadingViewProps {
  passageTitle?: string | null;
  passageText: string;
  children: React.ReactNode;
}

export const SplitReadingView: React.FC<SplitReadingViewProps> = ({
  passageTitle,
  passageText,
  children,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full flex-1">
      {/* Panel Kiri: Teks Wacana Bacaan (Light Mode Paper View) */}
      <div className="lg:col-span-6 bg-white border border-slate-200/80 rounded-xl lg:rounded-2xl p-6 sm:p-8 flex flex-col shadow-xs overflow-hidden">
        <div className="flex items-center gap-2 pb-4 mb-4 border-b border-slate-100 text-[#00a67c] font-bold text-sm sm:text-base">
          <BookOpen className="w-5 h-5" />
          <span>{passageTitle || 'Reading Passage'}</span>
        </div>
        <div className="overflow-y-auto pr-3 text-slate-800 text-sm sm:text-base lg:text-lg leading-relaxed space-y-4 font-serif">
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
