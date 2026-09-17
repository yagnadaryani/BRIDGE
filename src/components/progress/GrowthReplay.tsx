import React from 'react';
import { storageService } from '../../services/storage';
import { useGamification } from '../../context/GamificationContext';
import { TrendingUp, AlertTriangle, ShieldCheck, CheckCircle2, Zap, ArrowRight, Clock, Award } from 'lucide-react';
import { motion } from 'motion/react';

export const GrowthReplay: React.FC = () => {
  const { isGamified } = useGamification();
  const learnerModel = storageService.getLearnerModel();
  const interventions = storageService.getInterventions();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
            Multidimensional Growth Replay
          </span>
          <span className="text-xs text-slate-400 font-semibold">Continuous Evolution Visualizer</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 mt-1">
          From Struggle to Verified Mastery
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review your diagnostic path: what failed, the root prerequisite gap detected, the intervention applied, and verified retention.
        </p>
      </div>

      {/* Multidimensional Radar/Bar Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Application Mastery</div>
          <div className="text-2xl font-bold text-blue-600 font-mono mt-1">{learnerModel.applicationScore}%</div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${learnerModel.applicationScore}%` }} />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Debugging Rigor</div>
          <div className="text-2xl font-bold text-indigo-600 font-mono mt-1">{learnerModel.debuggingScore}%</div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${learnerModel.debuggingScore}%` }} />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Long-term Retention</div>
          <div className="text-2xl font-bold text-emerald-600 font-mono mt-1">{learnerModel.retentionScore}%</div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${learnerModel.retentionScore}%` }} />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Technical Viva Express</div>
          <div className="text-2xl font-bold text-violet-600 font-mono mt-1">{learnerModel.communicationScore}%</div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-violet-500 rounded-full" style={{ width: `${learnerModel.communicationScore}%` }} />
          </div>
        </div>
      </div>

      {/* Verified Growth Case Studies (Before & After) */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
        <h3 className="font-bold text-base font-heading text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <span>Diagnostic Intervention Case Studies</span>
        </h3>

        <div className="space-y-4">
          {interventions.map((interv) => (
            <div
              key={interv.id}
              className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                    {interv.gapCategory}
                  </span>
                  <span className="text-xs font-bold text-slate-800">{interv.title}</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="text-red-500 font-bold">Initial: {interv.beforeScore}%</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-emerald-600 font-bold">
                    Post-Repair: {interv.afterScore || 95}%
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-bold">
                    +{(interv.afterScore || 95) - interv.beforeScore}% GAIN
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 leading-relaxed">
                <strong className="text-slate-900 block mb-1">Root Cause & Invariant Discovery:</strong>
                {interv.rootDiagnosis}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chronological Evidence Timeline */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
        <h3 className="font-bold text-base font-heading text-slate-900 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-indigo-600" />
          <span>Complete Chronological Evidence Flow</span>
        </h3>

        <div className="relative border-l-2 border-slate-200 ml-3 space-y-4 pl-4 text-xs">
          {learnerModel.learningHistory.map((hist, idx) => (
            <div key={idx} className="relative group">
              <div className={`absolute -left-[23px] top-1 w-3.5 h-3.5 rounded-full border-2 border-white shadow-xs ${
                hist.type === 'ERROR'
                  ? 'bg-red-500'
                  : hist.type === 'ROOT_GAP'
                    ? 'bg-amber-500'
                    : hist.type === 'VERIFICATION'
                      ? 'bg-emerald-500'
                      : 'bg-indigo-500'
              }`} />
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-indigo-600 uppercase text-[10px]">{hist.type}</span>
                  <span className="text-[10px] text-slate-400">{new Date(hist.timestamp).toLocaleTimeString()}</span>
                </div>
                <p className="leading-relaxed">{hist.summary}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
