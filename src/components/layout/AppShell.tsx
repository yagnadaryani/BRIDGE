import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useGamification } from '../../context/GamificationContext';
import { useDeviceMode } from '../../context/DeviceModeContext';
import {
  GraduationCap,
  School,
  LogOut,
  Flame,
  Zap,
  BookOpen,
  Code2,
  Cpu,
  Layers,
  Binary,
  Cloud,
  MessageSquare,
  Compass,
  HelpCircle,
  TrendingUp,
  Award,
  Sparkles,
  Smartphone,
  Monitor,
  Menu,
  X,
  Bot
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AppShellProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  children: React.ReactNode;
  onOpenAssistant: () => void;
}

export const AppShell: React.FC<AppShellProps> = ({
  currentRoute,
  onNavigate,
  children,
  onOpenAssistant
}) => {
  const { currentUser, role, logout } = useAuth();
  const { isGamified, toggleGamificationMode, profile, lastAward, showLevelUpModal, closeLevelUpModal } = useGamification();
  const { isMobileDemo, toggleMobileDemo } = useDeviceMode();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const studentNavItems = [
    { id: 'student_dashboard', label: 'Dashboard', route: '/student', icon: GraduationCap },
    { id: 'sub_dsa', label: 'DSA Code Studio', route: '/student/subjects/dsa', icon: Code2, badge: 'Primary' },
    { id: 'sub_de', label: 'Circuit Lab', route: '/student/subjects/digital-electronics', icon: Cpu, badge: 'Canvas' },
    { id: 'sub_os', label: 'OS Simulator', route: '/student/subjects/os', icon: Layers },
    { id: 'sub_mp', label: 'Processor Studio', route: '/student/subjects/microprocessor', icon: Binary },
    { id: 'sub_cloud', label: 'Cloud Architecture', route: '/student/subjects/cloud', icon: Cloud },
    { id: 'nav_comm', label: 'Communication Lab', route: '/student/communication', icon: MessageSquare },
    { id: 'nav_career', label: 'Career Guidance', route: '/student/career', icon: Compass },
    { id: 'nav_doubts', label: 'Doubts & Q&A', route: '/student/doubts', icon: HelpCircle },
    { id: 'nav_progress', label: 'Growth Replay & Model', route: '/student/progress', icon: TrendingUp },
    { id: 'nav_missions', label: 'Missions & Badges', route: '/student/missions', icon: Award }
  ];

  const teacherNavItems = [
    { id: 'teacher_overview', label: 'Teacher Overview', route: '/teacher', icon: School },
    { id: 'teacher_students', label: 'Cohort Students', route: '/teacher/students', icon: GraduationCap },
    { id: 'teacher_aarav', label: 'Aarav Intelligence', route: '/teacher/students/student_aarav_01', icon: TrendingUp, badge: 'Deep Dive' },
    { id: 'teacher_doubts', label: 'Doubts Center', route: '/teacher/doubts', icon: HelpCircle },
    { id: 'teacher_interventions', label: 'Interventions Engine', route: '/teacher/interventions', icon: Sparkles },
    { id: 'teacher_analytics', label: 'Analytics & Heatmaps', route: '/teacher/analytics', icon: Layers }
  ];

  const currentNav = role === 'STUDENT' ? studentNavItems : teacherNavItems;

  const appContent = (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${
      isGamified ? 'bg-[#0f172a] text-slate-100' : 'bg-[#F8FAFC] text-slate-800'
    }`}>
      {/* Top Floating Alert for XP Gains */}
      <AnimatePresence>
        {lastAward && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.95 }}
            animate={{ opacity: 1, y: 16, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-0 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500 to-indigo-600 text-white shadow-xl font-medium text-xs sm:text-sm border border-white/20 pointer-events-none"
          >
            <Zap className="w-4 h-4 fill-amber-300 text-amber-200 animate-pulse" />
            <span>+{lastAward.amount} XP</span>
            <span className="opacity-90">• {lastAward.reason}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main App Bar */}
      <header className={`sticky top-0 z-40 border-b backdrop-blur-md transition-colors ${
        isGamified
          ? 'bg-slate-900/90 border-slate-800 shadow-lg shadow-indigo-950/40'
          : 'bg-white/90 border-slate-200/90 shadow-xs'
      }`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo & Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <button
              type="button"
              onClick={() => onNavigate(role === 'STUDENT' ? '/student' : '/teacher')}
              className="flex items-center gap-2.5 text-left focus:outline-none"
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white shadow-sm ${
                isGamified ? 'bg-gradient-to-tr from-indigo-500 to-violet-600' : 'bg-indigo-600'
              }`}>
                B
              </div>
              <div className="hidden xs:block">
                <div className="flex items-center gap-1.5">
                  <span className={`font-bold tracking-tight text-base font-heading ${
                    isGamified ? 'text-white' : 'text-slate-900'
                  }`}>
                    BRIDGE
                  </span>
                  <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded tracking-wider ${
                    role === 'STUDENT'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-purple-100 text-purple-800'
                  }`}>
                    {role}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 font-medium hidden sm:block">
                  Learning Intelligence
                </div>
              </div>
            </button>
          </div>

          {/* Center/Right Controls */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Presentation Device Mode Switch: Desktop vs Mobile Frame */}
            <div className={`hidden md:flex items-center p-0.5 rounded-lg border text-xs font-semibold ${
              isGamified ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'
            }`}>
              <button
                type="button"
                onClick={() => isMobileDemo && toggleMobileDemo()}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all ${
                  !isMobileDemo
                    ? isGamified ? 'bg-indigo-600 text-white shadow-xs' : 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="View full Desktop application"
              >
                <Monitor className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">Desktop</span>
              </button>
              <button
                type="button"
                onClick={() => !isMobileDemo && toggleMobileDemo()}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all ${
                  isMobileDemo
                    ? isGamified ? 'bg-indigo-600 text-white shadow-xs' : 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Demonstrate inside realistic Mobile frame"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">Mobile Demo</span>
              </button>
            </div>

            {/* Mode Switcher: Academic Normal vs Gamification Mode */}
            <button
              type="button"
              onClick={toggleGamificationMode}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                isGamified
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white border-indigo-400 shadow-md shadow-indigo-500/20'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-xs'
              }`}
            >
              <Zap className={`w-3.5 h-3.5 ${isGamified ? 'fill-amber-300 text-amber-300' : 'text-slate-400'}`} />
              <span className="hidden sm:inline">
                {isGamified ? 'Gamification Mode' : 'Academic Mode'}
              </span>
              <span className={`text-[10px] px-1 py-0.2 rounded font-bold ${
                isGamified ? 'bg-indigo-900/60 text-indigo-200' : 'bg-slate-100 text-slate-500'
              }`}>
                {isGamified ? 'ACTIVE' : 'NORMAL'}
              </span>
            </button>

            {/* Gamification Stats in Header */}
            {role === 'STUDENT' && (
              <div className="flex items-center gap-1.5 sm:gap-2">
                {/* Streak */}
                <div
                  className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold ${
                    isGamified
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-amber-50 text-amber-800 border border-amber-200/60'
                  }`}
                  title={`${profile.streakDays} Day Learning Streak`}
                >
                  <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>{profile.streakDays}d</span>
                </div>

                {/* Level / XP */}
                <div
                  onClick={() => onNavigate('/student/missions')}
                  className={`cursor-pointer flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${
                    isGamified
                      ? 'bg-indigo-950/60 border-indigo-500/40 text-indigo-300 hover:border-indigo-400'
                      : 'bg-indigo-50/70 border-indigo-200 text-indigo-800 hover:bg-indigo-100'
                  }`}
                  title="Level & XP"
                >
                  <span className="text-[10px] uppercase text-indigo-400">Lv.{profile.level}</span>
                  <span>{profile.xp} XP</span>
                </div>
              </div>
            )}

            {/* AI Assistant Button */}
            <button
              type="button"
              onClick={onOpenAssistant}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold shadow-xs transition-all ${
                isGamified
                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40 hover:bg-emerald-900/50'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
              }`}
              title="Open Context-Aware AI Pedagogical Tutor"
            >
              <Bot className="w-3.5 h-3.5 text-emerald-500" />
              <span className="hidden md:inline">AI Tutor</span>
            </button>

            {/* User Profile & Logout */}
            <div className="flex items-center gap-2 pl-1 border-l border-slate-200/60">
              <div className="text-right hidden xl:block">
                <div className={`text-xs font-semibold leading-tight ${isGamified ? 'text-slate-100' : 'text-slate-900'}`}>
                  {currentUser?.name || 'Engineer'}
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  {currentUser?.department || 'CS Department'}
                </div>
              </div>

              <button
                type="button"
                onClick={logout}
                className={`p-2 rounded-lg text-slate-400 hover:text-red-600 transition-colors ${
                  isGamified ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
                }`}
                title="Logout session"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Body with Persistent Sidebar Layout */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Desktop Sidebar Navigation */}
        <aside className={`hidden lg:block w-64 flex-shrink-0 border-r py-6 px-4 transition-colors ${
          isGamified
            ? 'bg-slate-900/50 border-slate-800'
            : 'bg-white/50 border-slate-200/80'
        }`}>
          <div className="mb-4 px-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {role === 'STUDENT' ? 'Learning Pathways' : 'Instructional Management'}
            </p>
          </div>

          <nav className="space-y-1">
            {currentNav.map((item) => {
              const Icon = item.icon;
              const isActive = currentRoute === item.route;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onNavigate(item.route)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all text-left ${
                    isActive
                      ? isGamified
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                        : 'bg-indigo-50 text-indigo-700 border border-indigo-100 font-bold'
                      : isGamified
                        ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className={`w-4 h-4 flex-shrink-0 ${
                      isActive ? (isGamified ? 'text-white' : 'text-indigo-600') : 'text-slate-400'
                    }`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      isActive
                        ? isGamified ? 'bg-indigo-700 text-indigo-100' : 'bg-indigo-200 text-indigo-900'
                        : isGamified ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Context Summary Card in Sidebar */}
          <div className={`mt-8 p-3.5 rounded-2xl border ${
            isGamified
              ? 'bg-slate-800/60 border-slate-700/80 text-slate-300'
              : 'bg-slate-50 border-slate-200 text-slate-600'
          }`}>
            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-indigo-600">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Continuous Loop</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Every action generates evidence. The Learner Model diagnoses root prerequisite gaps and provides targeted interventions.
            </p>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className={`lg:hidden fixed inset-y-0 left-0 z-50 w-72 p-5 shadow-2xl overflow-y-auto ${
                isGamified ? 'bg-slate-900 text-slate-100' : 'bg-white text-slate-800'
              }`}
            >
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200">
                <div className="font-bold text-lg font-heading">BRIDGE Menu</div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-1.5">
                {currentNav.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentRoute === item.route;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        onNavigate(item.route);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-left ${
                        isActive
                          ? isGamified ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-700'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              <div className="mt-8 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={logout}
                  className="w-full flex items-center gap-2 py-2.5 px-3 text-sm font-semibold text-red-600 rounded-xl hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic Route Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>

      {/* Level Up Celebratory Modal */}
      <AnimatePresence>
        {showLevelUpModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs"
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              className="w-full max-w-sm p-6 rounded-3xl bg-white border border-indigo-200 shadow-2xl text-center text-slate-800 relative overflow-hidden"
            >
              <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-tr from-amber-400 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-300">
                <Award className="w-9 h-9" />
              </div>
              <h3 className="text-xl font-bold font-heading text-slate-900">LEVEL UP!</h3>
              <p className="text-sm text-indigo-600 font-semibold mb-2">
                You reached Level {profile.level}: {profile.title}
              </p>
              <p className="text-xs text-slate-500 mb-6">
                Your engineering diagnostic loop and verified interventions continue to expand your multidimensional mastery.
              </p>
              <button
                type="button"
                onClick={closeLevelUpModal}
                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-md transition-all"
              >
                Continue Learning
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  // If Mobile Demonstration Mode is selected on laptop/desktop:
  // Render the SAME app inside a realistic phone mockup with smooth transition!
  if (isMobileDemo) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-2 sm:p-6">
        {/* Floating Top Banner to Switch Back */}
        <div className="mb-4 flex items-center gap-3 px-4 py-2 bg-slate-800 text-slate-200 border border-slate-700 rounded-full shadow-lg text-xs font-semibold">
          <Smartphone className="w-4 h-4 text-indigo-400" />
          <span>Mobile Device Simulation Active</span>
          <button
            type="button"
            onClick={toggleMobileDemo}
            className="ml-2 px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-[11px] font-bold"
          >
            Back to Desktop
          </button>
        </div>

        {/* Realistic Smartphone Frame */}
        <div className="w-[380px] h-[780px] bg-slate-950 rounded-[48px] p-3 shadow-2xl border-4 border-slate-700 relative overflow-hidden flex flex-col">
          {/* Dynamic Island / Speaker notch */}
          <div className="w-28 h-5 bg-black rounded-full mx-auto mb-2 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-slate-900 mr-2" />
            <div className="w-2 h-2 rounded-full bg-slate-800" />
          </div>

          {/* Screen Content */}
          <div className="flex-1 w-full overflow-y-auto rounded-[36px] bg-white text-slate-800 relative">
            {appContent}
          </div>

          {/* Home Indicator bar */}
          <div className="w-32 h-1 bg-slate-600 rounded-full mx-auto mt-2" />
        </div>
      </div>
    );
  }

  return appContent;
};
