import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Compass, 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  BookOpen, 
  Cpu, 
  Cloud, 
  Settings, 
  X, 
  ArrowRight,
  TrendingUp,
  Target
} from 'lucide-react';

export const LearningPassportModal = ({ isOpen, onClose }) => {
  const { userStats, setActiveTab } = useApp();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="glass-panel w-full max-w-2xl p-6 space-y-6 border-cyan-500/40 relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 shadow-lg shadow-cyan-500/30">
              <Compass className="w-6 h-6 text-slate-950 animate-spin" style={{ animationDuration: '15s' }} />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-cyan-400">
                Persistent Intelligence Layer
              </span>
              <h2 className="text-xl font-extrabold text-gradient font-['Outfit']">
                Student Learning Passport
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Student Profile Card */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="font-extrabold text-base text-slate-100">{userStats.name}</h3>
            <p className="text-xs text-slate-400 font-mono">ID: PASSPORT-STEM-8842</p>
          </div>
          <div className="flex gap-4 text-xs font-mono">
            <div className="text-amber-400 font-bold">Lvl {userStats.level} ({userStats.xp} XP)</div>
            <div className="text-cyan-400 font-bold">🔥 {userStats.streak} Day Streak</div>
          </div>
        </div>

        {/* Skill Mastery Breakdown Meters */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase text-slate-400 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            Cross-System Mastery Metrics
          </h3>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
              <div className="flex justify-between font-bold text-slate-300">
                <span>Knowledge Concept Mastery</span>
                <span className="text-cyan-400">82%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-cyan-400 h-full rounded-full" style={{ width: '82%' }} />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
              <div className="flex justify-between font-bold text-slate-300">
                <span>Learning Consistency</span>
                <span className="text-indigo-400">71%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-400 h-full rounded-full" style={{ width: '71%' }} />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
              <div className="flex justify-between font-bold text-slate-300">
                <span>Adaptive Quiz Performance</span>
                <span className="text-emerald-400">84%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-400 h-full rounded-full" style={{ width: '84%' }} />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
              <div className="flex justify-between font-bold text-slate-300">
                <span>Virtual Lab Completion</span>
                <span className="text-purple-400">91%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-purple-400 h-full rounded-full" style={{ width: '91%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Strong Areas vs Needs Practice */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
            <span className="font-bold text-emerald-400 flex items-center gap-1.5 uppercase">
              <CheckCircle2 className="w-4 h-4" /> Strong Areas
            </span>
            <ul className="space-y-1 text-slate-200">
              <li>✓ Arrays & Sorting Algorithms</li>
              <li>✓ CPU Process Scheduling (FCFS, SJF)</li>
              <li>✓ Digital Logic Gate Combinations</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2">
            <span className="font-bold text-amber-400 flex items-center gap-1.5 uppercase">
              <AlertTriangle className="w-4 h-4" /> Needs Practice
            </span>
            <ul className="space-y-1 text-slate-200">
              <li>⚠ Binary Search Tree Traversals</li>
              <li>⚠ Cloud Auto-Scaling Traffic Spike Limits</li>
              <li>⚠ 8085 Assembly Register Flags</li>
            </ul>
          </div>
        </div>

        {/* AI Personalized Next Step Card */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-500/15 to-indigo-500/15 border border-cyan-500/30 space-y-2">
          <div className="flex items-center gap-2 text-cyan-300 font-bold text-xs uppercase">
            <Target className="w-4 h-4 text-cyan-400" />
            AI Passport Personalized Recommendation
          </div>
          <p className="text-xs text-slate-200 leading-relaxed">
            "You have demonstrated strong performance in CPU scheduling calculations! Your next optimal learning activity is practicing <strong>Binary Search Trees in the DSA Lab</strong>."
          </p>
          <div className="pt-1 flex justify-end">
            <button
              onClick={() => {
                onClose();
                setActiveTab('dsa');
              }}
              className="btn-primary text-xs py-1.5"
            >
              <span>Jump to DSA Practice</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
