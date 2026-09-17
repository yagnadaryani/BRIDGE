import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  CheckCircle2, 
  Lock, 
  Sparkles, 
  Star, 
  Cpu, 
  Settings, 
  Cloud, 
  Code2, 
  Binary, 
  ChevronRight, 
  Trophy,
  ArrowRight
} from 'lucide-react';

export const QuestMap = () => {
  const { setActiveTab, gamification } = useApp();

  // Visual Chapter Journey Map Nodes
  const questNodes = [
    {
      id: 'n1',
      stage: '1. Foundation',
      subject: '⚡ Digital Electronics',
      chapter: 'Logic Gates & Boolean Algebra',
      type: 'Concept Mission',
      status: 'completed',
      score: 98,
      icon: Cpu,
      tab: 'digital'
    },
    {
      id: 'n2',
      stage: '2. Lab Simulation',
      subject: '⚡ Digital Electronics',
      chapter: '2-Bit Binary Half & Full Adder',
      type: 'Lab Simulation',
      status: 'completed',
      score: 95,
      icon: Cpu,
      tab: 'digital'
    },
    {
      id: 'n3',
      stage: '3. Core OS Scheduling',
      subject: '⚙️ Operating Systems',
      chapter: 'CPU Scheduling (FCFS & SJF)',
      type: 'Practice',
      status: 'completed',
      score: 92,
      icon: Settings,
      tab: 'os'
    },
    {
      id: 'n4',
      stage: '4. Weak Area Remediation',
      subject: '⚙️ Operating Systems',
      chapter: 'Round Robin Quantum Math (q=2s)',
      type: 'Lab Challenge',
      status: 'recommended', // AI Recommended Next
      score: 45,
      icon: Settings,
      tab: 'os',
      recommendationReason: 'AI Diagnostic: 42% waiting time calculation error in previous attempt'
    },
    {
      id: 'n5',
      stage: '5. Cloud Architecture',
      subject: '☁️ Cloud Architecture',
      chapter: 'Load Balancing & Auto Scaling',
      type: 'Simulation',
      status: 'in_progress',
      score: 65,
      icon: Cloud,
      tab: 'cloud'
    },
    {
      id: 'n6',
      stage: '6. Algorithmic Mastery',
      subject: '💻 Data Structures',
      chapter: 'Binary Search Tree Traversals (BST)',
      type: 'Boss Challenge',
      status: 'locked',
      prerequisite: 'Complete Round Robin & Array Sort missions',
      score: 0,
      icon: Code2,
      tab: 'dsa'
    },
    {
      id: 'n7',
      stage: '7. Microprocessor Hardware',
      subject: '🔬 Microprocessors 8085',
      chapter: '8-Bit I/O Port Output (Port 01H)',
      type: 'Concept Mastery',
      status: 'locked',
      prerequisite: 'Pass BST Boss Challenge',
      score: 0,
      icon: Binary,
      tab: 'micro'
    }
  ];

  return (
    <div className={`p-6 rounded-2xl border space-y-6 ${
      gamification
        ? 'glass-panel border-cyan-500/40 bg-slate-950/90 text-white'
        : 'bg-white border-black text-black shadow-md'
    }`}>
      {/* Map Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-400" />
            <h2 className="text-xl font-extrabold font-['Outfit']">
              Interactive Gamified Quest Map & Learning Journey
            </h2>
          </div>
          <p className={`text-xs mt-1 ${gamification ? 'text-slate-300' : 'text-slate-800 font-semibold'}`}>
            Visual learning progression from prerequisite foundations to boss challenges and concept mastery.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs font-bold font-mono">
          <span className="flex items-center gap-1 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" /> Completed
          </span>
          <span className="flex items-center gap-1 text-cyan-400">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" /> In Progress
          </span>
          <span className="flex items-center gap-1 text-amber-400">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-bounce" /> Recommended Next
          </span>
          <span className="flex items-center gap-1 text-slate-400">
            <Lock className="w-3.5 h-3.5" /> Locked
          </span>
        </div>
      </div>

      {/* Quest Nodes Tree */}
      <div className="relative space-y-4">
        {/* Central Connecting Timeline Line */}
        <div className="absolute left-6 top-6 bottom-6 w-1 bg-gradient-to-b from-emerald-500 via-cyan-500 to-slate-800 z-0 hidden md:block" />

        <div className="space-y-4 relative z-10">
          {questNodes.map((node) => {
            const Icon = node.icon;
            const isCompleted = node.status === 'completed';
            const isInProgress = node.status === 'in_progress';
            const isRecommended = node.status === 'recommended';
            const isLocked = node.status === 'locked';

            return (
              <div
                key={node.id}
                onClick={() => !isLocked && setActiveTab(node.tab)}
                className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
                  isRecommended
                    ? 'bg-gradient-to-r from-amber-500/20 via-indigo-900/40 to-slate-950 border-amber-500/80 shadow-lg shadow-amber-500/20 ring-2 ring-amber-400'
                    : isCompleted
                      ? 'bg-slate-900/90 border-emerald-500/40 hover:border-emerald-400'
                      : isInProgress
                        ? 'bg-slate-900/90 border-cyan-500/40 hover:border-cyan-400'
                        : 'bg-slate-950/60 border-white/5 opacity-60 cursor-not-allowed'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-4">
                    {/* Node Circle Badge */}
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-md ${
                      isRecommended
                        ? 'bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 font-black animate-bounce'
                        : isCompleted
                          ? 'bg-emerald-500 text-slate-950'
                          : isInProgress
                            ? 'bg-cyan-500 text-slate-950'
                            : 'bg-slate-800 text-slate-500'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle2 className="w-6 h-6" />
                      ) : isLocked ? (
                        <Lock className="w-5 h-5" />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                          {node.stage}
                        </span>
                        {isRecommended && (
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-black flex items-center gap-1 animate-pulse">
                            <Star className="w-3 h-3 fill-slate-950" /> ⭐ RECOMMENDED NEXT MISSION
                          </span>
                        )}
                        <span className="text-xs font-mono font-bold text-slate-300">{node.type}</span>
                      </div>

                      <h3 className="text-base font-extrabold font-['Outfit'] mt-0.5">
                        {node.subject} — {node.chapter}
                      </h3>

                      {isRecommended && (
                        <p className="text-xs text-amber-300 font-semibold mt-1">
                          💡 <strong>Why Recommended:</strong> {node.recommendationReason}
                        </p>
                      )}

                      {isLocked && (
                        <p className="text-xs text-slate-400 mt-1">
                          🔒 <strong>Prerequisite:</strong> {node.prerequisite}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {isCompleted && (
                      <span className="text-sm font-mono font-extrabold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/30">
                        Score: {node.score}%
                      </span>
                    )}

                    {!isLocked && (
                      <button className={`btn-primary text-xs py-1.5 px-3 ${
                        isRecommended ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-black' : ''
                      }`}>
                        <span>{isRecommended ? 'Launch Recommended Mission' : 'Open Lab/Mission'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
