'use client';

import React, { useState } from 'react';
import { TrendingUp, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/shell/Navbar';
import { Sidebar } from '@/components/shell/Sidebar';
import { AIAssistantDrawer } from '@/components/ai/AIAssistantDrawer';
import { PerformanceView } from '@/components/performance/PerformanceView';
import { mockStore } from '@/lib/firebase/mockStore';
import { getCurrentSessionUser } from '@/lib/firebase/auth';

export default function LearnerProgressPage() {
  const [isAiOpen, setIsAiOpen] = useState(false);
  const currentUser = getCurrentSessionUser();
  const studentId = currentUser?.id || 'aarav-101';
  const model = mockStore.getLearnerModel(studentId);

  const growthSteps = [
    { title: '1. Code Attempt Submitted', desc: 'Submitted Binary Search code with boundary pointer `high = arr.length`.', status: 'FAILED' },
    { title: '2. Learning Evidence Logged', desc: 'Event engine recorded boundary failure & infinite loop potential.', status: 'EVIDENCE' },
    { title: '3. Root-Cause Diagnosis', desc: 'Prerequisite Detective identified gap in Array Indexing & Boundary Handling.', status: 'DIAGNOSED' },
    { title: '4. Targeted Intervention', desc: 'Presented boundary invariant repair exercise & contrast code example.', status: 'INTERVENTION' },
    { title: '5. Student Retry Attempt', desc: 'Corrected boundary pointer to `high = arr.length - 1` and resubmitted.', status: 'RETRY' },
    { title: '6. Improvement Verified!', desc: 'Before Score 42% → After Score 88%. Learner model updated & +150 XP awarded!', status: 'VERIFIED' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar onOpenAIAssistant={() => setIsAiOpen(true)} />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-6 h-6 text-indigo-400" />
              <h1 className="text-xl font-bold text-slate-100">Growth Replay & Learner Intelligence Model</h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Inspect your verified learning journey timeline from initial boundary misconception to verified mastery.
            </p>
          </div>

          {/* Growth Replay Timeline */}
          <Card>
            <CardHeader className="p-4 mb-2">
              <CardTitle className="text-sm font-bold text-slate-100">End-to-End Growth Replay Timeline</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-3">
              <div className="relative border-l-2 border-slate-800 pl-6 space-y-4 ml-2">
                {growthSteps.map((step, idx) => (
                  <div key={idx} className="relative">
                    <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-indigo-600 border-2 border-slate-950 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    </div>
                    <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-200">{step.title}</span>
                        <Badge variant={step.status === 'VERIFIED' ? 'success' : step.status === 'FAILED' ? 'destructive' : 'info'} className="text-[9px]">
                          {step.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-400">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Persistent Learner Model Breakdown */}
          <PerformanceView />
        </main>
      </div>

      <AIAssistantDrawer isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />
    </div>
  );
}
