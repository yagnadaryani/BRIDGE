'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  Gamepad2,
  BookOpen,
  Smartphone,
  Monitor,
  LogOut,
  BotMessageSquare,
  Flame,
  Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUIMode } from '@/lib/context/ModeContext';
import { useMobileDemo } from './MobileDemoWrapper';
import { getCurrentSessionUser, logoutUser } from '@/lib/firebase/auth';
import { mockStore } from '@/lib/firebase/mockStore';
import { useTranslation } from '@/lib/i18n/I18nContext';
import { LanguageSelector } from './LanguageSelector';
import { NotificationBell } from './NotificationBell';

interface NavbarProps {
  onOpenAIAssistant?: () => void;
}

export function Navbar({ onOpenAIAssistant }: NavbarProps) {
  const router = useRouter();
  const { mode, toggleMode } = useUIMode();
  const { isMobileDemo, toggleMobileDemo } = useMobileDemo();
  const { t } = useTranslation();
  const currentUser = getCurrentSessionUser();

  const isGamified = mode === 'GAMIFIED';
  const isStudent = currentUser?.role === 'STUDENT';
  const learnerModel = isStudent ? mockStore.getLearnerModel(currentUser?.id || 'aarav-101') : null;

  const handleLogout = async () => {
    await logoutUser();
    router.push('/login');
  };

  return (
    <header className={`sticky top-0 z-40 bg-surface border-b border-subtleBorder shadow-sm transition-colors duration-300 ${
      isGamified ? 'border-purple-200 bg-gradient-to-r from-surface via-purple-50/30 to-surface' : ''
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        {/* Brand Logo */}
        <div className="flex items-center space-x-3">
          <Link href={isStudent ? '/student' : '/teacher'} className="flex items-center space-x-2.5 group">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-extrabold text-lg text-white shadow-md transition-transform duration-300 group-hover:scale-105 ${
              isGamified
                ? 'bg-gradient-to-tr from-primary via-purpleAccent to-indigo-500 shadow-purpleAccent/25'
                : 'bg-gradient-to-tr from-primary to-purpleAccent shadow-primary/20'
            }`}>
              B
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-wider text-textMain">
                BRIDGE
              </span>
              <span className="hidden sm:block text-[9px] uppercase tracking-widest text-textMuted font-mono -mt-1">
                {t.nav.brandSubtitle}
              </span>
            </div>
          </Link>
          <Badge variant={currentUser?.role === 'TEACHER' ? 'purple' : 'info'} className="text-[10px] font-semibold">
            {currentUser?.role === 'TEACHER' ? t.nav.teacherPortal : t.nav.student}
          </Badge>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">

          {/* Gamification Stats (when student) */}
          {isStudent && learnerModel && (
            <div className={`hidden md:flex items-center space-x-2.5 px-3 py-1 rounded-full text-xs font-medium border border-subtleBorder ${
              isGamified ? 'bg-purple-50/80 border-purple-200 text-purple-900 shadow-sm' : 'bg-secondaryBg text-textMain'
            }`}>
              <span className="flex items-center text-amber-600 font-semibold" title="Mastery Streak">
                <Flame className={`w-3.5 h-3.5 mr-1 text-amber-500 fill-amber-500/20 ${isGamified ? 'animate-bounce' : ''}`} /> {learnerModel.streakDays}d {t.nav.streak}
              </span>
              <span className="text-subtleBorder">|</span>
              <span className="flex items-center text-primary font-semibold" title="XP Points">
                <Award className={`w-3.5 h-3.5 mr-1 text-primary ${isGamified ? 'animate-pulse' : ''}`} /> {learnerModel.xp} {t.nav.xp}
              </span>
              <span className="text-subtleBorder">|</span>
              <span className="text-purpleAccent font-bold">{t.nav.level} {learnerModel.level}</span>
            </div>
          )}

          {/* Language Switcher (Mandatory Section 10.1) */}
          <LanguageSelector />

          {/* Notification Bell (Mandatory Section 16 & 17) */}
          <NotificationBell userId={currentUser?.id || 'aarav-101'} />

          {/* AI Assistant Trigger Button */}
          {onOpenAIAssistant && (
            <Button
              size="sm"
              variant={isGamified ? 'gradient' : 'primary'}
              onClick={onOpenAIAssistant}
              className="text-xs space-x-1.5 shadow-sm"
            >
              <BotMessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">{t.nav.aiTutor}</span>
            </Button>
          )}

          {/* Mode Switcher Toggle */}
          <button
            onClick={toggleMode}
            className={`relative inline-flex items-center h-8 rounded-full px-3 text-xs font-semibold transition-all duration-300 border ${
              isGamified
                ? 'bg-purple-50 border-purple-300 text-purple-800 shadow-sm'
                : 'bg-secondaryBg border-subtleBorder text-textSecondary hover:text-textMain'
            }`}
            title="Toggle between Academic Normal and Gamification Mode"
          >
            {isGamified ? (
              <span className="flex items-center text-purple-700 font-bold">
                <Gamepad2 className="w-3.5 h-3.5 mr-1.5 text-primary animate-pulse" /> {t.nav.gamifiedMode}
              </span>
            ) : (
              <span className="flex items-center text-textSecondary">
                <BookOpen className="w-3.5 h-3.5 mr-1.5 text-primary" /> {t.nav.normalMode}
              </span>
            )}
          </button>

          {/* Mobile Demo View Toggle */}
          <Button
            size="sm"
            variant="outline"
            onClick={toggleMobileDemo}
            className="text-xs px-2.5 hidden sm:flex items-center text-textSecondary hover:text-textMain"
            title="Toggle Frame Demo View"
          >
            {isMobileDemo ? <Monitor className="w-3.5 h-3.5 mr-1" /> : <Smartphone className="w-3.5 h-3.5 mr-1 text-primary" />}
            <span className="text-xs">{isMobileDemo ? t.nav.desktop : t.nav.mobileView}</span>
          </Button>

          {/* Logout */}
          <Button size="sm" variant="ghost" onClick={handleLogout} className="text-xs px-2 text-textMuted hover:text-error" title={t.nav.logout}>
            <LogOut className="w-4 h-4" />
          </Button>

        </div>
      </div>
    </header>
  );
}
