'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  BookOpen,
  Code,
  Flame,
  Award,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  HelpCircle,
  Compass,
  CheckCircle2,
  ClipboardList
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { mockStore } from '@/lib/firebase/mockStore';
import { getCurrentSessionUser } from '@/lib/firebase/auth';
import { useTranslation } from '@/lib/i18n/I18nContext';
import { useUIMode } from '@/lib/context/ModeContext';

export default function StudentDashboard() {
  const { t } = useTranslation();
  const { mode } = useUIMode();
  const isGamified = mode === 'GAMIFIED';
  const currentUser = getCurrentSessionUser();
  const studentId = currentUser?.id || 'aarav-101';
  const model = mockStore.getLearnerModel(studentId);
  const diagnoses = mockStore.getDiagnoses(studentId);
  const workItems = mockStore.getWorkItems();
  const submissions = mockStore.getSubmissions(studentId);

  const activeDiagnosis = diagnoses[0];

  return (
    <div className="space-y-6">
      {/* Light Hero Section Banner */}
      <div className={`p-6 rounded-card flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-card border transition-all ${
        isGamified
          ? 'bg-gradient-to-r from-surface via-purple-50 to-indigo-50/50 border-purple-200 card-gamified-glow'
          : 'bg-surface border-subtleBorder'
      }`}>
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-extrabold text-textMain">
              {t.dashboard.welcomeBack}, {model.studentName}!
            </span>
            <Badge variant="info">{t.dashboard.studentYear}</Badge>
          </div>
          <p className="text-xs text-textSecondary">
            {t.dashboard.currentFocus}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link href="/student/subjects/dsa">
            <Button size="sm" variant={isGamified ? 'gradient' : 'primary'} className="text-xs space-x-1.5 font-bold shadow-sm">
              <span>{t.dashboard.continueStudio}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Recommended Intervention Alert Banner (Light Warning Surface #FFF9EC, border #F1D99A, warning icon #E59A18) */}
      {activeDiagnosis && (
        <Card className="border-[#F1D99A] bg-[#FFF9EC] shadow-card">
          <CardHeader className="p-4 mb-2 flex flex-row items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-[#E59A18]" />
              <CardTitle className="text-sm font-bold text-textMain">
                {t.dashboard.rootInterventionTitle}
              </CardTitle>
            </div>
            <Badge variant="warning">{activeDiagnosis.recommendedIntervention}</Badge>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-3 text-xs">
            <p className="text-textSecondary leading-relaxed">{activeDiagnosis.explanation}</p>
            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-[#E59A18] font-bold">
                {t.dashboard.rootGap}: {activeDiagnosis.rootGapTitle}
              </span>
              <Link href="/student/subjects/dsa">
                <Button size="sm" variant="primary" className="text-xs py-1 px-3">
                  {t.dashboard.startRepairLab}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Assigned Work & Actionable Tasks Section (Mandatory Section 17) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-textMain flex items-center">
            <ClipboardList className="w-4 h-4 mr-1.5 text-primary" />
            <span>{t.dashboard.assignedWorkTitle}</span>
          </h2>
          <Link href="/student/work" className="text-xs text-primary hover:underline font-semibold">
            {t.dashboard.viewAll}
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {workItems.slice(0, 3).map((item) => {
            const sub = submissions.find((s) => s.workItemId === item.id);
            const status = sub?.status || 'NOT_STARTED';

            return (
              <Card key={item.id} className="bg-surface border-subtleBorder hover:shadow-cardHover transition-all">
                <CardContent className="p-4 space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-textMain line-clamp-1">{item.title}</span>
                    <Badge variant="purple" className="text-[9px] font-mono">+{item.xpReward} XP</Badge>
                  </div>
                  <p className="text-[11px] text-textSecondary line-clamp-2 leading-relaxed">{item.description}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-subtleBorder text-[10px] text-textMuted font-mono">
                    <Badge
                      variant={status === 'COMPLETED' ? 'success' : status === 'IN_PROGRESS' ? 'warning' : 'default'}
                      className="text-[9px]"
                    >
                      {status.replace('_', ' ')}
                    </Badge>
                    <Link href="/student/work">
                      <span className="text-primary hover:underline font-semibold cursor-pointer">Start →</span>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Subject Cards & Intelligence Quick Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* Subjects Overview (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-textMain">{t.dashboard.subjectsTitle}</h2>
            <Link href="/student/subjects" className="text-xs text-primary hover:underline font-semibold">{t.dashboard.viewAll}</Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

            <Card className="bg-surface border-subtleBorder hover:shadow-cardHover transition-all">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-textMain">Data Structures & Algorithms</span>
                  <Badge variant="info">CS301</Badge>
                </div>
                <Progress value={model.conceptMastery['dsa-binary-search']?.masteryScore || 42} />
                <div className="flex justify-between text-[11px] text-textSecondary font-medium">
                  <span>Binary Search</span>
                  <span className="font-mono text-primary font-bold">{model.conceptMastery['dsa-binary-search']?.masteryScore || 42}% Mastery</span>
                </div>
                <Link href="/student/subjects/dsa" className="block pt-1">
                  <Button size="sm" variant="outline" className="w-full text-xs">Open Subject Workspace</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-surface border-subtleBorder hover:shadow-cardHover transition-all">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-textMain">Operating Systems</span>
                  <Badge variant="purple">CS302</Badge>
                </div>
                <Progress value={78} colorClass="bg-purpleAccent" />
                <div className="flex justify-between text-[11px] text-textSecondary font-medium">
                  <span>CPU Scheduling</span>
                  <span className="font-mono text-purpleAccent font-bold">78% Mastery</span>
                </div>
                <Link href="/student/subjects/os" className="block pt-1">
                  <Button size="sm" variant="outline" className="w-full text-xs">Open Subject Workspace</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-surface border-subtleBorder hover:shadow-cardHover transition-all">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-textMain">Digital Electronics</span>
                  <Badge variant="warning">EC201</Badge>
                </div>
                <Progress value={85} colorClass="bg-warning" />
                <div className="flex justify-between text-[11px] text-textSecondary font-medium">
                  <span>Logic Gates & Faults</span>
                  <span className="font-mono text-warning font-bold">85% Mastery</span>
                </div>
                <Link href="/student/subjects/digital-electronics" className="block pt-1">
                  <Button size="sm" variant="outline" className="w-full text-xs">Open Subject Workspace</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-surface border-subtleBorder hover:shadow-cardHover transition-all">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-textMain">Microprocessors</span>
                  <Badge variant="success">EC302</Badge>
                </div>
                <Progress value={62} colorClass="bg-success" />
                <div className="flex justify-between text-[11px] text-textSecondary font-medium">
                  <span>8086 Assembly</span>
                  <span className="font-mono text-success font-bold">62% Mastery</span>
                </div>
                <Link href="/student/subjects/microprocessor" className="block pt-1">
                  <Button size="sm" variant="outline" className="w-full text-xs">Open Subject Workspace</Button>
                </Link>
              </CardContent>
            </Card>

          </div>
        </div>

        {/* Intelligence Sidebar (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="bg-surface border-subtleBorder shadow-card">
            <CardHeader className="p-3 mb-2 border-b border-subtleBorder">
              <CardTitle className="text-xs font-bold text-textMain">{t.dashboard.intelligenceSnapshot}</CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0 space-y-3 text-xs">
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-textSecondary font-semibold">
                  <span>{t.dashboard.overallMastery}</span>
                  <span className="font-mono text-primary font-bold">{model.overallMastery}%</span>
                </div>
                <Progress value={model.overallMastery} />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
                <div className="p-2.5 bg-secondaryBg rounded-xl border border-subtleBorder">
                  <span className="text-textMuted text-[10px] block">{t.dashboard.applicationScore}</span>
                  <span className="text-primary font-bold text-sm">{model.applicationScore}%</span>
                </div>
                <div className="p-2.5 bg-secondaryBg rounded-xl border border-subtleBorder">
                  <span className="text-textMuted text-[10px] block">{t.dashboard.debuggingScore}</span>
                  <span className="text-purpleAccent font-bold text-sm">{model.debuggingScore}%</span>
                </div>
                <div className="p-2.5 bg-secondaryBg rounded-xl border border-subtleBorder">
                  <span className="text-textMuted text-[10px] block">{t.dashboard.retentionScore}</span>
                  <span className="text-success font-bold text-sm">{model.retentionScore}%</span>
                </div>
                <div className="p-2.5 bg-secondaryBg rounded-xl border border-subtleBorder">
                  <span className="text-textMuted text-[10px] block">{t.dashboard.confidenceCalibration}</span>
                  <span className="text-warning font-bold text-sm">{model.confidenceCalibration}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-subtleBorder space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-textMuted block">Active Root Gaps</span>
                <div className="flex flex-wrap gap-1.5">
                  {model.rootGaps.length === 0 ? (
                    <span className="text-success text-[11px] font-semibold">None! All verified closed.</span>
                  ) : (
                    model.rootGaps.map((gap) => (
                      <Badge key={gap} variant="warning" className="text-[10px]">
                        {gap}
                      </Badge>
                    ))
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-subtleBorder space-y-1">
                <span className="text-[10px] uppercase font-bold text-textMuted block">Effective Interventions</span>
                <div className="text-[11px] text-textSecondary">
                  {model.effectiveInterventions[0] || 'Contrast Invariant Repair'}
                </div>
              </div>

              <Link href="/student/progress" className="block pt-1">
                <Button size="sm" variant="ghost" className="w-full text-xs text-primary font-bold">
                  View Full Learner Growth Model →
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
