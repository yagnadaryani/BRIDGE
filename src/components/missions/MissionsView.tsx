import React from 'react';
import { useGamification } from '../../context/GamificationContext';
import { Award, Flame, Zap, CheckCircle2, ShieldAlert, Cpu, Sparkles, ArrowRight } from 'lucide-react';

interface MissionsViewProps {
  onNavigate: (route: string) => void;
}

export const MissionsView: React.FC<MissionsViewProps> = ({ onNavigate }) => {
  const { profile, isGamified, awardXP } = useGamification();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Gamification Header */}
      <div className={`p-6 rounded-3xl border transition-all ${
        isGamified
          ? 'bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 border-indigo-500/50 shadow-xl text-white'
          : 'bg-white border-slate-200 shadow-xs text-slate-800'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 fill-amber-500" />
                {profile.streakDays} Day Active Streak
              </span>
              <span className="text-xs opacity-60">• Level {profile.level}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-heading">
              {profile.title}
            </h1>
            <p className="text-xs opacity-70 mt-0.5">
              XP Formula: Driven by verified prerequisite repairs, debugging rigor, and lab simulations.
            </p>
          </div>

          <div className="text-right">
            <div className="text-3xl font-extrabold font-mono text-indigo-500">
              {profile.xp} <span className="text-xs font-sans opacity-70">TOTAL XP</span>
            </div>
            <div className="text-xs opacity-60 mt-1">
              Next Level at {profile.level * 500} XP
            </div>
          </div>
        </div>

        {/* Level Progress Bar */}
        <div className="w-full h-3 bg-slate-200/40 rounded-full mt-5 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-indigo-600 rounded-full transition-all duration-500"
            style={{ width: `${((profile.xp % 500) / 500) * 100}%` }}
          />
        </div>
      </div>

      {/* Multidimensional XP Breakdown */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
        <h3 className="font-bold text-base font-heading text-slate-900">
          Multidimensional XP Attribution
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          {Object.entries(profile.xpBreakdown).map(([category, amount]) => (
            <div key={category} className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-slate-500 capitalize font-medium text-[11px]">
                {category.replace('XP', ' Rigor')}
              </div>
              <div className="text-base font-bold text-indigo-600 mt-0.5 font-mono">
                {amount} XP
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Quests / Missions */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
        <h3 className="font-bold text-base font-heading text-slate-900 flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-500" />
          <span>Active Pedagogical Missions</span>
        </h3>

        <div className="space-y-3">
          {profile.activeMissions.map((m) => (
            <div
              key={m.id}
              className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-indigo-600 uppercase text-[10px]">{m.subjectId}</span>
                  <span className="font-mono text-amber-600 font-bold">+{m.xpReward} XP</span>
                </div>
                <h4 className="font-bold text-sm text-slate-900 mt-0.5">{m.title}</h4>
                <p className="text-slate-500 mt-0.5 max-w-xl">{m.description}</p>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (m.subjectId === 'dsa') onNavigate('/student/subjects/dsa');
                  else if (m.subjectId === 'digital-electronics') onNavigate('/student/subjects/digital-electronics');
                  else onNavigate('/student/communication');
                }}
                className="flex-shrink-0 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <span>Launch Mission</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Engineering Badges */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
        <h3 className="font-bold text-base font-heading text-slate-900 flex items-center gap-2">
          <Award className="w-5 h-5 text-indigo-600" />
          <span>Engineering Badges & Milestones</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {profile.achievements.map((ach) => {
            const isUnlocked = ach.progress >= ach.maxProgress;
            return (
              <div
                key={ach.id}
                className={`p-4 rounded-2xl border flex items-start gap-3.5 ${
                  isUnlocked
                    ? 'bg-amber-50/50 border-amber-200 text-slate-800'
                    : 'bg-slate-50/60 border-slate-200 text-slate-400 opacity-60'
                }`}
              >
                <div className={`p-2.5 rounded-xl ${isUnlocked ? 'bg-amber-500 text-white shadow-sm' : 'bg-slate-200 text-slate-500'}`}>
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900">{ach.title}</h4>
                    {isUnlocked && (
                      <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-amber-200 text-amber-900">
                        UNLOCKED
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{ach.description}</p>
                  <div className="text-[11px] font-mono mt-2 text-slate-400">
                    Progress: {ach.progress} / {ach.maxProgress}
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
