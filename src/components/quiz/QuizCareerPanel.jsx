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
  Code2,
  Target,
  Layers,
  Award,
  Wrench,
  Check
} from 'lucide-react';

export const QuizCareerPanel = () => {
  const { addXP, gamification, setActiveTab, t } = useApp();

  const [activeTab, setActiveTabState] = useState('career_readiness'); // 'career_readiness' | 'quiz' | 'survey'
  const [selectedTargetRole, setSelectedTargetRole] = useState('cloud_sre');

  // Quiz state
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userSelectedOpt, setUserSelectedOpt] = useState(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // Target Roles Data
  const targetRolesData = {
    cloud_sre: {
      title: 'Cloud Systems Architect & DevOps SRE ☁️',
      salary: '$135,000 – $185,000 / yr',
      desc: 'High demand path building cloud topology, autoscaling rules, NGINX load balancing, and high-availability clusters.',
      overallReadiness: 84,
      skillsGap: [
        { name: 'Python Systems Scripting', current: 85, required: 90, gap: 5, action: 'Complete Python automation mission in Chatbot' },
        { name: 'Cloud Infrastructure & ALB', current: 90, required: 95, gap: 5, action: 'Master Cloud Topology in Cloud Lab' },
        { name: 'Linux OS Kernels & Scheduling', current: 75, required: 90, gap: 15, action: 'Solve Round Robin Quantum in OS Lab' },
        { name: 'Kubernetes & Container Orchestration', current: 60, required: 85, gap: 25, action: 'Complete Autoscaling Surge Lab Mission' }
      ],
      roadmap: [
        { stage: 'Stage 1: Foundation', desc: 'Master OS CPU scheduling, process queues, and memory management.' },
        { stage: 'Stage 2: Core Skills', desc: 'Configure NGINX ALB, SSL termination, and Redis caching layers.' },
        { stage: 'Stage 3: Projects', desc: 'Build multi-region cloud topology handling 50k req/s traffic spikes.' },
        { stage: 'Stage 4: Advanced', desc: 'Implement automated failover & zero-downtime database replication.' },
        { stage: 'Stage 5: Career Ready', desc: 'SRE Mock interviews & infrastructure code review.' }
      ],
      recommendedProject: {
        title: 'Distributed Multi-Region Load-Balanced Microservice',
        problem: 'Simulate handling 50,000 req/s traffic spikes under a $250/mo cloud budget constraint with 99.99% uptime.',
        skillsRequired: ['NGINX ALB', 'Redis Cache', 'Auto-Scaling', 'Docker'],
        difficulty: 'Advanced Engineering',
        portfolioValue: '9.5 / 10',
        linkedTab: 'cloud'
      },
      nextActions: [
        { title: '1. Resolve OS Round Robin Quantum Gap', desc: 'Your OS scheduling skill is at 75%. Practice Round Robin Gantt calculation in OS Lab.', tab: 'os' },
        { title: '2. Complete Cloud Load Balancing Mission', desc: 'Simulate 50k req/s traffic spike without exceeding $250 budget limit.', tab: 'cloud' }
      ]
    },
    aiml_engineer: {
      title: 'AI / Machine Learning Systems Engineer 🧠',
      salary: '$145,000 – $200,000 / yr',
      desc: 'Top-tier career building neural network inference engines, model optimization, and GenAI pipeline architecture.',
      overallReadiness: 76,
      skillsGap: [
        { name: 'Python & Vectorized Math', current: 80, required: 95, gap: 15, action: 'Practice array pointer trace in DSA Lab' },
        { name: 'Data Structures & Trees (BST)', current: 70, required: 90, gap: 20, action: 'Fix tree recursion bug in DSA Lab' },
        { name: 'PyTorch / TensorFlow Frameworks', current: 55, required: 85, gap: 30, action: 'Complete AI Model Optimization Quiz' },
        { name: 'GPU Acceleration & CUDA Memory', current: 50, required: 80, gap: 30, action: 'Study 8085 opcode registers in Micro Lab' }
      ],
      roadmap: [
        { stage: 'Stage 1: Foundation', desc: 'Linear algebra, matrix operations, and Big-O algorithm analysis.' },
        { stage: 'Stage 2: Core Skills', desc: 'Supervised/unsupervised ML algorithms and loss function optimization.' },
        { stage: 'Stage 3: Projects', desc: 'Train LLM fine-tuned model for domain RAG question answering.' },
        { stage: 'Stage 4: Advanced', desc: 'Deploy ONNX model runtime with quantized INT8 GPU acceleration.' },
        { stage: 'Stage 5: Career Ready', desc: 'ML System Design interview prep & research paper code implementation.' }
      ],
      recommendedProject: {
        title: 'RAG-Powered Code Search & Diagnostic Engine',
        problem: 'Build an AI assistant that ingests repository source files and diagnoses syntax bugs in real time.',
        skillsRequired: ['Python', 'Embeddings', 'Vector DB', 'PyTorch'],
        difficulty: 'Advanced AI',
        portfolioValue: '9.8 / 10',
        linkedTab: 'chat'
      },
      nextActions: [
        { title: '1. Practice Tree Recursion in DSA Lab', desc: 'Close your 20% gap in Data Structures & Graph Traversals.', tab: 'dsa' },
        { title: '2. Complete AI Companion Practice Quiz', desc: 'Test model fine-tuning and vector prompt concepts.', tab: 'quiz' }
      ]
    },
    software_dev: {
      title: 'Full-Stack Software Developer & Systems Architect 💻',
      salary: '$125,000 – $175,000 / yr',
      desc: 'Versatile engineering path designing web platforms, REST/GraphQL APIs, microservices, and modern frontend UIs.',
      overallReadiness: 88,
      skillsGap: [
        { name: 'JavaScript / React & State', current: 90, required: 90, gap: 0, action: 'Mastered! Excellent proficiency' },
        { name: 'Algorithms & Data Structures', current: 85, required: 90, gap: 5, action: 'Practice Bubble/Quick Sort in DSA Lab' },
        { name: 'SQL & Database Indexing', current: 75, required: 85, gap: 10, action: 'Review DB crash recovery in Cloud Lab' },
        { name: 'Git & CI/CD Pipelines', current: 80, required: 85, gap: 5, action: 'Complete Git workflow mission' }
      ],
      roadmap: [
        { stage: 'Stage 1: Foundation', desc: 'HTML/CSS, JS ES6+, and responsive UI design principles.' },
        { stage: 'Stage 2: Core Skills', desc: 'React component architecture, state context, and REST API integration.' },
        { stage: 'Stage 3: Projects', desc: 'Develop full-stack web application with role-based auth & database.' },
        { stage: 'Stage 4: Advanced', desc: 'Implement WebSockets for live data sync & automated testing suites.' },
        { stage: 'Stage 5: Career Ready', desc: 'System design interview practice & portfolio deployment.' }
      ],
      recommendedProject: {
        title: 'Real-Time Interactive Engineering Simulation Hub',
        problem: 'Create a full-stack platform with interactive virtual breadboards, process Gantt charts, and user analytics.',
        skillsRequired: ['React 18', 'State Management', 'Tailwind CSS', 'Vite'],
        difficulty: 'Intermediate / Advanced',
        portfolioValue: '9.2 / 10',
        linkedTab: 'digital'
      },
      nextActions: [
        { title: '1. Complete DSA Array Pointer Mission', desc: 'Close remaining 5% gap in algorithm optimization.', tab: 'dsa' },
        { title: '2. Build Interactive Breadboard UI', desc: 'Enhance your portfolio with circuit simulation code.', tab: 'digital' }
      ]
    }
  };

  const currentRole = targetRolesData[selectedTargetRole] || targetRolesData.cloud_sre;

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
    <div className="space-y-6 text-slate-100">
      {/* Header */}
      <div className={`flex flex-wrap items-center justify-between gap-4 p-6 rounded-2xl border transition-all ${
        gamification ? 'glass-panel border-cyan-500/30' : 'bg-white border-black text-black shadow-md'
      }`}>
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-6 h-6 text-cyan-500" />
            <h1 className={`text-2xl font-extrabold tracking-tight font-['Outfit'] ${gamification ? 'text-gradient' : 'text-black'}`}>
              {t.quizHeader} & Evidence-Based Career Readiness
            </h1>
          </div>
          <p className={`text-sm mt-1 font-semibold ${gamification ? 'text-slate-300' : 'text-black'}`}>
            Personalized target career roadmaps, skill gap analysis, project recommendations, and integrated practice quizzes.
          </p>
        </div>

        {/* Top Tab Switcher */}
        <div className={`flex p-1 rounded-xl border text-xs ${
          gamification ? 'bg-slate-900 border-white/10' : 'bg-white border-black text-black'
        }`}>
          <button
            onClick={() => setActiveTabState('career_readiness')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all ${
              activeTab === 'career_readiness'
                ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-md'
                : gamification
                  ? 'text-slate-300 hover:text-white'
                  : 'text-black hover:bg-slate-200'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Career Readiness Profile</span>
          </button>

          <button
            onClick={() => setActiveTabState('quiz')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all ${
              activeTab === 'quiz'
                ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-md'
                : gamification
                  ? 'text-slate-300 hover:text-white'
                  : 'text-black hover:bg-slate-200'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>AI Practice Quiz</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: CAREER READINESS & INTEGRATED LEARNING */}
      {activeTab === 'career_readiness' && (
        <div className="space-y-6">
          {/* Target Role Selection Bar */}
          <div className={`p-4 rounded-2xl border space-y-3 ${
            gamification ? 'glass-panel border-white/10' : 'bg-white border-black text-black shadow-md'
          }`}>
            <span className="text-xs font-extrabold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5 font-mono">
              <Target className="w-4 h-4 text-cyan-400" /> Select Your Target Engineering Role:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'cloud_sre', label: '☁️ Cloud SRE / DevOps Architect' },
                { id: 'aiml_engineer', label: '🧠 AI / Machine Learning Engineer' },
                { id: 'software_dev', label: '💻 Full-Stack Software Developer' }
              ].map(roleItem => (
                <button
                  key={roleItem.id}
                  onClick={() => setSelectedTargetRole(roleItem.id)}
                  className={`p-3 rounded-xl text-xs font-extrabold transition-all border text-left flex items-center justify-between ${
                    selectedTargetRole === roleItem.id
                      ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white border-cyan-400 shadow-lg shadow-cyan-500/20'
                      : gamification
                        ? 'bg-slate-900 border-white/10 text-slate-200 hover:border-cyan-500/40'
                        : 'bg-slate-50 border-black text-black hover:bg-slate-100'
                  }`}
                >
                  <span>{roleItem.label}</span>
                  {selectedTargetRole === roleItem.id && <Check className="w-4 h-4 text-white" />}
                </button>
              ))}
            </div>
          </div>

          {/* Role Overview Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950 via-slate-900 to-cyan-950 border border-cyan-500/40 shadow-2xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyan-400 block font-mono">
                  EVIDENCE-BASED CAREER READINESS PROFILE
                </span>
                <h2 className="text-2xl font-extrabold font-['Outfit'] text-white mt-0.5">
                  {currentRole.title}
                </h2>
                <p className="text-xs text-slate-300 mt-1 max-w-2xl">{currentRole.desc}</p>
              </div>

              <div className="text-right p-4 rounded-xl bg-slate-900/90 border border-cyan-500/30">
                <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Skill Roadmap Progress</span>
                <div className="text-3xl font-extrabold text-cyan-400 font-mono">{currentRole.overallReadiness}%</div>
                <span className="text-[10px] text-emerald-400 font-bold block mt-0.5">Salary Range: {currentRole.salary}</span>
              </div>
            </div>
          </div>

          {/* SECTION B: SKILL GAP ANALYSIS */}
          <div className={`p-6 rounded-2xl border space-y-4 ${
            gamification ? 'glass-panel border-white/10' : 'bg-white border-black text-black shadow-md'
          }`}>
            <h3 className="font-extrabold text-sm uppercase tracking-wider text-cyan-400 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              Skill Gap Analysis & Recommended BRIDGE Missions
            </h3>

            <div className="space-y-4">
              {currentRole.skillsGap.map((sk, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-900 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between font-bold text-xs">
                    <span className="text-slate-100 font-extrabold">{sk.name}</span>
                    <div className="flex items-center gap-3 font-mono">
                      <span className="text-slate-400">Current: {sk.current}%</span>
                      <span className="text-cyan-400">Required: {sk.required}%</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] ${
                        sk.gap === 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-300'
                      }`}>
                        {sk.gap === 0 ? 'Mastered' : `Gap: -${sk.gap}%`}
                      </span>
                    </div>
                  </div>

                  {/* Dual Bar Gauge (Current vs Required) */}
                  <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden p-0.5 relative">
                    <div
                      className="bg-cyan-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${sk.current}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1 text-xs">
                    <span className="text-amber-300 font-semibold flex items-center gap-1">
                      💡 <strong>Action:</strong> {sk.action}
                    </span>
                    <button
                      onClick={() => setActiveTab('progress')}
                      className="text-cyan-400 hover:underline font-bold text-[11px]"
                    >
                      Open Mission in Passport ➔
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION C: CAREER ROADMAP & SECTION D: PROJECT RECOMMENDER */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* 5-Stage Step-by-Step Roadmap (7 cols) */}
            <div className={`lg:col-span-7 p-6 rounded-2xl border space-y-4 ${
              gamification ? 'glass-panel border-white/10' : 'bg-white border-black text-black shadow-md'
            }`}>
              <h3 className="font-extrabold text-sm uppercase tracking-wider text-purple-400 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-purple-400" />
                5-Stage Step-by-Step Career Roadmap
              </h3>

              <div className="space-y-3">
                {currentRole.roadmap.map((rd, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-slate-900 border border-white/10 space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold text-purple-300">
                      <span>{rd.stage}</span>
                      <span className="text-[10px] text-emerald-400">Milestone {i + 1}/5</span>
                    </div>
                    <p className="text-xs text-slate-300">{rd.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Project Recommender (5 cols) */}
            <div className={`lg:col-span-5 p-6 rounded-2xl border space-y-4 ${
              gamification ? 'glass-panel border-white/10' : 'bg-white border-black text-black shadow-md'
            }`}>
              <h3 className="font-extrabold text-sm uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                <Wrench className="w-4 h-4 text-emerald-400" />
                Recommended Capstone Project
              </h3>

              <div className="p-4 rounded-xl bg-slate-900 border border-emerald-500/30 space-y-3 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-400 font-mono">Portfolio Highlight</span>
                  <h4 className="text-base font-extrabold text-white mt-0.5">{currentRole.recommendedProject.title}</h4>
                </div>

                <p className="text-slate-300 leading-relaxed">{currentRole.recommendedProject.problem}</p>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Tech Stack & Tools:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {currentRole.recommendedProject.skillsRequired.map((sk, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-mono border border-cyan-500/30 font-bold">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <span className="text-amber-400 font-bold">Portfolio Value: {currentRole.recommendedProject.portfolioValue}</span>
                  <button
                    onClick={() => setActiveTab(currentRole.recommendedProject.linkedTab)}
                    className="btn-primary text-xs py-1.5 px-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white"
                  >
                    <span>Launch Project Module</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION F: "WHAT SHOULD I DO NEXT?" ENGINE */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-950/60 via-slate-900 to-indigo-950/60 border border-amber-500/50 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-amber-400 font-extrabold text-sm uppercase tracking-wider font-mono">
              <Sparkles className="w-5 h-5 text-amber-400 animate-spin" style={{ animationDuration: '8s' }} />
              "Your Next Best Career Action" Engine
            </div>

            <p className="text-xs text-slate-200">
              Based on your skill gap analysis for <strong>{currentRole.title}</strong>, BRIDGE has generated 2 high-priority actions to advance your roadmap:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentRole.nextActions.map((act, i) => (
                <div key={i} className="p-4 rounded-xl bg-slate-900/90 border border-amber-500/30 space-y-2 flex flex-col justify-between">
                  <div>
                    <h4 className="font-extrabold text-sm text-amber-300">{act.title}</h4>
                    <p className="text-xs text-slate-300 mt-1">{act.desc}</p>
                  </div>
                  <button
                    onClick={() => setActiveTab(act.tab)}
                    className="btn-primary text-xs py-2 justify-center bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-black mt-2"
                  >
                    <span>Execute Action Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: AI PRACTICE QUIZ */}
      {activeTab === 'quiz' && (
        <div className={`p-6 rounded-2xl border space-y-6 ${
          gamification ? 'glass-panel border-cyan-500/30' : 'bg-white border-black text-black shadow-md'
        }`}>
          {!quizStarted ? (
            <div className="text-center py-8 space-y-4 max-w-lg mx-auto">
              <div className="p-4 rounded-full bg-cyan-500/20 text-cyan-400 w-16 h-16 mx-auto flex items-center justify-center border border-cyan-500/40">
                <HelpCircle className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-extrabold font-['Outfit']">Interactive OS Scheduling Quiz</h2>
              <p className="text-xs text-slate-300">
                Test your knowledge on Round Robin quantum calculation, turnaround time, and CPU process queue formulas.
              </p>
              <button
                onClick={() => setQuizStarted(true)}
                className="btn-primary py-3 px-8 text-sm font-extrabold mx-auto bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-xl"
              >
                <span>Start Quiz Challenge</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : quizFinished ? (
            <div className="text-center py-8 space-y-4 max-w-lg mx-auto">
              <div className="p-4 rounded-full bg-emerald-500/20 text-emerald-400 w-16 h-16 mx-auto flex items-center justify-center border border-emerald-500/40 animate-bounce">
                <Trophy className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-extrabold font-['Outfit']">Quiz Completed!</h2>
              <p className="text-base font-extrabold text-cyan-400 font-mono">
                Your Score: {quizScore} / {osQuizQuestions.length} ({Math.round((quizScore / osQuizQuestions.length) * 100)}%)
              </p>
              <p className="text-xs text-slate-300">
                +100 XP awarded to your Learning Passport! Your career readiness score for OS Scheduling has been updated.
              </p>
              <button
                onClick={() => {
                  setQuizStarted(false);
                  setQuizFinished(false);
                  setCurrentQIndex(0);
                  setQuizScore(0);
                  setUserSelectedOpt(null);
                }}
                className="btn-primary py-2.5 px-6 text-xs font-bold mx-auto"
              >
                <span>Retake Quiz Challenge</span>
              </button>
            </div>
          ) : (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                <span>Question {currentQIndex + 1} of {osQuizQuestions.length}</span>
                <span className="text-cyan-400 font-mono">Score: {quizScore}</span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-white/10 space-y-4">
                <h3 className="text-base font-extrabold text-slate-100">
                  {osQuizQuestions[currentQIndex].q}
                </h3>

                <div className="space-y-2">
                  {osQuizQuestions[currentQIndex].options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAnswerQuiz(idx)}
                      disabled={userSelectedOpt !== null}
                      className={`w-full p-3.5 rounded-xl border text-xs text-left font-bold transition-all ${
                        userSelectedOpt === idx
                          ? idx === osQuizQuestions[currentQIndex].answer
                            ? 'bg-emerald-500/30 border-emerald-500 text-emerald-300'
                            : 'bg-rose-500/30 border-rose-500 text-rose-300'
                          : 'bg-slate-950 border-white/10 text-slate-200 hover:border-cyan-500/50'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>

                {userSelectedOpt !== null && (
                  <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-xs text-cyan-300 font-semibold space-y-1">
                    💡 <strong>Explanation:</strong> {osQuizQuestions[currentQIndex].explanation}
                  </div>
                )}
              </div>

              {userSelectedOpt !== null && (
                <button
                  onClick={handleNextQuizQuestion}
                  className="w-full btn-primary py-3 justify-center text-xs bg-gradient-to-r from-cyan-600 to-indigo-600 text-white"
                >
                  <span>{currentQIndex < osQuizQuestions.length - 1 ? 'Next Question ➔' : 'View Quiz Results'}</span>
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
