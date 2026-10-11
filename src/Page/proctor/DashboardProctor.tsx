import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Users, Key, Activity, ShieldCheck } from 'lucide-react';
import { AreaChart, Area, Tooltip, ResponsiveContainer } from 'recharts';
import { SidebarProctor } from '../../components/common/SidebarProctor';
import { ProctorHeader } from '../../components/proctor/ProctorHeader';
import api from '../../services/api';

export const DashboardProctor: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>({
    totalConnected: 0,
    activeSession: '-',
    currentSection: '-',
    sebIntegrity: '100% Safe',
    averageScore: 0,
    totalAnomalies: 0,
    liveParticipants: []
  });

  const mockChartData = [
    { time: '08:00', score: 400, anomalies: 0 },
    { time: '08:15', score: 450, anomalies: 1 },
    { time: '08:30', score: 480, anomalies: 0 },
    { time: '08:45', score: 510, anomalies: 2 },
    { time: '09:00', score: 490, anomalies: 0 },
    { time: '09:15', score: 530, anomalies: 0 },
    { time: '09:30', score: 550, anomalies: 1 },
  ];

  const proctorInfoStr = localStorage.getItem('proctor_info');
  const proctorInfo = proctorInfoStr ? JSON.parse(proctorInfoStr) : null;
  const proctorName = proctorInfo?.nama_lengkap || 'Pengawas';
  const firstName = proctorName.split(' ')[0];

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/dashboard/stats');
      setStats(res.data);
    } catch (err) {
      console.error('[PROCTOR DASHBOARD ERROR]', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Polling setiap 10 detik agar terasa "live"
    const intervalId = setInterval(fetchData, 10000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="h-screen overflow-hidden bg-[url('/bg-proctor.jpg')] bg-cover bg-center p-4 md:p-6 font-sans text-slate-800 flex gap-6 box-border selection:bg-teal-500/20 relative">
      
      {/* Floating Pill Sidebar */}
      <SidebarProctor activePath="/proctor/dashboard" />

      {/* Main Area */}
      <div className="flex-1 flex flex-col gap-6 max-w-[1400px] mx-auto w-full overflow-hidden relative z-10">
        <ProctorHeader />
        
        <motion.main
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="flex-1 flex flex-col gap-6 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-6 pr-2 md:pr-4"
        >
          
          {/* Top Metric Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Card 1: Total Peserta */}
            <div className="bg-white/50 backdrop-blur-md border border-white/70 rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-between min-h-[140px]">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium text-sm">Total Connected</span>
                <div className="w-10 h-10 rounded-full bg-white/60 flex items-center justify-center text-teal-600 shadow-sm border border-white/50">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-end justify-between mt-4">
                <span className="text-4xl font-semibold tracking-tight">{stats.totalConnected}</span>
                <div className="flex items-end gap-1 mb-1">
                  <div className="w-1.5 h-3 bg-slate-300 rounded-full"></div>
                  <div className="w-1.5 h-6 bg-slate-300 rounded-full"></div>
                  <div className="w-1.5 h-4 bg-slate-300 rounded-full"></div>
                  <div className="w-1.5 h-8 bg-teal-500 rounded-full shadow-[0_0_8px_rgba(20,184,166,0.4)]"></div>
                  <div className="w-1.5 h-5 bg-slate-200 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Card 2: Active Token */}
            <div className="bg-white/50 backdrop-blur-md border border-white/70 rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-between min-h-[140px]">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium text-sm">Active Session</span>
                <div className="w-10 h-10 rounded-full bg-white/60 flex items-center justify-center text-emerald-600 shadow-sm border border-white/50">
                  <Key className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-center justify-between mt-4">
                <span className="text-3xl font-semibold tracking-tight truncate max-w-[150px]">{stats.activeSession}</span>
                <button className="bg-white/60 hover:bg-white px-4 py-1.5 rounded-full text-xs font-bold text-slate-700 transition-colors shadow-sm border border-white">Copy</button>
              </div>
            </div>

            {/* Card 3: Current Section */}
            <div className="bg-white/50 backdrop-blur-md border border-white/70 rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-between min-h-[140px]">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium text-sm">Current Section</span>
                <div className="w-10 h-10 rounded-full bg-white/60 flex items-center justify-center text-indigo-600 shadow-sm border border-white/50">
                  <Activity className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-2xl font-semibold tracking-tight line-clamp-1">{stats.currentSection}</span>
              </div>
            </div>

            {/* Card 4: SEB Integrity */}
            <div className="bg-white/50 backdrop-blur-md border border-white/70 rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-between min-h-[140px]">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium text-sm">SEB Integrity</span>
              </div>
              <div className="mt-4 flex flex-col">
                <span className="text-3xl font-semibold tracking-tight text-emerald-600">{stats.sebIntegrity}</span>
                <div className="w-full h-1.5 bg-slate-200 rounded-full mt-3 overflow-hidden">
                  <div className="h-full bg-emerald-500 w-full rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                </div>
              </div>
            </div>

          </div>

          {/* Secondary Grid (Middle Content) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            
            {/* Main Activity Chart Card */}
            <div className="lg:col-span-2 bg-white/50 backdrop-blur-md border border-white/70 rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col relative overflow-hidden">
              <div className="flex items-center justify-between mb-8 z-10">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-xl text-slate-800">Proctoring Monitor</span>
                  <span className="px-3 py-1 bg-white/60 text-teal-700 text-xs font-semibold rounded-full flex items-center gap-1.5 border border-white/60 shadow-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-teal-500"></div> On track
                  </span>
                </div>
                <div className="text-sm font-bold text-slate-500 cursor-pointer hover:text-slate-800 bg-white/50 px-3 py-1.5 rounded-full border border-white/50">Gelombang 1 ▾</div>
              </div>

              <div className="flex gap-12 z-10">
                <div>
                  <p className="text-slate-500 text-sm font-medium mb-1">Average Score</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold">{stats.averageScore}</span>
                    <span className="text-xs font-bold text-slate-600 bg-white/60 px-2 py-1 rounded-full border border-white/50">All time</span>
                  </div>
                </div>
                <div>
                  <p className="text-slate-500 text-sm font-medium mb-1">Total Anomalies</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold">{stats.totalAnomalies}</span>
                    <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-1 rounded-full border border-teal-100">Safe</span>
                  </div>
                </div>
              </div>

              {/* Functional Area Chart */}
              <div className="absolute bottom-0 left-0 w-full h-32 opacity-70">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockChartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#14B8A6" stopOpacity={0.05}/>
                      </linearGradient>
                    </defs>
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(4px)' }} 
                      labelStyle={{ color: '#64748b', fontWeight: 'bold' }}
                    />
                    <Area type="monotone" dataKey="score" stroke="#0F766E" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Quick Actions / Safety Card */}
            <div className="bg-gradient-to-br from-teal-500 to-emerald-600 rounded-[2rem] p-8 shadow-lg flex flex-col items-center justify-center text-center gap-4 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full blur-xl -ml-8 -mb-8"></div>
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-2 border border-white/30 shadow-inner z-10">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold z-10">Setup training for next week</h3>
              <button className="bg-white text-teal-700 px-6 py-3 rounded-full font-bold text-sm hover:bg-slate-50 transition-colors w-full shadow-md z-10 mt-2">
                Go to training center
              </button>
            </div>
          </div>

          {/* Data Table Section */}
          <div className="bg-white/50 backdrop-blur-md border border-white/70 rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex-1">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-800">Live Participants</h3>
              <span className="text-sm font-bold text-slate-600 bg-white/60 border border-white/50 px-4 py-1.5 rounded-full cursor-pointer hover:bg-white transition-colors shadow-sm">View All</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-slate-500 text-sm font-bold border-b border-slate-200">
                    <th className="pb-4 px-2 uppercase tracking-wider text-xs">NIM</th>
                    <th className="pb-4 px-2 uppercase tracking-wider text-xs">Full Name</th>
                    <th className="pb-4 px-2 uppercase tracking-wider text-xs">Section</th>
                    <th className="pb-4 px-2 uppercase tracking-wider text-xs">Progress</th>
                    <th className="pb-4 px-2 text-right uppercase tracking-wider text-xs">Status</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700 font-medium text-sm">
                  {stats.liveParticipants && stats.liveParticipants.length > 0 ? (
                    stats.liveParticipants.map((p: any, idx: number) => (
                      <tr key={idx} className="border-b border-slate-100 last:border-0 hover:bg-white/40 transition-colors">
                        <td className="py-4 px-2 font-mono text-slate-500">{p.nim}</td>
                        <td className="py-4 px-2 font-bold text-slate-800">{p.nama}</td>
                        <td className="py-4 px-2 text-slate-500">{p.section}</td>
                        <td className="py-4 px-2">
                          <div className="flex items-center gap-3">
                            <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden shadow-inner">
                              <div 
                                className="h-full bg-teal-500 rounded-full"
                                style={{ width: `${(parseInt(p.progress.split('/')[0]) / parseInt(p.progress.split('/')[1])) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-xs font-bold text-slate-500">{p.progress}</span>
                          </div>
                        </td>
                        <td className="py-4 px-2 text-right">
                          <span className="inline-block px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-xs font-bold border border-teal-200 shadow-sm">
                            {p.seb}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400 font-medium bg-white/20 rounded-xl mt-4 block w-full">
                        No live participants currently connected.
                      </td>
                    </tr>
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
