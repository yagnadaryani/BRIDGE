import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { QuestMap } from './QuestMap';
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
  ArrowRight,
  Sparkles,
  Bug,
  Search,
  RotateCcw,
  Cpu,
  Sword,
  MessageSquare,
  Clock,
  Key
} from 'lucide-react';

export const StudentProgress = () => {
  const { userStats, addXP, triggerConfetti, gamification, setActiveTab, t } = useApp();
  const [completedMissions, setCompletedMissions] = useState({});
  const [showGrowthBonus, setShowGrowthBonus] = useState(false);

  const meaningfulMissions = [
    {
      id: 'm1',
      title: 'Fix the Bug 🐛',
      desc: 'Debug a null pointer dereference in DSA Lab BST insertion routine.',
      reward: 60,
      icon: Bug,
      tab: 'dsa'
    },
    {
      id: 'm2',
      title: 'Concept Detective 🔍',
      desc: 'Identify the missing waiting time quantum calculation in OS Gantt Chart.',
      reward: 50,
      icon: Search,
      tab: 'os'
    },
    {
      id: 'm3',
      title: '3-Day Revision Quest 📅',
      desc: 'Revise JK Flip-Flop setup/hold timing concepts for 3 consecutive days.',
      reward: 80,
      icon: RotateCcw,
      tab: 'digital'
    },
    {
      id: 'm4',
      title: 'Lab Challenge 🔬',
      desc: 'Construct a 2-bit Binary Adder on Digital Electronics Breadboard.',
      reward: 70,
      icon: Cpu,
      tab: 'digital'
    },
    {
      id: 'm5',
      title: 'Boss Battle ⚔️',
      desc: 'Solve 5 application-based Round Robin CPU scheduling questions.',
      reward: 100,
      icon: Sword,
      tab: 'quiz'
    },
    {
      id: 'm6',
      title: 'Teach Back 🗣️',
      desc: 'Explain Cloud Load Balancing in your own words to AI Companion.',
      reward: 50,
      icon: MessageSquare,
      tab: 'chat'
    },
    {
      id: 'm7',
      title: 'Speed Debugger ⏱️',
      desc: 'Debug 8085 Assembly LED port output instructions under 60 seconds.',
      reward: 90,
      icon: Clock,
      tab: 'micro'
    },
    {
      id: 'm8',
      title: 'Prerequisite Quest 🔑',
      desc: 'Master Boolean Algebra before unlocking 4-bit MUX IC circuits.',
      reward: 60,
      icon: Key,
      tab: 'digital'
    }
  ];

  const handleCompleteMission = (mId, xpReward) => {
    if (completedMissions[mId]) return;
    setCompletedMissions(prev => ({ ...prev, [mId]: true }));
    addXP(xpReward);
    triggerConfetti();
  };

  const handleClaimGrowthReward = () => {
    setShowGrowthBonus(true);
    addXP(150);
    triggerConfetti();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto text-slate-100">
      {/* Header */}
      <div className={`flex flex-wrap items-center justify-between gap-4 p-6 rounded-2xl border transition-all ${
        gamification ? 'glass-panel border-amber-500/30' : 'bg-white border-black text-black shadow-md'
      }`}>
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-400" />
            <h1 className={`text-2xl font-extrabold tracking-tight font-['Outfit'] ${gamification ? 'text-gradient-gold' : 'text-black'}`}>
              {t.progressHeader} & Learning Passport
            </h1>
          </div>
          <p className={`text-sm mt-1 font-semibold ${gamification ? 'text-slate-300' : 'text-black'}`}>
            Continuous learning intelligence profile: Mastery breakdown, meaningful engineering missions, and Quest Map.
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

      {/* Growth & Improvement Reward Bonus Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-600/20 via-cyan-600/20 to-indigo-600/20 border border-emerald-500/40 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-xs uppercase font-mono">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            🌟 Growth & Resilience Reward Engine
          </div>
          <h3 className="text-base font-extrabold font-['Outfit'] text-white">
            Performance Improved from 45% ➔ 70% in CPU Scheduling!
          </h3>
          <p className="text-xs text-slate-300">
            BRIDGE rewards effort and concept growth, not just perfect scores. You earned a <strong>Growth Mastery Bonus</strong> for overcoming misconceptions!
          </p>
        </div>

        {showGrowthBonus ? (
          <div className="px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-bounce">
            <CheckCircle2 className="w-4 h-4" />
            <span>+150 XP & Growth Badge Unlocked!</span>
          </div>
        ) : (
          <button
            onClick={handleClaimGrowthReward}
            className="btn-primary text-xs py-2.5 px-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-black shadow-lg shadow-emerald-500/30"
          >
            <Sparkles className="w-4 h-4" />
            <span>Claim +150 XP Growth Reward</span>
          </button>
        )}
      </div>

      {/* Meaningful Engineering Missions */}
      <div className={`p-6 rounded-2xl border space-y-4 ${
        gamification ? 'glass-panel border-amber-500/30' : 'bg-white border-black text-black shadow-md'
      }`}>
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h2 className="font-extrabold text-amber-400 text-sm uppercase tracking-wider flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
            🎯 Meaningful Engineering Learning Missions
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            {Object.keys(completedMissions).length} / {meaningfulMissions.length} Completed
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {meaningfulMissions.map((mission) => {
            const Icon = mission.icon;
            const isDone = completedMissions[mission.id];
            return (
              <div
                key={mission.id}
                className={`p-3.5 rounded-xl border flex flex-col justify-between space-y-3 transition-all ${
                  isDone
                    ? 'bg-emerald-500/10 border-emerald-500/50'
                    : 'bg-slate-900 border-white/10 hover:border-amber-500/50'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-slate-100 flex items-center gap-1.5">
                      <Icon className="w-4 h-4 text-cyan-400 shrink-0" />
                      {mission.title}
                    </span>
                    <span className="text-amber-400 font-mono font-bold text-xs">+{mission.reward} XP</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed font-sans">{mission.desc}</p>
                </div>

                {isDone ? (
                  <div className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Completed & XP Claimed</span>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setActiveTab(mission.tab)}
                      className="flex-1 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-white/10"
                    >
                      Open Lab
                    </button>
                    <button
                      onClick={() => handleCompleteMission(mission.id, mission.reward)}
                      className="px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs shadow-md"
                    >
                      Claim
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Gamification Quest Map / Journey Tree */}
      <QuestMap />

      {/* Persistent Learning Passport Intelligence Dashboard */}
      <div className={`p-6 rounded-2xl border space-y-6 ${
        gamification ? 'glass-panel border-cyan-500/30' : 'bg-white border-black text-black shadow-md'
      }`}>
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-cyan-400" />
            <h2 className={`font-extrabold text-base ${gamification ? 'text-slate-100' : 'text-black'}`}>
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
            <ul className="space-y-1 text-slate-200 font-semibold">
              <li>✓ Arrays & Sorting Algorithms</li>
              <li>✓ CPU Process Scheduling</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2">
            <span className="font-bold text-amber-400 uppercase flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" /> Needs Practice
            </span>
            <ul className="space-y-1 text-slate-200 font-semibold">
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
            className="btn-primary text-xs py-2 shrink-0 bg-gradient-to-r from-cyan-600 to-indigo-600 text-white"
          >
            <span>Launch Round Robin Practice</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
