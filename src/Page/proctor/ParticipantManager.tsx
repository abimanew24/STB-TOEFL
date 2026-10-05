import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { SidebarProctor } from '../../components/common/SidebarProctor';
import { ProctorHeader } from '../../components/proctor/ProctorHeader';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Upload, Trash2, X, AlertCircle, Download, Edit2 } from 'lucide-react';

export const ParticipantManager = () => {
  const [participants, setParticipants] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    nomor_induk: '',
    nama_lengkap: '',
    email: '',
    kata_sandi: '123456'
  });

  const fetchParticipants = async () => {
    try {
      const token = localStorage.getItem('proctor_token');
      const res = await axios.get('http://localhost:5001/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setParticipants(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParticipants();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Yakin ingin menghapus peserta ini?')) return;
    try {
      const token = localStorage.getItem('proctor_token');
      await axios.delete(`http://localhost:5001/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchParticipants();
    } catch (err) {
      console.error(err);
      alert('Gagal menghapus peserta');
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
      setFormData({ nomor_induk: '', nama_lengkap: '', email: '', kata_sandi: '123456' });
      fetchParticipants();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Gagal menambahkan peserta. Mungkin NIM/Email sudah terdaftar.');
    }
  };

  const openEditModal = (p: any) => {
    setFormData({
      nomor_induk: p.nomor_induk,
      nama_lengkap: p.nama_lengkap,
      email: p.email,
      kata_sandi: '123456'
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
      setFormData({ nomor_induk: '', nama_lengkap: '', email: '', kata_sandi: '123456' });
      setEditingId(null);
      fetchParticipants();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Gagal memperbarui data peserta.');
    }
  };

  const handleDownloadTemplate = () => {
    const instructions = [
      { "Aturan": "Kolom NIM", "Penjelasan": "Wajib diisi. Berupa angka/karakter nomor induk mahasiswa. Tidak boleh duplikat." },
      { "Aturan": "Kolom Nama Lengkap", "Penjelasan": "Wajib diisi. Berupa nama lengkap peserta ujian." },
      { "Aturan": "Kolom Email", "Penjelasan": "Wajib diisi. Pastikan menggunakan format email yang valid (contoh: budi@student.ac.id)." },
      { "Aturan": "Kata Sandi (Default)", "Penjelasan": "Sistem otomatis mengatur kata sandi default menjadi '123456' untuk semua peserta yang diimport." },
      { "Aturan": "Cara Pengisian", "Penjelasan": "Isi data pada sheet 'Template Data' (Sheet 1) mulai dari baris ke-2 ke bawah. Jangan ubah nama kolom di baris ke-1." }
    ];

    const templateData = [
      { "NIM": "20230001", "Nama Lengkap": "Budi Santoso", "Email": "budi@student.ac.id" }
    ];

    const wsInstructions = XLSX.utils.json_to_sheet(instructions);
    const wsTemplate = XLSX.utils.json_to_sheet(templateData);

    wsInstructions['!cols'] = [{ wch: 25 }, { wch: 80 }];
    wsTemplate['!cols'] = [{ wch: 15 }, { wch: 30 }, { wch: 30 }];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, wsTemplate, "Template Data");
    XLSX.utils.book_append_sheet(wb, wsInstructions, "Aturan Pengisian");

    XLSX.writeFile(wb, "Template_Import_Peserta_Ujian.xlsx");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        
        // Map Excel columns to our expected format
        const formattedUsers = data.map((row: any) => ({
          nim: String(row.NIM || row.nim || row.nomor_induk || ''),
          name: row.Nama || row.nama || row.nama_lengkap || row['Nama Lengkap'] || '',
          email: row.Email || row.email || ''
        })).filter(u => u.nim && u.name); // only keep rows with nim and name

        if (formattedUsers.length === 0) {
          alert('Format Excel tidak valid. Pastikan ada kolom NIM, Nama, dan Email.');
          return;
        }

        const token = localStorage.getItem('proctor_token');
        await axios.post('http://localhost:5001/api/users/import', { users: formattedUsers }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        alert(`Berhasil mengimport data peserta.`);
        fetchParticipants();
      } catch (err) {
        console.error(err);
        alert('Gagal mengimport Excel.');
      }
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsBinaryString(file);
  };

  const filteredParticipants = participants.filter(p => 
    p.nomor_induk.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.nama_lengkap.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-screen overflow-hidden bg-[url('/bg-proctor.jpg')] bg-cover bg-center p-4 md:p-6 font-sans text-slate-800 flex gap-6 box-border selection:bg-teal-500/20 relative">
      <SidebarProctor activePath="/proctor/peserta" />

      <div className="flex-1 flex flex-col gap-6 max-w-[1400px] mx-auto w-full overflow-hidden relative z-10">
        <ProctorHeader />

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 flex flex-col bg-white/50 backdrop-blur-md rounded-[2rem] border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden"
        >
          {/* Header Controls */}
          <div className="p-6 md:p-8 border-b border-white/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:max-w-xs">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Cari NIM atau Nama..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-white/60 border border-white/50 rounded-full text-sm font-medium focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
              />
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <input 
                type="file" 
                accept=".xlsx, .xls" 
                className="hidden" 
                ref={fileInputRef}
                onChange={handleFileUpload}
              />
              <button 
                onClick={handleDownloadTemplate}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-sm transition-all shadow-sm border border-indigo-100 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Download Template
              </button>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-white/60 hover:bg-white text-slate-700 font-bold text-sm transition-all shadow-sm border border-white/50 cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                Import Excel
              </button>
              <button 
                onClick={() => setShowAddModal(true)}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-all shadow-[0_8px_30px_rgb(0,0,0,0.04)] shadow-emerald-600/20 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Tambah Manual
              </button>
            </div>
          </div>

          {/* Table Area */}
          <div className="flex-1 overflow-auto custom-scrollbar pb-6 md:pb-8">
            {loading ? (
              <div className="text-center py-10 text-slate-500">Memuat data...</div>
            ) : filteredParticipants.length === 0 ? (
              <div className="text-center py-10 text-slate-500">Belum ada data peserta.</div>
            ) : (
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-white/95 shadow-sm sticky top-0 backdrop-blur-md z-10">
                  <tr>
                    <th className="px-6 py-4 font-black tracking-wider">NIM</th>
                    <th className="px-6 py-4 font-black tracking-wider">Nama Peserta</th>
                    <th className="px-6 py-4 font-black tracking-wider">Email</th>
                    <th className="px-6 py-4 font-black tracking-wider text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/40">
                  {filteredParticipants.map((p) => (
                    <tr key={p.id} className="hover:bg-white/40 transition-colors group">
                      <td className="px-6 py-4 font-bold text-slate-700">{p.nomor_induk}</td>
                      <td className="px-6 py-4 font-semibold text-slate-800">{p.nama_lengkap}</td>
                      <td className="px-6 py-4 text-slate-500 font-medium">{p.email}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 transition-opacity">
                          <button 
                            onClick={() => openEditModal(p)}
                            className="p-2 text-slate-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                            title="Edit Peserta"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(p.id)}
                            className="p-2 text-slate-700 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
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

      {/* Add Modal */}
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
                    placeholder="Contoh: 20230001"
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

                <div className="pt-2">
                  <button type="submit" className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold shadow-lg shadow-emerald-600/20 transition-all cursor-pointer">
                    Simpan Peserta
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {showEditModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => {
                setShowEditModal(false);
                setFormData({ nomor_induk: '', nama_lengkap: '', email: '', kata_sandi: '123456' });
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
                    setFormData({ nomor_induk: '', nama_lengkap: '', email: '', kata_sandi: '123456' });
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

                <div className="pt-2">
                  <button type="submit" className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-lg shadow-blue-600/20 transition-all cursor-pointer">
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
