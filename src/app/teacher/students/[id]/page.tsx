'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, User, TrendingUp, AlertTriangle, CheckCircle2, ShieldCheck, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PerformanceView } from '@/components/performance/PerformanceView';
import { mockStore } from '@/lib/firebase/mockStore';

export default function DetailedStudentProfilePage() {
  const params = useParams();
  const studentId = (params?.id as string) || 'aarav-101';
  const model = mockStore.getLearnerModel(studentId);
  const diagnoses = mockStore.getDiagnoses(studentId);
  const events = mockStore.getEvents(studentId);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Link href="/teacher">
          <Button size="sm" variant="ghost" className="text-xs">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
          </Button>
        </Link>
      </div>

      {/* Student Profile Banner */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center font-bold text-lg text-indigo-300">
            AS
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-100">{model.studentName}</h1>
            <p className="text-xs text-slate-400">Student ID: {model.studentId} • CSE Department</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Overall Mastery</span>
            <span className="text-xl font-bold text-indigo-400 font-mono">{model.overallMastery}%</span>
          </div>
          <Badge variant={model.rootGaps.length > 0 ? 'warning' : 'success'}>
            {model.rootGaps.length > 0 ? 'Active Gap' : 'Healthy Progress'}
          </Badge>
        </div>
      </div>

      {/* Structured Diagnostic Answers for Teacher */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4 space-y-1">
            <span className="text-[10px] uppercase font-bold text-amber-400 block">1. WHAT is student struggling with?</span>
            <span className="text-xs font-semibold text-slate-200 block">Binary Search Boundary Handling</span>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4 space-y-1">
            <span className="text-[10px] uppercase font-bold text-indigo-400 block">2. WHY? (Root Gap)</span>
            <span className="text-xs font-semibold text-slate-200 block">Zero-Indexed Array Pointer Invariants</span>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4 space-y-1">
            <span className="text-[10px] uppercase font-bold text-purple-400 block">3. WHAT Intervention happened?</span>
            <span className="text-xs font-semibold text-slate-200 block">Targeted Prerequisite Repair Activity</span>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4 space-y-1">
            <span className="text-[10px] uppercase font-bold text-emerald-400 block">4. DID it work?</span>
            <span className="text-xs font-semibold text-emerald-300 block">YES! Verified (42% → 88%)</span>
          </CardContent>
        </Card>
      </div>

      {/* Multidimensional Intelligence View */}
      <PerformanceView studentId={studentId} />
    </div>
  );
}
