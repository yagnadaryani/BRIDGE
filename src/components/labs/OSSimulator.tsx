'use client';

import React, { useState } from 'react';
import { Cpu, Play, BarChart3, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Process {
  id: string;
  name: string;
  arrivalTime: number;
  burstTime: number;
  priority: number;
  color: string;
}

const DEFAULT_PROCESSES: Process[] = [
  { id: 'p1', name: 'P1 (Compiler)', arrivalTime: 0, burstTime: 10, priority: 2, color: 'bg-indigo-50 border-indigo-300 text-indigo-900' },
  { id: 'p2', name: 'P2 (Text Editor)', arrivalTime: 1, burstTime: 4, priority: 1, color: 'bg-emerald-50 border-emerald-300 text-emerald-900' },
  { id: 'p3', name: 'P3 (Web Server)', arrivalTime: 2, burstTime: 6, priority: 3, color: 'bg-purple-50 border-purple-300 text-purple-900' },
  { id: 'p4', name: 'P4 (Audio Stream)', arrivalTime: 3, burstTime: 2, priority: 4, color: 'bg-amber-50 border-amber-300 text-amber-900' },
];

export function OSSimulator() {
  const [algorithm, setAlgorithm] = useState<'FCFS' | 'SJF' | 'RR'>('RR');
  const [timeQuantum, setTimeQuantum] = useState<number>(4);
  const [processes, setProcesses] = useState<Process[]>(DEFAULT_PROCESSES);

  const computeSchedule = () => {
    let gantt: { processName: string; duration: number; color: string; startTime: number; endTime: number }[] = [];
    let currentTime = 0;
    let turnarounds: Record<string, number> = {};
    let waitings: Record<string, number> = {};

    if (algorithm === 'FCFS') {
      const sorted = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
      sorted.forEach((p) => {
        if (currentTime < p.arrivalTime) currentTime = p.arrivalTime;
        const start = currentTime;
        const end = currentTime + p.burstTime;
        gantt.push({ processName: p.name, duration: p.burstTime, color: p.color, startTime: start, endTime: end });
        turnarounds[p.id] = end - p.arrivalTime;
        waitings[p.id] = turnarounds[p.id] - p.burstTime;
        currentTime = end;
      });
    } else if (algorithm === 'SJF') {
      const sorted = [...processes].sort((a, b) => a.burstTime - b.burstTime);
      sorted.forEach((p) => {
        if (currentTime < p.arrivalTime) currentTime = p.arrivalTime;
        const start = currentTime;
        const end = currentTime + p.burstTime;
        gantt.push({ processName: p.name, duration: p.burstTime, color: p.color, startTime: start, endTime: end });
        turnarounds[p.id] = end - p.arrivalTime;
        waitings[p.id] = turnarounds[p.id] - p.burstTime;
        currentTime = end;
      });
    } else if (algorithm === 'RR') {
      let remBurst = processes.reduce((acc, p) => ({ ...acc, [p.id]: p.burstTime }), {} as Record<string, number>);
      let queue = [...processes];
      let completed = 0;

      while (completed < processes.length) {
        let executedInPass = false;
        for (let p of queue) {
          if (remBurst[p.id] > 0) {
            executedInPass = true;
            const runTime = Math.min(remBurst[p.id], timeQuantum);
            const start = currentTime;
            const end = currentTime + runTime;
            gantt.push({ processName: p.name.split(' ')[0], duration: runTime, color: p.color, startTime: start, endTime: end });
            currentTime = end;
            remBurst[p.id] -= runTime;

            if (remBurst[p.id] === 0) {
              completed++;
              turnarounds[p.id] = end - p.arrivalTime;
              waitings[p.id] = turnarounds[p.id] - p.burstTime;
            }
          }
        }
        if (!executedInPass) currentTime++;
      }
    }

    const avgTAT = (Object.values(turnarounds).reduce((a, b) => a + b, 0) / processes.length).toFixed(1);
    const avgWT = (Object.values(waitings).reduce((a, b) => a + b, 0) / processes.length).toFixed(1);

    return { gantt, avgTAT, avgWT };
  };

  const { gantt, avgTAT, avgWT } = computeSchedule();

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface border border-subtleBorder p-4 rounded-card shadow-card">
        <div>
          <div className="flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-purpleAccent" />
            <h2 className="text-base font-bold text-textMain">OS Simulator: CPU Process Scheduling</h2>
            <Badge variant="purple">Preemptive & Non-preemptive</Badge>
          </div>
          <p className="text-xs text-textSecondary mt-1">
            Simulate FCFS, SJF, and Round Robin scheduling algorithms. Inspect real-time Gantt charts and turnaround metrics.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {(['RR', 'FCFS', 'SJF'] as const).map((alg) => (
            <Button
              key={alg}
              size="sm"
              variant={algorithm === alg ? 'accent' : 'outline'}
              onClick={() => setAlgorithm(alg)}
              className="text-xs py-1 px-3"
            >
              {alg}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

        {/* Process Queue Input (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <Card>
            <CardHeader className="p-3 mb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-bold text-textMain">Process Ready Queue</CardTitle>
              {algorithm === 'RR' && (
                <div className="text-[11px] text-textSecondary font-mono">
                  Time Quantum TQ: <span className="font-bold text-purpleAccent">{timeQuantum}ms</span>
                </div>
              )}
            </CardHeader>
            <CardContent className="p-3 pt-0 space-y-2">
              {processes.map((p) => (
                <div key={p.id} className="p-2.5 bg-secondaryBg border border-subtleBorder rounded-xl flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-textMain">{p.name}</span>
                  <div className="flex items-center space-x-3 text-textSecondary text-[11px]">
                    <span>Arr: {p.arrivalTime}ms</span>
                    <span>Burst: {p.burstTime}ms</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-surface border-subtleBorder">
            <CardHeader className="p-3 mb-2">
              <CardTitle className="text-xs font-bold text-textMain">Performance Metrics Comparison</CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0 grid grid-cols-2 gap-3 text-center">
              <div className="p-3 bg-secondaryBg border border-subtleBorder rounded-xl">
                <span className="text-[10px] text-textMuted block uppercase font-bold">Avg Turnaround Time</span>
                <span className="text-lg font-bold text-purpleAccent font-mono">{avgTAT} ms</span>
              </div>
              <div className="p-3 bg-secondaryBg border border-subtleBorder rounded-xl">
                <span className="text-[10px] text-textMuted block uppercase font-bold">Avg Waiting Time</span>
                <span className="text-lg font-bold text-primary font-mono">{avgWT} ms</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live Gantt Chart Renderer (7 cols) */}
        <div className="lg:col-span-7 bg-surface border border-subtleBorder rounded-card p-5 space-y-4 shadow-card">
          <div className="flex items-center justify-between border-b border-subtleBorder pb-2">
            <h3 className="text-xs font-bold text-textMain flex items-center">
              <BarChart3 className="w-4 h-4 mr-1.5 text-purpleAccent" /> Gantt Chart Timeline View ({algorithm})
            </h3>
            <span className="text-[10px] text-textMuted font-mono">Time Units (ms)</span>
          </div>

          <div className="py-4 overflow-x-auto">
            <div className="flex items-center space-x-1 min-w-[500px]">
              {gantt.map((block, idx) => (
                <div
                  key={idx}
                  className={`h-14 rounded-xl border p-2 flex flex-col items-center justify-between text-xs font-mono transition-all hover:scale-105 shadow-sm ${block.color}`}
                  style={{ flex: block.duration }}
                >
                  <span className="font-bold text-[11px] truncate">{block.processName}</span>
                  <span className="text-[9px] opacity-90 font-semibold">{block.startTime}-{block.endTime}ms</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-[11px] text-textSecondary leading-relaxed bg-secondaryBg p-3 rounded-xl border border-subtleBorder">
            {algorithm === 'RR' && 'Round Robin allocates CPU time slices (TQ=4ms) cyclically, ensuring fair CPU access without process starvation.'}
            {algorithm === 'FCFS' && 'First-Come First-Served executes processes strictly in arrival order. Long burst times cause the Convoy Effect.'}
            {algorithm === 'SJF' && 'Shortest Job First schedules the process with minimum CPU burst time, achieving optimal average waiting time.'}
          </p>

        </div>

      </div>
    </div>
  );
}
