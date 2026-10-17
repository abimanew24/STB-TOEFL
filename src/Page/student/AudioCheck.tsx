import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Pause, Volume2, ArrowRight, AlertCircle } from 'lucide-react';
import { StudentHeader } from '../../components/student/StudentHeader';
import { useLanguage } from '../../services/languageContext';

export const AudioCheck: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [audioTested, setAudioTested] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Sumber sampel audio uji coba lokal (bukan soal ujian)
  const demoAudioSrc = '/audio-sample.mp3';

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const playSynthFallback = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.25 * volume, ctx.currentTime + idx * 0.35);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.35 + 0.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.35);
        osc.stop(ctx.currentTime + idx * 0.35 + 0.6);
      });
      setIsPlaying(true);
      setTimeout(() => setIsPlaying(false), 2000);
    } catch (e) {
      console.error(e);
      setIsPlaying(false);
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) {
      playSynthFallback();
      return;
    }
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.warn('Audio play failed, playing fallback chime:', err);
        playSynthFallback();
      });
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
  };

  return (
    <div className="h-screen bg-[#F8FAFC] text-[#0F172A] font-sans flex flex-col selection:bg-emerald-600 selection:text-white">
      
      {/* Top Header Bar */}
      <StudentHeader subtitle="Audio Setup" />

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-4xl bg-[#FFFFFF] border border-[#E2E8F0] rounded-[2rem] p-12 shadow-sm flex flex-col gap-12">
          
          {/* Title & Subtitle */}
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#0F172A]">{t('audioCheckTitle')}</h2>
            <p className="text-base text-slate-500 font-medium">{t('audioCheckDesc')}</p>
          </div>

          {/* Minimalist Audio Player */}
          <div className="flex flex-col items-center gap-6">
            <audio 
              ref={audioRef} 
              src={demoAudioSrc} 
              onEnded={handleEnded} 
              onError={() => {
                if (audioRef.current && !audioRef.current.src.includes('audio-test-tone.wav')) {
                  audioRef.current.src = '/audio-test-tone.wav';
                }
              }}
              className="hidden" 
            />
            
            <div className="flex items-center gap-6 w-full max-w-lg bg-[#F8FAFC] p-4 pr-6 rounded-full border border-[#E2E8F0]">
              <button 
                onClick={togglePlay}
                className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-full font-bold text-sm transition-colors shadow-sm cursor-pointer w-64"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                <span>{t('playAudioBtn')}</span>
              </button>

              {/* Waveform / Equalizer Animation */}
              <div className="flex-1 flex items-center justify-center gap-1 h-8 opacity-60">
                {[...Array(12)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-1 bg-[#1E293B] rounded-full transition-all duration-150 ${isPlaying ? 'animate-pulse' : 'h-1'}`}
                    style={{ 
                      height: isPlaying ? `${Math.max(20, Math.random() * 100)}%` : '4px',
                      animationDelay: `${i * 0.1}s` 
                    }}
                  ></div>
                ))}
              </div>

              {/* Volume Slider */}
              <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                <Volume2 className="w-4 h-4 text-slate-400" />
                <input 
                  type="range" 
                  min="0" max="1" step="0.1" 
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-20 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
              </div>
            </div>
            
            <p className="text-xs font-bold text-slate-400">Sampel suara musik/nada uji coba dapat diputar berulang kali.</p>
          </div>

          {/* Actions & Confirmation */}
          <div className="flex flex-col gap-8 pt-4">
            <label className="flex items-center justify-center gap-3 cursor-pointer group w-max mx-auto">
              <input 
                type="checkbox" 
                checked={audioTested}
                onChange={(e) => setAudioTested(e.target.checked)}
                className="w-5 h-5 rounded border-[#E2E8F0] text-emerald-600 focus:ring-emerald-600 cursor-pointer"
              />
              <span className="text-sm font-bold text-[#1E293B] group-hover:text-emerald-600 transition-colors">{t('audioTestedSuccess')}</span>
            </label>

            <div className="flex items-center justify-center gap-4">
              <button 
                onClick={() => navigate('/student/instructions')}
                disabled={!audioTested}
                className="px-8 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer shadow-sm shadow-emerald-600/20"
              >
                {t('nextQuestionBtn') ? 'Lanjut ke Petunjuk Ujian' : 'Lanjut ke Petunjuk Ujian'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
};
