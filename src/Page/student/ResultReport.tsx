import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, Download, LogOut, ShieldCheck } from 'lucide-react';
import { StudentHeader } from '../../components/student/StudentHeader';
import api from '../../services/api';

export const ResultReport: React.FC = () => {
  const navigate = useNavigate();
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const cachedRes = localStorage.getItem('student_result');
        if (cachedRes) {
          setResult(JSON.parse(cachedRes));
          setLoading(false);
          return;
        }

        const response = await api.get('/scores/student');
        setResult(response.data);
      } catch (err) {
        console.error('[FETCH RESULT ERROR]', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('student_token');
    localStorage.removeItem('student_info');
    localStorage.removeItem('student_result');
    navigate('/student/login');
  };

  const getCefrBadgeColor = (level: string) => {
    if (level === 'C1') return 'bg-purple-50 text-purple-700 border-purple-200';
    if (level === 'B2') return 'bg-blue-50 text-blue-700 border-blue-200';
    if (level === 'B1') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    return 'bg-amber-50 text-amber-700 border-amber-200';
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <StudentHeader
        subtitle="Exam Completion"
        // Note: No onLogout passed here, so the top-right button is hidden
      />

      <main className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col justify-center">
        {loading ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-sm text-slate-500">Memproses kelulusan ujian Anda...</p>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-3xl p-10 sm:p-14 shadow-xl shadow-slate-200/50 flex flex-col items-center text-center">
            
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-emerald-50 text-emerald-600 border border-emerald-100 mb-8 shadow-sm">
              <ShieldCheck className="w-12 h-12" />
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
              Exam Completed
            </h2>
            
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-lg mb-10">
              Thank you for completing the test. Your responses have been safely recorded in the server. Please leave the room quietly. Have a good day!
            </p>

            <div className="w-full max-w-sm border-t border-slate-100 pt-8 flex justify-center">
              <button
                onClick={handleLogout}
                className="w-full inline-flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-lg shadow-blue-600/20 transition-all cursor-pointer"
              >
                <LogOut className="w-5 h-5" />
                <span>Exit from Exam Room</span>
              </button>
            </div>
            
          </div>
        )}
      </main>
    </div>
  );
};
