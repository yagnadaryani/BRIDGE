import React, { useState } from 'react';
import { storageService } from '../../services/storage';
import { DEMO_STUDENT } from '../../data/mockData';
import {
  GraduationCap,
  ShieldCheck,
  AlertTriangle,
  TrendingUp,
  RotateCcw,
  Sparkles,
  Send,
  MessageSquare,
  CheckCircle2,
  HelpCircle,
  ArrowLeft
} from 'lucide-react';

interface StudentIntelligenceProfileProps {
  studentId: string;
  onBack: () => void;
}

export const StudentIntelligenceProfile: React.FC<StudentIntelligenceProfileProps> = ({
  studentId,
  onBack
}) => {
  const learnerModel = storageService.getLearnerModel(studentId);
  const interventions = storageService.getInterventions();
  const doubts = storageService.getDoubts();

  const [facultyNote, setFacultyNote] = useState('');
  const [noteSent, setNoteSent] = useState(false);

  const handleSendFacultyNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!facultyNote) return;
    setNoteSent(true);
    setTimeout(() => {
      setFacultyNote('');
      setNoteSent(false);
    }, 2500);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-600">
            Student Deep-Dive Intelligence Profile
          </span>
          <h1 className="text-xl sm:text-2xl font-bold font-heading text-slate-900">
            {DEMO_STUDENT.name} ({DEMO_STUDENT.rollNo})
          </h1>
        </div>
      </div>

      {/* Student Profile Card */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white font-extrabold text-xl flex items-center justify-center shadow-md">
            AS
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">{DEMO_STUDENT.name}</h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                Semester 4
              </span>
            </div>
            <div className="text-xs text-slate-400 font-mono mt-0.5">
              {DEMO_STUDENT.email} • {DEMO_STUDENT.department}
            </div>
          </div>
        </div>

        {/* Confidence vs Correctness Calibration Matrix */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
          <div className="font-bold text-slate-700 mb-1">Metacognitive Calibration</div>
          <div className="flex gap-3 text-[11px]">
            <div>
              <span className="text-slate-400">Calibrated: </span>
              <strong className="text-emerald-600">{learnerModel.confidenceCalibration.calibratedRate}%</strong>
            </div>
            <div>
              <span className="text-slate-400">Overconfident: </span>
              <strong className="text-red-500">{learnerModel.confidenceCalibration.overconfidentRate}%</strong>
            </div>
            <div>
              <span className="text-slate-400">Underconfident: </span>
              <strong className="text-amber-500">{learnerModel.confidenceCalibration.underconfidentRate}%</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Multidimensional Radar Metric Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Application Mastery</div>
          <div className="text-2xl font-bold text-blue-600 font-mono mt-1">{learnerModel.applicationScore}%</div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2">
            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${learnerModel.applicationScore}%` }} />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Debugging Rigor</div>
          <div className="text-2xl font-bold text-indigo-600 font-mono mt-1">{learnerModel.debuggingScore}%</div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2">
            <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${learnerModel.debuggingScore}%` }} />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Retention Index</div>
          <div className="text-2xl font-bold text-emerald-600 font-mono mt-1">{learnerModel.retentionScore}%</div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${learnerModel.retentionScore}%` }} />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Technical Viva</div>
          <div className="text-2xl font-bold text-violet-600 font-mono mt-1">{learnerModel.communicationScore}%</div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2">
            <div className="h-full bg-violet-500 rounded-full" style={{ width: `${learnerModel.communicationScore}%` }} />
          </div>
        </div>
      </div>

      {/* Active Root Gaps & Recurring Errors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
          <h3 className="font-bold text-base font-heading text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <span>Active Root Gaps (Prerequisites)</span>
          </h3>

          <div className="space-y-3">
            {learnerModel.rootGaps.map((gap) => (
              <div key={gap.id} className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-amber-900 uppercase text-[10px]">{gap.gapCategory}</span>
                  <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                    gap.status === 'VERIFIED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-200 text-amber-900'
                  }`}>
                    {gap.status}
                  </span>
                </div>
                <p className="text-slate-800 font-medium leading-relaxed">{gap.description}</p>
                <div className="text-[11px] text-amber-800">
                  Prerequisite: <strong>{gap.prerequisiteConcept}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recurring Error Patterns */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
          <h3 className="font-bold text-base font-heading text-slate-900 flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-indigo-600" />
            <span>Recurring Error Frequencies</span>
          </h3>

          <div className="space-y-3">
            {learnerModel.recurringErrors.map((err) => (
              <div key={err.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-indigo-600 uppercase text-[10px]">{err.subjectId}</span>
                  <span className="font-mono text-red-600 font-bold">{err.count} occurrences</span>
                </div>
                <p className="text-slate-700">{err.errorType}</p>
                <div className="text-[10px] text-slate-400">
                  Last observed: {new Date(err.lastOccurred).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Instructor Direct Feedback Action */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
        <h3 className="font-bold text-base font-heading text-slate-900 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-purple-600" />
          <span>Send Faculty Guidance Note</span>
        </h3>

        <form onSubmit={handleSendFacultyNote} className="space-y-3">
          <textarea
            rows={3}
            value={facultyNote}
            onChange={(e) => setFacultyNote(e.target.value)}
            placeholder="Provide personalized advice or assign a custom review path directly to Aarav's dashboard..."
            className="w-full p-3 rounded-2xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/20"
          />
          <div className="flex justify-between items-center">
            {noteSent && (
              <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Guidance dispatched to student model
              </span>
            )}
            <button
              type="submit"
              disabled={!facultyNote}
              className="ml-auto px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs disabled:opacity-50 flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Note</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
