import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { GamificationProfile } from '../types';
import { storageService } from '../services/storage';

interface GamificationContextType {
  isGamified: boolean;
  toggleGamificationMode: () => void;
  profile: GamificationProfile;
  awardXP: (amount: number, category: keyof GamificationProfile['xpBreakdown'], reason: string) => void;
  lastAward: { amount: number; reason: string } | null;
  showLevelUpModal: boolean;
  closeLevelUpModal: () => void;
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

export const GamificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isGamified, setIsGamified] = useState<boolean>(() => {
    try {
      return localStorage.getItem('bridge_mode_gamification') === 'true';
    } catch {
      return false;
    }
  });

  const [profile, setProfile] = useState<GamificationProfile>(() => {
    return storageService.getGamificationProfile();
  });

  const [lastAward, setLastAward] = useState<{ amount: number; reason: string } | null>(null);
  const [showLevelUpModal, setShowLevelUpModal] = useState<boolean>(false);

  const toggleGamificationMode = () => {
    setIsGamified(prev => {
      const next = !prev;
      try {
        localStorage.setItem('bridge_mode_gamification', String(next));
      } catch {}
      return next;
    });
  };

  const awardXP = (amount: number, category: keyof GamificationProfile['xpBreakdown'], reason: string) => {
    const result = storageService.addXP(amount, category, reason);
    setProfile(storageService.getGamificationProfile());
    setLastAward({ amount, reason });

    // Trigger celebration if gamified
    if (isGamified) {
      try {
        confetti({
          particleCount: 45,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B']
        });
      } catch {}
    }

    if (result.leveledUp) {
      setShowLevelUpModal(true);
      try {
        confetti({
          particleCount: 120,
          spread: 100,
          origin: { y: 0.6 }
        });
      } catch {}
    }

    setTimeout(() => {
      setLastAward(null);
    }, 4000);
  };

  const closeLevelUpModal = () => setShowLevelUpModal(false);

  return (
    <GamificationContext.Provider
      value={{
        isGamified,
        toggleGamificationMode,
        profile,
        awardXP,
        lastAward,
        showLevelUpModal,
        closeLevelUpModal
      }}
    >
      {children}
    </GamificationContext.Provider>
  );
};

export const useGamification = () => {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error('useGamification must be used within a GamificationProvider');
  }
  return context;
};
