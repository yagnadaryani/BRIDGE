import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  SkipForward, 
  SkipBack, 
  Sparkles, 
  Film, 
  Volume2, 
  Maximize2, 
  Zap, 
  Cpu, 
  Cloud, 
  Settings 
} from 'lucide-react';

export const VideoGenerator = () => {
  const { notes, addXP, gamification, t } = useApp();
  const [selectedTopic, setSelectedTopic] = useState('rr-cpu');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);

  const videoPresets = {
    'rr-cpu': {
      title: 'Operating Systems: How Round Robin CPU Scheduling Works',
      duration: '4 Steps',
      steps: [
        {
          title: 'Step 1: Arrival & Ready Queue Initialization',
          caption: 'Processes P1 (Burst: 5s), P2 (Burst: 3s), P3 (Burst: 2s) enter the Ready Queue.',
          visual: 'ready-queue',
          activeNode: 'P1'
        },
        {
          title: 'Step 2: Time Quantum (q = 2s) Allocated to P1',
          caption: 'CPU executes P1 for 2 seconds. P1 remaining burst time becomes 3s. P1 is context-switched back to Ready Queue.',
          visual: 'cpu-exec-1',
          activeNode: 'CPU-P1'
        },
        {
          title: 'Step 3: P2 Executed & Completes Execution',
          caption: 'P2 enters CPU. Executes for 2s, then 1s. P2 finishes and exits system.',
          visual: 'cpu-exec-2',
          activeNode: 'CPU-P2'
        },
        {
          title: 'Step 4: Completion & Gantt Chart Generation',
          caption: 'P3 and P1 finish. Final Average Waiting Time calculated as 3.33ms.',
          visual: 'gantt-finish',
          activeNode: 'DONE'
        }
      ]
    },
    'half-adder': {
      title: 'Digital Electronics: 2-Bit Binary Half Adder Execution',
      duration: '4 Steps',
      steps: [
        {
          title: 'Step 1: Inputs Set (A = 1, B = 1)',
          caption: 'High voltage logic 1 signals travel down input rails A and B.',
          visual: 'inputs-high',
          activeNode: 'A1-B1'
        },
        {
          title: 'Step 2: XOR Gate Evaluates Sum Bit',
          caption: 'Input (1, 1) to XOR gate produces SUM = 0 (1 ⊕ 1 = 0).',
          visual: 'xor-eval',
          activeNode: 'SUM-0'
        },
        {
          title: 'Step 3: AND Gate Evaluates Carry Bit',
          caption: 'Input (1, 1) to AND gate produces CARRY = 1 (1 · 1 = 1).',
          visual: 'and-eval',
          activeNode: 'CARRY-1'
        },
        {
          title: 'Step 4: Output Result 1 + 1 = 10 (Decimal 2)',
          caption: 'Carry LED lights up red (1), Sum LED stays off (0). Binary result = 10.',
          visual: 'output-display',
          activeNode: 'RESULT-10'
        }
      ]
    },
    'cloud-traffic': {
      title: 'Cloud Architecture: Auto-Scaling & Load Balancer Request Distribution',
      duration: '4 Steps',
      steps: [
        {
          title: 'Step 1: Incoming Traffic Surge (10,000 req/s)',
          caption: 'User HTTP requests reach Cloudflare CDN and hit NGINX Load Balancer.',
          visual: 'traffic-surge',
          activeNode: 'CDN'
        },
        {
          title: 'Step 2: Round-Robin Distribution to Web Instance Cluster',
          caption: 'Load Balancer splits requests 50/50 across Web Server 1 and Web Server 2.',
          visual: 'traffic-split',
          activeNode: 'LB'
        },
        {
          title: 'Step 3: CPU Load Crosses 80% Threshold',
          caption: 'Auto Scaling Group detects heavy load and automatically provisions Web Server 3.',
          visual: 'auto-scale',
          activeNode: 'EC2-NEW'
        },
        {
          title: 'Step 4: System Latency Stabilizes at 45ms',
          caption: 'Traffic is balanced across 3 nodes. Budget increases slightly by $12/mo but 0% packet loss is maintained.',
          visual: 'stable',
          activeNode: 'HEALTHY'
        }
      ]
    }
  };

  const activeVideo = videoPresets[selectedTopic] || videoPresets['rr-cpu'];
  const stepsCount = activeVideo.steps.length;

  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= stepsCount - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 3000 / playbackSpeed);
    }
    return () => clearInterval(timer);
  }, [isPlaying, stepsCount, playbackSpeed]);

  const handleGenerateCustom = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setSelectedTopic('half-adder');
      setCurrentStep(0);
      setIsPlaying(true);
      addXP(50);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 glass-panel p-6">
        <div>
          <div className="flex items-center gap-2">
            <Film className="w-6 h-6 text-indigo-400" />
            <h1 className="text-2xl font-extrabold tracking-tight text-gradient font-['Outfit']">
              {t.videoHeader}
            </h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            {t.videoSub}
          </p>
        </div>

        {/* Generator Controls */}
        <div className="flex items-center gap-3">
          <select
            value={selectedTopic}
            onChange={(e) => {
              setSelectedTopic(e.target.value);
              setCurrentStep(0);
              setIsPlaying(false);
            }}
            className="bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-xs text-slate-200 font-semibold focus:outline-none focus:border-indigo-500"
          >
            <option value="rr-cpu">⚙️ OS: Round Robin Scheduling</option>
            <option value="half-adder">⚡ Digital: Half Adder Circuit Execution</option>
            <option value="cloud-traffic">☁️ Cloud: Load Balancer & Auto Scaling</option>
          </select>

          <button
            onClick={handleGenerateCustom}
            disabled={isGenerating}
            className="btn-primary text-xs"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isGenerating ? 'Rendering...' : 'Generate New Animation'}</span>
          </button>
        </div>
      </div>

      {/* Main Player Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Animated Canvas Player */}
        <div className="lg:col-span-8 glass-panel p-5 flex flex-col justify-between h-[520px] relative overflow-hidden">
          {/* Top Info Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10 z-10">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400 animate-pulse" />
              {activeVideo.title}
            </span>
            <span className="text-xs font-mono font-semibold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/30">
              Step {currentStep + 1} / {stepsCount}
            </span>
          </div>

          {/* Interactive Animation Renderer Canvas */}
          <div className="my-auto flex flex-col items-center justify-center relative min-h-[300px]">
            {/* Visual Canvas Elements based on active step */}
            <div className="w-full max-w-lg p-6 rounded-2xl bg-slate-900/90 border border-indigo-500/30 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center min-h-[220px]">
              {/* Dynamic Animated Nodes */}
              {selectedTopic === 'rr-cpu' && (
                <div className="w-full space-y-4 text-center">
                  <div className="flex justify-center gap-3">
                    {['P1 (5s)', 'P2 (3s)', 'P3 (2s)'].map((p, i) => (
                      <div
                        key={i}
                        className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all duration-500 ${
                          currentStep === i || (currentStep === 3 && i === 0)
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 scale-110 shadow-lg shadow-cyan-500/40'
                            : 'bg-slate-800 text-slate-400 border border-white/5'
                        }`}
                      >
                        {p}
                      </div>
                    ))}
                  </div>

                  {/* CPU Core */}
                  <div className="mx-auto w-32 py-3 rounded-2xl bg-gradient-to-b from-indigo-900 to-purple-950 border border-indigo-500/50 shadow-inner flex flex-col items-center">
                    <Cpu className="w-8 h-8 text-cyan-400 animate-spin" style={{ animationDuration: '4s' }} />
                    <span className="text-[11px] font-bold text-slate-200 mt-1">CPU Core 0</span>
                    <span className="text-[10px] text-cyan-300 font-mono">
                      {currentStep === 0 ? 'IDLE' : currentStep === 1 ? 'P1 Executing (q=2s)' : currentStep === 2 ? 'P2 Executing (q=2s)' : 'DONE'}
                    </span>
                  </div>
                </div>
              )}

              {selectedTopic === 'half-adder' && (
                <div className="w-full space-y-4 text-center">
                  <div className="flex justify-center gap-6 text-xs font-mono font-bold">
                    <span className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                      Input A = 1 (HIGH)
                    </span>
                    <span className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                      Input B = 1 (HIGH)
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
                    <div className={`p-3 rounded-xl border text-xs font-bold ${currentStep >= 1 ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300' : 'bg-slate-800 border-white/10 text-slate-500'}`}>
                      XOR GATE → SUM: {currentStep >= 1 ? '0' : '?'}
                    </div>
                    <div className={`p-3 rounded-xl border text-xs font-bold ${currentStep >= 2 ? 'bg-rose-500/20 border-rose-500 text-rose-300' : 'bg-slate-800 border-white/10 text-slate-500'}`}>
                      AND GATE → CARRY: {currentStep >= 2 ? '1' : '?'}
                    </div>
                  </div>
                </div>
              )}

              {selectedTopic === 'cloud-traffic' && (
                <div className="w-full space-y-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Cloud className="w-6 h-6 text-cyan-400 animate-bounce" />
                    <span className="text-xs font-bold text-slate-200">
                      Incoming Requests: {currentStep === 0 ? '1,000 req/s' : currentStep === 1 ? '10,000 req/s' : '50,000 req/s'}
                    </span>
                  </div>

                  <div className="flex justify-center gap-3">
                    {['Web Server 1 (42%)', 'Web Server 2 (48%)', 'Web Server 3 (AUTO)'].map((srv, idx) => (
                      <div
                        key={idx}
                        className={`px-3 py-2 rounded-xl text-[11px] font-mono font-bold ${
                          idx === 2 && currentStep < 2
                            ? 'opacity-30 bg-slate-800 border border-dashed border-slate-600'
                            : 'bg-indigo-900/60 border border-indigo-500/40 text-indigo-200 shadow-md'
                        }`}
                      >
                        {srv}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Player Controls Bar */}
          <div className="space-y-3 pt-3 border-t border-white/10 z-10">
            {/* Timeline Progress Bar */}
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden flex gap-1 p-0.5">
              {activeVideo.steps.map((_, i) => (
                <div
                  key={i}
                  onClick={() => setCurrentStep(i)}
                  className={`flex-1 h-full rounded-full cursor-pointer transition-all ${
                    i <= currentStep ? 'bg-indigo-400' : 'bg-slate-700'
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300"
                >
                  <SkipBack className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white shadow-md shadow-indigo-500/30"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                </button>
                <button
                  onClick={() => setCurrentStep((prev) => Math.min(stepsCount - 1, prev + 1))}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setCurrentStep(0);
                    setIsPlaying(false);
                  }}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 ml-1"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Speed controls */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400 font-semibold">Speed:</span>
                {[1, 1.5, 2].map((spd) => (
                  <button
                    key={spd}
                    onClick={() => setPlaybackSpeed(spd)}
                    className={`px-2 py-1 rounded-md font-mono ${
                      playbackSpeed === spd
                        ? 'bg-indigo-500 text-white font-bold'
                        : 'bg-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Step Breakdown & Audio Voiceover Caption Panel */}
        <div className="lg:col-span-4 glass-panel p-5 flex flex-col justify-between h-[520px]">
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-white/10">
              <Volume2 className="w-5 h-5 text-cyan-400" />
              <h3 className="font-bold text-slate-200 text-base">
                Synchronized Narrated Script
              </h3>
            </div>

            <div className="space-y-3">
              <span className="text-xs uppercase font-extrabold tracking-wider text-cyan-400 block">
                {activeVideo.steps[currentStep]?.title}
              </span>
              <p className="text-sm text-slate-200 leading-relaxed p-4 rounded-xl bg-slate-900/80 border border-cyan-500/20 shadow-inner">
                "{activeVideo.steps[currentStep]?.caption}"
              </p>
            </div>
          </div>

          {/* Timeline Steps List */}
          <div className="space-y-2 pt-4 border-t border-white/10 overflow-y-auto max-h-[220px]">
            {activeVideo.steps.map((st, i) => (
              <div
                key={i}
                onClick={() => {
                  setCurrentStep(i);
                  setIsPlaying(false);
                }}
                className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                  i === currentStep
                    ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-200 font-semibold shadow-sm'
                    : 'bg-slate-900/40 border-white/5 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="font-bold text-slate-300">
                  Step {i + 1}: {st.title}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
