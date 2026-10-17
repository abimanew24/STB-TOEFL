import React, { useState, useEffect, useRef, useMemo } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { SidebarProctor } from '../../components/common/SidebarProctor';
import { ProctorHeader } from '../../components/proctor/ProctorHeader';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Users, Upload, Trash2, X, AlertCircle, Download, Edit2, Layers, FileSpreadsheet, CheckCircle2, Loader2, ChevronDown } from 'lucide-react';
import { CustomDropdown } from '../../components/common/CustomDropdown';

export const ParticipantManager = () => {
  const [participants, setParticipants] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [selectedSessionFilter, setSelectedSessionFilter] = useState<string>('1');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Import modal states
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importSesiId, setImportSesiId] = useState<string>('');
  const [isImporting, setIsImporting] = useState<boolean>(false);
  const [importError, setImportError] = useState<string>('');
  const modalFileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    nomor_induk: '',
    nama_lengkap: '',
    email: '',
    kata_sandi: '123456',
    sesi_id: ''
  });

  const fetchSessions = async () => {
    try {
      const token = localStorage.getItem('proctor_token');
      const res = await axios.get('http://localhost:5001/api/sessions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSessions(res.data);
      return res.data;
    } catch (err) {
      console.error('[FETCH SESSIONS ERROR]', err);
      return [];
    }
  };

  const fetchParticipants = async (sesiId: string = selectedSessionFilter) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('proctor_token');
      const url = sesiId && sesiId !== 'all' 
        ? `http://localhost:5001/api/users?sesi_id=${sesiId}`
        : 'http://localhost:5001/api/users';
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setParticipants(res.data);
    } catch (err) {
      console.error('[FETCH PARTICIPANTS ERROR]', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      const sessionList = await fetchSessions();
      const activeSesi = sessionList.find((s: any) => s.status_aktif);
      const defaultSesi = activeSesi ? String(activeSesi.id) : (sessionList[0]?.id ? String(sessionList[0].id) : '1');
      setSelectedSessionFilter(defaultSesi);
      fetchParticipants(defaultSesi);
    };
    init();
  }, []);

  const handleSessionFilterChange = (val: string) => {
    setSelectedSessionFilter(val);
    fetchParticipants(val);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Yakin ingin menghapus peserta ini?')) return;
    try {
      const token = localStorage.getItem('proctor_token');
      await axios.delete(`http://localhost:5001/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchSessions();
      fetchParticipants(selectedSessionFilter);
    } catch (err) {
      console.error(err);
      alert('Gagal menghapus peserta');
    }
  };

  const handleDeleteSession = async (sessionId: number) => {
    const target = sessions.find(s => s.id === sessionId);
    if (!window.confirm(`Yakin ingin menghapus sesi '${target?.nama_sesi || ''}'? Sesi yang dihapus tidak dapat dipulihkan.`)) return;
    try {
      const token = localStorage.getItem('proctor_token');
      const res = await axios.delete(`http://localhost:5001/api/sessions/${sessionId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(res.data?.message || `Sesi '${target?.nama_sesi || ''}' berhasil dihapus.`);
      setSelectedSessionFilter('all');
      await fetchSessions();
      fetchParticipants('all');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal menghapus sesi');
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const token = localStorage.getItem('proctor_token');
      await axios.post('http://localhost:5001/api/users', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowAddModal(false);
      setFormData({ nomor_induk: '', nama_lengkap: '', email: '', kata_sandi: '123456', sesi_id: '' });
      await fetchSessions();
      fetchParticipants(selectedSessionFilter);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Gagal menambahkan peserta. Mungkin NIM/Email sudah terdaftar.');
    }
  };

  const openEditModal = (p: any) => {
    setFormData({
      nomor_induk: p.nomor_induk,
      nama_lengkap: p.nama_lengkap,
      email: p.email,
      kata_sandi: '123456',
      sesi_id: p.sesi_id ? String(p.sesi_id) : '1'
    });
    setEditingId(p.id);
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const token = localStorage.getItem('proctor_token');
      await axios.put(`http://localhost:5001/api/users/${editingId}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowEditModal(false);

      const targetSesi = sessions.find(s => String(s.id) === String(formData.sesi_id));
      const targetSesiName = targetSesi?.nama_sesi || 'Sesi 1';

      // Optimistic update to immediately reflect in UI
      setParticipants(prev => prev.map(p => {
        if (p.id === editingId) {
          return {
            ...p,
            nomor_induk: formData.nomor_induk,
            nama_lengkap: formData.nama_lengkap,
            email: formData.email,
            sesi_id: formData.sesi_id ? parseInt(formData.sesi_id, 10) : 1,
            nama_sesi: targetSesiName
          };
        }
        return p;
      }));

      setFormData({ nomor_induk: '', nama_lengkap: '', email: '', kata_sandi: '123456', sesi_id: '' });
      setEditingId(null);
      await fetchSessions();
      fetchParticipants(selectedSessionFilter);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Gagal memperbarui data peserta.');
    }
  };

  const handleDownloadTemplate = () => {
    const instructions = [
      { "Aturan": "Kolom NIM", "Penjelasan": "Wajib diisi. Berupa nomor induk mahasiswa. Tidak boleh duplikat." },
      { "Aturan": "Kolom Nama Lengkap", "Penjelasan": "Wajib diisi. Berupa nama lengkap peserta ujian." },
      { "Aturan": "Kolom Email", "Penjelasan": "Wajib diisi. Format email yang valid (contoh: budi@student.ac.id)." },
      { "Aturan": "Gelombang / Sesi", "Penjelasan": "Pilih gelombang tujuan langsung pada modal dialog import Excel." },
      { "Aturan": "Kata Sandi Default", "Penjelasan": "Sistem otomatis mengatur kata sandi default menjadi '123456'." }
    ];

    const templateData = [
      { "NIM": "220101001", "Nama Lengkap": "Ahmad Fauzi Rahman", "Email": "ahmad.fauzi@student.ac.id" },
      { "NIM": "220101002", "Nama Lengkap": "Siti Nurhaliza Putri", "Email": "siti.nurhaliza@student.ac.id" }
    ];

    const wsInstructions = XLSX.utils.json_to_sheet(instructions);
    const wsTemplate = XLSX.utils.json_to_sheet(templateData);

    wsInstructions['!cols'] = [{ wch: 25 }, { wch: 80 }];
    wsTemplate['!cols'] = [{ wch: 15 }, { wch: 30 }, { wch: 30 }];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, wsTemplate, "Template Data");
    XLSX.utils.book_append_sheet(wb, wsInstructions, "Aturan Pengisian");

    XLSX.writeFile(wb, "Template_Import_Peserta_TOEFL.xlsx");
  };

  const openImportModal = () => {
    const activeSesi = sessions.find(s => s.status_aktif)?.id || (sessions[0]?.id || '');
    const defaultSesi = selectedSessionFilter !== 'all' ? selectedSessionFilter : (activeSesi ? String(activeSesi) : '');
    setImportSesiId(defaultSesi);
    setImportFile(null);
    setImportError('');
    setShowImportModal(true);
  };

  const handleExecuteImport = async () => {
    if (!importFile) {
      setImportError('Silakan pilih berkas Excel (.xlsx / .xls) terlebih dahulu.');
      return;
    }
    setImportError('');
    setIsImporting(true);

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);

        const formattedUsers = data.map((row: any) => ({
          nim: String(row.NIM || row.nim || row.nomor_induk || '').trim(),
          name: String(row.Nama || row.nama || row.nama_lengkap || row['Nama Lengkap'] || '').trim(),
          email: String(row.Email || row.email || '').trim()
        })).filter(u => u.nim && u.name);

        if (formattedUsers.length === 0) {
          setImportError('Format Excel tidak valid atau data kosong. Pastikan kolom NIM dan Nama terisi.');
          setIsImporting(false);
          return;
        }

        const token = localStorage.getItem('proctor_token');
        const res = await axios.post('http://localhost:5001/api/users/import', { 
          users: formattedUsers,
          sesi_id: importSesiId || null
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });

        alert(res.data?.message || `Berhasil mengimport ${formattedUsers.length} peserta.`);
        setShowImportModal(false);
        setImportFile(null);
        await fetchSessions();
        fetchParticipants(selectedSessionFilter);
      } catch (err: any) {
        console.error(err);
        setImportError(err.response?.data?.message || 'Gagal memproses berkas Excel.');
      } finally {
        setIsImporting(false);
      }
    };
    reader.onerror = () => {
      setImportError('Gagal membaca berkas Excel.');
      setIsImporting(false);
    };
    reader.readAsBinaryString(importFile);
  };

  const filteredParticipants = useMemo(() => {
    return participants.filter(p => {
      // Filter sesi jika bukan 'all'
      if (selectedSessionFilter !== 'all') {
        const pSesi = p.sesi_id ? String(p.sesi_id) : '1';
        if (pSesi !== String(selectedSessionFilter)) {
          return false;
        }
      }

      // Filter pencarian
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        p.nomor_induk?.toLowerCase().includes(q) || 
        p.nama_lengkap?.toLowerCase().includes(q) ||
        (p.email && p.email.toLowerCase().includes(q))
      );
    });
  }, [participants, selectedSessionFilter, searchQuery]);

  const totalAllParticipants = useMemo(() => {
    return sessions.reduce((acc, s) => acc + (s.total_peserta || 0), 0);
  }, [sessions]);

  return (
    <div className="h-screen overflow-hidden bg-[url('/bg-proctor.jpg')] bg-cover bg-center p-4 md:p-6 font-sans text-slate-800 flex gap-6 box-border selection:bg-teal-500/20 relative">
      <SidebarProctor activePath="/proctor/peserta" />

      <div className="flex-1 flex flex-col gap-6 max-w-[1400px] mx-auto w-full overflow-hidden relative z-10">
        <ProctorHeader />

        {/* Header */}
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-2 text-slate-800">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-800">Data Peserta Ujian</h1>
            <p className="text-slate-500 font-medium text-xs md:text-sm mt-0.5">Kelola akun dan kredensial peserta ujian per gelombang, unduh template, dan import data mahasiswa.</p>
          </div>

          <div className="flex items-center gap-2 sm:gap-2.5 flex-nowrap shrink-0 overflow-x-auto">
            <button 
              onClick={handleDownloadTemplate}
              className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2.5 rounded-2xl border border-white/60 hover:bg-white/80 bg-white/50 text-slate-700 font-semibold text-xs md:text-sm transition-all shadow-sm cursor-pointer whitespace-nowrap backdrop-blur-sm"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span>Download Template</span>
            </button>
            <button 
              onClick={openImportModal}
              className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2.5 rounded-2xl border border-white/60 hover:bg-white/80 bg-white/50 text-slate-700 font-semibold text-xs md:text-sm transition-all shadow-sm cursor-pointer whitespace-nowrap backdrop-blur-sm"
            >
              <Upload className="w-4 h-4 text-slate-500" />
              <span>Import Excel</span>
            </button>
            <button 
              onClick={() => {
                setFormData({
                  nomor_induk: "",
                  nama_lengkap: "",
                  email: "",
                  kata_sandi: "123456",
                  sesi_id: selectedSessionFilter !== "all" ? selectedSessionFilter : (sessions[0]?.id ? String(sessions[0].id) : "1")
                });
                setShowAddModal(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2.5 rounded-2xl border border-white/60 hover:bg-white/80 bg-white/50 text-slate-700 font-semibold text-xs md:text-sm transition-all shadow-sm cursor-pointer whitespace-nowrap backdrop-blur-sm"
            >
              <Plus className="w-4 h-4 text-slate-500" />
              <span>Tambah Manual</span>
            </button>
          </div>
        </header>

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 flex flex-col bg-white/50 backdrop-blur-md rounded-[2rem] border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden"
        >
          {/* Header Controls */}
          <div className="p-5 md:p-6 border-b border-white/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Search Input & Sesi Dropdown */}
            <div className="flex items-center gap-3 flex-1 max-w-3xl flex-wrap sm:flex-nowrap">
              <div className="relative flex-1 min-w-[220px]">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  placeholder="Cari NIM, Nama, atau Email Peserta..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-white/70 border border-white/60 rounded-full text-sm font-medium focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all placeholder:text-slate-400"
                />
              </div>

              {/* Sesi Dropdown & Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <CustomDropdown
                  value={selectedSessionFilter}
                  onChange={(val) => handleSessionFilterChange(val)}
                  options={[
                    { value: 'all', label: 'Semua Sesi', badge: `${totalAllParticipants} mhs` },
                    ...sessions.map((s) => ({
                      value: String(s.id),
                      label: s.nama_sesi,
                      badge: `${s.total_peserta || 0} mhs`,
                      isLive: Boolean(s.status_aktif)
                    }))
                  ]}
                  placeholder="Pilih Sesi..."
                />

                {/* Tombol Hapus Sesi (Aktif jika sesi spesifik dipilih) */}
                {selectedSessionFilter !== 'all' && (
                  <button
                    type="button"
                    onClick={() => handleDeleteSession(parseInt(selectedSessionFilter, 10))}
                    className="p-2.5 rounded-full bg-white/70 hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-white/70 hover:border-rose-200 transition-all shadow-sm cursor-pointer"
                    title={`Hapus ${sessions.find(s => String(s.id) === selectedSessionFilter)?.nama_sesi || 'Sesi ini'}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="text-xs font-semibold text-slate-600 bg-white/60 px-4 py-2 rounded-full border border-white/50 shadow-sm flex items-center justify-center self-start md:self-auto shrink-0">
              <span>
                {selectedSessionFilter === 'all'
                  ? `Total: ${filteredParticipants.length} Peserta`
                  : `${sessions.find(s => String(s.id) === selectedSessionFilter)?.nama_sesi || 'Sesi'}: ${filteredParticipants.length} Peserta`
                }
              </span>
            </div>
          </div>

          {/* Table Area */}
          <div className="flex-1 overflow-auto custom-scrollbar pb-6 md:pb-8">
            {loading ? (
              <div className="text-center py-16 text-slate-400 font-medium">Memuat data peserta...</div>
            ) : filteredParticipants.length === 0 ? (
              <div className="text-center py-16 text-slate-400 font-medium">
                {searchQuery || selectedSessionFilter !== 'all' 
                  ? 'Tidak ada peserta yang cocok dengan filter yang dipilih.' 
                  : 'Belum ada data peserta.'}
              </div>
            ) : (
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-white/95 shadow-sm sticky top-0 backdrop-blur-md z-10">
                  <tr>
                    <th className="px-6 py-4 font-black tracking-wider">NIM</th>
                    <th className="px-6 py-4 font-black tracking-wider">Nama Peserta</th>
                    <th className="px-6 py-4 font-black tracking-wider">Email</th>
                    <th className="px-6 py-4 font-black tracking-wider">Gelombang / Sesi</th>
                    <th className="px-6 py-4 font-black tracking-wider text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/40">
                  {filteredParticipants.map((p) => (
                    <tr key={p.id} className="hover:bg-white/40 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-800">{p.nomor_induk}</td>
                      <td className="px-6 py-4 font-semibold text-slate-700">{p.nama_lengkap}</td>
                      <td className="px-6 py-4 text-slate-500">{p.email}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/70 border border-white/80 text-slate-700 shadow-sm">
                          <Layers className="w-3 h-3 text-teal-600" />
                          <span>{p.nama_sesi || 'Belum Terjadwal'}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button 
                            onClick={() => openEditModal(p)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="Edit Data Peserta"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(p.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Hapus Peserta"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </motion.div>
      </div>

      {/* Modal Tambah Manual */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setShowAddModal(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden"
            >
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h3 className="font-bold text-slate-800 text-lg">Tambah Peserta Ujian</h3>
                <button onClick={() => setShowAddModal(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleAddSubmit} className="p-6 flex flex-col gap-4">
                {errorMsg && (
                  <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-sm flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <p>{errorMsg}</p>
                  </div>
                )}
                
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">NIM / Nomor Induk</label>
                  <input
                    type="text"
                    required
                    value={formData.nomor_induk}
                    onChange={(e) => setFormData({...formData, nomor_induk: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
                    placeholder="Contoh: 220101001"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Nama Lengkap</label>
                  <input
                    type="text"
                    required
                    value={formData.nama_lengkap}
                    onChange={(e) => setFormData({...formData, nama_lengkap: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
                    placeholder="Contoh: Budi Santoso"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email Aktif</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
                    placeholder="budi@student.ac.id"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Gelombang / Sesi Ujian</label>
                  <select
                    value={formData.sesi_id}
                    onChange={(e) => setFormData({...formData, sesi_id: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors cursor-pointer"
                  >
                    <option value="">-- Pilih Gelombang Ujian --</option>
                    {sessions.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.nama_sesi} (Token: {s.token}){s.status_aktif ? ' - Aktif' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pt-2">
                  <button type="submit" className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold shadow-lg shadow-emerald-600/20 transition-all cursor-pointer">
                    Simpan Peserta
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Modal Edit */}
        {showEditModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => {
                setShowEditModal(false);
                setFormData({ nomor_induk: '', nama_lengkap: '', email: '', kata_sandi: '123456', sesi_id: '' });
                setEditingId(null);
              }}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden"
            >
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h3 className="font-bold text-slate-800 text-lg">Edit Peserta Ujian</h3>
                <button 
                  onClick={() => {
                    setShowEditModal(false);
                    setFormData({ nomor_induk: '', nama_lengkap: '', email: '', kata_sandi: '123456', sesi_id: '' });
                    setEditingId(null);
                  }} 
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleEditSubmit} className="p-6 flex flex-col gap-4">
                {errorMsg && (
                  <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-sm flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <p>{errorMsg}</p>
                  </div>
                )}
                
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">NIM / Nomor Induk</label>
                  <input
                    type="text"
                    required
                    value={formData.nomor_induk}
                    onChange={(e) => setFormData({...formData, nomor_induk: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Nama Lengkap</label>
                  <input
                    type="text"
                    required
                    value={formData.nama_lengkap}
                    onChange={(e) => setFormData({...formData, nama_lengkap: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email Aktif</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Gelombang / Sesi Ujian</label>
                  <select
                    value={formData.sesi_id}
                    onChange={(e) => setFormData({...formData, sesi_id: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-colors cursor-pointer"
                  >
                    <option value="">-- Pilih Gelombang Ujian --</option>
                    {sessions.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.nama_sesi} (Token: {s.token}){s.status_aktif ? ' - Aktif' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pt-2">
                  <button type="submit" className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-lg shadow-blue-600/20 transition-all cursor-pointer">
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Modal Import Excel */}
        {showImportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => {
                if (!isImporting) {
                  setShowImportModal(false);
                  setImportFile(null);
                  setImportError('');
                }
              }}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden"
            >
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg">Import Peserta dari Excel</h3>
                    <p className="text-xs text-slate-500">Unggah berkas data peserta ujian sekaligus</p>
                  </div>
                </div>
                <button 
                  disabled={isImporting}
                  onClick={() => {
                    setShowImportModal(false);
                    setImportFile(null);
                    setImportError('');
                  }} 
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer disabled:opacity-50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 flex flex-col gap-5">
                {importError && (
                  <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-sm flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <p>{importError}</p>
                  </div>
                )}

                {/* Gelombang Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1 flex items-center justify-between">
                    <span>1. Pilih Gelombang / Sesi Tujuan</span>
                    <span className="text-[11px] text-emerald-600 font-semibold normal-case">Wajib dipilih</span>
                  </label>
                  <select
                    value={importSesiId}
                    onChange={(e) => setImportSesiId(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-700 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors cursor-pointer"
                  >
                    <option value="">-- Tetapkan Gelombang Nanti / Tanpa Gelombang --</option>
                    {sessions.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.nama_sesi} (Token: {s.token}){s.status_aktif ? ' - Aktif' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                {/* File Upload Box */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between ml-1">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                      2. Unggah Berkas Excel (.xlsx / .xls)
                    </label>
                    <button
                      type="button"
                      onClick={handleDownloadTemplate}
                      className="text-xs text-teal-600 hover:text-teal-700 font-bold inline-flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Unduh Template</span>
                    </button>
                  </div>

                  <input 
                    type="file" 
                    accept=".xlsx, .xls" 
                    className="hidden" 
                    ref={modalFileInputRef}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setImportFile(file);
                        setImportError('');
                      }
                    }}
                  />

                  {!importFile ? (
                    <div 
                      onClick={() => modalFileInputRef.current?.click()}
                      className="border-2 border-dashed border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/20 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all text-center"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:text-emerald-600 transition-colors">
                        <Upload className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-700">Klik untuk memilih file Excel</p>
                        <p className="text-xs text-slate-400 mt-0.5">Format kolom: NIM, Nama, Email</p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl shrink-0">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-sm font-bold text-slate-800 truncate">{importFile.name}</p>
                          <p className="text-xs text-slate-500 font-medium">{(importFile.size / 1024).toFixed(1)} KB</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setImportFile(null);
                          if (modalFileInputRef.current) modalFileInputRef.current.value = '';
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer shrink-0"
                        title="Hapus file"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="button"
                    disabled={isImporting}
                    onClick={() => {
                      setShowImportModal(false);
                      setImportFile(null);
                      setImportError('');
                    }}
                    className="flex-1 py-3 px-4 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-2xl font-bold text-sm transition-all cursor-pointer disabled:opacity-50"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    disabled={isImporting || !importFile}
                    onClick={handleExecuteImport}
                    className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-sm shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isImporting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Memproses Import...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        <span>Mulai Import</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
