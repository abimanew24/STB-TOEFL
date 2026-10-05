import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  BookOpen, Plus, Upload, Volume2, Edit2, Trash2, 
  PlayCircle, PauseCircle, CheckCircle2, Server, Clock, FileText, Download
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
  
  const fileInputRef = React.useRef<HTMLInputElement>(null);

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

  const handleDeleteMasterAudio = async (id: number) => {
    if (!window.confirm('Yakin hapus master audio ini?')) return;
    try {
      const q1 = questions.find(q => q.id === id);
      if (q1) {
        await api.put(`/questions/${id}`, {
          nomor_section: q1.nomor_section,
          wacana_id: q1.wacana_id,
          pertanyaan: q1.pertanyaan,
          pilihan_a: q1.pilihan_a,
          pilihan_b: q1.pilihan_b,
          pilihan_c: q1.pilihan_c,
          pilihan_d: q1.pilihan_d,
          jawaban_benar: q1.jawaban_benar,
          berkas_audio: null
        });
        fetchQuestions();
      }
    } catch (err) {
      alert('Gagal menghapus audio');
    }
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
      fetchQuestions();
    } catch (err) { alert('Gagal menghapus soal'); }
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
    return (
      <div key={q.id} className="relative p-6 rounded-[2rem] bg-white/50 backdrop-blur-md text-slate-800 border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col gap-5 hover:shadow-md transition-shadow group">
        
        {/* Floating Actions */}
        <div className="absolute top-6 right-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {selectedSection === 1 && (
            <button className="p-2 rounded-full bg-white/60 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors" title="Ganti MP3">
              <Volume2 className="w-4 h-4" />
            </button>
          )}
          <button onClick={() => openEditQuestion(q)} className="p-2 rounded-full bg-white/60 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors" title="Edit Soal">
            <Edit2 className="w-4 h-4" />
          </button>
          <button onClick={() => handleDeleteQuestion(q.id)} className="p-2 rounded-full bg-white/60 text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors" title="Hapus">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-start gap-4">
          <span className="shrink-0 w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 font-black flex items-center justify-center text-lg">
            {index + 1}
          </span>
          <div className="flex-1 pt-1 pr-32">
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Soal #{index + 1} {q.nama_bagian ? `- ${q.nama_bagian}` : ''}</h4>
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
          style={{ WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 20px, black calc(100% - 20px), transparent)' }}
        >
          {/* Header */}
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 pt-2 text-slate-800">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Bank Soal TOEFL ITP (140 Butir)</h1>
              <p className="text-slate-500 font-medium">Kelola wacana bacaan, berkas audio terenkripsi, dan kunci jawaban per section.</p>
            </div>
            
            <div className="flex items-center gap-3 self-start md:self-auto flex-wrap">

              <button onClick={handleDownloadTemplate} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-indigo-100 hover:border-indigo-200 bg-indigo-50 text-indigo-700 font-bold text-sm transition-all shadow-[0_8px_30px_rgb(0,0,0,0.04)] cursor-pointer">
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
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-white/50 hover:border-slate-300 bg-white/60 text-slate-700 font-bold text-sm transition-all shadow-[0_8px_30px_rgb(0,0,0,0.04)] cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>Import Soal</span>
              </button>
              <button onClick={() => { setEditQId(null); setPertanyaan(''); setPilihanA(''); setPilihanB(''); setPilihanC(''); setPilihanD(''); setCreateQModalOpen(true); }} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-all shadow-[0_8px_30px_rgb(0,0,0,0.04)] shadow-emerald-600/20 cursor-pointer">
                <Plus className="w-5 h-5" />
                <span>Tambah Butir Soal</span>
              </button>
            </div>
          </header>

          {/* Master Audio Preview for Section 1 */}
          {selectedSection === 1 && (
            <div className={`p-5 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
              questions.find(q => q.berkas_audio) 
                ? 'bg-emerald-50/80 backdrop-blur-md border border-emerald-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)]' 
                : 'bg-white/40 border-2 border-dashed border-slate-300'
            }`}>
              {questions.find(q => q.berkas_audio) ? (
                <>
                  <div>
                    <h3 className="font-bold text-emerald-900 mb-1 flex items-center gap-2">
                      <Volume2 className="w-5 h-5" /> Master Audio Listening (Aktif)
                    </h3>
                    <p className="text-sm text-emerald-700 font-medium">Audio ini akan diputar untuk seluruh mahasiswa pada Section 1 secara otomatis.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <MiniAudioPlayer 
                      src={
                        (questions.find(q => q.berkas_audio)?.berkas_audio || '').startsWith('http') || (questions.find(q => q.berkas_audio)?.berkas_audio || '').startsWith('/')
                          ? (questions.find(q => q.berkas_audio)?.berkas_audio || '')
                          : `/static/audio/${questions.find(q => q.berkas_audio)?.berkas_audio || ''}`
                      } 
                      filename={questions.find(q => q.berkas_audio)?.berkas_audio?.split('/').pop() || 'master-audio.mp3'} 
                    />
                    <div className="flex gap-2">
                      <button onClick={() => setAudioModalOpen(true)} className="p-2 rounded-full bg-white text-emerald-600 hover:bg-emerald-100 transition-colors shadow-sm cursor-pointer" title="Ganti Master Audio">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteMasterAudio(questions.find(q => q.berkas_audio).id)} className="p-2 rounded-full bg-white text-rose-500 hover:bg-rose-50 transition-colors shadow-sm cursor-pointer" title="Hapus Master Audio">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <h3 className="font-bold text-slate-700 mb-1 flex items-center gap-2">
                      <Volume2 className="w-5 h-5 text-slate-400" /> Master Audio Listening Belum Ada
                    </h3>
                    <p className="text-sm text-slate-500 font-medium">Unggah 1 file MP3 yang berisi instruksi dan percakapan untuk seluruh soal Section 1.</p>
                  </div>
                  <button onClick={() => setAudioModalOpen(true)} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-emerald-600 font-bold text-sm transition-all shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:bg-emerald-50 border border-emerald-100 cursor-pointer">
                    <Upload className="w-4 h-4" />
                    <span>Unggah MP3 Sekarang</span>
                  </button>
                </>
              )}
            </div>
          )}

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
                  <div className="flex-1 overflow-y-auto p-4 space-y-3 [&::-webkit-scrollbar]:hidden" style={{ WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 20px, black calc(100% - 20px), transparent)' }}>
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
                   <div className="flex-1 overflow-y-auto p-6 space-y-6 [&::-webkit-scrollbar]:hidden" style={{ WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 20px, black calc(100% - 20px), transparent)' }}>
                     {questions.filter(q => q.wacana_id === activePassageId).map((q, idx) => renderQuestionCard(q, idx))}
                     {questions.filter(q => q.wacana_id === activePassageId).length === 0 && (
                        <div className="text-center py-12 text-slate-400 text-sm font-medium">Belum ada butir soal untuk wacana ini.</div>
                     )}
                   </div>
                </div>
              </div>
            ) : (
              // SECTION 1 & 2: LIST LAYOUT
              <div className="flex-1 overflow-y-auto space-y-6 [&::-webkit-scrollbar]:hidden pr-2" style={{ WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 20px, black calc(100% - 20px), transparent)' }}>
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

    </div>
  );
};





