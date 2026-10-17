import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Upload, Music, Play, Pause, Trash2, CheckCircle, 
  AlertCircle, FileAudio, RefreshCw, Search, Download, 
  Copy, Check, AlertTriangle, X, Volume2, ArrowLeft
} from 'lucide-react';
import { SidebarProctor } from '../../components/common/SidebarProctor';
import { ProctorHeader } from '../../components/proctor/ProctorHeader';
import api from '../../services/api';

export const AudioManager: React.FC = () => {
  const navigate = useNavigate();
  const [audioFiles, setAudioFiles] = useState<any[]>([]);
  const [activeMasterAudio, setActiveMasterAudio] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingFile, setDeletingFile] = useState<string | null>(null);
  const [clearingAll, setClearingAll] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedFilename, setCopiedFilename] = useState<string | null>(null);
  
  // Audio playback state
  const [playingUrl, setPlayingUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Modal / Confirm state for delete
  const [confirmDelete, setConfirmDelete] = useState<{ filename: string; inUseCount?: number } | null>(null);
  const [confirmClearAll, setConfirmClearAll] = useState(false);

  const fetchAudioFiles = async () => {
    setLoading(true);
    try {
      const [resAudio, resQ] = await Promise.all([
        api.get('/questions/audio'),
        api.get('/questions?section=1')
      ]);
      setAudioFiles(resAudio.data);
      const qWithAudio = resQ.data.find((q: any) => q.berkas_audio);
      setActiveMasterAudio(qWithAudio?.berkas_audio || null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal memuat daftar audio');
    } finally {
      setLoading(false);
    }
  };

  const handleSetAsMaster = async (audioUrl: string) => {
    try {
      await api.put('/questions/master-audio', { berkas_audio: audioUrl });
      setActiveMasterAudio(audioUrl);
      setSuccess('Audio berhasil disetel sebagai Master Audio Section 1!');
      fetchAudioFiles();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal menyetel master audio.');
    }
  };

  useEffect(() => {
    fetchAudioFiles();
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList = Array.from(files);
    const invalidFiles = fileList.filter(
      (f) => !f.type.startsWith('audio/') && !/\.(mp3|wav|ogg|m4a|aac|flac)$/i.test(f.name)
    );

    if (invalidFiles.length > 0) {
      setError(`Hanya file audio (MP3, WAV, dsb.) yang diperbolehkan. File tidak valid: ${invalidFiles.map(f => f.name).join(', ')}`);
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append('audio', file);
    });

    try {
      const res = await api.post('/questions/upload-audio', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSuccess(
        res.data?.message || 
        (fileList.length === 1 
          ? `File "${fileList[0].name}" berhasil diunggah.` 
          : `Berhasil mengunggah ${fileList.length} file audio.`)
      );
      fetchAudioFiles();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal mengunggah audio');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (filename: string, force = false) => {
    setDeletingFile(filename);
    setError(null);
    try {
      const res = await api.delete(`/questions/audio/${encodeURIComponent(filename)}${force ? '?force=true' : ''}`);
      setSuccess(res.data?.message || `File ${filename} berhasil dihapus.`);
      if (playingUrl && playingUrl.includes(filename)) {
        audioRef.current?.pause();
        setPlayingUrl(null);
      }
      setConfirmDelete(null);
      fetchAudioFiles();
    } catch (err: any) {
      if (err.response?.status === 409 && !force) {
        setConfirmDelete({ filename, inUseCount: err.response.data?.questionIds?.length || 1 });
      } else {
        setError(err.response?.data?.message || 'Gagal menghapus file audio.');
      }
    } finally {
      setDeletingFile(null);
    }
  };

  const handleClearAll = async () => {
    setClearingAll(true);
    setError(null);
    try {
      const res = await api.delete('/questions/audio');
      setSuccess(res.data?.message || 'Seluruh file audio berhasil dikosongkan.');
      audioRef.current?.pause();
      setPlayingUrl(null);
      setConfirmClearAll(false);
      fetchAudioFiles();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal mengosongkan direktori audio.');
    } finally {
      setClearingAll(false);
    }
  };

  const togglePlay = (url: string) => {
    if (playingUrl === url) {
      audioRef.current?.pause();
      setPlayingUrl(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const audioSrc = url.startsWith('http') ? url : ((import.meta.env.VITE_API_URL || '') + url);
      const newAudio = new Audio(audioSrc);
      newAudio.play().catch(e => {
        console.error('Playback error:', e);
        setError('Gagal memutar audio. Pastikan file audio tersedia.');
        setPlayingUrl(null);
      });
      newAudio.onended = () => setPlayingUrl(null);
      audioRef.current = newAudio;
      setPlayingUrl(url);
    }
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const copyToClipboard = (filename: string) => {
    navigator.clipboard.writeText(filename);
    setCopiedFilename(filename);
    setTimeout(() => setCopiedFilename(null), 2000);
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredAudioFiles = audioFiles.filter(item => 
    item.filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-screen overflow-hidden bg-[url('/bg-proctor.jpg')] bg-cover bg-center p-4 md:p-6 font-sans text-slate-800 flex gap-6 box-border selection:bg-teal-500/20 relative">
      <SidebarProctor activePath="/proctor/audio" />
      
      <div className="flex-1 flex flex-col gap-6 max-w-[1400px] mx-auto w-full overflow-hidden relative z-10">
        <ProctorHeader />

        <motion.main
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="flex-1 flex flex-col gap-6 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-6 pr-2 md:pr-4"
        >
          {/* Back Button to Bank Soal */}
          <div>
            <button
              onClick={() => navigate('/proctor/bank?section=1')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/70 hover:bg-white text-slate-700 rounded-full font-bold text-xs border border-slate-200 shadow-sm transition-all cursor-pointer hover:shadow"
            >
              <ArrowLeft className="w-4 h-4 text-teal-600" />
              <span>Kembali ke Bank Soal</span>
            </button>
          </div>

          {/* Header & Controls Section */}
          <div className="bg-white/50 backdrop-blur-md border border-white/70 rounded-[2rem] p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <Music className="w-6 h-6 text-teal-600" />
                Media Library (Audio Bank)
              </h2>
              <p className="text-slate-500 mt-1 max-w-xl text-sm leading-relaxed">
                Kelola file audio untuk soal Listening Section 1. File yang diunggah dapat ditautkan ke butir soal TOEFL, diunduh, atau dihapus jika sudah tidak digunakan.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button 
                onClick={fetchAudioFiles}
                title="Muat Ulang"
                className="px-4 py-2.5 bg-white/70 text-slate-600 rounded-full font-bold shadow-sm hover:bg-white border border-slate-200 transition-colors flex items-center gap-2 text-sm"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>

              {audioFiles.length > 0 && (
                <button
                  onClick={() => setConfirmClearAll(true)}
                  disabled={clearingAll}
                  className="px-4 py-2.5 bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 rounded-full font-bold shadow-sm transition-colors flex items-center gap-2 text-sm disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                  Kosongkan Semua
                </button>
              )}

              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="px-5 py-2.5 bg-teal-600 text-white rounded-full font-bold shadow-md shadow-teal-500/30 hover:bg-teal-500 transition-colors flex items-center gap-2 text-sm disabled:opacity-50"
              >
                {uploading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                {uploading ? 'Mengunggah...' : 'Upload Berkas Audio'}
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="audio/*,.mp3,.wav,.ogg,.m4a,.aac,.flac" 
                multiple
                className="hidden" 
              />
            </div>
          </div>

          {/* Alert Messages */}
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0 }}
                className="bg-rose-50/90 border border-rose-200 text-rose-700 px-6 py-4 rounded-2xl flex items-center justify-between shadow-sm backdrop-blur-sm"
              >
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <p className="font-medium text-sm">{error}</p>
                </div>
                <button onClick={() => setError(null)} className="text-rose-500 hover:text-rose-700">
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {success && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0 }}
                className="bg-teal-50/90 border border-teal-200 text-teal-700 px-6 py-4 rounded-2xl flex items-center justify-between shadow-sm backdrop-blur-sm"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 shrink-0" />
                  <p className="font-medium text-sm">{success}</p>
                </div>
                <button onClick={() => setSuccess(null)} className="text-teal-500 hover:text-teal-700">
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Search Bar & Total Counter */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text"
                placeholder="Cari nama file audio..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/60 border border-white/80 rounded-full text-sm font-medium text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 backdrop-blur-sm shadow-sm"
              />
            </div>

            <div className="text-xs font-bold text-slate-500 flex items-center gap-3">
              <span className="px-3 py-1 bg-white/60 rounded-full border border-white/70">
                Total File: <strong className="text-teal-700">{audioFiles.length}</strong>
              </span>
              {audioFiles.length > 0 && (
                <span className="px-3 py-1 bg-white/60 rounded-full border border-white/70">
                  Digunakan: <strong className="text-emerald-700">{audioFiles.filter(a => (a.usedCount || 0) > 0).length}</strong>
                </span>
              )}
            </div>
          </div>

          {/* Audio List Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {loading ? (
              <div className="col-span-full py-16 flex flex-col items-center justify-center text-slate-400">
                <RefreshCw className="w-8 h-8 animate-spin mb-4 text-teal-500" />
                <p className="font-medium">Memuat pustaka audio...</p>
              </div>
            ) : filteredAudioFiles.length === 0 ? (
              <div className="col-span-full py-16 flex flex-col items-center justify-center text-slate-400 bg-white/40 rounded-[2rem] border border-white/60 border-dashed p-8 text-center backdrop-blur-sm">
                <div className="w-16 h-16 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mb-4 shadow-sm">
                  <FileAudio className="w-8 h-8" />
                </div>
                <p className="font-bold text-lg text-slate-700">
                  {searchQuery ? 'File audio tidak ditemukan' : 'Pustaka Audio Kosong'}
                </p>
                <p className="text-sm text-slate-500 mt-1 max-w-md">
                  {searchQuery 
                    ? `Tidak ada file yang cocok dengan kata kunci "${searchQuery}".` 
                    : 'Belum ada berkas audio di server. Anda dapat mengunggah file audio baru kapan saja.'}
                </p>
                {!searchQuery && (
                  <div className="mt-6 flex justify-center">
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="px-6 py-2.5 bg-teal-600 text-white rounded-full font-bold shadow-md shadow-teal-500/20 hover:bg-teal-500 transition-colors flex items-center gap-2 text-sm"
                    >
                      <Upload className="w-4 h-4" />
                      Upload File Audio Sekarang
                    </button>
                  </div>
                )}
              </div>
            ) : (
              filteredAudioFiles.map((audio) => {
                const isPlaying = playingUrl === audio.url;
                const audioSrc = audio.url.startsWith('http') ? audio.url : ((import.meta.env.VITE_API_URL || '') + audio.url);
                const isUsed = (audio.usedCount || 0) > 0;

                return (
                  <div 
                    key={audio.filename} 
                    className={`bg-white/50 backdrop-blur-md border rounded-2xl p-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex flex-col justify-between group hover:bg-white/80 transition-all ${
                      isPlaying 
                        ? 'border-teal-500/80 shadow-[0_4px_25px_rgba(20,184,166,0.18)] bg-white/85' 
                        : 'border-white/70'
                    }`}
                  >
                    <div>
                      {/* Top Header & Play Button */}
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 overflow-hidden flex-1 min-w-0 pr-1">
                          <button 
                            onClick={() => togglePlay(audio.url)}
                            title={isPlaying ? 'Jeda' : 'Putar Audio'}
                            className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center cursor-pointer shadow-sm transition-all ${
                              isPlaying 
                                ? 'bg-teal-600 text-white shadow-teal-500/30 ring-4 ring-teal-500/20' 
                                : 'bg-teal-50 text-teal-600 hover:bg-teal-100 hover:scale-105'
                            }`}
                          >
                            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                          </button>
                          
                          <div className="overflow-hidden flex-1 min-w-0">
                            <h4 
                              className="font-bold text-slate-800 truncate text-sm hover:text-teal-700 transition-colors cursor-pointer" 
                              title={audio.filename}
                              onClick={() => togglePlay(audio.url)}
                            >
                              {audio.filename}
                            </h4>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs font-semibold text-slate-400">{formatSize(audio.size)}</span>
                              <span className="text-[10px] text-slate-300">•</span>
                              {isUsed ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60" title={`Digunakan di butir soal ID: ${audio.questionIds?.join(', ')}`}>
                                  <Volume2 className="w-3 h-3" />
                                  Dipakai: {audio.usedCount} Soal
                                </span>
                              ) : (
                                <span className="text-[11px] font-medium text-slate-400 bg-slate-100/70 px-2 py-0.5 rounded-full">
                                  Belum Digunakan
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Set as Master Audio Button */}
                        <div className="shrink-0 flex items-center pr-1">
                          {(() => {
                            const isMaster = activeMasterAudio === audio.url || activeMasterAudio === audio.filename || activeMasterAudio === `/static/audio/${audio.filename}`;
                            return isMaster ? (
                              <span className="text-[10px] font-bold bg-emerald-600 text-white px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm whitespace-nowrap">
                                <Check className="w-3 h-3" /> Master Aktif
                              </span>
                            ) : (
                              <button
                                onClick={() => handleSetAsMaster(audio.url)}
                                className="text-[10px] font-bold bg-white text-emerald-700 hover:bg-emerald-600 hover:text-white border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1 transition-colors shadow-sm cursor-pointer whitespace-nowrap"
                                title="Jadikan file ini sebagai Master Audio Section 1"
                              >
                                <Check className="w-3 h-3" /> Jadikan Master
                              </button>
                            );
                          })()}
                        </div>
                      </div>
                    </div>
                    
                    {/* Bottom Metadata & Action Buttons */}
                    <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-semibold text-slate-400">
                      <span>{formatDate(audio.createdAt)}</span>
                      
                      <div className="flex items-center gap-1">
                        {/* Copy filename button */}
                        <button
                          onClick={() => copyToClipboard(audio.filename)}
                          title="Salin Nama File"
                          className="p-1.5 text-slate-400 hover:text-teal-600 rounded-lg hover:bg-teal-50 transition-colors"
                        >
                          {copiedFilename === audio.filename ? (
                            <Check className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>

                        {/* Download button */}
                        <a
                          href={audioSrc}
                          download={audio.filename}
                          title="Unduh File MP3"
                          className="p-1.5 text-slate-400 hover:text-teal-600 rounded-lg hover:bg-teal-50 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                        </a>

                        {/* Delete button */}
                        <button 
                          className="text-slate-400 hover:text-rose-600 transition-colors p-1.5 rounded-lg hover:bg-rose-50"
                          title="Hapus File Audio"
                          disabled={deletingFile === audio.filename}
                          onClick={() => {
                            if (isUsed) {
                              setConfirmDelete({ filename: audio.filename, inUseCount: audio.usedCount });
                            } else {
                              if (window.confirm(`Hapus berkas audio "${audio.filename}" dari server?`)) {
                                handleDelete(audio.filename);
                              }
                            }
                          }}
                        >
                          {deletingFile === audio.filename ? (
                            <RefreshCw className="w-4 h-4 animate-spin text-rose-500" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </motion.main>
      </div>

      {/* Delete In-Use Confirmation Modal */}
      <AnimatePresence>
        {confirmDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-slate-100 flex flex-col gap-4"
            >
              <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-bold text-slate-800">Berkas Masih Terhubung ke Soal!</h3>
                <p className="text-sm text-slate-500 mt-2">
                  File <strong className="text-slate-700">{confirmDelete.filename}</strong> saat ini masih digunakan pada <strong>{confirmDelete.inUseCount} butir soal</strong> di Bank Soal.
                </p>
                <p className="text-xs text-rose-600 mt-2 bg-rose-50 p-3 rounded-xl border border-rose-100">
                  Jika dihapus, berkas fisik akan hilang dan referensi audio pada soal tersebut akan dikosongkan.
                </p>
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="flex-1 py-2.5 rounded-full font-bold text-sm bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={() => handleDelete(confirmDelete.filename, true)}
                  disabled={deletingFile === confirmDelete.filename}
                  className="flex-1 py-2.5 rounded-full font-bold text-sm bg-rose-600 text-white hover:bg-rose-700 transition-colors shadow-md shadow-rose-500/20 disabled:opacity-50"
                >
                  {deletingFile === confirmDelete.filename ? 'Menghapus...' : 'Hapus & Lepas Relasi'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Clear All Confirmation Modal */}
      <AnimatePresence>
        {confirmClearAll && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-slate-100 flex flex-col gap-4 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Kosongkan Seluruh Pustaka Audio?</h3>
              <p className="text-sm text-slate-500">
                Tindakan ini akan menghapus <strong>semua {audioFiles.length} file audio MP3</strong> dari folder server. Halaman audio akan dikosongkan sampai Anda mengunggah berkas baru.
              </p>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setConfirmClearAll(false)}
                  className="flex-1 py-2.5 rounded-full font-bold text-sm bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleClearAll}
                  disabled={clearingAll}
                  className="flex-1 py-2.5 rounded-full font-bold text-sm bg-rose-600 text-white hover:bg-rose-700 transition-colors shadow-md shadow-rose-500/20 disabled:opacity-50"
                >
                  {clearingAll ? 'Mengosongkan...' : 'Ya, Kosongkan Semua'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
