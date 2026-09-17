'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UIMode } from '@/types/gamification';

interface ModeContextType {
  mode: UIMode;
  toggleMode: () => void;
  setMode: (mode: UIMode) => void;
}

const ModeContext = createContext<ModeContextType>({
  mode: 'NORMAL',
  toggleMode: () => {},
  setMode: () => {},
});

export const useUIMode = () => useContext(ModeContext);

export function ModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<UIMode>('NORMAL');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bridge_ui_mode') as UIMode;
      if (saved === 'NORMAL' || saved === 'GAMIFIED') {
        setModeState(saved);
      }
    }
  }, []);

  const setMode = (newMode: UIMode) => {
    setModeState(newMode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('bridge_ui_mode', newMode);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'NORMAL' ? 'GAMIFIED' : 'NORMAL');
  };

  return (
    <ModeContext.Provider value={{ mode, toggleMode, setMode }}>
      <div className={mode === 'GAMIFIED' ? 'mode-gamified font-sans' : 'mode-normal font-sans'}>
        {children}
      </div>
    </ModeContext.Provider>
  );
}
