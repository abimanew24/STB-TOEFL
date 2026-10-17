import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from './api';

export type ExamTheme = 'light' | 'warm' | 'dark';

interface ThemeContextType {
  theme: ExamTheme;
  setTheme: (newTheme: ExamTheme) => Promise<void>;
  setThemeSilent: (newTheme: ExamTheme) => void;
  isDark: boolean;
  isWarm: boolean;
  isLight: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  setTheme: async () => {},
  setThemeSilent: () => {},
  isDark: false,
  isWarm: false,
  isLight: true,
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ExamTheme>(() => {
    const saved = localStorage.getItem('stbtoefl_theme');
    if (saved === 'warm' || saved === 'dark' || saved === 'light') {
      return saved;
    }
    return 'light';
  });

  const applyThemeToDom = useCallback((targetTheme: ExamTheme) => {
    const root = document.documentElement;
    root.setAttribute('data-theme', targetTheme);
    
    if (targetTheme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('theme-warm');
    } else if (targetTheme === 'warm') {
      root.classList.add('theme-warm');
      root.classList.remove('dark');
    } else {
      root.classList.remove('dark');
      root.classList.remove('theme-warm');
    }
  }, []);

  // Sync DOM on mount and when theme changes
  useEffect(() => {
    applyThemeToDom(theme);
  }, [theme, applyThemeToDom]);

  // Synchronize from server public configuration
  useEffect(() => {
    api.get('/system/public-config')
      .then(res => {
        if (res.data?.examTheme && ['light', 'warm', 'dark'].includes(res.data.examTheme)) {
          const serverTheme = res.data.examTheme as ExamTheme;
          const localSaved = localStorage.getItem('stbtoefl_theme');
          if (!localSaved) {
            setThemeState(serverTheme);
            localStorage.setItem('stbtoefl_theme', serverTheme);
          }
        }
      })
      .catch(() => {});
  }, []);

  const setThemeSilent = useCallback((newTheme: ExamTheme) => {
    setThemeState(newTheme);
    localStorage.setItem('stbtoefl_theme', newTheme);
    applyThemeToDom(newTheme);
  }, [applyThemeToDom]);

  const setTheme = useCallback(async (newTheme: ExamTheme) => {
    setThemeSilent(newTheme);
    try {
      await api.post('/system/settings', { examTheme: newTheme });
    } catch (err) {
      console.warn('[THEME SYNC ERROR]', err);
    }
  }, [setThemeSilent]);

  const value = {
    theme,
    setTheme,
    setThemeSilent,
    isDark: theme === 'dark',
    isWarm: theme === 'warm',
    isLight: theme === 'light',
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
