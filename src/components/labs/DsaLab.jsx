import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Code2, 
  RotateCcw, 
  SkipForward, 
  SkipBack, 
  BarChart2,
  AlertCircle
} from 'lucide-react';

export const DsaLab = () => {
  const { gamification, t } = useApp();

  const [algo, setAlgo] = useState('bubble');
  const [stepIndex, setStepIndex] = useState(0);

  const bubbleSteps = [
    { 
      arr: [5, 2, 8, 1], 
      active: [0, 1], 
      line: 3, 
      action: 'Compare [5] & [2]',
      desc: 'Comparing element arr[0] (5) and arr[1] (2). Since 5 > 2, a swap is performed.',
      visualTrace: '[5] [2] [8] [1]  ➔  Compare (5 > 2)  ➔  Swap!' 
    },
    { 
      arr: [2, 5, 8, 1], 
      active: [1, 2], 
      line: 4, 
      action: 'Compare [5] & [8]',
      desc: 'Swapped to [2, 5, 8, 1]. Comparing arr[1] (5) and arr[2] (8). Since 5 < 8, no swap needed.',
      visualTrace: '[2] [5] [8] [1]  ➔  Compare (5 < 8)  ➔  Keep Order' 
    },
    { 
      arr: [2, 5, 8, 1], 
      active: [2, 3], 
      line: 3, 
      action: 'Compare [8] & [1]',
      desc: 'Comparing arr[2] (8) and arr[3] (1). Since 8 > 1, a swap is performed.',
      visualTrace: '[2] [5] [8] [1]  ➔  Compare (8 > 1)  ➔  Swap!' 
    },
    { 
      arr: [2, 5, 1, 8], 
      active: [3], 
      line: 6, 
      action: 'Element [8] Placed',
      desc: 'Element 8 has bubbled to its final sorted position at index 3.',
      visualTrace: '[2] [5] [1] [8]  ➔  8 is in final position!' 
    },
    { 
      arr: [2, 1, 5, 8], 
      active: [1, 2], 
      line: 4, 
      action: 'Pass 2 Swap',
      desc: 'Comparing arr[0] and arr[1]. Swapped 2 and 1.',
      visualTrace: '[2] [1] [5] [8]  ➔  Swap (2 > 1)' 
    },
    { 
      arr: [1, 2, 5, 8], 
      active: [0, 1, 2, 3], 
      line: 7, 
      action: 'Sorting Complete',
      desc: 'Array is fully sorted in ascending order: [1, 2, 5, 8].',
      visualTrace: '[1] [2] [5] [8]  ➔  Fully Sorted!' 
    }
  ];

  const currentStepData = bubbleSteps[stepIndex] || bubbleSteps[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 glass-panel p-6">
        <div>
          <div className="flex items-center gap-2">
            <Code2 className="w-6 h-6 text-cyan-400" />
            <h1 className="text-2xl font-extrabold tracking-tight text-gradient font-['Outfit']">
              {t.dsaHeader}
            </h1>
          </div>
          <p className={`text-sm mt-1 font-semibold ${gamification ? 'text-white' : 'text-black'}`}>
            Interactive visual algorithmic code workspace with line-by-line pointer execution & AI error diagnosis.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={algo}
            onChange={(e) => {
              setAlgo(e.target.value);
              setStepIndex(0);
            }}
            className={`rounded-xl px-4 py-2 text-xs font-mono font-bold focus:outline-none ${
              gamification
                ? 'bg-slate-900 border border-white/10 text-white focus:border-cyan-500'
                : 'bg-white border border-black text-black focus:border-cyan-700'
            }`}
          >
            <option value="bubble">📊 Bubble Sort (Animated Trace)</option>
            <option value="bst">🌳 Binary Search Tree (BST)</option>
          </select>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Visual Canvas Left (7 cols) */}
        <div className="lg:col-span-7 glass-panel p-5 flex flex-col justify-between min-h-[500px]">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <span className="text-xs font-bold uppercase text-slate-300 flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-cyan-400" />
              Visual Pointer Trace Canvas
            </span>
            <span className="text-xs font-mono text-cyan-400">
              Step {stepIndex + 1} / {bubbleSteps.length}
            </span>
          </div>

          {/* Visual Execution Pointer Box */}
          <div className="my-auto py-8 px-4 bg-slate-950 rounded-2xl border border-indigo-500/20 flex flex-col items-center justify-center gap-6 min-h-[240px] shadow-inner">
            {/* Visual Pointer Trace Text Banner */}
            <div className="text-xs font-mono font-bold text-cyan-300 bg-cyan-500/10 px-4 py-2 rounded-xl border border-cyan-500/30">
              {currentStepData.visualTrace}
            </div>

            {/* Render Array Nodes with Pointer Highlight */}
            <div className="flex items-center justify-center gap-4">
              {currentStepData.arr.map((val, idx) => {
                const isActive = currentStepData.active.includes(idx);
                return (
                  <div key={idx} className="flex flex-col items-center gap-2">
                    <span className={`text-[11px] font-mono font-bold ${isActive ? 'text-cyan-400' : 'text-slate-600'}`}>
                      {isActive ? '↓ Compare' : ''}
                    </span>
                    <div
                      className={`w-14 h-16 rounded-2xl font-mono font-extrabold text-xl flex items-center justify-center shadow-lg transition-all duration-300 ${
                        isActive
                          ? 'bg-gradient-to-tr from-cyan-500 to-indigo-600 text-slate-950 scale-110 shadow-cyan-500/40 ring-4 ring-cyan-400/30'
                          : 'bg-slate-900 border border-white/10 text-slate-300'
                      }`}
                    >
                      {val}
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">[{idx}]</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-3 pt-3 border-t border-white/10">
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/80 p-3 rounded-xl border border-cyan-500/20">
              💡 <strong>Step Action:</strong> {currentStepData.desc}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setStepIndex(prev => Math.max(0, prev - 1))}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300"
                >
                  <SkipBack className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setStepIndex(prev => Math.min(bubbleSteps.length - 1, prev + 1))}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setStepIndex(0)}
                  className="p-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold ml-1 shadow-md shadow-cyan-500/20"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              <div className="flex gap-3 text-xs font-mono text-slate-400">
                <span>Time Complexity: <strong className="text-cyan-400">O(N²)</strong></span>
                <span>Space: <strong className="text-emerald-400">O(1)</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Code Tracing & AI Error Analyzer Right (5 cols) */}
        <div className="lg:col-span-5 glass-panel p-5 space-y-4">
          <h2 className="font-bold text-slate-200 text-base pb-3 border-b border-white/10 flex items-center justify-between">
            <span>Algorithm Line Execution & AI Diagnosis</span>
            <span className="text-xs text-indigo-400 font-mono">C++</span>
          </h2>

          <div className="font-mono text-xs p-4 rounded-xl bg-slate-950 border border-white/10 space-y-1 shadow-inner">
            {[
              'void bubbleSort(int arr[], int n) {',
              '  for (int i = 0; i < n-1; i++) {',
              '    for (int j = 0; j < n-i-1; j++) {',
              '      if (arr[j] > arr[j+1]) {',
              '        swap(arr[j], arr[j+1]);',
              '      }',
              '    }',
              '  }',
              '}'
            ].map((line, idx) => (
              <div
                key={idx}
                className={`px-3 py-1 rounded-md ${
                  currentStepData.line === idx
                    ? 'bg-gradient-to-r from-cyan-500/30 to-indigo-500/30 text-cyan-300 font-bold border-l-2 border-cyan-400'
                    : 'text-slate-500'
                }`}
              >
                {line}
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-indigo-500/20 text-xs text-slate-300 leading-relaxed space-y-1">
            <div className="font-bold text-indigo-300 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-cyan-400" />
              AI Conceptual Error Diagnosis:
            </div>
            <div>Common Student Error: Forgetting the outer loop condition `n-i-1` causes redundant comparisons on already sorted elements.</div>
          </div>
        </div>
      </div>
    </div>
  );
};
