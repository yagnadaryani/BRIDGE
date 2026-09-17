import React from 'react';
import { storageService } from '../../services/storage';
import { DEMO_STUDENT } from '../../data/mockData';
import {
  School,
  AlertTriangle,
  TrendingUp,
  CheckCircle2,
  Users,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Flame
} from 'lucide-react';

interface TeacherOverviewProps {
  onNavigate: (route: string) => void;
}

export const TeacherOverview: React.FC<TeacherOverviewProps> = ({ onNavigate }) => {
  const learnerModel = storageService.getLearnerModel();
  const doubts = storageService.getDoubts();
  const interventions = storageService.getInterventions();

  const cohortHeatmap = [
    {
      subject: 'DSA (CS401)',
      concept: 'Binary Search Boundary Invariants [low, high]',
      gapCategory: 'PREREQUISITE_GAP',
      affectedStudents: 18,
      percentage: 43,
      typicalError: 'high = mid instead of high = mid - 1 causes non-terminating loop',
      status: 'Intervention Deployed'
    },
    {
      subject: 'Digital Electronics (EC302)',
      concept: 'XOR Parity / Difference Detection',
      gapCategory: 'MISCONCEPTION',
      affectedStudents: 16,
      percentage: 38,
      typicalError: 'Used OR gate for difference detector (fires HIGH on 1,1)',
      status: 'Lab Diagnostic Active'
    },
    {
      subject: 'Operating Systems (CS403)',
      concept: 'CPU Scheduling Convoy Effect (FCFS)',
      gapCategory: 'APPLICATION_GAP',
      affectedStudents: 12,
      percentage: 29,
      typicalError: 'Did not calculate waiting time impact on short burst jobs',
      status: 'Verified in Simulator'
    }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Faculty Header */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded">
              Faculty Command • School of Computing & Systems
            </span>
            <span className="text-xs text-slate-400 font-semibold">Cohort Intelligence Analytics</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 mt-1">
            Cohort Diagnostic Overview (CS Sem 4)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Real-time telemetry aggregated from student code runs, logic circuits, and viva oral evaluations.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('/teacher/students/student_aarav_01')}
          className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all self-start md:self-auto"
        >
          <span>Aarav Sharma Deep Dive</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Metric Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Enrolled Students</div>
          <div className="text-2xl font-bold text-slate-900 font-mono mt-1">42</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">100% active this week</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Cohort Avg Mastery</div>
          <div className="text-2xl font-bold text-indigo-600 font-mono mt-1">68.4%</div>
          <div className="text-[11px] text-indigo-500 font-semibold mt-1">+12% post-interventions</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">At-Risk Students</div>
          <div className="text-2xl font-bold text-amber-600 font-mono mt-1">4</div>
          <div className="text-[11px] text-amber-600 font-semibold mt-1">Prerequisite gaps active</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Intervention Success</div>
          <div className="text-2xl font-bold text-emerald-600 font-mono mt-1">86.2%</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">Verified on code retry</div>
        </div>
      </div>

      {/* Cohort Recurring Root Gap Heatmap */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base font-heading text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-500" />
              <span>Cohort Recurring Root Gap Heatmap</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Identifies systemic prerequisite bottlenecks across the student body before mid-semester exams.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {cohortHeatmap.map((item, idx) => (
            <div key={idx} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-2 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded text-[10px]">
                    {item.subject}
                  </span>
                  <span className="font-bold text-slate-800 text-sm">{item.concept}</span>
                  <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold text-[10px]">
                    {item.gapCategory}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-red-600">{item.affectedStudents} students ({item.percentage}%)</span>
                  <span className="text-emerald-600 font-bold">• {item.status}</span>
                </div>
              </div>

              <div className="text-slate-600 leading-relaxed">
                <strong>Diagnostic Pattern:</strong> {item.typicalError}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Student Roster Table */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base font-heading text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            <span>Student Diagnostic Profiles</span>
          </h3>
          <span className="text-xs text-slate-400">Class CS2024</span>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          <div className="grid grid-cols-12 py-2 font-bold text-slate-400 uppercase text-[10px]">
            <span className="col-span-4">Student</span>
            <span className="col-span-3">Active Gap Category</span>
            <span className="col-span-2">Debugging</span>
            <span className="col-span-2">Communication</span>
            <span className="col-span-1 text-right">Action</span>
          </div>

          <div className="grid grid-cols-12 py-3 items-center hover:bg-slate-50 rounded-xl px-1 transition-colors">
            <div className="col-span-4 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                AS
              </div>
              <div>
                <div className="font-bold text-slate-900">{DEMO_STUDENT.name}</div>
                <div className="text-[10px] text-slate-400 font-mono">{DEMO_STUDENT.rollNo}</div>
              </div>
            </div>

            <div className="col-span-3">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                PREREQUISITE_GAP (Boundary Invariant)
              </span>
            </div>

            <div className="col-span-2 font-mono font-bold text-indigo-600">
              {learnerModel.debuggingScore}%
            </div>

            <div className="col-span-2 font-mono font-bold text-emerald-600">
              {learnerModel.communicationScore}%
            </div>

            <div className="col-span-1 text-right">
              <button
                type="button"
                onClick={() => onNavigate('/teacher/students/student_aarav_01')}
                className="text-indigo-600 hover:text-indigo-800 font-bold"
              >
                Inspect →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
