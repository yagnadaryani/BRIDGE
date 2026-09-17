'use client';

import React from 'react';
import { TrendingUp, AlertTriangle, CheckCircle2, ShieldAlert, Award } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { mockStore } from '@/lib/firebase/mockStore';
import { getCurrentSessionUser } from '@/lib/firebase/auth';

interface PerformanceViewProps {
  studentId?: string;
  subjectId?: string;
}

export function PerformanceView({ studentId, subjectId }: PerformanceViewProps) {
  const currentUser = getCurrentSessionUser();
  const targetStudentId = studentId || currentUser?.id || 'aarav-101';
  const learnerModel = mockStore.getLearnerModel(targetStudentId);
  const diagnoses = mockStore.getDiagnoses(targetStudentId);

  return (
    <div className="space-y-4">
      {/* Overview Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <Card className="bg-surface border-subtleBorder shadow-card">
          <CardContent className="p-4 text-center">
            <span className="text-[10px] uppercase font-bold text-textMuted block">Overall Mastery</span>
            <span className="text-2xl font-extrabold text-primary font-mono">{learnerModel.overallMastery}%</span>
          </CardContent>
        </Card>

        <Card className="bg-surface border-subtleBorder shadow-card">
          <CardContent className="p-4 text-center">
            <span className="text-[10px] uppercase font-bold text-textMuted block">Application Ability</span>
            <span className="text-2xl font-extrabold text-emerald-600 font-mono">{learnerModel.applicationScore}%</span>
          </CardContent>
        </Card>

        <Card className="bg-surface border-subtleBorder shadow-card">
          <CardContent className="p-4 text-center">
            <span className="text-[10px] uppercase font-bold text-textMuted block">Debugging Score</span>
            <span className="text-2xl font-extrabold text-purpleAccent font-mono">{learnerModel.debuggingScore}%</span>
          </CardContent>
        </Card>

        <Card className="bg-surface border-subtleBorder shadow-card">
          <CardContent className="p-4 text-center">
            <span className="text-[10px] uppercase font-bold text-textMuted block">Confidence Calibration</span>
            <span className="text-2xl font-extrabold text-amber-600 font-mono">{learnerModel.confidenceCalibration}</span>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

        {/* Concept Mastery Breakdown (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <Card>
            <CardHeader className="p-3 mb-2">
              <CardTitle className="text-xs font-bold text-textMain">Concept Mastery Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0 space-y-3">
              {Object.entries(learnerModel.conceptMastery).map(([conceptId, mastery]) => (
                <div key={conceptId} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-textMain">
                    <span>{conceptId.split('-').slice(1).join(' ').toUpperCase()}</span>
                    <span className="font-mono text-primary font-bold">{mastery.masteryScore}%</span>
                  </div>
                  <Progress value={mastery.masteryScore} colorClass={mastery.masteryScore < 50 ? 'bg-amber-500' : 'bg-primary'} />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Diagnostic Intervention History (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <Card>
            <CardHeader className="p-3 mb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-bold text-textMain">Verified Intervention History</CardTitle>
              <Badge variant="success">Evidence-Based</Badge>
            </CardHeader>
            <CardContent className="p-3 pt-0 space-y-2">
              {diagnoses.map((diag) => (
                <div key={diag.id} className="p-3 bg-secondaryBg border border-subtleBorder rounded-xl space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-textMain">{diag.title}</span>
                    <Badge variant={diag.verified ? 'success' : 'warning'} className="text-[9px]">
                      {diag.verified ? 'VERIFIED CLOSED' : 'IN PROGRESS'}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-textSecondary">{diag.explanation}</p>
                  <div className="flex items-center justify-between text-[11px] text-textMain font-mono pt-1">
                    <span>Before: <strong className="text-rose-600">{diag.beforeScore}%</strong></span>
                    <span>→</span>
                    <span>After: <strong className="text-emerald-600">{diag.afterScore ?? 'Pending'}%</strong></span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
