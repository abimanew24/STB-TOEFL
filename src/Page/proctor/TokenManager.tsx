import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
 Plus, Copy, Search, Filter, 
 Users, Activity, CheckCircle2, Clock, Trash2, Server, ToggleRight, ToggleLeft, ChevronDown,
  KeyRound
} from 'lucide-react';
import { SidebarProctor } from '../../components/common/SidebarProctor';
import { ProctorHeader } from '../../components/proctor/ProctorHeader';
import { Modal } from '../../components/common/Modal';
import { CustomDropdown } from '../../components/common/CustomDropdown';
import api from '../../services/api';

// No mock participants needed

export const TokenManager: React.FC = () => {
 const [sessions, setSessions] = useState<any[]>([]);
 const [participants, setParticipants] = useState<any[]>([]);
 const [loading, setLoading] = useState(true);

 // Modals
 const [createModalOpen, setCreateModalOpen] = useState(false);

 // Form States
 const [namaSesi, setNamaSesi] = useState('');
 const [submitting, setSubmitting] = useState(false);

 // API Calls
 const fetchSessions = async () => {
 setLoading(true);
 try {
 const res = await api.get('/sessions');
 setSessions(res.data);
 } catch (err) {
 console.error('[FETCH SESSIONS ERROR]', err);
 } finally {
 setLoading(false);
 }
 };

 const fetchParticipants = async () => {
 try {
 const res = await api.get('/users');
 setParticipants(res.data);
 } catch (err) {
 console.error('[FETCH PARTICIPANTS ERROR]', err);
 }
 };

 useEffect(() => {
 fetchSessions();
 fetchParticipants();
 }, []);

 const handleCreateSession = async (e: React.FormEvent) => {
 e.preventDefault();
 if (!namaSesi) return;

 setSubmitting(true);
 try {
 await api.post('/sessions', { nama_sesi: namaSesi });
 setNamaSesi('');
 setCreateModalOpen(false);
 fetchSessions();
 } catch (err: any) {
 alert(err.response?.data?.message || 'Gagal membuat sesi ujian.');
 } finally {
 setSubmitting(false);
 }
 };

 const handleToggleStatus = async (sessionId: number, currentStatus: boolean) => {
 try {
 await api.patch(`/sessions/${sessionId}/status`, { status_aktif: !currentStatus });
 fetchSessions();
 } catch (err) {
 console.error('[TOGGLE STATUS ERROR]', err);
 }
 };

 const handleCopyToken = (token: string) => {
 navigator.clipboard.writeText(token);
 alert('Token ' + token + ' disalin ke clipboard!');
 };

 const handleDeleteParticipant = async (id: number) => {
 if (!window.confirm('Yakin ingin menghapus peserta ini?')) return;
 try {
 await api.delete(`/users/${id}`);
 fetchParticipants();
 } catch (err: any) {
 alert(err.response?.data?.message || 'Gagal menghapus peserta');
 }
 };

 const handleDeleteSession = async (sessionId: number) => {
 const target = sessions.find(s => s.id === sessionId);
 if (!window.confirm(`Yakin ingin menghapus sesi '${target?.nama_sesi || ''}'? Sesi yang dihapus tidak dapat dipulihkan.`)) return;
 try {
 await api.delete(`/sessions/${sessionId}`);
 alert(`Sesi '${target?.nama_sesi || ''}' berhasil dihapus.`);
 await fetchSessions();
 setSelectedSessionId(null);
 } catch (err: any) {
 alert(err.response?.data?.message || 'Gagal menghapus sesi');
 }
 };

 // Sesi yang sedang dipilih untuk diinspeksi
 const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);
 const currentSession = sessions.find(s => s.id === selectedSessionId) || sessions.find(s => s.status_aktif) || sessions[0];
 const activeSession = currentSession;

 return (
 <div className="h-screen overflow-hidden bg-[url('/bg-proctor.jpg')] bg-cover bg-center p-4 md:p-6 font-sans text-slate-800 flex gap-6 box-border selection:bg-teal-500/20 relative">
 
 {/* Sidebar */}
 <SidebarProctor activePath="/proctor/tokens" />

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
 {/* Header with Unified Controls */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-2 text-slate-800">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-800">Manajemen Sesi & Token Ujian</h1>
          <p className="text-slate-500 font-medium text-xs md:text-sm mt-0.5">Atur parameter sesi, pantau aktivasi token, dan kelola kuota peserta terdaftar.</p>
        </div>
        
        <div className="flex items-center gap-2.5 flex-wrap">
          <CustomDropdown
            value={currentSession?.id || ""}
            onChange={(val) => setSelectedSessionId(Number(val))}
            options={sessions.map((s) => ({
              value: s.id,
              label: s.nama_sesi,
              badge: `${s.total_peserta || 0} mhs`,
              isLive: Boolean(s.status_aktif)
            }))}
            placeholder="Pilih Sesi Ujian..."
          />

          {currentSession && sessions.length > 1 && (
            <button
              onClick={() => handleDeleteSession(currentSession.id)}
              className="p-2.5 rounded-2xl bg-white/40 hover:bg-rose-50/70 text-slate-400 hover:text-rose-600 border border-white/60 hover:border-rose-200 transition-all shadow-sm cursor-pointer"
              title={`Hapus ${currentSession.nama_sesi}`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          <button 
            onClick={() => setCreateModalOpen(true)} 
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white/40 hover:bg-white/70 text-slate-700 font-semibold text-xs md:text-sm transition-all border border-white/60 shadow-sm cursor-pointer backdrop-blur-sm"
          >
            <Plus className="w-4 h-4 text-slate-500" />
            <span>Buat Sesi Baru</span>
          </button>
        </div>
      </header>

 {/* Kartu Ringkasan Sesi Aktif */}
 {activeSession ? (
 <div className="bg-white/50 backdrop-blur-md text-slate-800 rounded-[2.5rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between relative overflow-hidden">
 <div className="absolute top-0 right-0 w-64 h-64 bg-teal-50/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

 <div className="flex flex-col gap-4 relative z-10">
 <div className="flex items-center gap-3">
 <span className={`px-3 py-1 text-xs font-semibold rounded-full border transition-colors ${
 activeSession.status_aktif 
 ? 'bg-teal-50/80 text-teal-800 border-teal-200/70' 
 : 'bg-slate-100/80 text-slate-500 border-slate-200/70'
 }`}>
 {activeSession.status_aktif ? 'Sesi Terbuka' : 'Sesi Ditutup'}
 </span>
 <h2 className="text-xl font-bold text-slate-800">{activeSession.nama_sesi}</h2>
 </div>
 
 <div className="flex items-center gap-4">
 <div className="bg-white/60 border border-white/50 px-6 py-3 rounded-2xl flex items-center gap-4">
 <span className="font-mono text-3xl font-black tracking-[0.2em] text-slate-800">{activeSession.token}</span>
 <div className="flex flex-col gap-1 border-l border-white/50 pl-4">
 <button onClick={() => handleCopyToken(activeSession.token)} className="text-slate-400 hover:text-teal-700 transition-colors cursor-pointer" title="Salin Token">
 <Copy className="w-4 h-4" />
 </button>
 </div>
 </div>
 <div onClick={() => handleToggleStatus(activeSession.id, Boolean(activeSession.status_aktif))} className="flex items-center gap-2 cursor-pointer group">
 {activeSession.status_aktif ? (
 <ToggleRight className="w-9 h-9 text-teal-600 group-hover:opacity-80 transition-opacity" />
 ) : (
 <ToggleLeft className="w-9 h-9 text-slate-300 group-hover:opacity-80 transition-opacity" />
 )}
 <span className={`text-xs font-semibold ${activeSession.status_aktif ? 'text-teal-700' : 'text-slate-400'}`}>
 {activeSession.status_aktif ? 'Terbuka' : 'Ditutup'}
 </span>
 </div>
 </div>
 </div>

 <div className="flex flex-col gap-3 relative z-10 w-full lg:w-auto">
 <div className="grid grid-cols-3 gap-3">
 <div className="bg-white/60 backdrop-blur-md rounded-2xl p-3.5 border border-white/60 shadow-sm flex flex-col justify-between min-w-[110px]">
 <div className="flex items-center justify-between text-slate-400 mb-1">
 <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Terdaftar</span>
 <Users className="w-3.5 h-3.5 text-blue-500" />
 </div>
 <p className="text-2xl font-black text-slate-800">{activeSession.total_peserta || 0}</p>
 <span className="text-[10px] font-medium text-slate-400 mt-0.5">Total Mahasiswa</span>
 </div>

 <div className="bg-white/60 backdrop-blur-md rounded-2xl p-3.5 border border-white/60 shadow-sm flex flex-col justify-between min-w-[110px]">
 <div className="flex items-center justify-between text-slate-400 mb-1">
 <span className="text-[10px] font-black uppercase tracking-wider text-amber-600">Sedang Ujian</span>
 <Activity className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
 </div>
 <p className="text-2xl font-black text-amber-600">{activeSession.total_mengerjakan || 0}</p>
 <span className="text-[10px] font-medium text-slate-400 mt-0.5">Aktif Mengerjakan</span>
 </div>

 <div className="bg-white/60 backdrop-blur-md rounded-2xl p-3.5 border border-white/60 shadow-sm flex flex-col justify-between min-w-[110px]">
 <div className="flex items-center justify-between text-slate-400 mb-1">
 <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600">Selesai</span>
 <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
 </div>
 <p className="text-2xl font-black text-emerald-600">{activeSession.total_selesai || 0}</p>
 <span className="text-[10px] font-medium text-slate-400 mt-0.5">Lembar Terkumpul</span>
 </div>
 </div>

 <div className="bg-white/40 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/40 flex items-center justify-between text-xs font-semibold text-slate-500">
 <div className="flex items-center gap-1.5">
 <Clock className="w-3.5 h-3.5 text-teal-600" />
 <span>Durasi: <strong className="text-slate-700">115 Menit</strong></span>
 </div>
 <span className="text-slate-300">•</span>
 <div>
 Total: <strong className="text-slate-700">140 Soal</strong>
 </div>
 </div>
 </div>
 </div>
 ) : (
 <div className="bg-white/50 backdrop-blur-md text-slate-800 rounded-[2.5rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 text-center text-slate-500 font-bold">
 Belum ada sesi yang dibuat. Silakan buat sesi baru.
 </div>
 )}

 {/* Candidate Management Table (Mock Frontend Logic) */}
 <div className="bg-white/50 backdrop-blur-md text-slate-800 rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 flex-1 flex flex-col min-h-0">
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
 <h3 className="text-lg font-bold text-slate-800">Daftar Mahasiswa Peserta</h3>
 
 <div className="flex items-center gap-3">
 <div className="relative">
 <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
 <input 
 type="text" 
 placeholder="Cari NIM atau Nama..."
 className="pl-9 pr-4 py-2 bg-white/60 border border-white/50 rounded-full text-sm font-medium focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 w-64 transition-all"
 />
 </div>
 <button className="p-2 border border-white/50 rounded-full text-slate-500 hover:bg-white/60 transition-colors">
 <Filter className="w-4 h-4" />
 </button>
 <button className="px-4 py-2 bg-white/60 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-full transition-colors cursor-pointer">
 Pilih Semua
 </button>
 </div>
 </div>

 <div className="overflow-x-auto">
 <table className="w-full text-left">
 <thead>
 <tr className="text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-white/40">
 <th className="pb-3 px-3 w-10">
 <input type="checkbox" className="rounded text-emerald-600 bg-white/60 border-slate-300" />
 </th>
 <th className="pb-3 px-3">Mahasiswa</th>
 <th className="pb-3 px-3">Email</th>
 <th className="pb-3 px-3 text-center">Token Pribadi</th>
 <th className="pb-3 px-3 text-center">Status Email</th>
 <th className="pb-3 px-3 text-center">Status Ujian</th>
 <th className="pb-3 px-3 text-right">Aksi</th>
 </tr>
 </thead>
 <tbody className="text-sm font-medium">
 {participants.filter(p => !currentSession?.id || (p.sesi_id ? p.sesi_id === currentSession.id : currentSession.id === 1)).map((p) => (
 <tr key={p.id} className="border-b border-slate-100 last:border-0 hover:bg-white/40 transition-colors group">
 <td className="py-4 px-3">
 <input type="checkbox" className="rounded text-emerald-600 bg-white/60 border-slate-300 cursor-pointer" />
 </td>
 <td className="py-4 px-3">
 <div className="flex flex-col">
 <span className="font-bold text-slate-800">{p.nama_lengkap}</span>
 <span className="font-mono text-xs text-slate-400">{p.nomor_induk}</span>
 </div>
 </td>
 <td className="py-4 px-3 text-slate-500">{p.email}</td>
 <td className="py-4 px-3 text-center">
 <span className="font-mono text-xs font-bold bg-white/60 text-slate-700 px-2 py-1 rounded-md border border-white/50">
 {activeSession ? activeSession.token : 'Belum Ada Sesi'}
 </span>
 </td>
 <td className="py-4 px-3 text-center">
 <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600">
 <CheckCircle2 className="w-3 h-3" /> Siap Ujian
 </span>
 </td>
 <td className="py-4 px-3 text-center">
 <span className="text-xs font-bold text-slate-400">Terdaftar</span>
 </td>
 <td className="py-4 px-3 text-right">
 <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
 <button onClick={() => handleDeleteParticipant(p.id)} className="p-1.5 rounded bg-white/60 text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer" title="Hapus Peserta">
 <Trash2 className="w-4 h-4" />
 </button>
 </div>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 </motion.main>
 </div>

 {/* Create Session Modal */}
 <Modal isOpen={createModalOpen} onClose={() => setCreateModalOpen(false)} title="Buat Sesi Ujian Baru">
 <form onSubmit={handleCreateSession} className="space-y-4 pt-2 text-slate-800">
 <div>
 <label className="block text-sm font-semibold text-slate-700 mb-2">Nama / Label Sesi Ujian</label>
 <input
 type="text"
 required
 value={namaSesi}
 onChange={(e) => setNamaSesi(e.target.value)}
 placeholder="Contoh: STBTOEFL Gelombang 1 - Lab 01"
 className="w-full bg-white/70 border border-slate-200/80 rounded-2xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 outline-none placeholder:text-slate-400 transition-all"
 />
 </div>
 <div className="pt-4 flex justify-end gap-2.5">
 <button type="button" onClick={() => setCreateModalOpen(false)} className="px-5 py-2.5 rounded-2xl bg-white/70 text-slate-600 font-semibold text-sm hover:bg-slate-100 transition-colors border border-slate-200/60 cursor-pointer">
 Batal
 </button>
 <button type="submit" disabled={submitting} className="px-5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-900 text-white text-sm font-semibold transition-all shadow-sm cursor-pointer disabled:opacity-50">
 {submitting ? 'Membuat...' : 'Buat Sesi & Token'}
 </button>
 </div>
 </form>
 </Modal>

 </div>
 );
};




