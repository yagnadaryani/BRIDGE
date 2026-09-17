'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  Mic,
  Compass,
  HelpCircle,
  TrendingUp,
  Target,
  Users,
  AlertTriangle,
  FileCheck,
  Radio,
  ClipboardList
} from 'lucide-react';
import { getCurrentSessionUser } from '@/lib/firebase/auth';
import { useUIMode } from '@/lib/context/ModeContext';
import { useTranslation } from '@/lib/i18n/I18nContext';

export function Sidebar() {
  const pathname = usePathname();
  const currentUser = getCurrentSessionUser();
  const { mode } = useUIMode();
  const { t } = useTranslation();
  const isTeacher = currentUser?.role === 'TEACHER';

  const studentLinks = [
    { href: '/student', label: t.sidebar.dashboard, icon: LayoutDashboard },
    { href: '/student/subjects', label: t.sidebar.subjects, icon: BookOpen },
    { href: '/student/work', label: t.sidebar.assignedWork, icon: ClipboardList },
    { href: '/student/communication', label: t.sidebar.technicalEnglish, icon: Mic },
    { href: '/student/career', label: t.sidebar.careerGuidance, icon: Compass },
    { href: '/student/doubts', label: t.sidebar.askTeacher, icon: HelpCircle },
    { href: '/student/progress', label: t.sidebar.learnerGrowth, icon: TrendingUp },
    { href: '/student/missions', label: t.sidebar.missions, icon: Target },
  ];

  const teacherLinks = [
    { href: '/teacher', label: t.sidebar.teacherOverview, icon: LayoutDashboard },
    { href: '/teacher/students', label: t.sidebar.studentRoster, icon: Users },
    { href: '/teacher/broadcast', label: t.sidebar.broadcast, icon: Radio },
    { href: '/teacher/allotment', label: t.sidebar.workAllotment, icon: ClipboardList },
    { href: '/teacher/interventions', label: t.sidebar.interventions, icon: FileCheck },
    { href: '/teacher/doubts', label: t.sidebar.doubtsInbox, icon: HelpCircle },
  ];

  const links = isTeacher ? teacherLinks : studentLinks;

  return (
    <aside className="w-64 flex-shrink-0 bg-surface border-r border-subtleBorder min-h-[calc(100vh-4rem)] p-4 hidden md:block">
      <div className="space-y-6">

        <div>
          <h2 className="text-[11px] font-bold text-textMuted uppercase tracking-wider px-3 mb-3">
            {isTeacher ? t.sidebar.teacherCommand : t.sidebar.studentHub}
          </h2>
          <nav className="space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || (link.href !== '/student' && link.href !== '/teacher' && pathname?.startsWith(link.href));

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-light text-primary shadow-sm font-bold'
                      : 'text-textSecondary hover:text-textMain hover:bg-secondaryBg'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-textMuted'}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Quick Diagnostic Warning (Light Warning Surface) */}
        {!isTeacher && (
          <div className="p-3.5 bg-warning-light border border-warning-border rounded-card space-y-1.5 shadow-sm">
            <div className="flex items-center text-xs font-bold text-warning space-x-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-warning" />
              <span>{t.sidebar.prereqGapActive}</span>
            </div>
            <p className="text-[11px] text-textSecondary leading-relaxed">
              {t.sidebar.prereqGapDesc}
            </p>
            <Link
              href="/student/subjects/dsa"
              className="inline-block text-[11px] font-bold text-primary hover:underline pt-0.5"
            >
              {t.sidebar.startGuidedRepair}
            </Link>
          </div>
        )}

      </div>
    </aside>
  );
}
