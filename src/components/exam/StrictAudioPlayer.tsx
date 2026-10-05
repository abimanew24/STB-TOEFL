import React, { useRef, useState, useEffect } from 'react';
import { Volume2, Play, CheckCircle2, AlertCircle } from 'lucide-react';

interface StrictAudioPlayerProps {
  audioSrc: string;
  onEnded?: () => void;
  autoPlay?: boolean;
}

export const StrictAudioPlayer: React.FC<StrictAudioPlayerProps> = ({
  audioSrc,
  onEnded,
  autoPlay = true,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsPlaying(false);
    setHasPlayed(false);
    setCurrentTime(0);
    setError(null);
  }, [audioSrc]);

  const handlePlay = () => {
    if (hasPlayed || isPlaying) return;

    if (audioRef.current) {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.error('[AUDIO PLAY ERROR]', err);
          setError('Klik tombol putar untuk mendengarkan audio.');
        });
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      if (autoPlay && !hasPlayed) {
        handlePlay();
      }
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setHasPlayed(true);
    if (onEnded) {
      onEnded();
    }
  };

  const formatTime = (timeInSec: number) => {
    const min = Math.floor(timeInSec / 60);
    const sec = Math.floor(timeInSec % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="w-full bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col gap-3">
      <audio
        ref={audioRef}
        src={audioSrc}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onError={() => setError('Gagal memuat berkas audio listening.')}
      />

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handlePlay}
            disabled={hasPlayed || isPlaying}
            className={`w-12 h-12 rounded-xl flex items-center justify-center font-semibold transition-all ${
              hasPlayed
                ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 cursor-not-allowed'
                : isPlaying
                ? 'bg-blue-600 text-white animate-pulse shadow-md shadow-blue-600/30 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 cursor-pointer'
            }`}
          >
            {hasPlayed ? (
              <CheckCircle2 className="w-6 h-6" />
            ) : isPlaying ? (
              <Volume2 className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6 ml-0.5" />
            )}
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900">Listening Audio Player</span>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                Single Play (1x)
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {hasPlayed
                ? 'Audio selesai diputar. Sesuai aturan ETS, audio tidak dapat diputar ulang.'
                : isPlaying
                ? 'Audio sedang diputar... Dengarkan dengan seksama.'
                : 'Siap diputar (Strict 1x Play).'}
            </p>
          </div>
        </div>

        <div className="text-right font-mono text-xs text-slate-600">
          <span>{formatTime(currentTime)}</span> / <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="relative w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
        <div
          className={`h-full transition-all duration-200 ${
            hasPlayed ? 'bg-emerald-500' : 'bg-blue-600'
          }`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {error && (
        <div className="flex items-center gap-2 text-xs text-amber-800 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
