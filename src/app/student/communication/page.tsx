'use client';

import React, { useState } from 'react';
import { Mic, MicOff, Volume2, Sparkles, Award, CheckCircle2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Navbar } from '@/components/shell/Navbar';
import { Sidebar } from '@/components/shell/Sidebar';
import { AIAssistantDrawer } from '@/components/ai/AIAssistantDrawer';

export default function TechnicalCommunicationPage() {
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [scenario, setScenario] = useState<'2_MARK' | '4_MARK' | 'VIVA' | 'INTERVIEW'>('VIVA');
  const [topic, setTopic] = useState('Explain the operational difference between FCFS and Round Robin CPU scheduling.');
  const [isRecording, setIsRecording] = useState(false);
  const [spokenText, setSpokenText] = useState(
    'In FCFS processes execute in arrival order without preemption. In Round Robin each process gets a time quantum TQ slice. If TQ is too small context switch overhead increases.'
  );
  const [evaluating, setEvaluating] = useState(false);
  const [evalResult, setEvalResult] = useState<any>(null);

  const handleEvaluate = async () => {
    setEvaluating(true);
    setTimeout(() => {
      setEvalResult({
        technicalAccuracy: 88,
        structure: 72,
        fluency: 80,
        vocabulary: 78,
        overallScore: 80,
        gapDistinction: 'KNOWLEDGE VS COMMUNICATION GAP: Strong conceptual grasp of time quanta and preemption. Structurally, lead with a formal definition before comparing context switch overhead.',
        suggestedStructure: [
          '1. Direct Definition of both algorithms',
          '2. Contrast Mechanism (Non-preemptive vs Time-sliced preemptive)',
          '3. Impact of Time Quantum size',
          '4. Practical OS Example (e.g. Interactive systems vs Batch processing)'
        ],
        examinerModelResponse: 'First-Come First-Served (FCFS) is a non-preemptive scheduling policy where tasks execute strictly in arrival order. Conversely, Round Robin (RR) is a preemptive algorithm that allocates fixed time quanta (TQ) per process. If TQ is set excessively small, context-switch overhead dominates CPU utilization.'
      });
      setEvaluating(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-page text-textMain flex flex-col">
      <Navbar onOpenAIAssistant={() => setIsAiOpen(true)} />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 space-y-6">
          {/* Header */}
          <div className="bg-surface border border-subtleBorder p-5 rounded-card shadow-card space-y-2">
            <div className="flex items-center space-x-2">
              <Mic className="w-6 h-6 text-purpleAccent" />
              <h1 className="text-xl font-bold text-textMain">Technical English & Examiner Viva Lab</h1>
              <Badge variant="purple">English Only</Badge>
            </div>
            <p className="text-xs text-textSecondary">
              Practice expressing engineering concepts verbally in English. Evaluates technical accuracy separately from language structure.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

            {/* Scenario & Speech Input (6 cols) */}
            <div className="lg:col-span-6 space-y-4">
              <Card>
                <CardHeader className="p-3 mb-2">
                  <CardTitle className="text-xs font-bold text-textMain">1. Select Examiner Scenario</CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0 flex gap-2">
                  {(['VIVA', '2_MARK', '4_MARK', 'INTERVIEW'] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setScenario(s)}
                      className={`flex-1 p-2.5 rounded-xl border text-xs font-bold transition-all ${
                        scenario === s
                          ? 'bg-purple-50 border-purple-300 text-purple-900 shadow-sm'
                          : 'bg-secondaryBg border-subtleBorder text-textSecondary hover:bg-subtleBorder'
                      }`}
                    >
                      {s.replace('_', ' ')}
                    </button>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="p-3 mb-2">
                  <CardTitle className="text-xs font-bold text-textMain">2. Examiner Question Topic</CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <div className="p-3 bg-secondaryBg border border-subtleBorder rounded-xl text-xs font-semibold text-textMain">
                    "{topic}"
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="p-3 mb-2 flex flex-row items-center justify-between">
                  <CardTitle className="text-xs font-bold text-textMain">3. Speak / Type Response</CardTitle>
                  <Button
                    size="sm"
                    variant={isRecording ? 'destructive' : 'outline'}
                    onClick={() => setIsRecording(!isRecording)}
                    className="text-xs py-1 px-3"
                  >
                    {isRecording ? <MicOff className="w-3.5 h-3.5 mr-1" /> : <Mic className="w-3.5 h-3.5 mr-1 text-purpleAccent" />}
                    {isRecording ? 'Stop Recording' : 'Record Audio'}
                  </Button>
                </CardHeader>
                <CardContent className="p-3 pt-0 space-y-3">
                  <textarea
                    value={spokenText}
                    onChange={(e) => setSpokenText(e.target.value)}
                    rows={4}
                    className="w-full bg-secondaryBg border border-subtleBorder rounded-xl p-3 text-xs text-textMain focus:outline-none focus:border-primary"
                    placeholder="Speak or type your technical answer in English..."
                  />

                  <Button size="sm" onClick={handleEvaluate} disabled={evaluating} className="w-full text-xs bg-purpleAccent hover:opacity-90 text-white font-bold">
                    {evaluating ? <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 mr-1.5" />}
                    Analyze Technical Speech Rubric
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Rubric Feedback Output (6 cols) */}
            <div className="lg:col-span-6 space-y-4">
              {evalResult ? (
                <Card className="border-purple-200 bg-surface shadow-card space-y-4">
                  <CardHeader className="p-4 mb-2 flex flex-row items-center justify-between">
                    <CardTitle className="text-xs font-bold text-purple-900">Technical Communication Evaluation</CardTitle>
                    <Badge variant="purple" className="text-sm font-mono font-bold">{evalResult.overallScore}% Overall</Badge>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 space-y-4 text-xs">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="flex justify-between text-[11px] text-textSecondary mb-1 font-semibold">
                          <span>Technical Accuracy</span>
                          <span className="font-mono text-emerald-600 font-bold">{evalResult.technicalAccuracy}%</span>
                        </div>
                        <Progress value={evalResult.technicalAccuracy} colorClass="bg-emerald-500" />
                      </div>
                      <div>
                        <div className="flex justify-between text-[11px] text-textSecondary mb-1 font-semibold">
                          <span>Answer Structure</span>
                          <span className="font-mono text-amber-600 font-bold">{evalResult.structure}%</span>
                        </div>
                        <Progress value={evalResult.structure} colorClass="bg-amber-500" />
                      </div>
                      <div>
                        <div className="flex justify-between text-[11px] text-textSecondary mb-1 font-semibold">
                          <span>English Fluency</span>
                          <span className="font-mono text-cyanAccent font-bold">{evalResult.fluency}%</span>
                        </div>
                        <Progress value={evalResult.fluency} colorClass="bg-cyanAccent" />
                      </div>
                      <div>
                        <div className="flex justify-between text-[11px] text-textSecondary mb-1 font-semibold">
                          <span>Domain Vocabulary</span>
                          <span className="font-mono text-purpleAccent font-bold">{evalResult.vocabulary}%</span>
                        </div>
                        <Progress value={evalResult.vocabulary} colorClass="bg-purpleAccent" />
                      </div>
                    </div>

                    <div className="p-3 bg-secondaryBg border border-subtleBorder rounded-xl space-y-1">
                      <span className="font-bold text-primary block text-[11px]">Knowledge vs Communication Analysis:</span>
                      <p className="text-[11px] text-textMain leading-relaxed">{evalResult.gapDistinction}</p>
                    </div>

                    <div className="p-3 bg-secondaryBg border border-subtleBorder rounded-xl space-y-1">
                      <span className="font-bold text-textMain block text-[11px]">"Explain Like I'm the Examiner" Model Response:</span>
                      <p className="text-[11px] text-emerald-800 leading-relaxed italic font-medium">{evalResult.examinerModelResponse}</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-surface border-subtleBorder p-8 text-center text-textMuted text-xs shadow-card">
                  Speak or submit an answer to receive multi-dimensional technical speech feedback.
                </Card>
              )}
            </div>

          </div>
        </main>
      </div>

      <AIAssistantDrawer isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />
    </div>
  );
}
