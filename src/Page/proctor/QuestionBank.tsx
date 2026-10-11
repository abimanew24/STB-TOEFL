import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  BookOpen, Plus, Upload, Volume2, VolumeX, Edit2, Trash2, 
  PlayCircle, PauseCircle, CheckCircle2, Server, Clock, FileText, Download,
  Music, Check, RefreshCw
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { SidebarProctor } from '../../components/common/SidebarProctor';
import { ProctorHeader } from '../../components/proctor/ProctorHeader';
import { Modal } from '../../components/common/Modal';
import api from '../../services/api';

const MiniAudioPlayer = ({ src, filename, className = '' }: { src: string, filename: string, className?: string }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      } else {
        audioRef.current.play().catch(e => {
          console.error('Audio play error:', e);
          alert('Gagal memutar audio! Pastikan kamu benar-benar mengunggah file MP3-nya melalui tombol "Unggah" atau "Ganti", bukan sekadar mengetikkan namanya di Excel.');
          setIsPlaying(false);
        });
      }
    }
  };

  return (
    <div className={`flex items-center gap-4 bg-white/60 border border-white/50 p-2 pr-4 rounded-full w-max ${className}`}>
      <audio 
        ref={audioRef} 
        src={src} 
        onEnded={() => setIsPlaying(false)} 
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        className="hidden" 
      />
      <button 
        onClick={togglePlay}
        className="w-10 h-10 shrink-0 rounded-full bg-emerald-600 text-slate-800 flex items-center justify-center hover:bg-emerald-700 transition-colors shadow-[0_8px_30px_rgb(0,0,0,0.04)] cursor-pointer"
      >
        {isPlaying ? <PauseCircle className="w-5 h-5" /> : <PlayCircle className="w-5 h-5 ml-0.5" />}
      </button>
      <div className="flex flex-col">
        <span className="text-xs font-bold text-slate-800 font-mono truncate max-w-[180px]" title={filename}>
          {filename}
        </span>
        <span className="text-[10px] font-bold text-slate-400">Audio Preview</span>
      </div>
      <div className={`flex items-end gap-1 h-5 ml-4 opacity-50 ${isPlaying ? '' : 'hidden'}`}>
        <div className="w-1 h-3 bg-emerald-600 rounded-full animate-pulse"></div>
        <div className="w-1 h-5 bg-emerald-600 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-1 h-2 bg-emerald-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-1 h-4 bg-emerald-600 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
        <div className="w-1 h-5 bg-emerald-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        <div className="w-1 h-3 bg-emerald-600 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>
      <div className={`flex items-center gap-1 h-5 ml-4 opacity-30 ${isPlaying ? 'hidden' : ''}`}>
        <div className="w-1 h-1 bg-emerald-600 rounded-full"></div>
        <div className="w-1 h-1 bg-emerald-600 rounded-full"></div>
        <div className="w-1 h-1 bg-emerald-600 rounded-full"></div>
        <div className="w-1 h-1 bg-emerald-600 rounded-full"></div>
        <div className="w-1 h-1 bg-emerald-600 rounded-full"></div>
        <div className="w-1 h-1 bg-emerald-600 rounded-full"></div>
      </div>
    </div>
  );
};

export const QuestionBank: React.FC = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<any[]>([]);
  const [passages, setPassages] = useState<any[]>([]);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const sectionParam = searchParams.get('section');
  const [selectedSection, setSelectedSection] = useState<number>(sectionParam ? parseInt(sectionParam) : 1);

  // Sync state when URL changes
  useEffect(() => {
    if (sectionParam) {
      setSelectedSection(parseInt(sectionParam));
    } else {
      setSelectedSection(1);
    }
  }, [sectionParam]);

  const [loading, setLoading] = useState(true);

  // Reading Mode States
  const [activePassageId, setActivePassageId] = useState<number | null>(null);

  const [createQModalOpen, setCreateQModalOpen] = useState(false);
  const [audioModalOpen, setAudioModalOpen] = useState(false);
  const [editQId, setEditQId] = useState<number | null>(null);
  const [createPassageModalOpen, setCreatePassageModalOpen] = useState(false);
  const [editPassageId, setEditPassageId] = useState<number | null>(null);
  const [wacanaTeks, setWacanaTeks] = useState('');

  const [pertanyaan, setPertanyaan] = useState('');
  const [pilihanA, setPilihanA] = useState('');
  const [pilihanB, setPilihanB] = useState('');
  const [pilihanC, setPilihanC] = useState('');
  const [pilihanD, setPilihanD] = useState('');
  const [jawabanBenar, setJawabanBenar] = useState('A');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [uploadedAudioPath, setUploadedAudioPath] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  // Media Library Modal States
  const [mediaLibraryModalOpen, setMediaLibraryModalOpen] = useState(false);
  const [audioLibraryFiles, setAudioLibraryFiles] = useState<any[]>([]);
  const [loadingAudioLibrary, setLoadingAudioLibrary] = useState(false);
  const [uploadingLibraryAudio, setUploadingLibraryAudio] = useState(false);
  const [playingModalUrl, setPlayingModalUrl] = useState<string | null>(null);
  const modalAudioRef = React.useRef<HTMLAudioElement | null>(null);
  const libraryFileInputRef = React.useRef<HTMLInputElement | null>(null);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Batch Selection & Deletion States
  const [selectedQIds, setSelectedQIds] = useState<number[]>([]);
  const [deletingBatch, setDeletingBatch] = useState(false);
  const [confirmBatchModalOpen, setConfirmBatchModalOpen] = useState(false);
  const [confirmDeleteAllModalOpen, setConfirmDeleteAllModalOpen] = useState(false);

  // Individual Question Audio Playback State
  const [playingQuestionId, setPlayingQuestionId] = useState<number | null>(null);
  const questionAudioRef = React.useRef<HTMLAudioElement | null>(null);

  const toggleQuestionAudio = (q: any) => {
    const hasAudio = !!(q.audio_url || q.berkas_audio);
    if (!hasAudio) {
      alert(`Soal #${q.id} belum terhubung dengan berkas audio.`);
      return;
    }

    const targetSrc = q.audio_url || (q.berkas_audio.startsWith('http') || q.berkas_audio.startsWith('/') ? q.berkas_audio : `/static/audio/${q.berkas_audio}`);
    const fullUrl = targetSrc.startsWith('http') ? targetSrc : ((import.meta.env.VITE_API_URL || '') + targetSrc);

    if (playingQuestionId === q.id) {
      questionAudioRef.current?.pause();
      setPlayingQuestionId(null);
    } else {
      if (questionAudioRef.current) {
        questionAudioRef.current.pause();
      }
      const audio = new Audio(fullUrl);
      audio.onended = () => setPlayingQuestionId(null);
      audio.onerror = () => {
        alert(`Gagal memutar audio (${q.audio_filename || q.berkas_audio}). File audio belum tersedia di server.`);
        setPlayingQuestionId(null);
      };
      questionAudioRef.current = audio;
      audio.play().catch(err => {
        console.error('Play audio error:', err);
        alert('Gagal memutar audio. Pastikan berkas audio telah diunggah ke server.');
        setPlayingQuestionId(null);
      });
      setPlayingQuestionId(q.id);
    }
  };

  // Reset selection and audio on section or passage change
  useEffect(() => {
    setSelectedQIds([]);
    if (questionAudioRef.current) {
      questionAudioRef.current.pause();
    }
    setPlayingQuestionId(null);
  }, [selectedSection, activePassageId]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const [resQ, resP] = await Promise.all([
        api.get(`/questions?section=${selectedSection}`),
        api.get('/questions/passages'),
      ]);
      setQuestions(resQ.data);
      setPassages(resP.data);
      if (selectedSection === 3 && resP.data.length > 0) {
        setActivePassageId(resP.data[0].id);
      }
    } catch (err) {
      console.error('[FETCH QUESTIONS ERROR]', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [selectedSection]);

  const handleAudioUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!audioFile) return;

    const formData = new FormData();
    formData.append('audio', audioFile);

    setSubmitting(true);
    try {
      const res = await api.post('/questions/upload-audio', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      const filename = `/static/audio/${res.data.filename}`;
      
      // Auto-attach to Question 1
      if (questions.length > 0) {
        const q1 = questions[0];
        await api.put(`/questions/${q1.id}`, {
          nomor_section: q1.nomor_section,
          wacana_id: q1.wacana_id,
          pertanyaan: q1.pertanyaan,
          pilihan_a: q1.pilihan_a,
          pilihan_b: q1.pilihan_b,
          pilihan_c: q1.pilihan_c,
          pilihan_d: q1.pilihan_d,
          jawaban_benar: q1.jawaban_benar,
          berkas_audio: filename
        });
      } else {
        await api.post('/questions', {
          nomor_section: 1,
          nama_bagian: 'Part A',
          berkas_audio: filename,
          pertanyaan: '',
          pilihan_a: 'A',
          pilihan_b: 'B',
          pilihan_c: 'C',
          pilihan_d: 'D',
          jawaban_benar: 'A',
        });
      }

      setAudioFile(null);
      alert('Unggah Master Audio sukses!');
      setAudioModalOpen(false);
      fetchQuestions();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal mengunggah audio.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteMasterAudio = async () => {
    if (!window.confirm('Yakin ingin melepas Master Audio Listening Section 1?')) return;
    try {
      await api.put('/questions/master-audio', { berkas_audio: null });
      fetchQuestions();
    } catch (err) {
      alert('Gagal melepas master audio');
    }
  };

  const fetchAudioLibrary = async () => {
    setLoadingAudioLibrary(true);
    try {
      const res = await api.get('/questions/audio');
      setAudioLibraryFiles(res.data);
    } catch (err) {
      console.error('Gagal memuat pustaka audio', err);
    } finally {
      setLoadingAudioLibrary(false);
    }
  };

  const handleSelectMasterAudio = async (audioUrl: string) => {
    try {
      await api.put('/questions/master-audio', { berkas_audio: audioUrl });
      closeMediaLibraryModal();
      fetchQuestions();
    } catch (err) {
      alert('Gagal menyetel Master Audio.');
    }
  };

  const handleUploadLibraryAudio = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('audio/') && !file.name.endsWith('.mp3')) {
      alert('Hanya file audio MP3 yang diperbolehkan.');
      return;
    }

    setUploadingLibraryAudio(true);
    const formData = new FormData();
    formData.append('audio', file);
    try {
      await api.post('/questions/upload-audio', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      fetchAudioLibrary();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal mengunggah audio.');
    } finally {
      setUploadingLibraryAudio(false);
      if (libraryFileInputRef.current) libraryFileInputRef.current.value = '';
    }
  };

  const handleDeleteAudioFromLibrary = async (filename: string) => {
    if (!window.confirm(`Hapus berkas audio "${filename}" dari server?`)) return;
    try {
      await api.delete(`/questions/audio/${encodeURIComponent(filename)}?force=true`);
      fetchAudioLibrary();
      fetchQuestions();
    } catch (err) {
      alert('Gagal menghapus file audio.');
    }
  };

  const toggleModalPlay = (url: string) => {
    if (playingModalUrl === url) {
      modalAudioRef.current?.pause();
      setPlayingModalUrl(null);
    } else {
      if (modalAudioRef.current) {
        modalAudioRef.current.pause();
      }
      const audioSrc = url.startsWith('http') ? url : ((import.meta.env.VITE_API_URL || '') + url);
      const newAudio = new Audio(audioSrc);
      newAudio.play().catch(e => console.error(e));
      newAudio.onended = () => setPlayingModalUrl(null);
      modalAudioRef.current = newAudio;
      setPlayingModalUrl(url);
    }
  };

  const closeMediaLibraryModal = () => {
    if (modalAudioRef.current) {
      modalAudioRef.current.pause();
    }
    setPlayingModalUrl(null);
    setMediaLibraryModalOpen(false);
  };

  const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        
        const formattedQuestions = data.map((row: any) => ({
          section: parseInt(row.Section) || 1,
          pertanyaan: row.Pertanyaan || '',
          a: row['Pilihan A'] || row.A || '',
          b: row['Pilihan B'] || row.B || '',
          c: row['Pilihan C'] || row.C || '',
          d: row['Pilihan D'] || row.D || '',
          jawaban: row['Jawaban Benar'] || row.Jawaban || 'A',
          audio: row['Nama File Audio'] || '',
          wacana_teks: row['Teks Wacana'] || ''
        })).filter(q => q.a && q.b);

        if (formattedQuestions.length === 0) {
          alert('Format Excel tidak valid atau kosong. Pastikan menggunakan Template Excel.');
          return;
        }

        await api.post('/questions/import', { questions: formattedQuestions });
        
        alert(`Berhasil mengimport ${formattedQuestions.length} soal.`);
        fetchQuestions();
      } catch (err) {
        console.error(err);
        alert('Gagal mengimport soal dari Excel.');
      }
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsBinaryString(file);
  };

  
  const handleDeleteQuestion = async (id: number) => {
    if (!window.confirm('Yakin hapus soal ini?')) return;
    try {
      await api.delete(`/questions/${id}`);
      setSelectedQIds(prev => prev.filter(x => x !== id));
      fetchQuestions();
    } catch (err) { alert('Gagal menghapus soal'); }
  };

  const visibleQuestions = selectedSection === 3 
    ? questions.filter(q => q.wacana_id === activePassageId)
    : questions;

  const isAllSelected = visibleQuestions.length > 0 && visibleQuestions.every(q => selectedQIds.includes(q.id));

  const toggleSelectAll = () => {
    if (isAllSelected) {
      const visibleIdSet = new Set(visibleQuestions.map(q => q.id));
      setSelectedQIds(prev => prev.filter(id => !visibleIdSet.has(id)));
    } else {
      const visibleIds = visibleQuestions.map(q => q.id);
      setSelectedQIds(prev => Array.from(new Set([...prev, ...visibleIds])));
    }
  };

  const toggleSelectQuestion = (id: number) => {
    setSelectedQIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleBatchDelete = async () => {
    if (selectedQIds.length === 0) return;
    setDeletingBatch(true);
    try {
      const res = await api.post('/questions/batch-delete', { ids: selectedQIds });
      alert(res.data?.message || `Berhasil menghapus ${selectedQIds.length} butir soal.`);
      setSelectedQIds([]);
      setConfirmBatchModalOpen(false);
      fetchQuestions();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal menghapus butir soal terpilih.');
    } finally {
      setDeletingBatch(false);
    }
  };

  const handleDeleteAllSection = async () => {
    setDeletingBatch(true);
    try {
      const res = await api.post('/questions/batch-delete', { section: selectedSection });
      alert(res.data?.message || `Berhasil mengosongkan seluruh butir soal Section ${selectedSection}.`);
      setSelectedQIds([]);
      setConfirmDeleteAllModalOpen(false);
      fetchQuestions();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal mengosongkan butir soal.');
    } finally {
      setDeletingBatch(false);
    }
  };

  const renderBatchToolbar = () => {
    if (visibleQuestions.length === 0) return null;

    const selectedCount = selectedQIds.length;

    return (
      <div className="bg-white/60 backdrop-blur-md border border-white/70 rounded-2xl p-3 px-5 flex flex-wrap items-center justify-between gap-3 shadow-[0_4px_20px_rgb(0,0,0,0.02)] mb-4">
        {/* Left: Select All & Counters */}
        <div className="flex items-center gap-3 flex-wrap">
          <label className="flex items-center gap-2.5 cursor-pointer select-none group/sel">
            <div className="relative flex items-center justify-center">
              <input 
                type="checkbox"
                checked={isAllSelected}
                onChange={toggleSelectAll}
                className="sr-only peer"
              />
              <div className="w-5 h-5 rounded-lg border-2 border-slate-300 bg-white peer-checked:bg-teal-600 peer-checked:border-teal-600 flex items-center justify-center transition-all shadow-xs group-hover/sel:border-teal-500">
                <Check className="w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity stroke-[3]" />
              </div>
            </div>
            <span className="text-sm font-bold text-slate-700">
              Pilih Semua ({visibleQuestions.length} Soal)
            </span>
          </label>

          {selectedCount > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold bg-rose-100 text-rose-700 px-2.5 py-0.5 rounded-full border border-rose-200">
                {selectedCount} Terpilih
              </span>
              <button 
                onClick={() => setSelectedQIds([])}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 underline decoration-slate-300 hover:decoration-slate-600 cursor-pointer"
              >
                Batalkan
              </button>
            </div>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {selectedCount > 0 && (
            <button 
              onClick={() => setConfirmBatchModalOpen(true)}
              disabled={deletingBatch}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-all shadow-sm shadow-rose-600/20 cursor-pointer disabled:opacity-50"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus Terpilih ({selectedCount})</span>
            </button>
          )}

          <button 
            onClick={() => setConfirmDeleteAllModalOpen(true)}
            disabled={deletingBatch || visibleQuestions.length === 0}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 font-bold text-xs transition-all border border-slate-200/80 cursor-pointer disabled:opacity-50"
            title={`Hapus seluruh soal di Section ${selectedSection}`}
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-500" />
            <span>Hapus Semua Soal</span>
          </button>
        </div>
      </div>
    );
  };

  const openEditQuestion = (q: any) => {
    setEditQId(q.id);
    setPertanyaan(q.pertanyaan || '');
    setPilihanA(q.pilihan_a || '');
    setPilihanB(q.pilihan_b || '');
    setPilihanC(q.pilihan_c || '');
    setPilihanD(q.pilihan_d || '');
    setJawabanBenar(q.jawaban_benar || 'A');
    setCreateQModalOpen(true);
  };

  const handleDeletePassage = async (id: number) => {
    if (!window.confirm('Yakin hapus wacana ini beserta soal-soalnya?')) return;
    try {
      await api.delete(`/questions/passages/${id}`);
      fetchQuestions();
    } catch (err) { alert('Gagal menghapus wacana'); }
  };

  const openEditPassage = (p: any, e: any) => {
    e.stopPropagation();
    setEditPassageId(p.id);
    setWacanaTeks(p.teks_wacana || '');
    setCreatePassageModalOpen(true);
  };

  const handleSavePassage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editPassageId) {
        await api.put(`/questions/passages/${editPassageId}`, { teks_wacana: wacanaTeks });
      } else {
        await api.post('/questions/passages', { teks_wacana: wacanaTeks });
      }
      setCreatePassageModalOpen(false);
      setWacanaTeks('');
      setEditPassageId(null);
      fetchQuestions();
    } catch (err) { alert('Gagal menyimpan wacana'); }
  };

  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editQId) {
        await api.put(`/questions/${editQId}`, {
          nomor_section: selectedSection,
          wacana_id: selectedSection === 3 ? activePassageId : null,
          pertanyaan,
          pilihan_a: pilihanA,
          pilihan_b: pilihanB,
          pilihan_c: pilihanC,
          pilihan_d: pilihanD,
          jawaban_benar: jawabanBenar,
        });
      } else {
        await api.post('/questions', {
        nomor_section: selectedSection,
        nama_bagian: selectedSection === 1 ? 'Part A' : undefined,
        berkas_audio: uploadedAudioPath || undefined,
        wacana_id: selectedSection === 3 ? activePassageId : null,
        pertanyaan,
        pilihan_a: pilihanA,
        pilihan_b: pilihanB,
        pilihan_c: pilihanC,
        pilihan_d: pilihanD,
        jawaban_benar: jawabanBenar,
      });

      setPertanyaan('');
      setPilihanA('');
      setPilihanB('');
      setPilihanC('');
      setPilihanD('');
      setUploadedAudioPath('');
      setCreateQModalOpen(false);
      setEditQId(null);
      } // close else block for api.post

      fetchQuestions();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal menambahkan soal.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownloadTemplate = () => {
    const instructions = [
      { "Aturan": "Kolom Section", "Penjelasan": "Wajib diisi angka 1, 2, atau 3 (1: Listening, 2: Structure, 3: Reading)." },
      { "Aturan": "Kolom Pertanyaan", "Penjelasan": "Teks soal. Boleh dikosongkan untuk Listening jika pertanyaan ada di audio." },
      { "Aturan": "Kolom Pilihan A - D", "Penjelasan": "Wajib diisi dengan teks pilihan jawaban." },
      { "Aturan": "Kolom Jawaban Benar", "Penjelasan": "Wajib diisi dengan A, B, C, atau D." },
      { "Aturan": "Kolom Nama File Audio", "Penjelasan": "Khusus Section 1. Ketik nama file MP3 persis seperti yang akan/sudah diunggah lewat tombol 'Unggah MP3 Massal' (contoh: soal1.mp3). Sistem akan otomatis mencocokkannya." },
      { "Aturan": "Kolom Teks Wacana", "Penjelasan": "Khusus Section 3. Isi wacana utuh. Jika wacana sama untuk bbrp soal berurutan, copy-paste teks yang sama persis agar sistem mengelompokkannya." }
    ];

    const templateData = [
      { 
        "Section": 1, 
        "Pertanyaan": "What does the man imply?", 
        "Pilihan A": "He is tired", 
        "Pilihan B": "He is hungry", 
        "Pilihan C": "He is happy", 
        "Pilihan D": "He is angry", 
        "Jawaban Benar": "A",
        "Nama File Audio": "listening_partA_1.mp3",
        "Teks Wacana": ""
      },
      { 
        "Section": 2, 
        "Pertanyaan": "The committee ___ decided to postpone the meeting.", 
        "Pilihan A": "have", 
        "Pilihan B": "has", 
        "Pilihan C": "having", 
        "Pilihan D": "had", 
        "Jawaban Benar": "B",
        "Nama File Audio": "",
        "Teks Wacana": ""
      }
    ];

    const wsInstructions = XLSX.utils.json_to_sheet(instructions);
    const wsTemplate = XLSX.utils.json_to_sheet(templateData);

    wsInstructions['!cols'] = [{ wch: 25 }, { wch: 80 }];
    wsTemplate['!cols'] = [{ wch: 10 }, { wch: 40 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 15 }, { wch: 25 }, { wch: 50 }];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, wsTemplate, "Template Soal");
    XLSX.utils.book_append_sheet(wb, wsInstructions, "Aturan Pengisian");

    XLSX.writeFile(wb, "Template_Import_Bank_Soal.xlsx");
  };

  const renderQuestionCard = (q: any, index: number) => {
    const isSelected = selectedQIds.includes(q.id);
    const isPlaying = playingQuestionId === q.id;
    const hasAudio = !!(q.audio_url || q.berkas_audio);
    const audioExists = q.audio_exists !== false && hasAudio;
    const audioDisplayName = q.audio_filename || q.berkas_audio;

    return (
      <div 
        key={q.id} 
        className={`relative p-6 rounded-[2rem] bg-white/50 backdrop-blur-md text-slate-800 border transition-all flex flex-col gap-5 hover:shadow-md group ${
          isSelected 
            ? 'border-rose-300 ring-2 ring-rose-400/40 bg-rose-50/25 shadow-rose-500/5' 
            : 'border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)]'
        }`}
      >
        {/* Floating Actions */}
        <div className="absolute top-6 right-6 flex items-center gap-2">
          {selectedSection === 1 && (
            <button 
              onClick={() => toggleQuestionAudio(q)}
              className={`p-2 rounded-full transition-all flex items-center justify-center cursor-pointer shadow-xs ${
                isPlaying 
                  ? 'bg-teal-600 text-white ring-2 ring-teal-400 scale-105 shadow-teal-500/30' 
                  : audioExists 
                    ? 'bg-teal-50 text-teal-600 border border-teal-200/80 hover:bg-teal-100 hover:scale-105' 
                    : hasAudio 
                      ? 'bg-amber-50 text-amber-600 border border-amber-200/80 hover:bg-amber-100' 
                      : 'bg-slate-100 text-slate-400 hover:text-slate-600 hover:bg-slate-200'
              }`} 
              title={
                isPlaying 
                  ? `Jeda Audio (${audioDisplayName})` 
                  : audioExists 
                    ? `Audio Terhubung: ${audioDisplayName} (Klik untuk Putar)` 
                    : hasAudio 
                      ? `File "${audioDisplayName}" belum ada di server (Klik untuk Cek)` 
                      : 'Belum ada audio terhubung ke soal ini'
              }
            >
              {isPlaying ? (
                <PauseCircle className="w-4 h-4 fill-current" />
              ) : audioExists ? (
                <Volume2 className="w-4 h-4" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </button>
          )}
          <button onClick={() => openEditQuestion(q)} className="p-2 rounded-full bg-white/60 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer" title="Edit Soal">
            <Edit2 className="w-4 h-4" />
          </button>
          <button onClick={() => handleDeleteQuestion(q.id)} className="p-2 rounded-full bg-white/60 text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer" title="Hapus">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-start gap-4">
          {/* Checkbox & Question Number */}
          <div className="flex items-center gap-3 shrink-0 pt-0.5">
            <label className="relative flex items-center justify-center cursor-pointer select-none group/chk">
              <input 
                type="checkbox"
                checked={isSelected}
                onChange={() => toggleSelectQuestion(q.id)}
                className="sr-only peer"
              />
              <div className="w-6 h-6 rounded-lg border-2 border-slate-300 bg-white peer-checked:bg-rose-500 peer-checked:border-rose-500 flex items-center justify-center transition-all shadow-xs group-hover/chk:border-rose-400">
                <Check className="w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity stroke-[3]" />
              </div>
            </label>
            <span className={`w-11 h-11 rounded-2xl font-black flex items-center justify-center text-base transition-colors ${
              isSelected ? 'bg-rose-100 text-rose-700 font-black' : 'bg-emerald-50 text-emerald-600'
            }`}>
              {index + 1}
            </span>
          </div>

          <div className="flex-1 pt-1 pr-32">
            <div className="flex items-center gap-3 flex-wrap mb-2">
              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                Soal #{index + 1} {q.nama_bagian ? `- ${q.nama_bagian}` : ''}
              </h4>

              {/* Status Audio Terhubung */}
              {selectedSection === 1 && (
                hasAudio ? (
                  <button
                    onClick={() => toggleQuestionAudio(q)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      isPlaying
                        ? 'bg-teal-600 text-white shadow-sm shadow-teal-500/30'
                        : audioExists
                          ? 'bg-teal-50 text-teal-700 border border-teal-200 hover:bg-teal-100'
                          : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                    }`}
                    title={`Klik untuk ${isPlaying ? 'jeda' : 'putar'} audio`}
                  >
                    {isPlaying ? (
                      <>
                        <PauseCircle className="w-3.5 h-3.5" />
                        <span>Memutar: {audioDisplayName}</span>
                        <div className="flex items-end gap-0.5 h-3 ml-0.5">
                          <div className="w-0.5 h-2 bg-white rounded-full animate-bounce"></div>
                          <div className="w-0.5 h-3 bg-white rounded-full animate-bounce [animation-delay:0.15s]"></div>
                          <div className="w-0.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:0.3s]"></div>
                        </div>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3.5 h-3.5 text-teal-600" />
                        <span>Audio Terhubung: {audioDisplayName}</span>
                        <PlayCircle className="w-3.5 h-3.5 opacity-60" />
                      </>
                    )}
                  </button>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-400 border border-slate-200/60">
                    <VolumeX className="w-3 h-3" />
                    <span>Belum Terhubung Audio</span>
                  </span>
                )
              )}
            </div>

            <p className="text-lg font-bold text-slate-800 leading-relaxed mb-4">
              {q.pertanyaan}
            </p>



            {/* 2x2 Options Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['A', 'B', 'C', 'D'].map((opt) => {
                const isCorrect = q.jawaban_benar === opt;
                const optionText = q[`pilihan_${opt.toLowerCase()}`];
                return (
                  <div 
                    key={opt} 
                    className={`relative p-4 rounded-[1rem] border-2 transition-all flex items-start gap-3 ${isCorrect ? 'bg-emerald-50 border-emerald-500' : 'bg-white/60 border-white/50'}`}
                  >
                    <span className={`w-6 h-6 shrink-0 rounded-full flex items-center justify-center text-xs font-bold ${isCorrect ? 'bg-emerald-500 text-slate-800' : 'bg-white/60 text-slate-500'}`}>
                      {opt}
                    </span>
                    <span className={`font-medium text-sm pt-0.5 ${isCorrect ? 'text-emerald-900 font-bold' : 'text-slate-700'}`}>
                      {optionText}
                    </span>
                    {isCorrect && (
                      <div className="absolute -top-3 -right-2 bg-emerald-500 text-slate-800 text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Kunci Jawaban
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen overflow-hidden bg-[url('/bg-proctor.jpg')] bg-cover bg-center p-4 md:p-6 font-sans text-slate-800 flex gap-6 box-border selection:bg-teal-500/20 relative">
      
      {/* 1. Sidebar */}
      <SidebarProctor activePath="/proctor/bank" />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col gap-6 max-w-[1400px] mx-auto w-full overflow-hidden relative z-10">
        
        {/* Topbar */}
        <ProctorHeader />

        <motion.main
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="flex-1 flex flex-col gap-6 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-6"
        >
          {/* Header & Button Actions */}
          <div className="flex flex-col gap-4 pt-2">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2 text-slate-800">Bank Soal TOEFL ITP (140 Butir)</h1>
              <p className="text-slate-500 font-medium text-sm">Kelola wacana bacaan, berkas audio terenkripsi, dan kunci jawaban per section.</p>
            </div>

            {/* Action Buttons Bar */}
            <div className="bg-white/40 backdrop-blur-md border border-white/70 rounded-2xl p-3 md:px-6 md:py-3.5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
              {/* Left Action Buttons */}
              <div className="flex items-center gap-3 flex-wrap">
                <button 
                  onClick={handleDownloadTemplate} 
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#ece8fd] hover:bg-[#e0d9fc] text-[#5540bf] font-bold text-sm transition-all shadow-sm border border-[#dcd4fa] cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Template Excel</span>
                </button>

                <input 
                  type="file" 
                  accept=".xlsx, .xls" 
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handleExcelUpload}
                />

                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/90 hover:bg-white text-slate-700 font-bold text-sm transition-all shadow-sm border border-white cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  <span>Import Soal</span>
                </button>
              </div>

              {/* Right Action Buttons */}
              <div className="flex items-center gap-3 flex-wrap">
                <button 
                  onClick={() => { setEditQId(null); setPertanyaan(''); setPilihanA(''); setPilihanB(''); setPilihanC(''); setPilihanD(''); setCreateQModalOpen(true); }} 
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#058252] hover:bg-[#046e45] text-white font-bold text-sm transition-all shadow-sm shadow-emerald-700/20 cursor-pointer"
                >
                  <Plus className="w-5 h-5" />
                  <span>Tambah Butir Soal</span>
                </button>

                <button 
                  onClick={() => navigate('/proctor/audio')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#e6f7ef] hover:bg-[#d5f2e3] text-[#00663f] font-bold text-sm transition-all shadow-sm border border-[#bce8d0] cursor-pointer"
                  title="Buka Media Library untuk mengelola berkas audio"
                >
                  <Music className="w-4 h-4 text-[#00875a]" />
                  <span>Media Library</span>
                </button>
              </div>
            </div>
          </div>



          {/* Content Area */}
          <div className="flex-1 flex flex-col min-h-0">
            {loading ? (
              <div className="flex-1 flex items-center justify-center text-slate-400 font-bold">Memuat Data...</div>
            ) : selectedSection === 3 ? (
              // SECTION 3: SPLIT LAYOUT (READING VIEW MODE)
              <div className="flex-1 flex gap-6 min-h-0 h-full">
                {/* Left Panel: Passages */}
                <div className="w-1/3 bg-white/50 backdrop-blur-md backdrop-blur-md rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 flex flex-col overflow-hidden">
                  <div className="p-6 border-b border-white/50 flex items-center justify-between bg-white/60">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-slate-800" /> Daftar Wacana
                    </h3>
                    <button onClick={() => { setEditPassageId(null); setWacanaTeks(''); setCreatePassageModalOpen(true); }} className="p-2 rounded-full bg-white/50 backdrop-blur-md text-slate-800 hover:bg-white/20 transition-colors cursor-pointer" title="Tambah Wacana">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-3 [&::-webkit-scrollbar]:hidden">
                    {passages.map((p, idx) => (
                      <div 
                        key={p.id}
                        onClick={() => setActivePassageId(p.id)}
                        className={`p-5 rounded-[1.5rem] border-2 cursor-pointer transition-all ${activePassageId === p.id ? 'border-white bg-white/20' : 'border-white/40 bg-white/60 hover:border-white/50'}`}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <h4 className={`font-bold ${activePassageId === p.id ? 'text-slate-800' : 'text-slate-800'}`}>Wacana #{idx + 1}</h4>
                          <div className="flex gap-2">
                             <button onClick={(e) => openEditPassage(p, e)} className="text-slate-400 hover:text-slate-800 p-1"><Edit2 className="w-3.5 h-3.5"/></button>
                             <button onClick={(e) => { e.stopPropagation(); handleDeletePassage(p.id); }} className="text-slate-400 hover:text-rose-400 p-1"><Trash2 className="w-3.5 h-3.5"/></button>
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 font-medium line-clamp-3 leading-relaxed">{p.teks_wacana}</p>
                      </div>
                    ))}
                    {passages.length === 0 && (
                      <div className="text-center py-8 text-slate-400 text-sm font-medium">Belum ada wacana.</div>
                    )}
                  </div>
                </div>

                {/* Right Panel: Questions for Passage */}
                <div className="flex-1 bg-white/50 backdrop-blur-md backdrop-blur-md rounded-[2rem] flex flex-col overflow-hidden border border-white/50">
                   <div className="p-6 border-b border-white/50 flex items-center justify-between bg-white/60">
                     <div>
                       <h3 className="font-bold text-slate-800">Soal Terkait Wacana</h3>
                       <p className="text-xs text-slate-500 font-medium">Anak soal yang merujuk pada teks wacana di samping.</p>
                     </div>
                     <button onClick={() => { setEditQId(null); setPertanyaan(''); setPilihanA(''); setPilihanB(''); setPilihanC(''); setPilihanD(''); setCreateQModalOpen(true); }} className="px-4 py-2 rounded-full bg-white/60 border border-white/50 text-slate-700 text-xs font-bold shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:bg-white/60 cursor-pointer">
                       Tambah Anak Soal
                     </button>
                   </div>
                   <div className="flex-1 overflow-y-auto p-6 space-y-6 [&::-webkit-scrollbar]:hidden">
                     {renderBatchToolbar()}
                     {questions.filter(q => q.wacana_id === activePassageId).map((q, idx) => renderQuestionCard(q, idx))}
                     {questions.filter(q => q.wacana_id === activePassageId).length === 0 && (
                        <div className="text-center py-12 text-slate-400 text-sm font-medium">Belum ada butir soal untuk wacana ini.</div>
                     )}
                   </div>
                </div>
              </div>
            ) : (
              // SECTION 1 & 2: LIST LAYOUT
              <div className="flex-1 overflow-y-auto space-y-6 [&::-webkit-scrollbar]:hidden pr-2">
                {renderBatchToolbar()}
                {questions.map((q, idx) => renderQuestionCard(q, idx))}
                {questions.length === 0 && (
                  <div className="text-center py-20 bg-white/60 rounded-[2rem] border border-white/40 border-dashed text-slate-400 font-bold">
                    Belum ada butir soal pada section ini.
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.main>
      </div>

      <Modal isOpen={createQModalOpen} onClose={() => setCreateQModalOpen(false)} title={editQId ? "Edit Soal" : "Tambah Soal"}>
        <form onSubmit={handleCreateQuestion} className="flex flex-col gap-4 text-slate-800">
           <textarea placeholder="Pertanyaan" value={pertanyaan} onChange={e => setPertanyaan(e.target.value)} required className="p-3 border rounded-xl bg-white" rows={3}></textarea>
           <input placeholder="Pilihan A" value={pilihanA} onChange={e => setPilihanA(e.target.value)} required className="p-3 border rounded-xl bg-white" />
           <input placeholder="Pilihan B" value={pilihanB} onChange={e => setPilihanB(e.target.value)} required className="p-3 border rounded-xl bg-white" />
           <input placeholder="Pilihan C" value={pilihanC} onChange={e => setPilihanC(e.target.value)} required className="p-3 border rounded-xl bg-white" />
           <input placeholder="Pilihan D" value={pilihanD} onChange={e => setPilihanD(e.target.value)} required className="p-3 border rounded-xl bg-white" />
           <select value={jawabanBenar} onChange={e => setJawabanBenar(e.target.value)} className="p-3 border rounded-xl font-bold bg-white">
             <option value="A">Jawaban Benar: A</option>
             <option value="B">Jawaban Benar: B</option>
             <option value="C">Jawaban Benar: C</option>
             <option value="D">Jawaban Benar: D</option>
           </select>
           <button type="submit" disabled={submitting} className="bg-emerald-600 text-slate-800 p-3 rounded-xl font-bold mt-2 hover:bg-emerald-700 cursor-pointer shadow-md">
              {submitting ? 'Menyimpan...' : 'Simpan Soal'}
           </button>
        </form>
      </Modal>

      <Modal isOpen={createPassageModalOpen} onClose={() => setCreatePassageModalOpen(false)} title={editPassageId ? "Edit Wacana" : "Tambah Wacana"}>
        <form onSubmit={handleSavePassage} className="flex flex-col gap-4 text-slate-800">
           <textarea placeholder="Teks Wacana (Reading Comprehension)..." value={wacanaTeks} onChange={e => setWacanaTeks(e.target.value)} required className="p-3 border rounded-xl bg-white" rows={8}></textarea>
           <button type="submit" disabled={submitting} className="bg-emerald-600 text-slate-800 p-3 rounded-xl font-bold mt-2 hover:bg-emerald-700 cursor-pointer shadow-md">
              {submitting ? 'Menyimpan...' : 'Simpan Wacana'}
           </button>
        </form>
      </Modal>

      <Modal isOpen={audioModalOpen} onClose={() => setAudioModalOpen(false)} title="Unggah Master Audio">
        <form onSubmit={handleAudioUpload} className="flex flex-col gap-4 text-slate-800">
           <div className="p-4 border-2 border-dashed border-emerald-200 rounded-xl bg-emerald-50 text-center">
             <Volume2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
             <p className="text-sm font-medium text-emerald-800 mb-4">Pilih file MP3 untuk dijadikan master track Listening Section.</p>
             <input 
               type="file" 
               accept="audio/mp3,audio/*" 
               onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
               className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-600 file:text-white hover:file:bg-emerald-700 w-full"
               required
             />
           </div>
           <button type="submit" disabled={submitting} className="bg-emerald-600 text-slate-800 p-3 rounded-xl font-bold mt-2 hover:bg-emerald-700 cursor-pointer shadow-md">
              {submitting ? 'Mengunggah...' : 'Simpan & Jadikan Master Audio'}
           </button>
        </form>
      </Modal>

      {/* Modal Media Library */}
      <Modal isOpen={mediaLibraryModalOpen} onClose={closeMediaLibraryModal} title="Media Library (Pustaka Audio)">
        <div className="flex flex-col gap-4 text-slate-800 max-h-[70vh] overflow-hidden">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <p className="text-xs text-slate-500 font-medium">
              Pilih audio untuk dijadikan master Section 1 atau unggah berkas MP3 baru.
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={fetchAudioLibrary}
                className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors"
                title="Refresh Pustaka"
              >
                <RefreshCw className={`w-4 h-4 ${loadingAudioLibrary ? 'animate-spin' : ''}`} />
              </button>
              <button
                type="button"
                onClick={() => libraryFileInputRef.current?.click()}
                disabled={uploadingLibraryAudio}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
              >
                {uploadingLibraryAudio ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                <span>Upload MP3 Baru</span>
              </button>
              <input
                type="file"
                ref={libraryFileInputRef}
                onChange={handleUploadLibraryAudio}
                accept="audio/mp3,audio/*"
                className="hidden"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full">
            {loadingAudioLibrary ? (
              <div className="py-12 flex flex-col items-center justify-center text-slate-400">
                <RefreshCw className="w-6 h-6 animate-spin mb-2 text-emerald-500" />
                <span className="text-xs font-semibold">Memuat audio...</span>
              </div>
            ) : audioLibraryFiles.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-center p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400">
                <Music className="w-10 h-10 mb-2 opacity-40 text-emerald-600" />
                <p className="font-bold text-sm text-slate-600">Pustaka Audio Masih Kosong</p>
                <p className="text-xs text-slate-400 mt-1 max-w-xs">
                  Belum ada file audio di server. Klik "Upload MP3 Baru" di atas untuk menambahkan berkas.
                </p>
              </div>
            ) : (
              audioLibraryFiles.map((audio) => {
                const currentMaster = questions.find(q => q.berkas_audio)?.berkas_audio;
                const isCurrentMaster = currentMaster === audio.url || currentMaster === audio.filename || currentMaster === `/static/audio/${audio.filename}`;
                const isPlaying = playingModalUrl === audio.url;

                return (
                  <div
                    key={audio.filename}
                    className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                      isCurrentMaster ? 'bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-400' : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 overflow-hidden flex-1">
                      <button
                        type="button"
                        onClick={() => toggleModalPlay(audio.url)}
                        className={`w-9 h-9 shrink-0 rounded-full flex items-center justify-center cursor-pointer transition-colors ${
                          isPlaying ? 'bg-emerald-600 text-white' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                        }`}
                        title={isPlaying ? 'Pause' : 'Putar'}
                      >
                        {isPlaying ? <PauseCircle className="w-5 h-5" /> : <PlayCircle className="w-5 h-5 ml-0.5" />}
                      </button>
                      <div className="overflow-hidden flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-xs text-slate-800 truncate" title={audio.filename}>
                            {audio.filename}
                          </p>
                          {isCurrentMaster && (
                            <span className="shrink-0 text-[10px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Check className="w-3 h-3" /> Master Aktif
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                          {(audio.size / (1024 * 1024)).toFixed(2)} MB • {new Date(audio.createdAt).toLocaleDateString('id-ID')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {!isCurrentMaster ? (
                        <button
                          type="button"
                          onClick={() => handleSelectMasterAudio(audio.url)}
                          className="px-3 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors cursor-pointer shadow-sm"
                        >
                          Pilih Jadi Master
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled
                          className="px-3 py-1.5 rounded-full bg-slate-100 text-emerald-700 font-bold text-xs cursor-default"
                        >
                          Sedang Aktif
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDeleteAudioFromLibrary(audio.filename)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                        title="Hapus berkas dari server"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </Modal>

      {/* Modal Konfirmasi Hapus Soal Terpilih */}
      <Modal isOpen={confirmBatchModalOpen} onClose={() => setConfirmBatchModalOpen(false)} title="Hapus Butir Soal Terpilih">
        <div className="flex flex-col gap-4 text-slate-800">
          <p className="text-sm text-slate-600 leading-relaxed">
            Apakah Anda yakin ingin menghapus <strong className="text-slate-800">{selectedQIds.length} butir soal</strong> yang telah dipilih? 
            Tindakan ini permanen dan tidak dapat dibatalkan.
          </p>
          <div className="flex gap-3 justify-end mt-2">
            <button 
              type="button"
              onClick={() => setConfirmBatchModalOpen(false)}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm cursor-pointer transition-colors"
            >
              Batal
            </button>
            <button 
              type="button"
              onClick={handleBatchDelete}
              disabled={deletingBatch}
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm cursor-pointer shadow-md shadow-rose-600/20 disabled:opacity-50 flex items-center gap-2 transition-colors"
            >
              {deletingBatch ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              <span>{deletingBatch ? 'Menghapus...' : `Hapus ${selectedQIds.length} Soal`}</span>
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal Konfirmasi Hapus Seluruh Soal Section */}
      <Modal isOpen={confirmDeleteAllModalOpen} onClose={() => setConfirmDeleteAllModalOpen(false)} title={`Hapus Seluruh Soal Section ${selectedSection}`}>
        <div className="flex flex-col gap-4 text-slate-800">
          <p className="text-sm text-slate-600 leading-relaxed">
            Apakah Anda yakin ingin menghapus <strong>seluruh butir soal pada Section {selectedSection}</strong> ({questions.length} butir soal)?
          </p>
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold">
            Peringatan: Seluruh butir soal dan kunci jawaban pada bagian ini akan dihapus permanen dari basis data.
          </div>
          <div className="flex gap-3 justify-end mt-2">
            <button 
              type="button"
              onClick={() => setConfirmDeleteAllModalOpen(false)}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm cursor-pointer transition-colors"
            >
              Batal
            </button>
            <button 
              type="button"
              onClick={handleDeleteAllSection}
              disabled={deletingBatch}
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm cursor-pointer shadow-md shadow-rose-600/20 disabled:opacity-50 flex items-center gap-2 transition-colors"
            >
              {deletingBatch ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              <span>{deletingBatch ? 'Menghapus...' : 'Ya, Hapus Semua Soal'}</span>
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
};





