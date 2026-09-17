import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useGamification } from '../../../context/GamificationContext';
import { storageService } from '../../../services/storage';
import { Play, RotateCcw, Zap, Layers, AlertCircle, CheckCircle2 } from 'lucide-react';

interface Process {
  id: string;
  name: string;
  arrivalTime: number;
  burstTime: number;
  color: string;
}

const DEFAULT_PROCESSES: Process[] = [
  { id: 'p1', name: 'P1 (Database Query)', arrivalTime: 0, burstTime: 8, color: '#3B82F6' },
  { id: 'p2', name: 'P2 (Auth Check)', arrivalTime: 1, burstTime: 2, color: '#10B981' },
  { id: 'p3', name: 'P3 (Cache Lookup)', arrivalTime: 2, burstTime: 3, color: '#8B5CF6' }
];

export const OSSimulator: React.FC = () => {
  const { currentUser } = useAuth();
  const { awardXP } = useGamification();

  const [algorithm, setAlgorithm] = useState<'FCFS' | 'SJF' | 'RR'>('FCFS');
  const [quantum, setQuantum] = useState<number>(2);
  const [processes] = useState<Process[]>(DEFAULT_PROCESSES);

  // Calculate Gantt Chart and Metrics
  const calculateSchedule = () => {
    let currentTime = 0;
    const gantt: Array<{ processName: string; start: number; end: number; color: string }> = [];
    const metrics: Record<string, { ct: number; tat: number; wt: number }> = {};

    if (algorithm === 'FCFS') {
      // Sort by arrival
      const sorted = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
      for (const p of sorted) {
        if (currentTime < p.arrivalTime) currentTime = p.arrivalTime;
        const start = currentTime;
        const end = currentTime + p.burstTime;
        currentTime = end;
        gantt.push({ processName: p.name.split(' ')[0], start, end, color: p.color });
        const tat = end - p.arrivalTime;
        const wt = tat - p.burstTime;
        metrics[p.id] = { ct: end, tat, wt };
      }
    } else if (algorithm === 'SJF') {
      // Non-preemptive Shortest Job First
      const ready = [...processes];
      while (ready.length > 0) {
        const available = ready.filter(p => p.arrivalTime <= currentTime);
        const nextProcess = (available.length > 0 ? available : ready).sort((a, b) => a.burstTime - b.burstTime)[0];
        const idx = ready.findIndex(p => p.id === nextProcess.id);
        ready.splice(idx, 1);

        if (currentTime < nextProcess.arrivalTime) currentTime = nextProcess.arrivalTime;
        const start = currentTime;
        const end = currentTime + nextProcess.burstTime;
        currentTime = end;
        gantt.push({ processName: nextProcess.name.split(' ')[0], start, end, color: nextProcess.color });
        const tat = end - nextProcess.arrivalTime;
        const wt = tat - nextProcess.burstTime;
        metrics[nextProcess.id] = { ct: end, tat, wt };
      }
    } else {
      // Simple Round Robin
      let remaining = processes.map(p => ({ ...p, rem: p.burstTime }));
      let queue = remaining.filter(p => p.arrivalTime <= currentTime);
      while (remaining.some(p => p.rem > 0)) {
        if (queue.length === 0) {
          currentTime++;
          queue = remaining.filter(p => p.arrivalTime <= currentTime && p.rem > 0);
          continue;
        }
        const curr = queue.shift()!;
        const execTime = Math.min(quantum, curr.rem);
        const start = currentTime;
        const end = currentTime + execTime;
        currentTime = end;
        curr.rem -= execTime;
        gantt.push({ processName: curr.name.split(' ')[0], start, end, color: curr.color });

        // Add newly arrived
        const newlyArrived = remaining.filter(p => p.arrivalTime <= currentTime && p.rem > 0 && !queue.some(q => q.id === p.id) && p.id !== curr.id);
        queue.push(...newlyArrived);
        if (curr.rem > 0) queue.push(curr);
        else {
          const tat = end - curr.arrivalTime;
          const wt = tat - curr.burstTime;
          metrics[curr.id] = { ct: end, tat, wt };
        }
      }
    }

    const avgWT = Object.values(metrics).reduce((acc, m) => acc + m.wt, 0) / processes.length;
    const avgTAT = Object.values(metrics).reduce((acc, m) => acc + m.tat, 0) / processes.length;

    return { gantt, metrics, avgWT: avgWT.toFixed(2), avgTAT: avgTAT.toFixed(2) };
  };

  const schedule = calculateSchedule();

  const handleSimulate = () => {
    storageService.recordLearningEvent({
      studentId: currentUser?.id || 'student_aarav_01',
      subjectId: 'os',
      conceptId: 'os_cpu_scheduling_fcfs',
      eventType: 'simulation_passed',
      evidence: { algorithm, avgWT: schedule.avgWT }
    });
    awardXP(80, 'labXP', `Simulated ${algorithm} CPU Schedule`);
  };

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
              CS403 • Kernel Simulator
            </span>
            <span className="text-xs text-slate-400 font-semibold">Gantt Visualizer & Convoy Effect</span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 font-heading mt-0.5">
            Process Scheduling Heuristics & Metrics
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            {(['FCFS', 'SJF', 'RR'] as const).map(algo => (
              <button
                key={algo}
                type="button"
                onClick={() => setAlgorithm(algo)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  algorithm === algo ? 'bg-white text-emerald-700 shadow-xs font-bold' : 'text-slate-600'
                }`}
              >
                {algo}
              </button>
            ))}
          </div>

          {algorithm === 'RR' && (
            <div className="flex items-center gap-1.5 text-xs font-semibold px-2 py-1 bg-slate-50 border rounded-xl">
              <span>Time Slice (q):</span>
              <input
                type="number"
                min="1"
                max="10"
                value={quantum}
                onChange={e => setQuantum(Number(e.target.value) || 1)}
                className="w-10 text-center font-bold border rounded"
              />
            </div>
          )}

          <button
            type="button"
            onClick={handleSimulate}
            className="flex items-center gap-1 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Simulate</span>
          </button>
        </div>
      </div>

      {/* Convoy Effect Warning Banner if FCFS */}
      {algorithm === 'FCFS' && (
        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <p>
            <strong>Convoy Effect Observation:</strong> Notice how P2 (Burst: 2ms) and P3 (Burst: 3ms) are forced to wait 8ms while P1 completes. Switching to <strong>SJF</strong> drastically reduces average waiting time!
          </p>
        </div>
      )}

      {/* Gantt Chart Display */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Live CPU Execution Timeline (Gantt Chart)</h3>
        
        <div className="flex w-full h-14 rounded-xl overflow-hidden border border-slate-300">
          {schedule.gantt.map((slot, idx) => {
            const duration = slot.end - slot.start;
            const totalDuration = schedule.gantt[schedule.gantt.length - 1]?.end || 13;
            const widthPercent = (duration / totalDuration) * 100;
            return (
              <div
                key={idx}
                style={{ width: `${widthPercent}%`, backgroundColor: slot.color }}
                className="h-full flex flex-col items-center justify-center text-white font-bold text-xs border-r border-white/20 transition-all hover:brightness-110"
                title={`${slot.processName}: [${slot.start}ms - ${slot.end}ms]`}
              >
                <span>{slot.processName}</span>
                <span className="text-[10px] opacity-80">{duration}ms</span>
              </div>
            );
          })}
        </div>

        {/* Time markers */}
        <div className="flex justify-between text-[11px] font-mono text-slate-400 px-1">
          <span>0ms</span>
          <span>End: {schedule.gantt[schedule.gantt.length - 1]?.end || 0}ms</span>
        </div>
      </div>

      {/* Metric Table */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          <div className="p-3 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-700">
            Process Execution Metrics
          </div>
          <div className="divide-y divide-slate-100 text-xs">
            <div className="grid grid-cols-5 p-2.5 font-bold text-slate-500 bg-slate-50/50">
              <span>Process</span>
              <span>Arrival</span>
              <span>Burst</span>
              <span>TAT</span>
              <span>Wait Time</span>
            </div>
            {processes.map(p => {
              const m = schedule.metrics[p.id] || { ct: 0, tat: 0, wt: 0 };
              return (
                <div key={p.id} className="grid grid-cols-5 p-2.5 items-center font-mono">
                  <span className="font-bold text-slate-800">{p.name}</span>
                  <span>{p.arrivalTime}ms</span>
                  <span>{p.burstTime}ms</span>
                  <span className="text-indigo-600 font-bold">{m.tat}ms</span>
                  <span className="text-emerald-600 font-bold">{m.wt}ms</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs flex flex-col justify-center space-y-3">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Averages</div>
          <div>
            <div className="text-xs text-slate-500">Average Waiting Time</div>
            <div className="text-2xl font-bold text-emerald-600 font-mono">{schedule.avgWT} ms</div>
          </div>
          <div>
            <div className="text-xs text-slate-500">Average Turnaround Time</div>
            <div className="text-2xl font-bold text-indigo-600 font-mono">{schedule.avgTAT} ms</div>
          </div>
        </div>
      </div>
    </div>
  );
};
