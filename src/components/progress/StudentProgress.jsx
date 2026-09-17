import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Award, 
  Trophy, 
  Flame, 
  Coins, 
  CheckCircle2, 
  AlertTriangle,
  Compass, 
  Target,
  Zap,
  TrendingUp,
  ArrowRight
} from 'lucide-react';

export const StudentProgress = () => {
  const { userStats, gamification, setActiveTab, t } = useApp();

  const xpPercent = Math.min(100, Math.floor((userStats.xp / userStats.maxXp) * 100));

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 glass-panel p-6 border-amber-500/30">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-400" />
            <h1 className="text-2xl font-extrabold tracking-tight text-gradient-gold font-['Outfit']">
              {t.progressHeader} & Learning Passport
            </h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Continuous learning intelligence profile: Mastery breakdown, strong areas, weak concepts, and daily missions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400 font-bold text-xs">
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
            <span>{userStats.streak} Day Streak</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 font-bold text-xs">
            <Coins className="w-4 h-4 text-yellow-400" />
            <span>{userStats.coins} Coins</span>
          </div>
        </div>
      </div>

      {/* Gamified Daily Missions (If Gamification is ON) */}
      {gamification && (
        <div className="glass-panel p-5 space-y-3 border-amber-500/30">
          <h2 className="font-bold text-amber-400 text-sm uppercase tracking-wider flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
            🎯 Daily Missions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-between text-xs font-semibold">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>📖 Learn one concept</span>
              </div>
              <span className="text-amber-400 font-bold">+20 XP</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-between text-xs font-semibold">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>🧠 Complete 5 questions</span>
              </div>
              <span className="text-amber-400 font-bold">+30 XP</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-between text-xs font-semibold">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>💡 Fix a misconception</span>
              </div>
              <span className="text-amber-400 font-bold">+40 XP</span>
            </div>
          </div>
        </div>
      )}

      {/* Persistent Learning Passport Intelligence Dashboard */}
      <div className="glass-panel p-6 space-y-6 border-cyan-500/30">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-cyan-400" />
            <h2 className="font-bold text-slate-100 text-base">
              MY LEARNING PASSPORT PROFILE
            </h2>
          </div>
          <span className="text-xs font-mono text-cyan-400">PASSPORT-STEM-8842</span>
        </div>

        {/* 4 Key Intelligence Meters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-white/10 space-y-2">
            <div className="flex justify-between font-bold text-slate-300">
              <span>Knowledge</span>
              <span className="text-cyan-400 font-mono">82%</span>
            </div>
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div className="bg-cyan-400 h-full rounded-full" style={{ width: '82%' }} />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-white/10 space-y-2">
            <div className="flex justify-between font-bold text-slate-300">
              <span>Consistency</span>
              <span className="text-indigo-400 font-mono">71%</span>
            </div>
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div className="bg-indigo-400 h-full rounded-full" style={{ width: '71%' }} />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-white/10 space-y-2">
            <div className="flex justify-between font-bold text-slate-300">
              <span>Quiz Performance</span>
              <span className="text-emerald-400 font-mono">84%</span>
            </div>
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div className="bg-emerald-400 h-full rounded-full" style={{ width: '84%' }} />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-white/10 space-y-2">
            <div className="flex justify-between font-bold text-slate-300">
              <span>Lab Completion</span>
              <span className="text-purple-400 font-mono">91%</span>
            </div>
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div className="bg-purple-400 h-full rounded-full" style={{ width: '91%' }} />
            </div>
          </div>
        </div>

        {/* Strong Areas & Needs Practice Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
            <span className="font-bold text-emerald-400 uppercase flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Strong Areas
            </span>
            <ul className="space-y-1 text-slate-200">
              <li>✓ Arrays & Sorting Algorithms</li>
              <li>✓ CPU Process Scheduling</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2">
            <span className="font-bold text-amber-400 uppercase flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" /> Needs Practice
            </span>
            <ul className="space-y-1 text-slate-200">
              <li>⚠ Binary Search Trees</li>
              <li>⚠ Cloud Auto-Scaling Traffic Limits</li>
            </ul>
          </div>
        </div>

        {/* AI Recommended Next Step */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-500/15 to-indigo-500/15 border border-cyan-500/30 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-cyan-300 font-bold text-xs uppercase">
              <Target className="w-4 h-4 text-cyan-400" />
              AI Personalized Next Step Recommendation
            </div>
            <p className="text-xs text-slate-200">
              "You have improved in CPU scheduling calculations! Your next recommended activity is <strong>Round Robin practice</strong> in the Operating Systems Lab."
            </p>
          </div>

          <button
            onClick={() => setActiveTab('os')}
            className="btn-primary text-xs py-2 shrink-0"
          >
            <span>Launch Round Robin Practice</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
