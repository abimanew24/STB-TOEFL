import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface SectionTimerProps {
  durationSeconds: number;
  onTimeUp: () => void;
  sectionName?: string;
  theme?: 'dark' | 'light';
}

export const SectionTimer: React.FC<SectionTimerProps> = ({
  durationSeconds,
  onTimeUp,
  sectionName = 'Section',
  theme = 'light',
}) => {
  const [timeLeft, setTimeLeft] = useState(durationSeconds);
  const isLight = theme === 'light';

  useEffect(() => {
    setTimeLeft(durationSeconds);
  }, [durationSeconds]);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeUp]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isWarning = timeLeft <= 300;

  return (
    <div
      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border transition-all ${
        isWarning
          ? 'bg-rose-500/10 text-rose-600 border-rose-200 animate-pulse'
          : isLight
          ? 'bg-slate-100 text-blue-700 border-slate-200'
          : 'bg-slate-800/90 text-blue-400 border-slate-700/80'
      }`}
    >
      <Clock className="w-4 h-4 shrink-0" />
      <div className="flex items-center gap-1 font-mono text-xs sm:text-sm font-bold tracking-wider">
        <span>{minutes < 10 ? `0${minutes}` : minutes}</span>
        <span>:</span>
        <span>{seconds < 10 ? `0${seconds}` : seconds}</span>
      </div>
    </div>
  );
};
