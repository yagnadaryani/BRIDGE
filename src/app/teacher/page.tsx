'use client';

import React from 'react';
import Link from 'next/link';
import {
  Users,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  HelpCircle,
  ArrowRight,
  Radio,
  ClipboardList,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockStore } from '@/lib/firebase/mockStore';
import { useTranslation } from '@/lib/i18n/I18nContext';

export default function TeacherOverviewPage() {
  const { t } = useTranslation();
  const aaravModel = mockStore.getLearnerModel('aarav-101');
  const aaravDiagnoses = mockStore.getDiagnoses('aarav-101');
  const doubts = mockStore.getDoubts();
  const broadcasts = mockStore.getBroadcasts();
  const workItems = mockStore.getWorkItems();

  const openDoubtsCount = doubts.filter((d) => d.status === 'OPEN').length;

  return (
    <div className="space-y-6">
      {/* Light Header */}
      <div className="bg-surface border border-subtleBorder p-5 rounded-card shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <Users className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold text-textMain">{t.teacher.commandTitle}</h1>
            <Badge variant="purple">CSE Class 3-A</Badge>
          </div>
          <p className="text-xs text-textSecondary mt-1">
            {t.teacher.commandSubtitle}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Link href="/teacher/broadcast">
            <Button size="sm" variant="outline" className="text-xs space-x-1">
              <Radio className="w-3.5 h-3.5 text-primary" />
              <span>Broadcast</span>
            </Button>
          </Link>
          <Link href="/teacher/allotment">
            <Button size="sm" variant="primary" className="text-xs space-x-1">
              <ClipboardList className="w-3.5 h-3.5" />
              <span>Allot Work</span>
            </Button>
          </Link>
          <Link href="/teacher/doubts">
            <Button size="sm" variant="outline" className="text-xs">
              <HelpCircle className="w-3.5 h-3.5 mr-1 text-amber-500" />
              <span>Inbox ({openDoubtsCount})</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Class Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="bg-surface border-subtleBorder shadow-card">
          <CardContent className="p-4 text-center">
            <span className="text-[10px] uppercase font-bold text-textMuted block">{t.teacher.totalEnrolled}</span>
            <span className="text-2xl font-extrabold text-textMain font-mono">48</span>
          </CardContent>
        </Card>

        <Card className="border-[#F1D99A] bg-[#FFF9EC] shadow-card">
          <CardContent className="p-4 text-center">
            <span className="text-[10px] uppercase font-bold text-warning block">{t.teacher.needsAttention}</span>
            <span className="text-2xl font-extrabold text-warning font-mono">1</span>
          </CardContent>
        </Card>

        <Card className="bg-surface border-subtleBorder shadow-card">
          <CardContent className="p-4 text-center">
            <span className="text-[10px] uppercase font-bold text-textMuted block">{t.teacher.activeInterventions}</span>
            <span className="text-2xl font-extrabold text-purpleAccent font-mono">3</span>
          </CardContent>
        </Card>

        <Card className="bg-surface border-subtleBorder shadow-card">
          <CardContent className="p-4 text-center">
            <span className="text-[10px] uppercase font-bold text-textMuted block">{t.teacher.successRate}</span>
            <span className="text-2xl font-extrabold text-success font-mono">100%</span>
          </CardContent>
        </Card>
      </div>

      {/* Evidence-Based Students Needing Attention Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-textMain flex items-center">
            <AlertTriangle className="w-4 h-4 mr-1.5 text-warning" />
            <span>{t.teacher.signalsTitle}</span>
          </h2>
          <span className="text-[11px] text-textMuted">Classified by Diagnostic Engine</span>
        </div>

        <Card className="border-[#F1D99A] bg-[#FFF9EC] shadow-card">
          <CardHeader className="p-4 mb-2 flex flex-row items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-primary-light border border-primary/20 flex items-center justify-center font-bold text-sm text-primary">
                AS
              </div>
              <div>
                <CardTitle className="text-sm font-bold text-textMain">{aaravModel.studentName}</CardTitle>
                <p className="text-xs text-textSecondary">3rd Year CSE • ID: {aaravModel.studentId}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Badge variant="warning">NEEDS ATTENTION</Badge>
              <Link href={`/teacher/students/${aaravModel.studentId}`}>
                <Button size="sm" variant="outline" className="text-xs">
                  {t.teacher.inspectProfile}
                </Button>
              </Link>
            </div>
          </CardHeader>

          <CardContent className="p-4 pt-0 space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-surface border border-subtleBorder rounded-xl shadow-sm">
              <div>
                <span className="text-textMuted text-[10px] uppercase font-bold block">Observed Failure Reason</span>
                <span className="text-warning font-semibold text-xs">Repeated Binary Search boundary errors</span>
              </div>
              <div>
                <span className="text-textMuted text-[10px] uppercase font-bold block">Root Gap Identified</span>
                <span className="text-primary font-semibold text-xs">Array Indexing & Boundary Handling</span>
              </div>
              <div>
                <span className="text-textMuted text-[10px] uppercase font-bold block">Targeted Intervention</span>
                <span className="text-purpleAccent font-semibold text-xs">Prerequisite Repair: Boundary Invariants</span>
              </div>
            </div>

            {/* Before vs After Score Verification Table */}
            {aaravDiagnoses.length > 0 && (
              <div className="p-3 bg-surface border border-subtleBorder rounded-xl flex items-center justify-between text-xs font-mono shadow-sm">
                <div>
                  <span className="text-textMuted block text-[10px]">Before Score</span>
                  <span className="text-error font-bold text-sm">{aaravDiagnoses[0].beforeScore}%</span>
                </div>
                <ArrowRight className="w-4 h-4 text-success" />
                <div>
                  <span className="text-textMuted block text-[10px]">After Score</span>
                  <span className="text-success font-bold text-sm">{aaravDiagnoses[0].afterScore}%</span>
                </div>
                <div>
                  <span className="text-textMuted block text-[10px]">Intervention Verification</span>
                  <Badge variant="success" className="text-[10px]">
                    {aaravDiagnoses[0].verified ? 'VERIFIED IMPROVED (YES)' : 'PENDING'}
                  </Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Broadcast & Work Allotment Live Summaries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Recent Broadcasts */}
        <Card className="bg-surface border-subtleBorder shadow-card">
          <CardHeader className="p-4 border-b border-subtleBorder flex flex-row items-center justify-between">
            <div className="flex items-center space-x-2">
              <Radio className="w-4 h-4 text-primary" />
              <CardTitle className="text-sm font-bold text-textMain">Recent Announcements</CardTitle>
            </div>
            <Link href="/teacher/broadcast" className="text-xs text-primary font-semibold hover:underline">
              Manage Broadcasts →
            </Link>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            {broadcasts.slice(0, 2).map((b) => (
              <div key={b.id} className="p-3 bg-secondaryBg rounded-xl border border-subtleBorder space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-textMain">{b.title}</span>
                  <Badge variant={b.priority === 'URGENT' ? 'destructive' : 'info'} className="text-[9px]">
                    {b.priority}
                  </Badge>
                </div>
                <p className="text-[11px] text-textSecondary line-clamp-2">{b.message}</p>
                <div className="text-[10px] text-textMuted font-mono">Audience: {b.targetAudience}</div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Assigned Learning Tasks */}
        <Card className="bg-surface border-subtleBorder shadow-card">
          <CardHeader className="p-4 border-b border-subtleBorder flex flex-row items-center justify-between">
            <div className="flex items-center space-x-2">
              <ClipboardList className="w-4 h-4 text-purpleAccent" />
              <CardTitle className="text-sm font-bold text-textMain">Active Work Allotments</CardTitle>
            </div>
            <Link href="/teacher/allotment" className="text-xs text-primary font-semibold hover:underline">
              Manage Allotments →
            </Link>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            {workItems.slice(0, 2).map((w) => (
              <div key={w.id} className="p-3 bg-secondaryBg rounded-xl border border-subtleBorder space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-textMain">{w.title}</span>
                  <Badge variant="purple" className="text-[9px]">+{w.xpReward} XP</Badge>
                </div>
                <p className="text-[11px] text-textSecondary line-clamp-2">{w.description}</p>
                <div className="flex items-center justify-between text-[10px] text-textMuted font-mono">
                  <span>Type: {w.workType}</span>
                  <span>Due: {w.dueDate}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
