import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Pause, Volume2, ArrowRight, AlertCircle } from 'lucide-react';
import { StudentHeader } from '../../components/student/StudentHeader';

export const AudioCheck: React.FC = () => {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [audioTested, setAudioTested] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const demoAudioSrc = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.error('Audio play failed:', err);
        alert('Gagal memutar audio. Pastikan koneksi internet stabil atau browser Anda mendukung pemutaran MP3.');
        setIsPlaying(false);
      });
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
  };

  return (
    <div className="h-screen bg-[#F8FAFC] text-[#0F172A] font-sans flex flex-col selection:bg-blue-600 selection:text-white">
      
      {/* Top Header Bar */}
      <StudentHeader subtitle="Audio Setup" />

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-4xl bg-[#FFFFFF] border border-[#E2E8F0] rounded-[2rem] p-12 shadow-sm flex flex-col gap-12">
          
          {/* Title & Subtitle */}
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#0F172A]">Pemeriksaan Audio</h2>
            <p className="text-base text-slate-500 font-medium">Pasang headphone Anda dan pastikan suara narator terdengar jelas.</p>
          </div>

          {/* Minimalist Audio Player */}
          <div className="flex flex-col items-center gap-6">
            <audio ref={audioRef} src={demoAudioSrc} onEnded={handleEnded} className="hidden" />
            
            <div className="flex items-center gap-6 w-full max-w-lg bg-[#F8FAFC] p-4 pr-6 rounded-full border border-[#E2E8F0]">
              <button 
                onClick={togglePlay}
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-bold text-sm transition-colors shadow-sm cursor-pointer w-64"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                <span>Putar Suara Percakapan</span>
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
                  className="w-20 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>
            </div>
            
            <p className="text-xs font-bold text-slate-400">Sampel suara lokal dapat diputar berulang kali.</p>
          </div>

          {/* Actions & Confirmation */}
          <div className="flex flex-col gap-8 pt-4">
            <label className="flex items-center justify-center gap-3 cursor-pointer group w-max mx-auto">
              <input 
                type="checkbox" 
                checked={audioTested}
                onChange={(e) => setAudioTested(e.target.checked)}
                className="w-5 h-5 rounded border-[#E2E8F0] text-blue-600 focus:ring-blue-600 cursor-pointer"
              />
              <span className="text-sm font-bold text-[#1E293B] group-hover:text-blue-600 transition-colors">Saya mendengar narator dengan jelas.</span>
            </label>

            <div className="flex items-center justify-center gap-4">
              <button 
                onClick={() => navigate('/student/instructions')}
                disabled={!audioTested}
                className="px-8 py-3.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer shadow-sm shadow-blue-600/20"
              >
                Lanjut ke Petunjuk Ujian
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
};
