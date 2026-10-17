import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
 Award, Download, RefreshCw, Search, 
 FileText, MoreVertical, Server, Clock, Users, Target, TrendingUp, CheckCircle2, Trash2
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import { SidebarProctor } from '../../components/common/SidebarProctor';
import { ProctorHeader } from '../../components/proctor/ProctorHeader';
import { CustomDropdown, DropdownOption } from '../../components/common/CustomDropdown';
import api from '../../services/api';

export const ScoreRecap: React.FC = () => {
 const navigate = useNavigate();
 const [recapData, setRecapData] = useState<any[]>([]);
 const [filteredData, setFilteredData] = useState<any[]>([]);
 const [sessions, setSessions] = useState<any[]>([]);
 const [searchQuery, setSearchQuery] = useState('');
 const [sessionFilter, setSessionFilter] = useState('Semua');
 const [predicateFilter, setPredicateFilter] = useState('Semua');
 const [loading, setLoading] = useState(true);
 const [activeMenuId, setActiveMenuId] = useState<number | null>(null);

 const fetchRecap = async () => {
 setLoading(true);
 try {
 const [resRecap, resSessions] = await Promise.all([
 api.get('/scores/recap'),
 api.get('/sessions')
 ]);
 setRecapData(resRecap.data);
 setSessions(resSessions.data);
 } catch (err) {
 console.error('[FETCH RECAP ERROR]', err);
 } finally {
 setLoading(false);
 }
 };

 useEffect(() => {
 fetchRecap();
 }, []);

 // Tutup menu opsi saat klik di area luar
 useEffect(() => {
 const handleOutsideClick = () => setActiveMenuId(null);
 window.addEventListener('click', handleOutsideClick);
 return () => window.removeEventListener('click', handleOutsideClick);
 }, []);

 const handleDeleteScore = async (id: number, namaLengkap: string) => {
 if (!window.confirm(`Yakin ingin menghapus rekap hasil ujian untuk mahasiswa '${namaLengkap}'? Data skor dan lembar jawaban akan dihapus sehingga mahasiswa dapat mengikuti ujian kembali.`)) {
 return;
 }

 try {
 await api.delete(`/scores/${id}`);
 await fetchRecap();
 } catch (err: any) {
 console.error('[DELETE SCORE ERROR]', err);
 alert(err.response?.data?.message || 'Gagal menghapus hasil ujian');
 }
 };

 // Compute Session Options for Dropdown with participant counts & status
 const sessionOptions = useMemo(() => {
 const opts: DropdownOption[] = [
 { 
 value: 'Semua', 
 label: 'Semua Gelombang / Sesi', 
 badge: `${recapData.length} mhs` 
 }
 ];

 sessions.forEach((s) => {
 const count = recapData.filter(
 (d) => String(d.sesi_id) === String(s.id) || d.nama_sesi === s.nama_sesi
 ).length;
 opts.push({
 value: String(s.id),
 label: s.nama_sesi,
 badge: `${count} mhs`,
 isLive: Boolean(s.status_aktif)
 });
 });

 return opts;
 }, [sessions, recapData]);

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
 result = result.filter(
 (item) => String(item.sesi_id) === String(sessionFilter) || item.nama_sesi === sessionFilter
 );
 }

 if (predicateFilter === 'Lulus S1') {
 result = result.filter((item) => (item.total_skor_toefl || 0) >= 450);
 } else if (predicateFilter === 'Belum Memenuhi Syarat') {
 result = result.filter((item) => (item.total_skor_toefl || 0) < 450);
 }

 setFilteredData(result);
 }, [searchQuery, sessionFilter, predicateFilter, recapData]);

 // Calculate KPI Analytics dynamically based on current filtered view
 const analytics = useMemo(() => {
 const total = filteredData.length;
 if (total === 0) return { total: 0, avg: 0, passRate: 0, passCount: 0, maxScore: 0, maxCefr: '-' };
 
 let sum = 0;
 let max = 0;
 let maxC = '-';
 let passC = 0;

 filteredData.forEach(d => {
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
 }, [filteredData]);

 
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
 'Sesi Ujian': item.nama_sesi || 'Sesi 1',
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
 const sessionTag = sessionFilter !== 'Semua'
 ? (sessions.find(s => String(s.id) === String(sessionFilter))?.nama_sesi || sessionFilter).replace(/\s+/g, '_')
 : 'Semua_Sesi';
 XLSX.writeFile(workbook, `Rekapitulasi_TOEFL_${sessionTag}_${new Date().toISOString().slice(0, 10)}.xlsx`);
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
 <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-1">Rekapitulasi Skor TOEFL</h1>
 <p className="text-slate-500 font-medium text-sm">Laporan skor hasil konversi resmi ETS (310–677), klasifikasi CEFR, dan ekspor data nilai.</p>
 </div>
 
 <div className="flex items-center gap-3 self-start md:self-auto">
 <button onClick={handleExportExcel} disabled={filteredData.length === 0} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/80 hover:bg-white text-slate-700 font-bold text-sm transition-all shadow-sm border border-white/70 hover:shadow-md cursor-pointer disabled:opacity-50 whitespace-nowrap">
 <Download className="w-4 h-4 text-emerald-600" />
 <span>Ekspor Excel (.xlsx)</span>
 </button>
 </div>
 </header>

 {/* KPI Analytics Cards */}
 <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
 <div className="bg-white/50 backdrop-blur-md p-4 rounded-2xl border border-white/60 shadow-sm flex items-center gap-3.5">
 <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
 <Users className="w-5 h-5" />
 </div>
 <div className="min-w-0">
 <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Peserta Dinilai</p>
 <p className="text-xl font-black text-slate-800 tracking-tight">{analytics.total} <span className="text-xs font-semibold text-slate-400">Mhs</span></p>
 </div>
 </div>

 <div className="bg-white/50 backdrop-blur-md p-4 rounded-2xl border border-white/60 shadow-sm flex items-center gap-3.5">
 <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
 <Target className="w-5 h-5" />
 </div>
 <div className="min-w-0">
 <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Rata-rata Skor</p>
 <p className="text-xl font-black text-slate-800 tracking-tight">{analytics.avg} <span className="text-xs font-semibold text-slate-400">ETS</span></p>
 </div>
 </div>

 <div className="bg-white/50 backdrop-blur-md p-4 rounded-2xl border border-white/60 shadow-sm flex items-center gap-3.5">
 <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
 <CheckCircle2 className="w-5 h-5" />
 </div>
 <div className="min-w-0">
 <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Kelulusan S1</p>
 <p className="text-xl font-black text-emerald-600 tracking-tight">{analytics.passRate}% <span className="text-xs font-semibold text-slate-400">({analytics.passCount} Lulus)</span></p>
 </div>
 </div>

 <div className="bg-white/50 backdrop-blur-md p-4 rounded-2xl border border-white/60 shadow-sm flex items-center gap-3.5">
 <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
 <TrendingUp className="w-5 h-5" />
 </div>
 <div className="min-w-0">
 <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Skor Tertinggi</p>
 <p className="text-xl font-black text-slate-800 tracking-tight">{analytics.maxScore} <span className="text-xs font-semibold text-amber-600">CEFR {analytics.maxCefr}</span></p>
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
 options={sessionOptions}
 placeholder="Pilih Sesi..."
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
 <div className="flex flex-col gap-1">
 <span className="font-bold text-slate-800">{item.nama_lengkap}</span>
 <span className="inline-block text-[11px] font-semibold text-teal-800/80 bg-teal-50/70 border border-teal-200/50 px-2 py-0.5 rounded-md w-max">
 {item.nama_sesi || 'Sesi 1'}
 </span>
 </div>
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
 <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold ${isPassed ? 'bg-teal-50/80 text-teal-800 border border-teal-200/60' : 'bg-slate-100/80 text-slate-500 border border-slate-200/60'}`}>
 Level {item.level_cefr}
 </span>
 <span className={`text-[10px] font-semibold ${isPassed ? 'text-teal-700' : 'text-slate-400'}`}>
 {isPassed ? 'Lulus Sidang Skripsi' : 'Belum Memenuhi Syarat'}
 </span>
 </div>
 </td>
 <td className="p-4 rounded-r-2xl border-y border-r border-transparent group-hover:border-white/40 text-right">
 <div className="flex items-center justify-end gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
 <button onClick={() => generateCertificate(item)} className="p-2 rounded-xl bg-white/60 text-slate-500 hover:text-teal-700 hover:bg-teal-50 transition-colors border border-white/40 cursor-pointer" title="Cetak PDF Sertifikat">
 <FileText className="w-4 h-4" />
 </button>

 <div className="relative inline-block text-left" onClick={(e) => e.stopPropagation()}>
 <button 
 onClick={() => setActiveMenuId(activeMenuId === item.id ? null : item.id)} 
 className={`p-2 rounded-xl transition-all border cursor-pointer ${
 activeMenuId === item.id 
 ? 'bg-white text-slate-800 border-white/80 shadow-sm' 
 : 'bg-white/60 text-slate-400 hover:text-slate-800 hover:bg-white/80 border-white/40'
 }`}
 title="Opsi Tindakan"
 >
 <MoreVertical className="w-4 h-4" />
 </button>

 {activeMenuId === item.id && (
 <div className="absolute right-0 top-full mt-1.5 w-48 bg-white/95 backdrop-blur-2xl border border-white/70 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
 <button
 onClick={() => {
 setActiveMenuId(null);
 handleDeleteScore(item.id, item.nama_lengkap);
 }}
 className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer text-left"
 >
 <Trash2 className="w-4 h-4 text-rose-500 shrink-0" />
 <span>Hapus Hasil Ujian</span>
 </button>
 </div>
 )}
 </div>
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




