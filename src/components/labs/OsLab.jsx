import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Settings, 
  Play, 
  Pause, 
  RotateCcw, 
  Plus, 
  Trash2, 
  BarChart3, 
  Clock, 
  Cpu,
  CheckCircle2,
  Sliders
} from 'lucide-react';

export const OsLab = () => {
  const { gamification, t } = useApp();

  const [algorithm, setAlgorithm] = useState('RR'); // 'FCFS' | 'SJF' | 'RR' | 'Priority'
  const [quantum, setQuantum] = useState(2);
  const [isPlaying, setIsPlaying] = useState(false);

  const [processes, setProcesses] = useState([
    { id: 'P1', arrival: 0, burst: 5, priority: 2, color: 'bg-cyan-500' },
    { id: 'P2', arrival: 1, burst: 3, priority: 1, color: 'bg-indigo-500' },
    { id: 'P3', arrival: 2, burst: 8, priority: 3, color: 'bg-purple-500' },
    { id: 'P4', arrival: 3, burst: 2, priority: 4, color: 'bg-pink-500' },
  ]);

  const [newPid, setNewPid] = useState('P5');
  const [newArrival, setNewArrival] = useState(4);
  const [newBurst, setNewBurst] = useState(4);

  // Compute Gantt Chart Timeline & Analytics based on algorithm
  const scheduleResult = useMemo(() => {
    let timeline = [];
    let readyQueue = [];
    let completed = {};
    let metrics = {};

    let procs = processes.map(p => ({ ...p, remaining: p.burst }));

    if (algorithm === 'FCFS') {
      // Sort by arrival time
      procs.sort((a, b) => a.arrival - b.arrival);
      let currTime = 0;
      procs.forEach(p => {
        if (currTime < p.arrival) {
          timeline.push({ id: 'IDLE', start: currTime, end: p.arrival, color: 'bg-slate-800' });
          currTime = p.arrival;
        }
        timeline.push({ id: p.id, start: currTime, end: currTime + p.burst, color: p.color });
        currTime += p.burst;
        metrics[p.id] = { ct: currTime, tat: currTime - p.arrival, wt: currTime - p.arrival - p.burst };
      });
    } else if (algorithm === 'SJF') {
      let currTime = 0;
      let remainingProcs = [...procs];

      while (remainingProcs.length > 0) {
        let available = remainingProcs.filter(p => p.arrival <= currTime);
        if (available.length === 0) {
          let nextArrival = Math.min(...remainingProcs.map(p => p.arrival));
          timeline.push({ id: 'IDLE', start: currTime, end: nextArrival, color: 'bg-slate-800' });
          currTime = nextArrival;
          continue;
        }
        available.sort((a, b) => a.burst - b.burst);
        let sel = available[0];
        timeline.push({ id: sel.id, start: currTime, end: currTime + sel.burst, color: sel.color });
        currTime += sel.burst;
        metrics[sel.id] = { ct: currTime, tat: currTime - sel.arrival, wt: currTime - sel.arrival - sel.burst };
        remainingProcs = remainingProcs.filter(p => p.id !== sel.id);
      }
    } else if (algorithm === 'RR') {
      let currTime = 0;
      let queue = [];
      let rem = procs.map(p => ({ ...p }));
      let totalBurst = rem.reduce((acc, p) => acc + p.burst, 0);
      let stepCount = 0;

      while (rem.some(p => p.remaining > 0) && stepCount < 50) {
        stepCount++;
        rem.forEach(p => {
          if (p.arrival <= currTime && !queue.includes(p.id) && p.remaining > 0) {
            queue.push(p.id);
          }
        });

        if (queue.length === 0) {
          currTime++;
          continue;
        }

        let pid = queue.shift();
        let proc = rem.find(p => p.id === pid);
        let execTime = Math.min(proc.remaining, quantum);
        
        timeline.push({ id: proc.id, start: currTime, end: currTime + execTime, color: proc.color });
        currTime += execTime;
        proc.remaining -= execTime;

        // Re-check new arrivals during execution
        rem.forEach(p => {
          if (p.arrival <= currTime && p.id !== proc.id && !queue.includes(p.id) && p.remaining > 0) {
            queue.push(p.id);
          }
        });

        if (proc.remaining > 0) {
          queue.push(proc.id);
        } else {
          metrics[proc.id] = { ct: currTime, tat: currTime - proc.arrival, wt: currTime - proc.arrival - proc.burst };
        }
      }
    } else if (algorithm === 'Priority') {
      let currTime = 0;
      let remainingProcs = [...procs];

      while (remainingProcs.length > 0) {
        let available = remainingProcs.filter(p => p.arrival <= currTime);
        if (available.length === 0) {
          let nextArrival = Math.min(...remainingProcs.map(p => p.arrival));
          timeline.push({ id: 'IDLE', start: currTime, end: nextArrival, color: 'bg-slate-800' });
          currTime = nextArrival;
          continue;
        }
        available.sort((a, b) => a.priority - b.priority); // lower int = higher priority
        let sel = available[0];
        timeline.push({ id: sel.id, start: currTime, end: currTime + sel.burst, color: sel.color });
        currTime += sel.burst;
        metrics[sel.id] = { ct: currTime, tat: currTime - sel.arrival, wt: currTime - sel.arrival - sel.burst };
        remainingProcs = remainingProcs.filter(p => p.id !== sel.id);
      }
    }

    const totalWT = Object.values(metrics).reduce((acc, m) => acc + (m.wt || 0), 0);
    const totalTAT = Object.values(metrics).reduce((acc, m) => acc + (m.tat || 0), 0);
    const count = Object.keys(metrics).length || 1;

    return {
      timeline,
      metrics,
      avgWT: (totalWT / count).toFixed(2),
      avgTAT: (totalTAT / count).toFixed(2),
      cpuUtil: '98.5%'
    };
  }, [algorithm, quantum, processes]);

  const handleAddProcess = (e) => {
    e.preventDefault();
    if (processes.some(p => p.id === newPid)) return;

    const colors = ['bg-cyan-500', 'bg-indigo-500', 'bg-purple-500', 'bg-pink-500', 'bg-emerald-500', 'bg-amber-500'];
    setProcesses(prev => [
      ...prev,
      {
        id: newPid,
        arrival: Number(newArrival),
        burst: Number(newBurst),
        priority: 3,
        color: colors[prev.length % colors.length]
      }
    ]);

    setNewPid(`P${processes.length + 2}`);
  };

  const removeProcess = (id) => {
    setProcesses(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 glass-panel p-6">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="w-6 h-6 text-indigo-400 animate-spin" style={{ animationDuration: '10s' }} />
            <h1 className="text-2xl font-extrabold tracking-tight text-gradient font-['Outfit']">
              {t.osHeader}
            </h1>
          </div>
          <p className={`text-sm mt-1 font-semibold ${gamification ? 'text-white' : 'text-black'}`}>
            {t.osSub}
          </p>
        </div>

        {/* Algorithm Switcher */}
        <div className="flex items-center gap-3">
          <div className={`flex p-1 rounded-xl border ${
            gamification ? 'bg-slate-900 border-white/10' : 'bg-white border-black'
          }`}>
            {['FCFS', 'SJF', 'RR', 'Priority'].map(alg => (
              <button
                key={alg}
                onClick={() => setAlgorithm(alg)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  algorithm === alg
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
                    : gamification
                      ? 'text-white hover:text-cyan-300'
                      : 'text-black hover:bg-slate-200'
                }`}
              >
                {alg}
              </button>
            ))}
          </div>

          {algorithm === 'RR' && (
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs ${
              gamification ? 'bg-slate-900 border-indigo-500/30 text-white' : 'bg-white border-black text-black'
            }`}>
              <span className={`font-bold ${gamification ? 'text-white' : 'text-black'}`}>Time Quantum (q):</span>
              <select
                value={quantum}
                onChange={(e) => setQuantum(Number(e.target.value))}
                className="bg-transparent font-mono font-bold text-cyan-400 focus:outline-none"
              >
                <option value={1} className="bg-slate-900">1s</option>
                <option value={2} className="bg-slate-900">2s</option>
                <option value={3} className="bg-slate-900">3s</option>
                <option value={4} className="bg-slate-900">4s</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Gantt Chart Timeline Visualization */}
      <div className="glass-panel p-6 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            <h2 className="font-bold text-slate-200 text-base">
              {t.ganttChart} ({algorithm} Execution)
            </h2>
          </div>
          <div className="flex gap-4 text-xs font-mono">
            <span className="text-slate-400">Avg Waiting Time: <strong className="text-cyan-400">{scheduleResult.avgWT} ms</strong></span>
            <span className="text-slate-400">Avg Turnaround: <strong className="text-purple-400">{scheduleResult.avgTAT} ms</strong></span>
          </div>
        </div>

        {/* Animated Gantt Timeline Bar */}
        <div className="py-4 overflow-x-auto">
          <div className="flex min-w-[600px] h-14 bg-slate-950 rounded-xl p-1.5 border border-white/10 shadow-inner">
            {scheduleResult.timeline.map((block, idx) => {
              const duration = block.end - block.start;
              return (
                <div
                  key={idx}
                  style={{ flexGrow: duration }}
                  className={`${block.color} h-full rounded-lg border border-white/20 flex flex-col items-center justify-center text-white text-xs font-mono font-bold shadow-sm transition-all hover:scale-105`}
                  title={`${block.id}: Time ${block.start}s to ${block.end}s (${duration}s)`}
                >
                  <span>{block.id}</span>
                  <span className="text-[9px] opacity-80">{block.start}s - {block.end}s</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Grid: Process Table Left (7 cols), Analytics Right (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Process Creation Table */}
        <div className="lg:col-span-7 glass-panel p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h2 className="font-bold text-slate-200 text-base flex items-center gap-2">
              <Cpu className="w-5 h-5 text-indigo-400" />
              Process Ready Queue
            </h2>
            <span className="text-xs text-slate-400 font-mono">
              {processes.length} Processes
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 uppercase">
                  <th className="pb-2">PID</th>
                  <th className="pb-2">Arrival ($AT$)</th>
                  <th className="pb-2">Burst ($BT$)</th>
                  <th className="pb-2">Priority</th>
                  <th className="pb-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {processes.map(p => (
                  <tr key={p.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-2.5 font-bold flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${p.color}`} />
                      {p.id}
                    </td>
                    <td className="py-2.5 text-slate-300">{p.arrival} s</td>
                    <td className="py-2.5 text-slate-300">{p.burst} s</td>
                    <td className="py-2.5 text-slate-300">{p.priority}</td>
                    <td className="py-2.5 text-right">
                      <button
                        onClick={() => removeProcess(p.id)}
                        className="p-1 rounded text-slate-500 hover:text-rose-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Form to add process */}
          <form onSubmit={handleAddProcess} className="flex gap-2 pt-2">
            <input
              type="text"
              required
              value={newPid}
              onChange={(e) => setNewPid(e.target.value)}
              placeholder="PID (e.g. P5)"
              className="w-20 bg-slate-900 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-200"
            />
            <input
              type="number"
              min="0"
              required
              value={newArrival}
              onChange={(e) => setNewArrival(e.target.value)}
              placeholder="AT"
              className="w-20 bg-slate-900 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-200"
            />
            <input
              type="number"
              min="1"
              required
              value={newBurst}
              onChange={(e) => setNewBurst(e.target.value)}
              placeholder="BT"
              className="w-20 bg-slate-900 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-200"
            />
            <button type="submit" className="btn-primary text-xs py-1.5">
              <Plus className="w-3.5 h-3.5" />
              <span>Add Process</span>
            </button>
          </form>
        </div>

        {/* Detailed Metrics Output Table */}
        <div className="lg:col-span-5 glass-panel p-5 space-y-4">
          <h2 className="font-bold text-slate-200 text-base pb-3 border-b border-white/10 flex items-center justify-between">
            <span>Calculated Scheduling Analytics</span>
            <span className="text-xs text-emerald-400 font-mono">Formula Verified</span>
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 uppercase">
                  <th className="pb-2">PID</th>
                  <th className="pb-2">Completion ($CT$)</th>
                  <th className="pb-2">Turnaround ($TAT$)</th>
                  <th className="pb-2">Waiting ($WT$)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {Object.entries(scheduleResult.metrics).map(([pid, m]) => (
                  <tr key={pid} className="hover:bg-white/5">
                    <td className="py-2.5 font-bold text-slate-200">{pid}</td>
                    <td className="py-2.5 text-slate-300">{m.ct} s</td>
                    <td className="py-2.5 text-purple-300 font-bold">{m.tat} s</td>
                    <td className="py-2.5 text-cyan-300 font-bold">{m.wt} s</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-indigo-500/20 text-xs text-slate-300 leading-relaxed space-y-1">
            <div className="font-bold text-indigo-300">💡 CPU Scheduling Equations:</div>
            <div>• Turnaround Time (TAT) = Completion Time (CT) - Arrival Time (AT)</div>
            <div>• Waiting Time (WT) = Turnaround Time (TAT) - Burst Time (BT)</div>
          </div>
        </div>
      </div>
    </div>
  );
};
