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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full min-h-[550px]">
      {/* Panel Kiri: Teks Wacana Bacaan (Light Mode Paper View) */}
      <div className="lg:col-span-6 bg-white border border-slate-200 rounded-3xl p-6 flex flex-col shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 pb-4 mb-4 border-b border-slate-200 text-blue-700 font-bold text-sm">
          <BookOpen className="w-4 h-4" />
          <span>{passageTitle || 'Reading Passage'}</span>
        </div>
        <div className="overflow-y-auto pr-3 text-slate-800 text-sm sm:text-base leading-relaxed space-y-4 font-serif">
          {passageText.split('\n\n').map((paragraph, index) => (
            <p key={index} className="indent-6 text-justify">
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      {/* Panel Kanan: Pertanyaan & Opsi Jawaban */}
      <div className="lg:col-span-6 flex flex-col">
        {children}
      </div>
    </div>
  );
};
