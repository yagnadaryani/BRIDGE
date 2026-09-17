import React, { createContext, useContext, useState } from 'react';

interface DeviceModeContextType {
  isMobileDemo: boolean;
  setMobileDemo: (isMobile: boolean) => void;
  toggleMobileDemo: () => void;
}

const DeviceModeContext = createContext<DeviceModeContextType | undefined>(undefined);

export const DeviceModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMobileDemo, setIsMobileDemo] = useState<boolean>(() => {
    try {
      return localStorage.getItem('bridge_device_mode') === 'mobile';
    } catch {
      return false;
    }
  });

  const setMobileDemo = (isMobile: boolean) => {
    setIsMobileDemo(isMobile);
    try {
      localStorage.setItem('bridge_device_mode', isMobile ? 'mobile' : 'desktop');
    } catch {}
  };

  const toggleMobileDemo = () => {
    setMobileDemo(!isMobileDemo);
  };

  return (
    <DeviceModeContext.Provider value={{ isMobileDemo, setMobileDemo, toggleMobileDemo }}>
      {children}
    </DeviceModeContext.Provider>
  );
};

export const useDeviceMode = () => {
  const context = useContext(DeviceModeContext);
  if (!context) {
    throw new Error('useDeviceMode must be used within a DeviceModeProvider');
  }
  return context;
};
