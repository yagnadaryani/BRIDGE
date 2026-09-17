import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useGamification } from '../../context/GamificationContext';
import { storageService } from '../../services/storage';
import { SUBJECTS } from '../../data/mockData';
import {
  Code2,
  Cpu,
  Layers,
  Binary,
  Cloud,
  Flame,
  Zap,
  ArrowRight,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  TrendingUp,
  MessageSquare,
  Compass,
  RotateCcw
} from 'lucide-react';
import { motion } from 'motion/react';

interface StudentDashboardProps {
  onNavigate: (route: string) => void;
  onOpenAssistant: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ onNavigate, onOpenAssistant }) => {
  const { currentUser } = useAuth();
  const { isGamified, profile } = useGamification();

  const learnerModel = storageService.getLearnerModel(currentUser?.id);
  const interventions = storageService.getInterventions();
  const doubts = storageService.getDoubts();
  const pendingIntervention = interventions.find(i => i.status === 'PENDING');
  const unresolvedDoubts = doubts.filter(d => d.status !== 'RESOLVED');

  const subjectIcons: Record<string, any> = {
    'dsa': Code2,
    'digital-electronics': Cpu,
    'os': Layers,
    'microprocessor': Binary,
    'cloud': Cloud
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Greeting & Learning Focus Banner */}
      <div className={`p-5 sm:p-7 rounded-3xl border transition-all ${
        isGamified
          ? 'bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-indigo-500/40 shadow-xl'
          : 'bg-white border-slate-200/90 shadow-xs'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-500">
                Active Learning Loop • Semester 4
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                <CheckCircle2 className="w-3 h-3" /> Learner Model Synced
              </span>
            </div>
            <h1 className={`text-xl sm:text-2xl font-bold tracking-tight font-heading ${
              isGamified ? 'text-white' : 'text-slate-900'
            }`}>
              Welcome back, {currentUser?.name?.split(' ')[0] || 'Aarav'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              Current Focus: <strong className={isGamified ? 'text-indigo-300' : 'text-slate-800'}>
                Binary Search Boundary Invariants & Logic Gate Difference Verification
              </strong>. Root-cause detective has prepared a targeted prerequisite repair.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => onNavigate('/student/subjects/dsa')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white shadow-md transition-all ${
                isGamified
                  ? 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30'
                  : 'bg-slate-900 hover:bg-slate-800 shadow-slate-300'
              }`}
            >
              <span>Continue DSA Lab</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick High-Level Metric Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-100/20">
          <div className={`p-3 rounded-xl border ${
            isGamified ? 'bg-slate-800/60 border-slate-700/60' : 'bg-slate-50/80 border-slate-100'
          }`}>
            <div className="text-[11px] font-semibold text-slate-400">Current Streak</div>
            <div className="flex items-center gap-1.5 mt-1 font-bold text-base text-amber-500">
              <Flame className="w-4 h-4 fill-amber-500" />
              <span>{profile.streakDays} Days</span>
            </div>
          </div>

          <div className={`p-3 rounded-xl border ${
            isGamified ? 'bg-slate-800/60 border-slate-700/60' : 'bg-slate-50/80 border-slate-100'
          }`}>
            <div className="text-[11px] font-semibold text-slate-400">Debugging Score</div>
            <div className="flex items-center gap-1.5 mt-1 font-bold text-base text-indigo-500">
              <Zap className="w-4 h-4" />
              <span>{learnerModel.debuggingScore}/100</span>
            </div>
          </div>

          <div className={`p-3 rounded-xl border ${
            isGamified ? 'bg-slate-800/60 border-slate-700/60' : 'bg-slate-50/80 border-slate-100'
          }`}>
            <div className="text-[11px] font-semibold text-slate-400">Viva / Technical English</div>
            <div className="flex items-center gap-1.5 mt-1 font-bold text-base text-emerald-500">
              <MessageSquare className="w-4 h-4" />
              <span>{learnerModel.communicationScore}%</span>
            </div>
          </div>

          <div className={`p-3 rounded-xl border ${
            isGamified ? 'bg-slate-800/60 border-slate-700/60' : 'bg-slate-50/80 border-slate-100'
          }`}>
            <div className="text-[11px] font-semibold text-slate-400">Active Inquiries</div>
            <div className="flex items-center gap-1.5 mt-1 font-bold text-base text-violet-500">
              <HelpCircle className="w-4 h-4" />
              <span>{unresolvedDoubts.length} Open Doubts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Targeted Intervention (Core BRIDGE feature!) */}
      {pendingIntervention && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-5 rounded-3xl border ${
            isGamified
              ? 'bg-amber-950/40 border-amber-500/40 text-amber-200'
              : 'bg-amber-50/80 border-amber-200/90 text-amber-900'
          }`}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500 text-white shadow-sm flex-shrink-0 mt-0.5 sm:mt-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-200 text-amber-900">
                    DIAGNOSED: {pendingIntervention.gapCategory}
                  </span>
                  <span className="text-xs text-amber-700 font-medium hidden sm:inline">
                    Triggered by recurring boundary timeout
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold mt-1 text-slate-900">
                  {pendingIntervention.title}
                </h3>
                <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                  {pendingIntervention.rootDiagnosis}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('/student/subjects/dsa')}
              className="flex-shrink-0 w-full sm:w-auto px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs sm:text-sm shadow-sm flex items-center justify-center gap-2 transition-all"
            >
              <span>Repair Prerequisite Gap</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Grid of Subjects & Labs */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <div>
            <h2 className={`text-base font-bold font-heading ${isGamified ? 'text-white' : 'text-slate-900'}`}>
              Engineering Subject Workspaces
            </h2>
            <p className="text-xs text-slate-400">
              Each workspace provides four integrated phases: Learn • Virtual Lab • Assess • Performance
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SUBJECTS.map((sub) => {
            const Icon = subjectIcons[sub.id] || Code2;
            const mastery = learnerModel.subjectMastery[sub.id] || 60;
            return (
              <div
                key={sub.id}
                onClick={() => onNavigate(`/student/subjects/${sub.id}`)}
                className={`cursor-pointer group p-5 rounded-2xl border transition-all hover:scale-[1.01] hover:shadow-md ${
                  isGamified
                    ? 'bg-slate-900 border-slate-800 hover:border-indigo-500'
                    : 'bg-white border-slate-200/90 hover:border-indigo-300 shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-400">{sub.code}</span>
                </div>

                <h3 className={`font-bold text-sm sm:text-base font-heading group-hover:text-indigo-600 transition-colors ${
                  isGamified ? 'text-white' : 'text-slate-900'
                }`}>
                  {sub.name}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 mt-1 mb-4">
                  {sub.description}
                </p>

                {/* Mastery Progress Meter */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-400 text-[11px]">Subject Mastery</span>
                    <span className="font-bold text-indigo-600">{mastery}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                      style={{ width: `${mastery}%` }}
                    />
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span className="inline-flex items-center gap-1 text-[11px] text-indigo-600 font-semibold">
                    <Sparkles className="w-3 h-3" /> {sub.labName}
                  </span>
                  <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Enter Workspace <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Section: Recent Evidence Stream vs Quick AI Tutor Context */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recent Learning Evidence Loop */}
        <div className={`p-5 rounded-3xl border ${
          isGamified ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90 shadow-xs'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-sm font-bold font-heading flex items-center gap-2 ${
              isGamified ? 'text-white' : 'text-slate-900'
            }`}>
              <TrendingUp className="w-4 h-4 text-indigo-500" />
              <span>Continuous Evidence Stream</span>
            </h3>
            <button
              type="button"
              onClick={() => onNavigate('/student/progress')}
              className="text-xs text-indigo-600 font-semibold hover:underline"
            >
              Growth Replay →
            </button>
          </div>

          <div className="space-y-3">
            {learnerModel.learningHistory.slice(0, 4).map((hist, idx) => (
              <div key={idx} className="flex items-start gap-3 text-xs p-2.5 rounded-xl bg-slate-50/80 border border-slate-100">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  hist.type === 'ERROR'
                    ? 'bg-red-100 text-red-800'
                    : hist.type === 'ROOT_GAP'
                      ? 'bg-amber-100 text-amber-800'
                      : hist.type === 'VERIFICATION'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-indigo-100 text-indigo-800'
                }`}>
                  {hist.type}
                </span>
                <span className="text-slate-700 flex-1 leading-relaxed">
                  {hist.summary}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Career & Communication Growth Card */}
        <div className={`p-5 rounded-3xl border flex flex-col justify-between ${
          isGamified ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90 shadow-xs'
        }`}>
          <div>
            <h3 className={`text-sm font-bold font-heading flex items-center gap-2 mb-2 ${
              isGamified ? 'text-white' : 'text-slate-900'
            }`}>
              <Compass className="w-4 h-4 text-emerald-500" />
              <span>Engineering Express & Career Guidance</span>
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              BRIDGE goes beyond rote calculations: practice technical viva presentation, examiner explanations, and explore system engineering career pathways.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                type="button"
                onClick={() => onNavigate('/student/communication')}
                className="p-3 text-left rounded-xl border border-slate-200 hover:border-indigo-400 transition-all bg-slate-50 hover:bg-indigo-50/50"
              >
                <div className="font-bold text-xs text-slate-800">Viva Practice</div>
                <div className="text-[11px] text-slate-500">"Explain to Examiner"</div>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('/student/career')}
                className="p-3 text-left rounded-xl border border-slate-200 hover:border-indigo-400 transition-all bg-slate-50 hover:bg-indigo-50/50"
              >
                <div className="font-bold text-xs text-slate-800">Career Quiz</div>
                <div className="text-[11px] text-slate-500">Systems & Software fit</div>
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenAssistant}
            className="w-full py-2.5 px-4 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            <span>Consult Context-Aware AI Pedagogical Tutor</span>
          </button>
        </div>
      </div>
    </div>
  );
};
