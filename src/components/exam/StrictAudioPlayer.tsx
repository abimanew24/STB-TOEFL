import React, { useRef, useState, useEffect } from 'react';
import { Volume2, Play, CheckCircle2, AlertCircle } from 'lucide-react';

interface StrictAudioPlayerProps {
  audioSrc: string;
  onEnded?: () => void;
  autoPlay?: boolean;
  questionNumber?: number;
  partName?: string;
  isAlreadyPlayed?: boolean;
}

export const StrictAudioPlayer: React.FC<StrictAudioPlayerProps> = ({
  audioSrc,
  onEnded,
  autoPlay = true,
  questionNumber,
  partName,
  isAlreadyPlayed = false,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(isAlreadyPlayed);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    setIsPlaying(false);
    setHasPlayed(isAlreadyPlayed);
    setCurrentTime(0);
    setError(null);
  }, [audioSrc, isAlreadyPlayed]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeAttribute('src');
      }
    };
  }, []);

  useEffect(() => {
    if (autoPlay && !hasPlayed && !isAlreadyPlayed && duration > 0 && !isPlaying) {
      handlePlay();
    }
  }, [autoPlay, hasPlayed, isAlreadyPlayed, duration, isPlaying]);

  const handlePlay = () => {
    if (hasPlayed || isAlreadyPlayed || isPlaying) return;

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

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
    }
  };

  const formatTime = (timeInSec: number) => {
    const min = Math.floor(timeInSec / 60);
    const sec = Math.floor(timeInSec % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  return (
    <div className="w-full bg-emerald-50 border border-emerald-200/90 rounded-xl lg:rounded-2xl p-4 sm:p-5 shadow-xs flex flex-wrap sm:flex-nowrap items-center justify-between gap-4 transition-all">
      <audio
        ref={audioRef}
        src={audioSrc}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onError={() => setError('Gagal memuat berkas audio listening.')}
      />

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={handlePlay}
          disabled={hasPlayed || isPlaying}
          className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold transition-all shrink-0 ${
            hasPlayed
              ? 'bg-slate-300 text-white cursor-not-allowed'
              : isPlaying
              ? 'bg-[#00a67c] text-white animate-pulse shadow-md cursor-not-allowed'
              : 'bg-[#00a67c] hover:bg-[#008f6b] text-white shadow-md cursor-pointer'
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
            <span className="text-sm sm:text-base font-bold text-slate-800">
              Audio Listening {questionNumber ? `Soal No. ${questionNumber}` : 'Berjalan'} (Strict 1x Play)
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5 flex items-center gap-2">
            Status: {hasPlayed || isAlreadyPlayed ? 'Selesai diputar (Hanya 1x Putar)' : isPlaying ? `Sedang memutar audio soal ${questionNumber ? `no. ${questionNumber}` : ''}` : 'Siap diputar (1x Play)'}
            <span className="font-mono text-emerald-700 font-bold">
               • {formatTime(currentTime)} / {formatTime(duration)}
            </span>
            {isPlaying && (
              <span className="flex gap-0.5 items-end h-3 ml-2">
                <span className="w-1 bg-[#00a67c] h-1 animate-[bounce_1s_infinite]"></span>
                <span className="w-1 bg-[#00a67c] h-3 animate-[bounce_1.2s_infinite]"></span>
                <span className="w-1 bg-[#00a67c] h-2 animate-[bounce_0.8s_infinite]"></span>
                <span className="w-1 bg-[#00a67c] h-3 animate-[bounce_1.5s_infinite]"></span>
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="hidden sm:flex items-center gap-2.5 text-xs sm:text-sm font-medium text-slate-600">
        <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-700" />
        <span>Volume:</span>
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.05" 
          value={volume} 
          onChange={handleVolumeChange} 
          className="w-28 sm:w-32 accent-[#00a67c] cursor-pointer"
        />
      </div>

      {error && (
        <div className="absolute top-2 right-2 flex items-center gap-2 text-xs text-amber-800 bg-amber-50 p-2 rounded border border-amber-200">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
