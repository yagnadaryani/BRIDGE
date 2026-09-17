'use client';

import React, { useState } from 'react';
import { Target, Award, Flame, CheckCircle2, Lock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Navbar } from '@/components/shell/Navbar';
import { Sidebar } from '@/components/shell/Sidebar';
import { AIAssistantDrawer } from '@/components/ai/AIAssistantDrawer';
import { SYSTEM_MISSIONS, SYSTEM_BADGES } from '@/lib/engine/gamificationEngine';
import { mockStore } from '@/lib/firebase/mockStore';
import { getCurrentSessionUser } from '@/lib/firebase/auth';

export default function MissionsGamificationPage() {
  const [isAiOpen, setIsAiOpen] = useState(false);
  const currentUser = getCurrentSessionUser();
  const learnerModel = mockStore.getLearnerModel(currentUser?.id || 'aarav-101');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar onOpenAIAssistant={() => setIsAiOpen(true)} />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 space-y-6">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-purple-900/60 via-slate-900 to-indigo-900/60 border border-purple-800/60 p-5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <Target className="w-6 h-6 text-amber-400" />
                <h1 className="text-xl font-bold text-slate-100">Learning Missions & Achievements</h1>
                <Badge variant="purple">Level {learnerModel.level}</Badge>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Earn XP for verified learning growth, prerequisite repairs, and lab completions.
              </p>
            </div>

            <div className="flex items-center space-x-4 bg-slate-950/80 p-3 rounded-xl border border-slate-800">
              <div className="text-center px-2">
                <span className="text-[10px] uppercase font-bold text-amber-400 flex items-center justify-center">
                  <Flame className="w-3.5 h-3.5 mr-1 fill-amber-400/20" /> Streak
                </span>
                <span className="text-lg font-bold text-slate-100 font-mono">{learnerModel.streakDays} Days</span>
              </div>
              <div className="h-8 w-px bg-slate-800" />
              <div className="text-center px-2">
                <span className="text-[10px] uppercase font-bold text-purple-400 flex items-center justify-center">
                  <Award className="w-3.5 h-3.5 mr-1" /> Total XP
                </span>
                <span className="text-lg font-bold text-purple-300 font-mono">{learnerModel.xp} XP</span>
              </div>
            </div>
          </div>

          {/* Missions List */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-slate-200">Active Learning Missions</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SYSTEM_MISSIONS.map((m) => (
                <Card key={m.id} className="bg-slate-900 border-slate-800">
                  <CardHeader className="p-4 mb-2 flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-sm font-bold text-slate-100">{m.title}</CardTitle>
                      <p className="text-xs text-slate-400 mt-0.5">{m.description}</p>
                    </div>
                    <Badge variant="purple" className="text-xs font-mono">+{m.xpReward} XP</Badge>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 space-y-2 text-xs">
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>Progress</span>
                      <span className="font-mono text-purple-300 font-bold">{m.progress}%</span>
                    </div>
                    <Progress value={m.progress} colorClass="bg-purple-500" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Badges Collection */}
          <div className="space-y-3 pt-2">
            <h2 className="text-sm font-bold text-slate-200">Unlocked Mastery Badges</h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {SYSTEM_BADGES.map((b) => {
                const isUnlocked = learnerModel.unlockedBadges.includes(b.id) || b.id === 'boundary_master';

                return (
                  <div
                    key={b.id}
                    className={`p-4 rounded-xl border text-center space-y-2 transition-all ${
                      isUnlocked
                        ? 'bg-purple-950/40 border-purple-700/60 shadow-lg shadow-purple-950/40'
                        : 'bg-slate-900/60 border-slate-800 opacity-50'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full mx-auto flex items-center justify-center font-bold text-base ${
                      isUnlocked ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-500'
                    }`}>
                      {isUnlocked ? <Award className="w-5 h-5" /> : <Lock className="w-4 h-4" />}
                    </div>
                    <h4 className="font-bold text-xs text-slate-100">{b.title}</h4>
                    <p className="text-[10px] text-slate-400 leading-tight">{b.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>

      <AIAssistantDrawer isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />
    </div>
  );
}
