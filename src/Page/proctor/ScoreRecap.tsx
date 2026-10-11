import React, { useEffect, useState, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
 Award, Download, RefreshCw, Search, Mail, 
 FileText, MoreVertical, Server, Clock, Users, Target, TrendingUp, CheckCircle2, ChevronDown
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import { SidebarProctor } from '../../components/common/SidebarProctor';
import { ProctorHeader } from '../../components/proctor/ProctorHeader';
import api from '../../services/api';


const CustomDropdown = ({ value, onChange, options, placeholder }: any) => {
 const [isOpen, setIsOpen] = useState(false);
 const ref = useRef<HTMLDivElement>(null);

 useEffect(() => {
 const handleClickOutside = (event: MouseEvent) => {
 if (ref.current && !ref.current.contains(event.target as Node)) {
 setIsOpen(false);
 }
 };
 document.addEventListener('mousedown', handleClickOutside);
 return () => document.removeEventListener('mousedown', handleClickOutside);
 }, []);

 return (
 <div className="relative" ref={ref}>
 <button 
 onClick={() => setIsOpen(!isOpen)} 
 className="px-5 py-2.5 bg-white/60 border border-white/50 rounded-full text-sm font-bold text-slate-700 outline-none hover:bg-white/50 backdrop-blur-md transition-all shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center justify-between gap-3 min-w-[220px]"
 >
 <span>{options.find((o: any) => o.value === value)?.label || placeholder}</span>
 <ChevronDown className="w-4 h-4 opacity-70" />
 </button>
 
 {isOpen && (
 <div className="absolute top-full left-0 mt-2 w-max min-w-full bg-white/15 backdrop-blur-2xl border border-white/50 rounded-2xl shadow-xl z-50 overflow-hidden flex flex-col p-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
 {options.map((o: any) => (
 <button 
 key={o.value} 
 onClick={() => { onChange(o.value); setIsOpen(false); }} 
 className={`text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${value === o.value ? 'bg-emerald-600 text-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)]' : 'text-slate-800/70 hover:bg-white/50 backdrop-blur-md hover:text-slate-800'}`}
 >
 {o.label}
 </button>
 ))}
 </div>
 )}
 </div>
 );
};


export const ScoreRecap: React.FC = () => {
 const navigate = useNavigate();
 const [recapData, setRecapData] = useState<any[]>([]);
 const [filteredData, setFilteredData] = useState<any[]>([]);
 const [searchQuery, setSearchQuery] = useState('');
 const [sessionFilter, setSessionFilter] = useState('Semua');
 const [predicateFilter, setPredicateFilter] = useState('Semua');
 const [loading, setLoading] = useState(true);

 const fetchRecap = async () => {
 setLoading(true);
 try {
 const res = await api.get('/scores/recap');
 setRecapData(res.data);
 } catch (err) {
 console.error('[FETCH RECAP ERROR]', err);
 } finally {
 setLoading(false);
 }
 };

 useEffect(() => {
 fetchRecap();
 }, []);

 // Compute Unique Sessions for Dropdown
 const uniqueSessions = useMemo(() => {
 const sessions = new Set(recapData.map((d) => d.nama_sesi).filter(Boolean));
 return ['Semua', ...Array.from(sessions)];
 }, [recapData]);

 // Apply Filters
 useEffect(() => {
 let result = recapData;

 if (searchQuery.trim()) {
 const q = searchQuery.toLowerCase();
 result = result.filter(
 (item) =>
 item.nama_lengkap?.toLowerCase().includes(q) ||
 item.nomor_induk?.toLowerCase().includes(q)
 );
 }

 if (sessionFilter !== 'Semua') {
 result = result.filter((item) => item.nama_sesi === sessionFilter);
 }

 if (predicateFilter === 'Lulus S1') {
 result = result.filter((item) => (item.total_skor_toefl || 0) >= 450);
 } else if (predicateFilter === 'Belum Memenuhi Syarat') {
 result = result.filter((item) => (item.total_skor_toefl || 0) < 450);
 }

 setFilteredData(result);
 }, [searchQuery, sessionFilter, predicateFilter, recapData]);

 // Calculate KPI Analytics
 const analytics = useMemo(() => {
 const total = recapData.length;
 if (total === 0) return { total: 0, avg: 0, passRate: 0, passCount: 0, maxScore: 0, maxCefr: '-' };
 
 let sum = 0;
 let max = 0;
 let maxC = '-';
 let passC = 0;

 recapData.forEach(d => {
 const score = d.total_skor_toefl || 0;
 sum += score;
 if (score >= 450) passC++;
 if (score > max) {
 max = score;
 maxC = d.level_cefr || '-';
 }
 });

 return {
 total,
 avg: Math.round(sum / total),
 passCount: passC,
 passRate: Math.round((passC / total) * 100 * 10) / 10,
 maxScore: max,
 maxCefr: maxC
 };
 }, [recapData]);

 
 const generateCertificate = (item: any) => {
 const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
 
 // Background
 doc.setFillColor(245, 247, 250);
 doc.rect(0, 0, 297, 210, 'F');
 
 // Border
 doc.setDrawColor(30, 64, 175);
 doc.setLineWidth(3);
 doc.rect(10, 10, 277, 190);
 doc.setLineWidth(1);
 doc.rect(12, 12, 273, 186);

 // Title
 doc.setFont("helvetica", "bold");
 doc.setTextColor(30, 64, 175);
 doc.setFontSize(36);
 doc.text("CERTIFICATE OF ACHIEVEMENT", 148.5, 45, { align: "center" });

 // Subtitle
 doc.setFontSize(16);
 doc.setTextColor(100, 100, 100);
 doc.setFont("helvetica", "normal");
 doc.text("This is to certify that", 148.5, 65, { align: "center" });

 // Name
 doc.setFontSize(36);
 doc.setTextColor(15, 23, 42);
 doc.setFont("times", "bolditalic");
 doc.text(item.nama_lengkap.toUpperCase(), 148.5, 90, { align: "center" });

 // NIM
 doc.setFontSize(14);
 doc.setFont("helvetica", "normal");
 doc.text("Student ID (NIM): " + item.nomor_induk, 148.5, 105, { align: "center" });

 // Body
 doc.setFontSize(14);
 doc.setTextColor(70, 70, 70);
 doc.text("Has successfully completed the Test of English as a Foreign Language (TOEFL) ITP", 148.5, 125, { align: "center" });
 doc.text("with the following scores:", 148.5, 135, { align: "center" });

 // Scores
 doc.setFontSize(14);
 doc.setFont("helvetica", "bold");
 doc.setTextColor(15, 23, 42);
 doc.text("Listening: " + item.skala_listening, 80, 155, { align: "center" });
 doc.text("Structure: " + item.skala_structure, 148.5, 155, { align: "center" });
 doc.text("Reading: " + item.skala_reading, 217, 155, { align: "center" });

 // Total Score
 doc.setFontSize(20);
 doc.setTextColor(30, 64, 175);
 doc.text("TOTAL SCORE: " + item.total_skor_toefl, 148.5, 175, { align: "center" });
 
 // CEFR Level
 doc.setFontSize(14);
 doc.setTextColor(15, 23, 42);
 doc.text("CEFR Level: " + (item.level_cefr || '-'), 148.5, 187, { align: "center" });

 doc.save(`Certificate_TOEFL_${item.nomor_induk}.pdf`);
 };

 const handleExportExcel = () => {
 if (filteredData.length === 0) return;

 const excelRows = filteredData.map((item, index) => ({
 'No': index + 1,
 'NIM': item.nomor_induk,
 'Nama Lengkap': item.nama_lengkap,
 'Email': item.email,
 'Sesi Ujian': item.nama_sesi,
 'Benar L (0-50)': item.benar_listening,
 'Skala L': item.skala_listening,
 'Benar S (0-40)': item.benar_structure,
 'Skala S': item.skala_structure,
 'Benar R (0-50)': item.benar_reading,
 'Skala R': item.skala_reading,
 'Total Skor': item.total_skor_toefl,
 'Status': (item.total_skor_toefl || 0) >= 450 ? 'Lulus S1' : 'Belum Memenuhi',
 'Level CEFR': item.level_cefr,
 }));

 const worksheet = XLSX.utils.json_to_sheet(excelRows);
 const workbook = XLSX.utils.book_new();
 XLSX.utils.book_append_sheet(workbook, worksheet, 'Rekapitulasi Nilai TOEFL');
 XLSX.writeFile(workbook, `Rekapitulasi_TOEFL_${new Date().toISOString().slice(0, 10)}.xlsx`);
 };

 return (
 <div className="h-screen overflow-hidden bg-[url('/bg-proctor.jpg')] bg-cover bg-center p-4 md:p-6 font-sans text-slate-800 flex gap-6 box-border selection:bg-teal-500/20 relative">
 
 {/* Sidebar */}
 <SidebarProctor activePath="/proctor/recap" />

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
 {/* Header */}
 <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 pt-2 text-slate-800">
 <div>
 <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Rekapitulasi Skor & Sertifikasi TOEFL</h1>
 <p className="text-slate-500 font-medium">Laporan skor hasil konversi resmi ETS (310–677), klasifikasi CEFR, dan penerbitan sertifikat digital.</p>
 </div>
 
 <div className="flex items-center gap-3 self-start md:self-auto">
 <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-white/50 hover:border-slate-300 bg-white/60 text-slate-700 font-bold text-sm transition-all shadow-[0_8px_30px_rgb(0,0,0,0.04)] cursor-pointer">
 <Mail className="w-4 h-4" />
 <span>Kirim Sertifikat Massal via Email</span>
 </button>
 <button onClick={handleExportExcel} disabled={filteredData.length === 0} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-slate-800 font-bold text-sm transition-all shadow-[0_8px_30px_rgb(0,0,0,0.04)] shadow-emerald-600/20 cursor-pointer disabled:opacity-50">
 <Download className="w-5 h-5" />
 <span>Ekspor Rekapitulasi Excel (.xlsx)</span>
 </button>
 </div>
 </header>

 {/* KPI Analytics Cards */}
 <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
 <div className="bg-white/50 backdrop-blur-md text-slate-800 p-6 rounded-[1.5rem] border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center gap-5">
 <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
 <Users className="w-6 h-6" />
 </div>
 <div>
 <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Peserta Dinilai</p>
 <p className="text-2xl font-black text-slate-800">{analytics.total} <span className="text-sm text-slate-500 font-medium">Mahasiswa</span></p>
 </div>
 </div>
 <div className="bg-white/50 backdrop-blur-md text-slate-800 p-6 rounded-[1.5rem] border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center gap-5">
 <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
 <Target className="w-6 h-6" />
 </div>
 <div>
 <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Rata-rata Skor Kampus</p>
 <p className="text-2xl font-black text-slate-800">{analytics.avg} <span className="text-sm text-slate-500 font-medium">(Skala ETS)</span></p>
 </div>
 </div>
 <div className="bg-white/50 backdrop-blur-md text-slate-800 p-6 rounded-[1.5rem] border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center gap-5">
 <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
 <CheckCircle2 className="w-6 h-6" />
 </div>
 <div>
 <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Tingkat Kelulusan S1 (≥ 450)</p>
 <p className="text-2xl font-black text-slate-800">{analytics.passRate}% <span className="text-sm text-slate-500 font-medium">({analytics.passCount} Memenuhi)</span></p>
 </div>
 </div>
 <div className="bg-white/50 backdrop-blur-md text-slate-800 p-6 rounded-[1.5rem] border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center gap-5">
 <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
 <TrendingUp className="w-6 h-6" />
 </div>
 <div>
 <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Skor Tertinggi</p>
 <p className="text-2xl font-black text-slate-800">{analytics.maxScore} <span className="text-sm text-slate-400 font-medium">(Level {analytics.maxCefr})</span></p>
 </div>
 </div>
 </div>

 {/* Enriched Data Table Section */}
 <div className="bg-white/50 backdrop-blur-md text-slate-800 rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 flex-1 flex flex-col min-h-0">
 
 {/* Toolbar */}
 <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-6">
 <div className="relative w-full xl:w-80">
 <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
 <input 
 type="text" 
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 placeholder="Cari berdasarkan NIM atau Nama..."
 className="w-full pl-11 pr-4 py-2.5 bg-white/60 border border-white/50 rounded-full text-sm font-medium focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
 />
 </div>
 
 <div className="flex items-center gap-3">
 {/* Custom Dropdown: Session */}
 <CustomDropdown 
 value={sessionFilter}
 onChange={setSessionFilter}
 options={uniqueSessions.map(s => ({ value: s, label: s === 'Semua' ? 'Semua Gelombang / Sesi' : s }))}
 />

 {/* Custom Dropdown: Predicate */}
 <CustomDropdown 
 value={predicateFilter}
 onChange={setPredicateFilter}
 options={[
 { value: 'Semua', label: 'Semua Predikat Kelulusan' },
 { value: 'Lulus S1', label: 'Lulus S1 (≥ 450)' },
 { value: 'Belum Memenuhi Syarat', label: 'Belum Memenuhi Syarat (< 450)' }
 ]}
 />

 <button onClick={fetchRecap} className="p-2.5 border border-white/50 rounded-full text-slate-500 hover:bg-white/60 transition-colors" title="Segarkan Data">
 <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
 </button>
 </div>
 </div>

 {/* Table */}
 <div className="overflow-x-auto flex-1">
 <table className="w-full text-left border-separate border-spacing-y-2">
 <thead>
 <tr className="text-slate-400 text-xs font-bold uppercase tracking-wider">
 <th className="pb-2 px-4 whitespace-nowrap">No & NIM</th>
 <th className="pb-2 px-4 whitespace-nowrap">Nama Lengkap</th>
 <th className="pb-2 px-4 whitespace-nowrap">Rincian Skor (Mentah/Skala)</th>
 <th className="pb-2 px-4 text-center whitespace-nowrap">Total Skor</th>
 <th className="pb-2 px-4 text-center whitespace-nowrap">Predikat CEFR & Status</th>
 <th className="pb-2 px-4 text-right whitespace-nowrap">Aksi</th>
 </tr>
 </thead>
 <tbody className="text-sm font-medium">
 {loading ? (
 <tr><td colSpan={6} className="text-center py-12 text-slate-400 font-bold">Memuat Analitik Skor...</td></tr>
 ) : filteredData.length === 0 ? (
 <tr><td colSpan={6} className="text-center py-12 text-slate-400 font-bold">Data skor tidak ditemukan.</td></tr>
 ) : (
 filteredData.map((item, index) => {
 const isPassed = (item.total_skor_toefl || 0) >= 450;
 return (
 <tr key={item.id} className="group bg-white/60 hover:bg-white/60 transition-colors">
 <td className="p-4 rounded-l-2xl border-y border-l border-transparent group-hover:border-white/40">
 <div className="flex flex-col">
 <span className="text-xs text-slate-400 font-bold">#{index + 1}</span>
 <span className="font-mono text-slate-800 font-bold">{item.nomor_induk}</span>
 </div>
 </td>
 <td className="p-4 border-y border-transparent group-hover:border-white/40">
 <span className="font-bold text-slate-800">{item.nama_lengkap}</span>
 </td>
 <td className="p-4 border-y border-transparent group-hover:border-white/40">
 <div className="flex flex-col gap-1.5 w-max">
 <div className="flex items-center justify-between gap-4 text-xs">
 <span className="text-slate-500 w-16">Listening</span>
 <span className="font-mono text-slate-400">{item.benar_listening}/50</span>
 <span className="font-bold text-slate-800 font-mono bg-white/60 px-1.5 py-0.5 rounded">S: {item.skala_listening}</span>
 </div>
 <div className="flex items-center justify-between gap-4 text-xs">
 <span className="text-slate-500 w-16">Structure</span>
 <span className="font-mono text-slate-400">{item.benar_structure}/40</span>
 <span className="font-bold text-slate-800 font-mono bg-white/60 px-1.5 py-0.5 rounded">S: {item.skala_structure}</span>
 </div>
 <div className="flex items-center justify-between gap-4 text-xs">
 <span className="text-slate-500 w-16">Reading</span>
 <span className="font-mono text-slate-400">{item.benar_reading}/50</span>
 <span className="font-bold text-slate-800 font-mono bg-white/60 px-1.5 py-0.5 rounded">S: {item.skala_reading}</span>
 </div>
 </div>
 </td>
 <td className="p-4 border-y border-transparent group-hover:border-white/40 text-center">
 <span className="font-mono text-xl font-black tracking-wider text-slate-800 bg-white/60 px-3 py-1.5 rounded-xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
 {item.total_skor_toefl}
 </span>
 </td>
 <td className="p-4 border-y border-transparent group-hover:border-white/40 text-center">
 <div className="flex flex-col items-center gap-1.5">
 <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${isPassed ? 'bg-emerald-100 text-emerald-700' : 'bg-white/60 text-slate-500'}`}>
 Level {item.level_cefr}
 </span>
 <span className={`text-[10px] font-bold ${isPassed ? 'text-emerald-500' : 'text-slate-400'}`}>
 {isPassed ? 'Lulus Sidang Skripsi' : 'Belum Memenuhi Syarat'}
 </span>
 </div>
 </td>
 <td className="p-4 rounded-r-2xl border-y border-r border-transparent group-hover:border-white/40 text-right">
 <div className="flex items-center justify-end gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
 <button onClick={() => generateCertificate(item)} className="p-2 rounded-xl bg-white/60 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors border border-white/40 cursor-pointer" title="Cetak PDF Sertifikat">
 <FileText className="w-4 h-4" />
 </button>
 <button className="p-2 rounded-xl bg-white/60 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors border border-white/40" title="Kirim Email Nilai">
 <Mail className="w-4 h-4" />
 </button>
 <button className="p-2 rounded-xl bg-white/60 text-slate-400 hover:text-slate-800 hover:bg-white/60 transition-colors border border-white/40" title="Rincian Jawaban">
 <MoreVertical className="w-4 h-4" />
 </button>
 </div>
 </td>
 </tr>
 );
 })
 )}
 </tbody>
 </table>
 </div>
 </div>
 </motion.main>
 </div>
 </div>
 );
};




