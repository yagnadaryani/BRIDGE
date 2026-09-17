'use client';

import React from 'react';
import { FileCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockStore } from '@/lib/firebase/mockStore';

export default function ClassInterventionsPage() {
  const diagnoses = mockStore.getDiagnoses();

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
        <div className="flex items-center space-x-2">
          <FileCheck className="w-6 h-6 text-purple-400" />
          <h1 className="text-xl font-bold text-slate-100">Class Interventions & Verification Log</h1>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Complete log of diagnostic interventions, prerequisite repairs, and before vs after score verifications.
        </p>
      </div>

      <div className="space-y-3">
        {diagnoses.map((d) => (
          <Card key={d.id} className="bg-slate-900 border-slate-800">
            <CardHeader className="p-4 mb-2 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold text-slate-100">{d.title}</CardTitle>
                <p className="text-xs text-slate-400">Student ID: {d.studentId} • Concept: {d.conceptId}</p>
              </div>
              <Badge variant={d.verified ? 'success' : 'warning'}>
                {d.verified ? 'VERIFIED CLOSED' : 'IN PROGRESS'}
              </Badge>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-3 text-xs">
              <p className="text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-800">
                {d.explanation}
              </p>

              <div className="flex items-center justify-between p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block font-bold">Initial Score</span>
                  <span className="text-red-400 font-bold text-sm">{d.beforeScore}%</span>
                </div>
                <ArrowRight className="w-4 h-4 text-emerald-400" />
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block font-bold">Verified Post-Repair</span>
                  <span className="text-emerald-400 font-bold text-sm">{d.afterScore}%</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block font-bold">Intervention Type</span>
                  <Badge variant="purple" className="text-[10px]">{d.recommendedIntervention}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
