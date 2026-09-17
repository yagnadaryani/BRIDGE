import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users, 
  CheckCircle2, 
  AlertTriangle, 
  Send, 
  Search,
  TrendingUp,
  Award,
  X,
  BarChart2,
  ChevronRight,
  BookOpen,
  Sparkles,
  Layers,
  Target
} from 'lucide-react';

export const TeacherDashboard = () => {
  const { roster, t } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [announcement, setAnnouncement] = useState('');
  const [showAnnounceToast, setShowAnnounceToast] = useState(false);

  // Selected Student Modal State for Hierarchical Analytics
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedSubjectKey, setSelectedSubjectKey] = useState(null); // 'digital' | 'os' | 'cloud' | 'dsa' | 'micro'

  const filteredRoster = roster.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBroadcast = (e) => {
    e.preventDefault();
    if (!announcement.trim()) return;
    setShowAnnounceToast(true);
    setAnnouncement('');
    setTimeout(() => setShowAnnounceToast(false), 3000);
  };

  const subjectNames = {
    digital: '⚡ Digital Electronics Virtual Lab',
    os: '⚙️ Operating Systems Scheduling',
    cloud: '☁️ Cloud Architecture & Scaling',
    dsa: '💻 Data Structures & Algorithms',
    micro: '🔬 Microprocessors 8085 Assembly'
  };

  return (
    <div className="teacher-dark space-y-6 text-slate-100">
      {/* Black Command Center Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 glass-panel p-6 border-purple-500/40 bg-slate-950/90 shadow-2xl">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6 text-purple-400" />
            <h1 className="text-2xl font-extrabold tracking-tight text-gradient font-['Outfit']">
              {t.teacherHeader}
            </h1>
          </div>
          <p className="text-sm text-slate-300 mt-1">
            Teacher Command Center: Click any student's name to view <strong>Subject-Wise</strong> analytics, and click a subject to drill down into <strong>Topic-Wise</strong> breakdown.
          </p>
        </div>

        <span className="px-3.5 py-1.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/50 text-xs font-extrabold uppercase tracking-wider shadow-sm">
          Instructor Black Command Portal
        </span>
      </div>

      {/* Overview Analytics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-4 space-y-1 border-purple-500/30 bg-slate-900/90">
          <span className="text-[11px] font-extrabold uppercase text-slate-200">Total Enrolled Students</span>
          <div className="text-2xl font-extrabold text-white font-mono flex items-center justify-between">
            <span>60</span>
            <Users className="w-5 h-5 text-purple-400" />
          </div>
        </div>

        <div className="glass-card p-4 space-y-1 border-purple-500/30 bg-slate-900/90">
          <span className="text-[11px] font-extrabold uppercase text-slate-200">Learning Progress</span>
          <div className="text-2xl font-extrabold text-emerald-400 font-mono flex items-center justify-between">
            <span>78%</span>
            <TrendingUp className="w-5 h-5 text-emerald-400" />
          </div>
        </div>

        <div className="glass-card p-4 space-y-1 border-purple-500/30 bg-slate-900/90">
          <span className="text-[11px] font-extrabold uppercase text-slate-200">Quiz Performance</span>
          <div className="text-2xl font-extrabold text-cyan-400 font-mono flex items-center justify-between">
            <span>74%</span>
            <Award className="w-5 h-5 text-cyan-400" />
          </div>
        </div>

        <div className="glass-card p-4 space-y-1 border-purple-500/30 bg-slate-900/90">
          <span className="text-[11px] font-extrabold uppercase text-slate-200">Lab Completion</span>
          <div className="text-2xl font-extrabold text-purple-400 font-mono flex items-center justify-between">
            <span>81%</span>
            <CheckCircle2 className="w-5 h-5 text-purple-400" />
          </div>
        </div>
      </div>

      {/* Concept Alert Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-1">
          <span className="font-extrabold uppercase text-amber-400 block">Most Difficult Concept</span>
          <div className="text-sm font-extrabold text-white">→ CPU Scheduling & Round Robin</div>
          <p className="text-[11px] text-slate-200 font-semibold">42% of students made errors calculating waiting time formula.</p>
        </div>

        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs space-y-1">
          <span className="font-extrabold uppercase text-rose-400 block">Needing Intervention</span>
          <div className="text-sm font-extrabold text-white">→ 8 Students</div>
          <p className="text-[11px] text-slate-200 font-semibold">Pending lab completions in Cloud Scaling & Tree algorithms.</p>
        </div>

        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs space-y-1">
          <span className="font-extrabold uppercase text-emerald-400 block">Strong Progress</span>
          <div className="text-sm font-extrabold text-white">→ 17 Students</div>
          <p className="text-[11px] text-slate-200 font-semibold">Completed 100% of labs with quiz scores above 85%.</p>
        </div>
      </div>

      {/* Main Grid: Class Roster Left (8 cols), Assignment Broadcast Right (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Class Roster Table */}
        <div className="lg:col-span-8 glass-panel p-5 space-y-4 border-purple-500/30 bg-slate-950/80">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
            <h2 className="font-bold text-slate-200 text-base">
              Class Roster — Click Student for Hierarchical Subject/Topic Analytics
            </h2>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search student..."
                className="bg-slate-900 border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 uppercase">
                  <th className="pb-2">Student Name (Click to Open Analytics)</th>
                  <th className="pb-2">Level / XP</th>
                  <th className="pb-2">Labs Done</th>
                  <th className="pb-2">Quiz Avg</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredRoster.map(s => (
                  <tr 
                    key={s.id} 
                    onClick={() => {
                      setSelectedStudent(s);
                      setSelectedSubjectKey(null);
                    }}
                    className="hover:bg-purple-500/20 cursor-pointer transition-colors group"
                  >
                    <td className="py-3 font-bold text-purple-300 group-hover:text-cyan-300">
                      <div>{s.name} 📊</div>
                      <div className="text-[10px] text-slate-400 font-normal">{s.email}</div>
                    </td>
                    <td className="py-3 text-amber-400 font-bold">
                      Lvl {s.level} ({s.xp} XP)
                    </td>
                    <td className="py-3 text-cyan-400 font-bold">
                      {s.labsCompleted} / 5 Labs
                    </td>
                    <td className="py-3 text-emerald-400 font-bold">
                      {s.quizAvg}%
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        s.status === 'Top Performer'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : s.status === 'On Track'
                            ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                      }`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button className="px-2.5 py-1 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[10px] font-bold group-hover:bg-purple-500 group-hover:text-white">
                        View Graph ➔
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Broadcast Form */}
        <div className="lg:col-span-4 glass-panel p-5 space-y-4 flex flex-col justify-between border-purple-500/30 bg-slate-950/80">
          <div className="space-y-4">
            <h2 className="font-bold text-slate-200 text-base pb-3 border-b border-white/10 flex items-center gap-2">
              <Send className="w-4 h-4 text-purple-400" />
              Broadcast Assignment Task
            </h2>

            <form onSubmit={handleBroadcast} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                  Intervention Task Prompt
                </label>
                <textarea
                  rows={4}
                  required
                  value={announcement}
                  onChange={(e) => setAnnouncement(e.target.value)}
                  placeholder="e.g. Complete the Round Robin CPU Scheduling experiment in OS Lab..."
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                />
              </div>

              <button type="submit" className="w-full btn-primary justify-center bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                <Send className="w-4 h-4" />
                <span>Broadcast to 60 Students</span>
              </button>
            </form>

            {showAnnounceToast && (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-bounce">
                <CheckCircle2 className="w-4 h-4" />
                <span>Intervention task broadcasted!</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hierarchical Student Analytics Modal (Subject-Wise & Topic-Wise) */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in">
          <div className="glass-panel max-w-3xl w-full p-6 space-y-6 border-purple-500/50 bg-slate-950 relative max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/40">
                  <BarChart2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-purple-400">
                      Hierarchical Student Analytics
                    </span>
                    {selectedSubjectKey && (
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                        Topic-Wise Drill Down Active
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl font-extrabold text-gradient font-['Outfit']">
                    {selectedStudent.name}'s Performance Profile
                  </h2>
                </div>
              </div>

              <button
                onClick={() => setSelectedStudent(null)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* LEVEL 1: Subject-Wise Analytics Overview */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-extrabold uppercase text-slate-300 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-purple-400" />
                  Subject-Wise Analytics (Click Any Subject Card Below to Analyze Weak Topics & Root Causes)
                </h3>
                {selectedSubjectKey && (
                  <button
                    onClick={() => setSelectedSubjectKey(null)}
                    className="text-[11px] text-cyan-400 hover:underline font-bold"
                  >
                    ← Back to All Subjects
                  </button>
                )}
              </div>

              {/* Subject Bar Charts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                {Object.entries(selectedStudent.conceptualProgress).map(([subjKey, score]) => {
                  const isSelected = selectedSubjectKey === subjKey;
                  const isWeak = score < 70;
                  return (
                    <div
                      key={subjKey}
                      onClick={() => setSelectedSubjectKey(subjKey)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-purple-500/25 border-purple-500 shadow-lg shadow-purple-500/20'
                          : isWeak
                            ? 'bg-rose-500/10 border-rose-500/60 hover:border-rose-400 hover:bg-rose-500/20'
                            : 'bg-slate-900/80 border-white/10 hover:border-purple-500/50 hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex justify-between font-bold text-slate-200 mb-1.5 items-center">
                        <span className="flex items-center gap-1">
                          {subjectNames[subjKey]}
                          <ChevronRight className="w-3.5 h-3.5 text-purple-400" />
                        </span>
                        <div className="flex items-center gap-1.5">
                          {isWeak && (
                            <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 font-extrabold flex items-center gap-1 animate-pulse">
                              <AlertTriangle className="w-3 h-3 text-rose-400" />
                              WEAK SUBJECT
                            </span>
                          )}
                          <span className={`font-extrabold ${isWeak ? 'text-rose-400' : 'text-cyan-400'}`}>{score}%</span>
                        </div>
                      </div>
                      <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden p-0.5">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isWeak ? 'bg-gradient-to-r from-rose-500 to-amber-500' : 'bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500'
                          }`}
                          style={{ width: `${score}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-1">
                        {isWeak ? '⚠️ Click to analyze weak topic root causes ➔' : 'Click to expand 3 topics ➔'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* LEVEL 2: Topic-Wise Drill Down Analytics (If Subject Clicked) */}
            {selectedSubjectKey && (
              <div className="p-5 rounded-2xl bg-slate-900/90 border border-cyan-500/40 space-y-4 animate-fade-in">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h3 className="font-extrabold text-sm text-cyan-300 flex items-center gap-2">
                    <Target className="w-4 h-4 text-cyan-400" />
                    In-Depth Topic & Root Cause Breakdown: {subjectNames[selectedSubjectKey]}
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">
                    3 Topics Evaluated
                  </span>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  {selectedStudent.topicBreakdown[selectedSubjectKey]?.map((tItem, idx) => {
                    const isTopicWeak = tItem.score < 70;
                    return (
                      <div key={idx} className={`p-4 rounded-xl border space-y-2.5 transition-all ${
                        isTopicWeak ? 'bg-rose-500/10 border-rose-500/50' : 'bg-slate-950 border-white/10'
                      }`}>
                        <div className="flex items-center justify-between font-bold">
                          <span className="text-slate-200 text-sm flex items-center gap-2">
                            {isTopicWeak && <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />}
                            {tItem.topic}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-extrabold ${
                              tItem.status === 'Mastered'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                : tItem.status === 'On Track'
                                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/50'
                            }`}>
                              {tItem.status}
                            </span>
                            <span className={`font-extrabold text-sm ${isTopicWeak ? 'text-rose-400' : 'text-cyan-300'}`}>
                              {tItem.score}%
                            </span>
                          </div>
                        </div>

                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              tItem.score >= 85 ? 'bg-emerald-400' : tItem.score >= 70 ? 'bg-cyan-400' : 'bg-rose-500'
                            }`}
                            style={{ width: `${tItem.score}%` }}
                          />
                        </div>

                        {/* Diagnostic Root Cause Analysis */}
                        <div className="p-3 rounded-lg bg-slate-900 border border-white/5 space-y-1 text-slate-300">
                          <span className="text-[10px] uppercase font-bold text-amber-400 block tracking-wider">
                            🔍 Root Cause & Misconception Diagnosis:
                          </span>
                          <p className="text-xs leading-relaxed font-sans">{tItem.failureReason || 'Performance normal. No major conceptual misconceptions detected.'}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Diagnostic Alert & Recommendation */}
            <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30 text-xs space-y-2">
              <div className="font-extrabold text-purple-300 flex items-center gap-1.5 uppercase">
                <AlertTriangle className="w-4 h-4 text-purple-400" />
                AI Diagnostic Insight & Weak Concept:
              </div>
              <div className="text-slate-200 font-bold">{selectedStudent.weakConcept}</div>
              <div className="text-slate-300">💡 <strong>Teacher Action Recommendation:</strong> {selectedStudent.recommendation}</div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedStudent(null)}
                className="btn-primary text-xs"
              >
                Close Analytics Modal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
