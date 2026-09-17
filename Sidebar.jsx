import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  MessageSquare, 
  Video, 
  Cpu, 
  Cloud, 
  Settings, 
  Binary, 
  Code2, 
  HelpCircle, 
  Award, 
  Users,
  Sparkles,
  Zap,
  BookOpen,
  Gamepad2,
  Trophy,
  Flame,
  Film,
  Target
} from 'lucide-react';

export const Sidebar = () => {
  const { activeTab, setActiveTab, role, gamification, t } = useApp();

  // Gamified icon mapping vs Standard icon mapping
  const studentNavItems = [
    { 
      section: 'AI Companion & Media',
      items: [
        { 
          id: 'chat', 
          label: t.navChat, 
          icon: gamification ? Sparkles : MessageSquare, 
          badge: gamification ? '⚡ Gamified AI' : 'AI 2.0' 
        },
        { 
          id: 'video', 
          label: t.navVideo, 
          icon: gamification ? Film : Video, 
          badge: gamification ? '🎬 Animated' : 'Visual' 
        }
      ]
    },
    { 
      section: 'Virtual Engineering Labs',
      items: [
        { id: 'digital', label: t.navDigitalLab, icon: Cpu, isLab: true },
        { id: 'cloud', label: t.navCloudLab, icon: Cloud, isLab: true },
        { id: 'os', label: t.navOsLab, icon: Settings, isLab: true },
        { id: 'micro', label: t.navMicroLab, icon: Binary, isLab: true },
        { id: 'dsa', label: t.navDsaLab, icon: Code2, isLab: true },
      ]
    },
    { 
      section: 'Assessments & Passport',
      items: [
        { 
          id: 'quiz', 
          label: t.navQuiz, 
          icon: gamification ? Target : HelpCircle, 
          badge: gamification ? '🎯 Quest' : 'Career' 
        },
        { 
          id: 'progress', 
          label: t.navProgress, 
          icon: gamification ? Trophy : Award, 
          gamifiedOnly: true 
        }
      ]
    }
  ];

  const teacherNavItems = [
    { 
      section: 'Instructor Portal',
      items: [
        { id: 'teacher', label: t.navTeacherDash, icon: Users, badge: 'Control' },
        { id: 'chat', label: t.navChat, icon: MessageSquare },
      ]
    },
    {
      section: 'Virtual Engineering Labs Inspection',
      items: [
        { id: 'digital', label: t.navDigitalLab, icon: Cpu, isLab: true },
        { id: 'cloud', label: t.navCloudLab, icon: Cloud, isLab: true },
        { id: 'os', label: t.navOsLab, icon: Settings, isLab: true },
        { id: 'micro', label: t.navMicroLab, icon: Binary, isLab: true },
        { id: 'dsa', label: t.navDsaLab, icon: Code2, isLab: true },
      ]
    }
  ];

  const renderItem = (item) => {
    const Icon = item.icon;
    const isActive = activeTab === item.id;
    // Labs on left bounce in place when Gamification mode is ON
    const shouldBounce = gamification && item.isLab;

    return (
      <button
        key={item.id}
        onClick={() => setActiveTab(item.id)}
        className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl font-semibold text-sm transition-all duration-200 group ${
          shouldBounce ? 'subtle-bounce' : ''
        } ${
          isActive
            ? item.isLab
              ? gamification
                ? 'bg-gradient-to-r from-cyan-500/25 via-indigo-500/20 to-transparent border-l-4 border-cyan-400 text-cyan-200 shadow-lg shadow-cyan-500/10'
                : 'bg-cyan-50 border-l-4 border-cyan-600 text-cyan-900 font-bold shadow-sm'
              : gamification
                ? 'bg-slate-800/90 border-l-4 border-indigo-400 text-white shadow-md'
                : 'bg-slate-200 border-l-4 border-indigo-600 text-slate-900 font-bold shadow-sm'
            : gamification
              ? 'text-slate-300 hover:text-white hover:bg-slate-800/50 border border-transparent'
              : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
            isActive 
              ? (item.isLab ? (gamification ? 'text-cyan-400' : 'text-cyan-900') : (gamification ? 'text-indigo-400' : 'text-indigo-900')) 
              : (gamification ? 'text-slate-200' : 'text-black')
          }`} />
          <span className="truncate">{item.label}</span>
        </div>

        {item.badge && (
          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border ${
            gamification
              ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
              : 'bg-indigo-100 text-indigo-950 border-indigo-300'
          }`}>
            {item.badge}
          </span>
        )}

        {item.isLab && (
          <span className={`text-[9px] uppercase tracking-widest font-extrabold px-1.5 py-0.5 rounded border ${
            gamification
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
              : 'bg-cyan-100 text-cyan-950 border-cyan-300'
          }`}>
            Lab
          </span>
        )}
      </button>
    );
  };

  const sections = role === 'teacher' ? teacherNavItems : studentNavItems;

  return (
    <aside className="w-64 shrink-0 hidden md:block mx-4">
      <div className={`p-4 sticky top-24 space-y-4 rounded-2xl border transition-all duration-300 ${
        gamification ? 'glass-panel border-slate-700' : 'bg-white border-slate-900 shadow-md'
      }`}>
        <div className={`px-2 py-1 flex items-center justify-between pb-3 border-b ${
          gamification ? 'border-white/10' : 'border-slate-300'
        }`}>
          <span className={`text-xs uppercase font-extrabold tracking-wider flex items-center gap-1.5 ${
            gamification ? 'text-cyan-400' : 'text-black'
          }`}>
            <BookOpen className="w-3.5 h-3.5" />
            {role === 'teacher' ? 'Instructor Portal' : 'Main Navigation'}
          </span>
          {role === 'student' && gamification && (
            <span className="badge-gamified">
              <Zap className="w-3 h-3 text-amber-400 fill-amber-400" /> XP Active
            </span>
          )}
        </div>

        <nav className="space-y-4">
          {sections.map((sec, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className={`px-2 text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-1.5 ${
                gamification ? 'text-slate-200' : 'text-black font-black'
              }`}>
                <span>{sec.section}</span>
              </div>
              <div className="space-y-1">
                {sec.items.map((item) => renderItem(item))}
              </div>
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
};
