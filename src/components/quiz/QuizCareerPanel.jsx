import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  HelpCircle, 
  Compass, 
  Sparkles, 
  Trophy, 
  ArrowRight, 
  BookOpen,
  AlertTriangle,
  Briefcase,
  DollarSign,
  CheckCircle2,
  Sliders,
  TrendingUp,
  Cpu,
  Cloud,
  Code2
} from 'lucide-react';

export const QuizCareerPanel = () => {
  const { addXP, gamification, setActiveTab, t } = useApp();

  const [activeTab, setActiveTabState] = useState('career');
  const [careerStep, setCareerStep] = useState(0);
  const [careerAnswers, setCareerAnswers] = useState({});
  const [careerResult, setCareerResult] = useState(null);

  const [quizTopic, setQuizTopic] = useState('os');
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userSelectedOpt, setUserSelectedOpt] = useState(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const careerQuestions = [
    {
      id: 'q1',
      question: 'Which core technical domain excites you the most?',
      options: [
        { label: 'Designing scalable multi-region cloud infrastructure & high traffic servers ☁️', score: 'cloud' },
        { label: 'Building hardware microcontrollers, breadboard logic gates & physical chips ⚡', score: 'embedded' },
        { label: 'Writing low-level operating system kernel schedulers & memory management ⚙️', score: 'systems' },
        { label: 'Optimizing algorithmic data structures (Trees, Graphs, Sorting algorithms) 💻', score: 'dsa' }
      ]
    },
    {
      id: 'q2',
      question: 'What type of engineering problem do you enjoy solving?',
      options: [
        { label: 'Preventing server outages during a 50,000 req/s traffic spike under budget', score: 'cloud' },
        { label: 'Debugging voltage signals, flip-flops, and 8-bit LED output ports', score: 'embedded' },
        { label: 'Eliminating CPU starvation and calculating process waiting times', score: 'systems' },
        { label: 'Reducing algorithm time complexity from O(N^2) to O(N log N)', score: 'dsa' }
      ]
    },
    {
      id: 'q3',
      question: 'What is your ideal work environment and focus?',
      options: [
        { label: 'DevOps & Cloud Site Reliability Engineer (SRE) managing production clusters', score: 'cloud' },
        { label: 'Robotics, IoT & Embedded Electronics Lab designing hardware prototypes', score: 'embedded' },
        { label: 'Systems Software Architect building core OS kernel & compiler pipelines', score: 'systems' },
        { label: 'Quant Software Engineer developing high-frequency algorithmic code', score: 'dsa' }
      ]
    }
  ];

  const osQuizQuestions = [
    {
      q: 'In Round Robin scheduling with Time Quantum q = 2s, Process P1 (Burst: 5s) arrives at t=0s. When will P1 complete execution?',
      options: ['t = 5s', 't = 9s', 't = 11s', 't = 7s'],
      answer: 2,
      explanation: 'P1 executes in slots [0-2s], [4-6s], and [10-11s]. Completion time CT = 11s.'
    },
    {
      q: 'Which formula correctly calculates Waiting Time (WT) for a process?',
      options: ['WT = Turnaround Time (TAT) - Burst Time (BT)', 'WT = Completion Time - Arrival Time', 'WT = Burst Time + Arrival Time', 'WT = Quantum x Priority'],
      answer: 0,
      explanation: 'Waiting Time (WT) is the total time spent in Ready Queue: WT = TAT - BT.'
    }
  ];

  const handleCareerAnswer = (optionScore) => {
    setCareerAnswers(prev => ({ ...prev, [careerStep]: optionScore }));
    if (careerStep < careerQuestions.length - 1) {
      setCareerStep(prev => prev + 1);
    } else {
      if (optionScore === 'cloud') {
        setCareerResult({
          title: 'Cloud Systems Architect & DevOps SRE Engineer ☁️',
          matchScore: 96,
          salary: '$135,000 – $185,000 / yr',
          desc: 'High demand career focusing on multi-region cloud topology design, Kubernetes container orchestration, NGINX load balancing, and SLA availability optimization.',
          responsibilities: [
            'Architect high-availability server clusters handling 50k+ req/sec',
            'Implement auto-scaling rules based on CPU thresholds',
            'Manage cloud infrastructure budget caps ($/month)'
          ],
          recommendedLab: 'cloud',
          skillsNeeded: ['Kubernetes', 'Terraform', 'NGINX ALB', 'AWS/GCP Architecture']
        });
      } else if (optionScore === 'embedded') {
        setCareerResult({
          title: 'Embedded Systems & Firmware Engineer ⚡',
          matchScore: 94,
          salary: '$120,000 – $165,000 / yr',
          desc: 'Specialized hardware engineering role building microcontrollers, IoT devices, digital logic circuits, and 8085/ARM microprocessor assembly firmware.',
          responsibilities: [
            'Design and simulate digital breadboard circuits and logic gates',
            'Program low-level assembly instruction sets for I/O ports',
            'Develop real-time operating system (RTOS) firmware'
          ],
          recommendedLab: 'digital',
          skillsNeeded: ['C/C++', '8085 Assembly', 'Logic Circuit Design', 'Microcontrollers']
        });
      } else if (optionScore === 'systems') {
        setCareerResult({
          title: 'Systems Software Developer & Kernel Architect ⚙️',
          matchScore: 95,
          salary: '$140,000 – $190,000 / yr',
          desc: 'Core software engineering role focusing on operating system kernel design, process scheduling algorithms, deadlock prevention, and compiler toolchains.',
          responsibilities: [
            'Implement CPU scheduling algorithms (FCFS, SJF, Round Robin)',
            'Optimize process turnaround time and ready queue latency',
            'Prevent deadlock conditions and race conditions'
          ],
          recommendedLab: 'os',
          skillsNeeded: ['OS Kernel Programming', 'C/C++', 'Concurrency & Semaphores', 'Linux Internals']
        });
      } else {
        setCareerResult({
          title: 'Algorithmic Software Engineer & Data Structures Specialist 💻',
          matchScore: 97,
          salary: '$145,000 – $200,000 / yr',
          desc: 'Top-tier engineering path developing high-frequency trading engines, search indexing algorithms, graph traversals, and dynamic programming.',
          responsibilities: [
            'Optimize time complexity from O(N^2) to O(N log N)',
            'Implement tree traversals (BST) and graph BFS algorithms',
            'Design memory-efficient data structures'
          ],
          recommendedLab: 'dsa',
          skillsNeeded: ['Algorithms & Data Structures', 'C++', 'Graph Theory', 'Time/Space Complexity']
        });
      }
      addXP(100);
    }
  };

  const handleAnswerQuiz = (optIdx) => {
    setUserSelectedOpt(optIdx);
    if (optIdx === osQuizQuestions[currentQIndex].answer) {
      setQuizScore(prev => prev + 1);
      addXP(50);
    }
  };

  const handleNextQuizQuestion = () => {
    if (currentQIndex < osQuizQuestions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
      setUserSelectedOpt(null);
    } else {
      setQuizFinished(true);
      addXP(100);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 panel-container p-6">
        <div>
          <div className="flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-cyan-600" />
            <h1 className="text-2xl font-extrabold tracking-tight font-['Outfit'] text-slate-900 dark:text-white">
              {t.quizHeader}
            </h1>
          </div>
          <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">
            AI career guidance assessment, domain matching, salary insights, and personalized context quizzes.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 rounded-xl bg-slate-200 dark:bg-slate-900 border border-slate-300 dark:border-white/10">
          <button
            onClick={() => setActiveTabState('career')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'career'
                ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Career Exploration</span>
          </button>
          <button
            onClick={() => setActiveTabState('quiz')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'quiz'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                : 'text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Personalized Quiz</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Career Guidance Module */}
      {activeTab === 'career' && (
        <div className="panel-container p-6 max-w-3xl mx-auto space-y-6">
          {!careerResult ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10">
                <span className="text-xs font-extrabold text-cyan-700 dark:text-cyan-400 uppercase tracking-wider">
                  Career Survey Step {careerStep + 1} of {careerQuestions.length}
                </span>
                {gamification && (
                  <span className="badge-gamified">
                    +100 XP / Assessment
                  </span>
                )}
              </div>

              <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
                {careerQuestions[careerStep].question}
              </h2>

              <div className="space-y-3">
                {careerQuestions[careerStep].options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleCareerAnswer(opt.score)}
                    className="w-full text-left p-4 rounded-xl bg-slate-100 dark:bg-slate-900/80 hover:bg-cyan-50 dark:hover:bg-indigo-500/20 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-slate-100 text-sm font-semibold transition-all flex items-center justify-between group shadow-sm"
                  >
                    <span>{opt.label}</span>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-600 group-hover:translate-x-1 transition-transform" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Rich Career Recommendation Output */
            <div className="space-y-6">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-pink-500 mx-auto flex items-center justify-center text-slate-950 shadow-xl shadow-amber-500/30">
                  <Briefcase className="w-8 h-8" />
                </div>
                
                <div className="flex items-center justify-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/40 text-xs font-extrabold">
                    🎯 {careerResult.matchScore}% Match
                  </span>
                  <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-400 border border-amber-500/40 text-xs font-extrabold flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5" /> {careerResult.salary}
                  </span>
                </div>

                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white font-['Outfit']">
                  {careerResult.title}
                </h2>
                <p className="text-sm text-slate-700 dark:text-slate-300 max-w-lg mx-auto leading-relaxed">
                  {careerResult.desc}
                </p>
              </div>

              {/* Responsibilities */}
              <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-300 dark:border-white/10 space-y-2 text-xs">
                <span className="font-extrabold text-slate-900 dark:text-slate-100 uppercase block">Key Job Responsibilities:</span>
                <ul className="space-y-1.5 text-slate-800 dark:text-slate-300 font-medium">
                  {careerResult.responsibilities.map((resp, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Skills Roadmap */}
              <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-300 dark:border-white/10 space-y-2">
                <span className="text-xs font-extrabold text-slate-900 dark:text-slate-100 uppercase">Target Skills Roadmap:</span>
                <div className="flex flex-wrap gap-2 pt-1">
                  {careerResult.skillsNeeded.map((skill, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 border border-indigo-300 dark:border-indigo-500/40 text-xs font-mono font-bold text-indigo-900 dark:text-indigo-200">
                      ✓ {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-center gap-3">
                <button
                  onClick={() => {
                    setCareerResult(null);
                    setCareerStep(0);
                  }}
                  className="btn-secondary text-xs"
                >
                  Retake Survey
                </button>
                <button
                  onClick={() => setActiveTab(careerResult.recommendedLab)}
                  className="btn-primary text-xs"
                >
                  <span>Launch Recommended Lab</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Personalized Quiz & AI Mistake Analyzer */}
      {activeTab === 'quiz' && (
        <div className="panel-container p-6 max-w-3xl mx-auto space-y-6">
          {!quizStarted ? (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                Create Customized Context Assessment
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                    Select Subject Module
                  </label>
                  <select
                    value={quizTopic}
                    onChange={(e) => setQuizTopic(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-slate-200 font-semibold"
                  >
                    <option value="os">⚙️ Operating Systems Unit 2 (CPU Scheduling)</option>
                    <option value="digital">⚡ Digital Electronics & Logic Gates</option>
                  </select>
                </div>

                <button
                  onClick={() => setQuizStarted(true)}
                  className="w-full btn-primary justify-center py-3"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Start Customized Quiz</span>
                </button>
              </div>
            </div>
          ) : !quizFinished ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10">
                <span className="text-xs font-extrabold text-indigo-700 dark:text-indigo-400 uppercase">
                  Question {currentQIndex + 1} of {osQuizQuestions.length}
                </span>
                <span className="text-xs font-mono font-bold text-cyan-700 dark:text-cyan-400">
                  Score: {quizScore}
                </span>
              </div>

              <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
                {osQuizQuestions[currentQIndex].q}
              </h2>

              <div className="space-y-3">
                {osQuizQuestions[currentQIndex].options.map((opt, idx) => {
                  const isSelected = userSelectedOpt === idx;
                  const isCorrect = idx === osQuizQuestions[currentQIndex].answer;
                  
                  return (
                    <button
                      key={idx}
                      disabled={userSelectedOpt !== null}
                      onClick={() => handleAnswerQuiz(idx)}
                      className={`w-full text-left p-4 rounded-xl border text-sm font-semibold transition-all ${
                        userSelectedOpt !== null
                          ? isCorrect
                            ? 'bg-emerald-100 border-emerald-500 text-emerald-900 dark:bg-emerald-500/20 dark:text-emerald-300 font-bold'
                            : isSelected
                              ? 'bg-rose-100 border-rose-500 text-rose-900 dark:bg-rose-500/20 dark:text-rose-300'
                              : 'bg-slate-100 opacity-50 text-slate-500'
                          : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-white/5 border-slate-300 dark:border-white/10 text-slate-900 dark:text-slate-200'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {userSelectedOpt !== null && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900 border border-cyan-500/30 text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                    💡 <strong>Explanation:</strong> {osQuizQuestions[currentQIndex].explanation}
                  </div>

                  <button
                    onClick={handleNextQuizQuestion}
                    className="btn-primary w-full justify-center"
                  >
                    <span>{currentQIndex < osQuizQuestions.length - 1 ? 'Next Question' : 'Finish & View AI Diagnostic'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6 py-2">
              <div className="text-center space-y-2">
                <Trophy className="w-12 h-12 text-amber-500 mx-auto animate-bounce" />
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">Quiz Completed! Score: {quizScore} / {osQuizQuestions.length}</h2>
              </div>

              {/* AI Diagnostic Error Analysis */}
              <div className="p-5 rounded-2xl bg-slate-100 dark:bg-slate-900/90 border border-amber-500/40 space-y-3 text-xs leading-relaxed">
                <div className="font-extrabold text-amber-700 dark:text-amber-400 uppercase tracking-wider flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  AI Mistake Diagnostic Analysis Report
                </div>

                <div className="space-y-2 pt-1 border-t border-slate-200 dark:border-white/10 font-medium">
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Weak Area:</span>
                    <span className="font-bold text-rose-700 dark:text-rose-400">Round Robin Scheduling Calculations</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Common Error:</span>
                    <span className="font-bold text-amber-800 dark:text-amber-300">Incorrect waiting time calculation (WT = TAT - BT)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Recommendation:</span>
                    <span className="font-bold text-cyan-700 dark:text-cyan-300">Revise timeline calculation in OS Scheduling Lab</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-center gap-3">
                <button
                  onClick={() => {
                    setQuizStarted(false);
                    setQuizFinished(false);
                    setCurrentQIndex(0);
                    setUserSelectedOpt(null);
                    setQuizScore(0);
                  }}
                  className="btn-secondary text-xs"
                >
                  Retake Quiz
                </button>
                <button
                  onClick={() => setActiveTab('os')}
                  className="btn-primary text-xs"
                >
                  Launch OS Scheduling Lab
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
