import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';

export interface DropdownOption {
  value: string | number;
  label: string;
  badge?: string | number;
  isLive?: boolean;
}

interface CustomDropdownProps {
  options: DropdownOption[];
  value: string | number;
  onChange: (value: any) => void;
  placeholder?: string;
  className?: string;
}

export const CustomDropdown: React.FC<CustomDropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Pilih Sesi...',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => String(opt.value) === String(value));

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      {/* Trigger Button - Soft Translucent Glass */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-between gap-3 px-4 py-2 rounded-full bg-white/40 hover:bg-white/60 backdrop-blur-md border border-white/50 hover:border-white/80 text-slate-700 font-semibold text-xs md:text-sm shadow-sm transition-all cursor-pointer min-w-[190px]"
      >
        <div className="flex items-center gap-2 truncate">
          <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
          {selectedOption?.badge !== undefined && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/5 text-slate-500 font-bold shrink-0">
              {selectedOption.badge}
            </span>
          )}
          {selectedOption?.isLive && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/5 text-slate-600 font-medium shrink-0">
              Aktif
            </span>
          )}
        </div>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-slate-600' : ''
          }`}
        />
      </button>

      {/* Popover Menu - Soft Minimalist Glass */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.12, ease: 'easeOut' }}
            className="absolute left-0 mt-2 min-w-full w-max max-w-[320px] rounded-2xl bg-white/80 backdrop-blur-2xl border border-white/60 shadow-[0_10px_30px_rgba(0,0,0,0.06)] p-1.5 z-50 overflow-hidden"
          >
            <div className="max-h-60 overflow-y-auto no-scrollbar flex flex-col gap-0.5">
              {options.map((option) => {
                const isSelected = String(option.value) === String(value);
                return (
                  <button
                    key={String(option.value)}
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs md:text-sm transition-all text-left cursor-pointer ${
                      isSelected
                        ? 'bg-white text-slate-800 font-bold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/60 font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="truncate">{option.label}</span>
                      {option.badge !== undefined && (
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold shrink-0 ${
                            isSelected
                              ? 'bg-slate-100 text-slate-700'
                              : 'bg-black/5 text-slate-500'
                          }`}
                        >
                          {option.badge}
                        </span>
                      )}
                      {option.isLive && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium shrink-0">
                          Aktif
                        </span>
                      )}
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-slate-700 shrink-0 ml-2" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
