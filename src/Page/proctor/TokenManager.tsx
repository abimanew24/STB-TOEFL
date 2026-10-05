import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
 Plus, Upload, Copy, Mail, Search, Filter, 
 CheckCircle2, Clock, Trash2, Server, ToggleRight, ToggleLeft
} from 'lucide-react';
import { SidebarProctor } from '../../components/common/SidebarProctor';
import { ProctorHeader } from '../../components/proctor/ProctorHeader';
import { Modal } from '../../components/common/Modal';
import api from '../../services/api';

// No mock participants needed

export const TokenManager: React.FC = () => {
 const [sessions, setSessions] = useState<any[]>([]);
 const [participants, setParticipants] = useState<any[]>([]);
 const [loading, setLoading] = useState(true);

 // Modals
 const [createModalOpen, setCreateModalOpen] = useState(false);
 const [emailModalOpen, setEmailModalOpen] = useState(false);

 // Form States
 const [namaSesi, setNamaSesi] = useState('');
 const [emailInput, setEmailInput] = useState('');
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

 const handleSendEmails = async (e: React.FormEvent) => {
 e.preventDefault();
 const emailList = emailInput.split(/[\n,;]+/).map((e) => e.trim()).filter((e) => e.length > 0);
 if (emailList.length === 0 || !activeSession) return;

 setSubmitting(true);
 try {
 await api.post(`/sessions/${activeSession.id}/broadcast-email`, { emails: emailList });
 alert('Email token berhasil dikirim ke ' + emailList.length + ' peserta!');
 setEmailInput('');
 setEmailModalOpen(false);
 } catch (err: any) {
 alert(err.response?.data?.message || 'Gagal mengirim email.');
 } finally {
 setSubmitting(false);
 }
 };

 const handleCopyToken = (token: string) => {
 navigator.clipboard.writeText(token);
 alert('Token ' + token + ' disalin ke clipboard!');
 };

 const handleImportExcel = () => {
 const input = document.createElement('input');
 input.type = 'file';
 input.accept = '.xlsx, .csv';
 input.onchange = (e: any) => {
 const file = e.target.files[0];
 if (file) {
 alert('File ' + file.name + ' berhasil di-import (Simulasi Frontend).');
 }
 };
 input.click();
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

 // Ambil sesi pertama atau yang sedang aktif untuk Kartu Utama
 const activeSession = sessions.find(s => s.status_aktif) || sessions[0];

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
 style={{ WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 20px, black calc(100% - 20px), transparent)' }}
 >
 {/* Header */}
 <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 pt-2 text-slate-800">
 <div>
 <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Manajemen Sesi & Token Ujian</h1>
 <p className="text-slate-500 font-medium">Atur parameter sesi, pantau aktivasi token, dan kelola kuota peserta terdaftar.</p>
 </div>
 
 <div className="flex items-center gap-3 self-start md:self-auto">
 <button onClick={handleImportExcel} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-white/50 hover:border-slate-300 bg-white/60 text-slate-700 font-bold text-sm transition-all shadow-[0_8px_30px_rgb(0,0,0,0.04)] cursor-pointer">
 <Upload className="w-4 h-4" />
 <span>Import Peserta (Excel/CSV)</span>
 </button>
 <button onClick={() => setCreateModalOpen(true)} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-all shadow-[0_8px_30px_rgb(0,0,0,0.04)] shadow-emerald-600/20 cursor-pointer">
 <Plus className="w-5 h-5" />
 <span>Buat Sesi Baru</span>
 </button>
 </div>
 </header>

 {/* Kartu Ringkasan Sesi Aktif */}
 {activeSession ? (
 <div className="bg-white/50 backdrop-blur-md text-slate-800 rounded-[2.5rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between relative overflow-hidden">
 <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

 <div className="flex flex-col gap-4 relative z-10">
 <div className="flex items-center gap-3">
 <span className={`px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider rounded-full flex items-center gap-1.5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ${activeSession.status_aktif ? 'bg-emerald-100 text-emerald-700' : 'bg-white/60 text-slate-500'}`}>
 <span className={`w-1.5 h-1.5 rounded-full ${activeSession.status_aktif ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span> 
 {activeSession.status_aktif ? 'Sesi Aktif' : 'Sesi Ditutup'}
 </span>
 <h2 className="text-xl font-bold text-slate-800">{activeSession.nama_sesi}</h2>
 </div>
 
 <div className="flex items-center gap-4">
 <div className="bg-white/60 border border-white/50 px-6 py-3 rounded-2xl flex items-center gap-4">
 <span className="font-mono text-3xl font-black tracking-[0.2em] text-slate-800">{activeSession.token}</span>
 <div className="flex flex-col gap-1 border-l border-white/50 pl-4">
 <button onClick={() => handleCopyToken(activeSession.token)} className="text-slate-400 hover:text-emerald-600 transition-colors cursor-pointer" title="Salin Token">
 <Copy className="w-4 h-4" />
 </button>
 </div>
 </div>
 <div onClick={() => handleToggleStatus(activeSession.id, Boolean(activeSession.status_aktif))} className="flex items-center gap-2 cursor-pointer group">
 {activeSession.status_aktif ? (
 <ToggleRight className="w-10 h-10 text-emerald-500 group-hover:opacity-80 transition-opacity" />
 ) : (
 <ToggleLeft className="w-10 h-10 text-slate-300 group-hover:opacity-80 transition-opacity" />
 )}
 <span className={`text-sm font-bold ${activeSession.status_aktif ? 'text-emerald-600' : 'text-slate-400'}`}>
 {activeSession.status_aktif ? 'Terbuka' : 'Ditutup'}
 </span>
 </div>
 </div>
 </div>

 <div className="flex flex-col gap-4 relative z-10 w-full lg:w-auto">
 <div className="flex gap-4">
 <div className="bg-white/50 backdrop-blur-md rounded-2xl p-4 flex-1 border border-white/50 shadow-inner">
 <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Terdaftar</p>
 <p className="text-2xl font-black text-slate-800">{activeSession.total_peserta || 0}</p>
 </div>
 <div className="bg-white/50 backdrop-blur-md rounded-2xl p-4 flex-1 border border-white/50 shadow-inner">
 <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">Selesai</p>
 <p className="text-2xl font-black text-slate-800">{activeSession.total_selesai || 0}</p>
 </div>
 </div>
 
 <button onClick={() => setEmailModalOpen(true)} className="w-full inline-flex justify-center items-center gap-2 px-6 py-3.5 rounded-xl bg-white/60 hover:bg-white border border-white/50 text-slate-800 font-bold text-sm transition-all shadow-[0_8px_30px_rgb(0,0,0,0.04)] cursor-pointer">
 <Mail className="w-4 h-4" />
 <span>Kirim Token ke Semua Email Peserta</span>
 </button>
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
 {participants.map((p) => (
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
 <button className="p-1.5 rounded bg-white/60 text-slate-500 hover:bg-emerald-50 hover:text-emerald-600 transition-colors cursor-pointer" title="Kirim Email">
 <Mail className="w-4 h-4" />
 </button>
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
 <label className="block text-sm font-bold text-slate-800 mb-2">Nama / Label Sesi Ujian</label>
 <input
 type="text"
 required
 value={namaSesi}
 onChange={(e) => setNamaSesi(e.target.value)}
 placeholder="Contoh: STBTOEFL Gelombang 1 - Lab 01"
 className="w-full bg-white/60 border-none rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-emerald-600 outline-none placeholder:text-slate-400"
 />
 </div>
 <div className="pt-4 flex justify-end gap-3">
 <button type="button" onClick={() => setCreateModalOpen(false)} className="px-6 py-2.5 rounded-full bg-white/60 text-slate-700 font-bold text-sm hover:bg-slate-200 transition-colors cursor-pointer">
 Batal
 </button>
 <button type="submit" disabled={submitting} className="px-6 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold transition-colors cursor-pointer">
 {submitting ? 'Membuat...' : 'Buat Sesi & Token'}
 </button>
 </div>
 </form>
 </Modal>

 {/* Broadcast Email Modal */}
 <Modal isOpen={emailModalOpen} onClose={() => setEmailModalOpen(false)} title="Kirim Token Sesi">
 <form onSubmit={handleSendEmails} className="space-y-4 pt-2 text-slate-800">
 <div>
 <div className="mb-4 bg-white/60 p-4 rounded-xl border border-white/40">
 <span className="text-slate-500 text-xs font-medium uppercase tracking-wider">Sesi Terpilih</span>
 <div className="font-bold text-lg">{activeSession?.nama_sesi}</div>
 </div>
 <label className="block text-sm font-bold text-slate-800 mb-2">Daftar Email Peserta (Koma/Baris baru)</label>
 <textarea
 required
 rows={5}
 value={emailInput}
 onChange={(e) => setEmailInput(e.target.value)}
 placeholder="peserta1@gmail.com, peserta2@gmail.com"
 className="w-full bg-white/60 border-none rounded-xl p-4 text-sm font-medium focus:ring-2 focus:ring-emerald-600 outline-none placeholder:text-slate-400 font-mono"
 />
 </div>
 <div className="pt-4 flex justify-end gap-3">
 <button type="button" onClick={() => setEmailModalOpen(false)} className="px-6 py-2.5 rounded-full bg-white/60 text-slate-700 font-bold text-sm hover:bg-slate-200 transition-colors cursor-pointer">
 Batal
 </button>
 <button type="submit" disabled={submitting} className="px-6 py-2.5 rounded-full bg-slate-800 hover:bg-slate-900 text-white text-sm font-bold transition-colors cursor-pointer">
 {submitting ? 'Mengirim...' : 'Kirim Token'}
 </button>
 </div>
 </form>
 </Modal>

 </div>
 );
};




