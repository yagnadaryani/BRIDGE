import React, { useState, useEffect } from 'react';
import { SubjectId, SubjectInfo } from '../../types';
import { SUBJECTS, SUBJECT_ASSESSMENTS } from '../../data/mockData';
import { storageService } from '../../services/storage';
import { useGamification } from '../../context/GamificationContext';
import { CodeStudio } from './dsa/CodeStudio';
import { CircuitLab } from './digital/CircuitLab';
import { OSSimulator } from './os/OSSimulator';
import { ProcessorStudio } from './micro/ProcessorStudio';
import { CloudStudio } from './cloud/CloudStudio';
import {
  BookOpen,
  Cpu,
  CheckCircle2,
  BarChart3,
  Languages,
  Sparkles,
  HelpCircle,
  Check,
  AlertTriangle,
  RotateCcw,
  ArrowRight
} from 'lucide-react';

interface SubjectWorkspaceProps {
  subjectId: SubjectId;
  onNavigate: (route: string) => void;
  onOpenAssistant: () => void;
}

export const SubjectWorkspace: React.FC<SubjectWorkspaceProps> = ({
  subjectId,
  onNavigate,
  onOpenAssistant
}) => {
  const { awardXP } = useGamification();
  const subject: SubjectInfo = SUBJECTS.find(s => s.id === subjectId) || SUBJECTS[0];

  const [activeTab, setActiveTab] = useState<'LEARN' | 'LAB' | 'ASSESS' | 'PERFORMANCE'>('LAB');
  const [selectedLanguage, setSelectedLanguage] = useState<'English' | 'Hindi' | 'Marathi'>('English');
  const [explanation, setExplanation] = useState<string>('');
  const [isExplaining, setIsExplaining] = useState<boolean>(false);

  // Assessment State
  const assessments = SUBJECT_ASSESSMENTS[subjectId] || [];
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [confidences, setConfidences] = useState<Record<string, 'low' | 'medium' | 'high'>>({});
  const [submittedAssessment, setSubmittedAssessment] = useState<boolean>(false);

  // Fetch explanation when language changes
  useEffect(() => {
    fetchConceptExplanation(selectedLanguage);
  }, [subjectId, selectedLanguage]);

  const fetchConceptExplanation = async (lang: 'English' | 'Hindi' | 'Marathi') => {
    setIsExplaining(true);
    try {
      const res = await fetch('/api/gemini/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: subject.name,
          concept: subject.id === 'dsa' ? 'Binary Search Boundary Invariants' : 'Core Operating Principles',
          language: lang
        })
      });
      const data = await res.json();
      if (data.explanation) {
        setExplanation(data.explanation);
      }
    } catch (e) {
      console.warn('Explain fetch failed:', e);
    } finally {
      setIsExplaining(false);
    }
  };

  const handleAssessmentSubmit = () => {
    setSubmittedAssessment(true);
    let correctCount = 0;

    assessments.forEach(q => {
      const isCorrect = selectedAnswers[q.id] === q.correctOptionIndex;
      if (isCorrect) correctCount++;

      storageService.recordLearningEvent({
        studentId: 'student_aarav_01',
        subjectId,
        conceptId: q.conceptId,
        eventType: isCorrect ? 'answer_correct' : 'answer_wrong',
        evidence: {
          userConfidence: confidences[q.id] || 'medium',
          userSelectedOption: selectedAnswers[q.id]
        }
      });
    });

    if (correctCount === assessments.length) {
      awardXP(120, 'masteryXP', `Perfect score on ${subject.name} Assessment`);
    } else {
      awardXP(40, 'masteryXP', `Completed ${subject.name} Assessment`);
    }
  };

  const learnerModel = storageService.getLearnerModel();
  const currentSubjectMastery = learnerModel.subjectMastery[subjectId] || 65;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Subject Header Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
              {subject.code}
            </span>
            <span className="text-xs font-semibold text-slate-400 font-mono">
              Mastery: {currentSubjectMastery}%
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 mt-1">
            {subject.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            {subject.description}
          </p>
        </div>

        {/* 4 Dedicated Workspace Tabs */}
        <div className="flex p-1 bg-slate-100 rounded-2xl text-xs font-bold self-start md:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('LEARN')}
            className={`flex items-center gap-1.5 py-2 px-3 sm:px-4 rounded-xl transition-all ${
              activeTab === 'LEARN' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>LEARN</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('LAB')}
            className={`flex items-center gap-1.5 py-2 px-3 sm:px-4 rounded-xl transition-all ${
              activeTab === 'LAB' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>DO / VIRTUAL LAB</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('ASSESS')}
            className={`flex items-center gap-1.5 py-2 px-3 sm:px-4 rounded-xl transition-all ${
              activeTab === 'ASSESS' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>ASSESS</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('PERFORMANCE')}
            className={`flex items-center gap-1.5 py-2 px-3 sm:px-4 rounded-xl transition-all ${
              activeTab === 'PERFORMANCE' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>PERFORMANCE</span>
          </button>
        </div>
      </div>

      {/* Tab 1: LEARN (Theory, Multilingual Concept, Invariants) */}
      {activeTab === 'LEARN' && (
        <div className="space-y-4">
          {/* Multilingual Selector */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-700 font-bold">
              <Languages className="w-4 h-4 text-indigo-600" />
              <span>Concept Language Adaptation (Invariant remains identical):</span>
            </div>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              {(['English', 'Hindi', 'Marathi'] as const).map(lang => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setSelectedLanguage(lang)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    selectedLanguage === lang ? 'bg-white text-indigo-700 shadow-xs font-bold' : 'text-slate-600'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-base text-slate-900 font-heading">
                Pedagogical Foundations ({selectedLanguage})
              </h3>
              <button
                type="button"
                onClick={onOpenAssistant}
                className="text-xs font-bold text-indigo-600 flex items-center gap-1 hover:underline"
              >
                <Sparkles className="w-3.5 h-3.5" /> Ask AI Tutor
              </button>
            </div>

            {isExplaining ? (
              <div className="py-12 text-center text-xs text-slate-400">
                Generating multilingual conceptual explanation...
              </div>
            ) : (
              <div className="prose prose-slate max-w-none text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                {explanation || 'Loading comprehensive engineering foundations...'}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: DO / VIRTUAL LAB */}
      {activeTab === 'LAB' && (
        <div>
          {subjectId === 'dsa' && <CodeStudio />}
          {subjectId === 'digital-electronics' && <CircuitLab />}
          {subjectId === 'os' && <OSSimulator />}
          {subjectId === 'microprocessor' && <ProcessorStudio />}
          {subjectId === 'cloud' && <CloudStudio />}
        </div>
      )}

      {/* Tab 3: ASSESS (With Confidence Calibration) */}
      {activeTab === 'ASSESS' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <h3 className="text-base font-bold font-heading text-slate-900">
              Confidence-Calibrated Assessment
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              BRIDGE tracks not just correctness, but your confidence calibration (detecting overconfidence vs underconfidence).
            </p>
          </div>

          {assessments.map((q, idx) => (
            <div key={q.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="font-bold text-xs sm:text-sm text-slate-800">
                Q{idx + 1}. {q.prompt}
              </div>

              {q.codeSnippet && (
                <pre className="p-3 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs overflow-x-auto">
                  {q.codeSnippet}
                </pre>
              )}

              <div className="space-y-1.5 pt-1">
                {q.options.map((opt, oIdx) => {
                  const isSelected = selectedAnswers[q.id] === oIdx;
                  const isCorrect = oIdx === q.correctOptionIndex;
                  return (
                    <button
                      key={oIdx}
                      type="button"
                      disabled={submittedAssessment}
                      onClick={() => setSelectedAnswers(prev => ({ ...prev, [q.id]: oIdx }))}
                      className={`w-full text-left p-3 rounded-xl border text-xs transition-all ${
                        submittedAssessment
                          ? isCorrect
                            ? 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold'
                            : isSelected
                              ? 'bg-red-50 border-red-300 text-red-900 font-bold'
                              : 'bg-white border-slate-200 text-slate-500 opacity-60'
                          : isSelected
                            ? 'bg-indigo-50 border-indigo-400 text-indigo-900 font-bold'
                            : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {/* Confidence Rating */}
              {!submittedAssessment && (
                <div className="pt-2 flex items-center gap-2 text-xs">
                  <span className="text-slate-400 text-[11px] font-medium">How confident are you?</span>
                  {(['low', 'medium', 'high'] as const).map(lvl => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setConfidences(prev => ({ ...prev, [q.id]: lvl }))}
                      className={`px-2 py-1 rounded text-[11px] uppercase font-bold transition-all ${
                        confidences[q.id] === lvl
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              )}

              {submittedAssessment && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                  <strong className="text-indigo-600">Explanation:</strong> {q.explanation}
                </div>
              )}
            </div>
          ))}

          {!submittedAssessment && (
            <button
              type="button"
              onClick={handleAssessmentSubmit}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all"
            >
              Submit Assessment for Diagnostic Verification
            </button>
          )}
        </div>
      )}

      {/* Tab 4: PERFORMANCE */}
      {activeTab === 'PERFORMANCE' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <h3 className="font-bold text-base font-heading text-slate-900 mb-3">
              Learner Model Metrics in {subject.name}
            </h3>
            <div className="space-y-3">
              {Object.entries(learnerModel.conceptMastery)
                .filter(([concept]) => concept.startsWith(subjectId === 'digital-electronics' ? 'de_' : subjectId === 'microprocessor' ? 'mp_' : `${subjectId}_`))
                .map(([concept, score]) => (
                  <div key={concept}>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="capitalize">{concept.replace(/_/g, ' ')}</span>
                      <span className="text-indigo-600 font-bold">{score}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${score}%` }} />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
