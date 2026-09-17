import React, { useState } from 'react';
import { storageService } from '../../services/storage';
import { useGamification } from '../../context/GamificationContext';
import { Compass, Cpu, Server, Database, Code2, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export const CareerGuidance: React.FC = () => {
  const { awardXP } = useGamification();
  const learnerModel = storageService.getLearnerModel();

  const [selectedTrack, setSelectedTrack] = useState<'systems' | 'embedded' | 'backend' | 'cloud'>('systems');

  const tracks = [
    {
      id: 'systems',
      title: 'Systems & Infrastructure Engineer',
      icon: Server,
      match: 88,
      overview: 'Specializes in OS kernels, runtime concurrency, memory architectures, and low-latency distributed networks.',
      relevantSubjects: ['Operating Systems (CS403)', 'Cloud Architecture (IT405)', 'DSA (CS401)'],
      strongSignals: [
        'Demonstrated strong grasp of CPU scheduling heuristics and queue turnaround analysis',
        'High debugging score (58 -> 80) across state machines'
      ],
      skillGaps: [
        'Linux Kernel Module compilation (char devices, ioctl)',
        'Socket programming with epoll'
      ],
      recommendedProject: 'Build a lightweight user-space cooperative task scheduler with coroutines in C/C++.'
    },
    {
      id: 'embedded',
      title: 'Embedded Systems & Hardware Engineer',
      icon: Cpu,
      match: 74,
      overview: 'Designs micro-architectures, FPGA logic, IoT firmware, register allocation, and timing-sensitive hardware nodes.',
      relevantSubjects: ['Digital Electronics (EC302)', 'Microprocessors (EC404)'],
      strongSignals: ['Verified XOR difference logic and truth-table verification'],
      skillGaps: ['Timing diagrams & propagation delay timing constraints', 'Interrupt service routines (ISR) in 8085/ARM'],
      recommendedProject: 'Design a 4-bit ALU circuit on FPGA with status flags for Zero, Carry, and Overflow.'
    },
    {
      id: 'backend',
      title: 'Distributed Software Engineer',
      icon: Code2,
      match: 82,
      overview: 'Develops highly resilient services, algorithmic indexing, cache hierarchies, and database scaling layers.',
      relevantSubjects: ['DSA (CS401)', 'Cloud Computing (IT405)'],
      strongSignals: ['Repaired binary search boundary invariants with rigorous sub-interval proof'],
      skillGaps: ['Distributed consensus protocols (Raft, Paxos)', 'Database index B-tree disk layout'],
      recommendedProject: 'Implement an in-memory key-value store with LSM trees and write-ahead logs (WAL).'
    }
  ];

  const active = tracks.find(t => t.id === selectedTrack) || tracks[0];

  const handleSelectTrack = (trackId: any) => {
    setSelectedTrack(trackId);
    awardXP(30, 'growthXP', `Explored ${trackId} Career Pathway`);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
            Personalized Engineering Pathways
          </span>
          <span className="text-xs text-slate-400 font-semibold">Grounded in Learner Model Evidence</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 mt-1">
          Career Direction & Industry Alignment
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
          Based on your concept mastery, debugging traits, and lab performance across hardware, kernel, and algorithms.
        </p>
      </div>

      {/* Track Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tracks.map(t => {
          const Icon = t.icon;
          const isSelected = selectedTrack === t.id;
          return (
            <div
              key={t.id}
              onClick={() => handleSelectTrack(t.id)}
              className={`cursor-pointer p-5 rounded-2xl border transition-all ${
                isSelected
                  ? 'bg-indigo-50/70 border-indigo-400 shadow-sm'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-xl ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  {t.match}% Fit
                </span>
              </div>
              <h3 className="font-bold text-sm text-slate-900 font-heading">{t.title}</h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">{t.overview}</p>
            </div>
          );
        })}
      </div>

      {/* Deep Dive on Selected Track */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base sm:text-lg font-bold font-heading text-slate-900">{active.title}</h2>
            <div className="text-xs text-slate-400 mt-0.5">Core Syllabus Ties: {active.relevantSubjects.join(' • ')}</div>
          </div>
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
            Fit Index: {active.match}%
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Strong Signals */}
          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2 text-xs">
            <h4 className="font-bold text-emerald-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Learner Model Strengths:</span>
            </h4>
            <ul className="space-y-1.5 text-emerald-800 list-disc list-inside">
              {active.strongSignals.map((sig, i) => (
                <li key={i} className="leading-relaxed">{sig}</li>
              ))}
            </ul>
          </div>

          {/* Targeted Gaps to Bridge */}
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2 text-xs">
            <h4 className="font-bold text-amber-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Next Industry Competencies to Unlock:</span>
            </h4>
            <ul className="space-y-1.5 text-amber-800 list-disc list-inside">
              {active.skillGaps.map((gap, i) => (
                <li key={i} className="leading-relaxed">{gap}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Portfolio Project Recommendation */}
        <div className="p-4 rounded-2xl bg-indigo-900 text-white space-y-2 text-xs">
          <div className="text-[10px] uppercase font-bold tracking-wider text-indigo-300">
            Recommended Proof-of-Work Project:
          </div>
          <p className="font-semibold text-sm leading-relaxed">{active.recommendedProject}</p>
        </div>
      </div>
    </div>
  );
};
