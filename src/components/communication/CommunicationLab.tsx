import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useGamification } from '../../context/GamificationContext';
import { storageService } from '../../services/storage';
import {
  Mic,
  MessageSquare,
  Sparkles,
  Award,
  CheckCircle2,
  AlertCircle,
  Play,
  RotateCcw
} from 'lucide-react';

export const CommunicationLab: React.FC = () => {
  const { currentUser } = useAuth();
  const { awardXP } = useGamification();

  const [mode, setMode] = useState<'viva' | '2_mark' | '4_mark' | 'interview'>('viva');
  const [topic, setTopic] = useState<string>('Preemptive CPU Scheduling (Round Robin vs SRTF)');
  const [studentAnswer, setStudentAnswer] = useState<string>(
    'Round Robin uses a fixed time slice or quantum where each process gets CPU time before context switching. SRTF chooses the job with shortest remaining time preemptively.'
  );
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [evaluation, setEvaluation] = useState<any>(null);

  const handleEvaluate = async () => {
    setIsEvaluating(true);
    try {
      const res = await fetch('/api/gemini/communication-evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode,
          topic,
          studentResponse: studentAnswer
        })
      });
      const data = await res.json();
      if (data.evaluation) {
        setEvaluation(data.evaluation);

        // Update Learner Model communication score
        const model = storageService.getLearnerModel();
        model.communicationScore = Math.round(
          (model.communicationScore + data.evaluation.communicationScore) / 2
        );
        storageService.saveLearnerModel(model);

        awardXP(85, 'communicationXP', 'Technical Viva Evaluation Completed');
      }
    } catch (e) {
      console.warn('Evaluation failed:', e);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
              Engineering Express
            </span>
            <span className="text-xs text-slate-400 font-semibold">Oral Viva & Technical English Evaluator</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 mt-0.5">
            Technical Communication & Viva Simulator
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Separates what you know (Technical Knowledge) from how you present it (Clarity, Structure, Vocabulary).
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex p-1 bg-slate-100 rounded-xl text-xs font-semibold self-start sm:self-auto">
          {(['viva', '2_mark', '4_mark', 'interview'] as const).map(m => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                mode === m ? 'bg-white text-emerald-700 shadow-xs font-bold' : 'text-slate-600'
              }`}
            >
              {m.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input Form */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Examiner Prompt / Question:
              </label>
              <input
                type="text"
                value={topic}
                onChange={e => setTopic(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-slate-700">
                  Your Answer (Spoken or Written):
                </label>
                <span className="text-[11px] text-slate-400 font-mono">
                  {studentAnswer.split(/\s+/).filter(Boolean).length} words
                </span>
              </div>
              <textarea
                rows={6}
                value={studentAnswer}
                onChange={e => setStudentAnswer(e.target.value)}
                placeholder="Explain the technical concept as if speaking directly to the university examiner..."
                className="w-full p-3 rounded-xl border border-slate-200 text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <button
              type="button"
              onClick={handleEvaluate}
              disabled={isEvaluating || !studentAnswer}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isEvaluating ? 'Assessing Presentation...' : 'Evaluate with AI Examiner'}</span>
            </button>
          </div>
        </div>

        {/* Right: Detailed Rubric Feedback */}
        <div className="lg:col-span-6">
          {evaluation ? (
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
              {/* Dual Score Meters */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-center">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-blue-600">Technical Knowledge</div>
                  <div className="text-2xl font-extrabold text-blue-800 mt-0.5">{evaluation.knowledgeScore}%</div>
                </div>
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Communication Clarity</div>
                  <div className="text-2xl font-extrabold text-emerald-800 mt-0.5">{evaluation.communicationScore}%</div>
                </div>
              </div>

              {/* Granular Rubric Bars */}
              <div className="space-y-2 text-xs">
                {Object.entries(evaluation.scores || {}).map(([metric, val]: any) => (
                  <div key={metric}>
                    <div className="flex justify-between font-semibold text-[11px] capitalize text-slate-600 mb-0.5">
                      <span>{metric.replace(/([A-Z])/g, ' $1')}</span>
                      <span className="font-bold text-emerald-700">{val}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${val}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Examiner Feedback */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
                <strong className="text-slate-900 block">Examiner Feedback:</strong>
                <p className="leading-relaxed">{evaluation.examinerFeedback}</p>
              </div>

              {/* Model Answer */}
              <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-200 text-xs text-indigo-950 space-y-1">
                <strong className="text-indigo-900 block font-bold">Ideal Model Delivery:</strong>
                <p className="leading-relaxed italic">{evaluation.modelAnswer}</p>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[320px] rounded-2xl border border-dashed border-slate-300 flex flex-col items-center justify-center p-6 text-center text-slate-400 text-xs">
              <MessageSquare className="w-8 h-8 text-slate-300 mb-2" />
              <p className="max-w-xs">
                Submit an oral or written explanation to generate a multi-dimensional rubric breakdown.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
