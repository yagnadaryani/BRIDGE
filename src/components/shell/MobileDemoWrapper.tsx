'use client';

import React, { useState, createContext, useContext } from 'react';
import { Smartphone, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileDemoContextType {
  isMobileDemo: boolean;
  toggleMobileDemo: () => void;
}

const MobileDemoContext = createContext<MobileDemoContextType>({
  isMobileDemo: false,
  toggleMobileDemo: () => {},
});

export const useMobileDemo = () => useContext(MobileDemoContext);

export function MobileDemoProvider({ children }: { children: React.ReactNode }) {
  const [isMobileDemo, setIsMobileDemo] = useState(false);

  const toggleMobileDemo = () => setIsMobileDemo((prev) => !prev);

  return (
    <MobileDemoContext.Provider value={{ isMobileDemo, toggleMobileDemo }}>
      {isMobileDemo ? (
        <div className="min-h-screen bg-secondaryBg flex flex-col items-center justify-center p-4 transition-all duration-300">
          <div className="mb-3 flex items-center space-x-3 bg-surface border border-subtleBorder px-4 py-2 rounded-full shadow-card">
            <span className="text-xs font-semibold text-textMain flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-primary" />
              Mobile Demonstration View Active
            </span>
            <Button size="sm" variant="outline" onClick={toggleMobileDemo} className="text-xs py-0.5 px-2">
              <Monitor className="w-3 h-3 mr-1" /> Return to Desktop
            </Button>
          </div>

          {/* Smartphone Frame */}
          <div className="w-[390px] h-[810px] bg-surface border-[10px] border-slate-300 rounded-[44px] shadow-2xl flex flex-col overflow-hidden relative border-t-[14px]">
            {/* Phone Notch */}
            <div className="w-32 h-4 bg-slate-200 rounded-b-xl absolute top-0 left-1/2 -translate-x-1/2 z-50 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-slate-400 mr-2" />
              <div className="w-8 h-1 rounded-full bg-slate-300" />
            </div>

            {/* Screen Content */}
            <div className="flex-1 overflow-y-auto pt-4 bg-page text-textMain text-xs">
              {children}
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-page text-textMain">{children}</div>
      )}
    </MobileDemoContext.Provider>
  );
}
