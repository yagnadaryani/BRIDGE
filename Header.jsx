import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LearningPassportModal } from './passport/LearningPassportModal';
import { AuthModal } from './auth/AuthModal';
import { 
  Cpu, 
  Flame, 
  Trophy, 
  Globe, 
  GraduationCap, 
  Coins, 
  Gamepad2,
  ShieldCheck,
  Compass,
  Menu,
  X,
  MessageSquare,
  Video,
  Cloud,
  Settings,
  Binary,
  Code2,
  HelpCircle,
  Award,
  Users,
  UserCheck,
  LogIn,
  LogOut
} from 'lucide-react';

export const Header = () => {
  const { 
    role, 
    setRole, 
    gamification, 
    setGamification, 
    language, 
    setLanguage, 
    userStats, 
    activeTab,
    setActiveTab,
    currentUser,
    isAuthOpen,
    setIsAuthOpen,
    logoutUser,
    t 
  } = useApp();

  const [passportOpen, setPassportOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const xpPercent = Math.min(100, Math.floor((userStats.xp / userStats.maxXp) * 100));

  const navItems = [
    { id: 'chat', label: t.navChat, icon: MessageSquare },
    { id: 'video', label: t.navVideo, icon: Video },
    { id: 'digital', label: t.navDigitalLab, icon: Cpu },
    { id: 'cloud', label: t.navCloudLab, icon: Cloud },
    { id: 'os', label: t.navOsLab, icon: Settings },
    { id: 'micro', label: t.navMicroLab, icon: Binary },
    { id: 'dsa', label: t.navDsaLab, icon: Code2 },
    { id: 'quiz', label: t.navQuiz, icon: HelpCircle },
    { id: 'progress', label: t.navProgress, icon: Award },
    { id: 'teacher', label: t.navTeacherDash, icon: Users }
  ];

  return (
    <>
      <header className="glass-panel sticky top-0 z-40 mx-2 sm:mx-4 mt-2 sm:mt-3 mb-4 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 border-b border-white/10">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          {/* Mobile Menu Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 md:hidden hover:text-white border border-white/10"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-cyan-400" /> : <Menu className="w-5 h-5 text-cyan-400" />}
          </button>

          <div className="relative p-2 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 shadow-lg shadow-cyan-500/20">
            <Cpu className="w-5 h-5 sm:w-6 sm:h-6 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl sm:text-2xl tracking-wider text-gradient font-['Outfit']">
                BRIDGE
              </span>
              <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-widest px-1.5 sm:px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                AI ECOSYSTEM
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              {t.appSubTitle}
            </p>
          </div>
        </div>

        {/* Gamification Status Bar (Student Mode & Gamification ON) */}
        {role === 'student' && gamification && (
          <div className="hidden xl:flex items-center gap-4 px-4 py-2 rounded-xl bg-slate-900/80 border border-amber-500/20 shadow-inner">
            <div className="flex items-center gap-1.5 font-bold text-amber-400 text-xs">
              <Trophy className="w-4 h-4 text-amber-400 animate-bounce" />
              <span>{t.level} {userStats.level}</span>
            </div>

            <div className="w-28">
              <div className="flex justify-between text-[10px] text-slate-300 font-semibold mb-1">
                <span>{userStats.xp} {t.xp}</span>
                <span className="text-slate-500">{userStats.maxXp}</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-amber-400 to-pink-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-orange-500/10 border border-orange-500/30 text-orange-400 font-bold text-xs">
              <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
              <span>{userStats.streak} d</span>
            </div>

            <div className="flex items-center gap-1 font-bold text-yellow-300 text-xs px-2 py-0.5 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
              <Coins className="w-3.5 h-3.5 text-yellow-400" />
              <span>{userStats.coins}</span>
            </div>
          </div>
        )}

        {/* Controls & Switchers */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* User Auth Profile / Login Button */}
          {currentUser ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-cyan-500/30 text-xs font-semibold">
              <div className="w-6 h-6 rounded-full bg-cyan-600 flex items-center justify-center font-bold text-white uppercase text-[10px]">
                {currentUser.name.charAt(0)}
              </div>
              <span className="hidden md:inline font-bold text-slate-200">{currentUser.name}</span>
              <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 font-extrabold">
                {currentUser.role}
              </span>
              <button
                onClick={logoutUser}
                className="p-1 text-slate-400 hover:text-rose-400 ml-1"
                title="Log Out Session"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAuthOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-md"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Auth Login</span>
            </button>
          )}

          {/* Learning Passport Launcher */}
          {role === 'student' && (
            <button
              onClick={() => setPassportOpen(true)}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 hover:from-cyan-500/30 hover:to-indigo-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-bold transition-all shadow-sm"
              title="Open Persistent Student Learning Passport"
            >
              <Compass className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '20s' }} />
              <span className="hidden xs:inline">Passport</span>
            </button>
          )}

          {/* Gamification Toggle (Student mode only) */}
          {role === 'student' && (
            <button
              onClick={() => setGamification(!gamification)}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                gamification
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 shadow-sm shadow-amber-500/20'
                  : 'bg-slate-800/60 border-white/10 text-slate-400 hover:text-slate-200'
              }`}
              title="Toggle Gamified UI/UX"
            >
              <Gamepad2 className={`w-4 h-4 ${gamification ? 'text-amber-400' : 'text-slate-400'}`} />
              <span className="hidden lg:inline">
                {gamification ? t.gamificationOn : t.gamificationOff}
              </span>
            </button>
          )}

          {/* Multilingual Dropdown */}
          <div className="relative flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs">
            <Globe className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-transparent text-slate-200 font-medium focus:outline-none cursor-pointer text-xs"
            >
              <option value="en" className="bg-slate-900 text-slate-200">🇺🇸 EN</option>
              <option value="mr" className="bg-slate-900 text-slate-200">🇮🇳 मराठी</option>
              <option value="hi" className="bg-slate-900 text-slate-200">🇮🇳 हिन्दी</option>
              <option value="ta" className="bg-slate-900 text-slate-200">🇮🇳 தமிழ்</option>
              <option value="te" className="bg-slate-900 text-slate-200">🇮🇳 తెలుగు</option>
              <option value="bn" className="bg-slate-900 text-slate-200">🇮🇳 বাংলা</option>
              <option value="es" className="bg-slate-900 text-slate-200">🇪🇸 ES</option>
            </select>
          </div>

          {/* Role Switcher Pill */}
          <div className="flex items-center p-1 rounded-xl bg-slate-900/80 border border-white/10">
            <button
              onClick={() => setRole('student')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                role === 'student'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.roleStudent}</span>
            </button>
            <button
              onClick={() => setRole('teacher')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                role === 'teacher'
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.roleTeacher}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel mx-2 mb-4 p-4 space-y-2 border-cyan-500/30 animate-fade-in">
          <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2">
            Navigation Drawer
          </div>
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                      : 'bg-slate-900/80 border border-white/10 text-slate-200 hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Learning Passport Modal */}
      <LearningPassportModal
        isOpen={passportOpen}
        onClose={() => setPassportOpen(false)}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />
    </>
  );
};

