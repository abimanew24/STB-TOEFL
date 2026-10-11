import React from 'react';
import { ArrowRight, CheckCircle2, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SectionBreakModalProps {
  isOpen: boolean;
  completedSection: number;
  nextSectionName: string;
  onProceed: () => void;
}

export const SectionBreakModal: React.FC<SectionBreakModalProps> = ({
  isOpen,
  completedSection,
  nextSectionName,
  onProceed,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-6"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                Transisi Antar Section
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-2">
                Section {completedSection} Selesai!
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Jawaban Anda pada Section {completedSection} telah terkunci dan tersimpan dengan aman.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <Lock className="w-4 h-4 text-amber-600" />
                <span>Petunjuk Section Berikutnya:</span>
              </div>
              <p className="text-xs text-slate-600">
                Anda akan melanjutkan ke <strong className="text-emerald-700">{nextSectionName}</strong>. Setelah berpindah, Anda tidak dapat kembali ke section sebelumnya.
              </p>
            </div>

            <button
              onClick={onProceed}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3.5 px-4 rounded-xl shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Mulai {nextSectionName}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
