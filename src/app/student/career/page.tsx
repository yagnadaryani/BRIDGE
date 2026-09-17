'use client';

import React, { useState } from 'react';
import { Compass, Sparkles, CheckCircle2, Award, Briefcase, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Navbar } from '@/components/shell/Navbar';
import { Sidebar } from '@/components/shell/Sidebar';
import { AIAssistantDrawer } from '@/components/ai/AIAssistantDrawer';

export default function CareerGuidancePage() {
  const [isAiOpen, setIsAiOpen] = useState(false);

  const careerMatches = [
    {
      title: 'Systems & Algorithmic Software Engineer',
      matchScore: 92,
      description: 'High affinity for Data Structures, Binary Search boundary optimization, and algorithmic execution.',
      keySkills: ['JavaScript / C++', 'Algorithmic Optimization', 'Boundary Diagnostics'],
      recommendedSubjects: ['Data Structures & Algorithms', 'Operating Systems'],
      nextSteps: ['Explore Advanced Graph Algorithms', 'Practice LeetCode / CodeForces Hard Problems'],
    },
    {
      title: 'Cloud Infrastructure & DevOps Engineer',
      matchScore: 84,
      description: 'Demonstrated interest in load balancing, Redis caching, and resilient multi-tier cloud topology.',
      keySkills: ['Load Balancing', 'Autoscaling Groups', 'Distributed Caching'],
      recommendedSubjects: ['Cloud Computing', 'Operating Systems'],
      nextSteps: ['Build Kubernetes Cluster', 'Terraform Infrastructure as Code'],
    },
    {
      title: 'Embedded Systems & Hardware Engineer',
      matchScore: 76,
      description: 'Strong performance in 8086 Assembly registers, instruction execution, and logic gate fault diagnosis.',
      keySkills: ['8086 Assembly', 'Logic Gate Synthesis', 'Register Pointer Arithmetic'],
      recommendedSubjects: ['Microprocessors', 'Digital Electronics'],
      nextSteps: ['Program ARM Microcontroller', 'FPGA Verilog Design'],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar onOpenAIAssistant={() => setIsAiOpen(true)} />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 space-y-6">
          {/* Header */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-2">
            <div className="flex items-center space-x-2">
              <Compass className="w-6 h-6 text-sky-400" />
              <h1 className="text-xl font-bold text-slate-100">Engineering Career Exploration</h1>
              <Badge variant="info">Evidence-Based Guidance</Badge>
            </div>
            <p className="text-xs text-slate-400">
              Maps your demonstrated learning behaviors, debugging capabilities, and virtual lab performance to prospective engineering career paths.
            </p>
          </div>

          {/* Interest Profile Summary */}
          <Card>
            <CardHeader className="p-4 mb-2">
              <CardTitle className="text-sm font-bold text-slate-100">Demonstrated Skill Aptitude Profile</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Algorithmic Logic</span>
                  <span className="font-mono text-indigo-400 font-bold">88%</span>
                </div>
                <Progress value={88} colorClass="bg-indigo-500" />
              </div>
              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>System Resilience & Cloud</span>
                  <span className="font-mono text-sky-400 font-bold">82%</span>
                </div>
                <Progress value={82} colorClass="bg-sky-500" />
              </div>
              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Hardware & Registers</span>
                  <span className="font-mono text-purple-400 font-bold">75%</span>
                </div>
                <Progress value={75} colorClass="bg-purple-500" />
              </div>
            </CardContent>
          </Card>

          {/* Career Matches List */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-slate-200">Recommended Career Focus Areas</h2>

            <div className="grid grid-cols-1 gap-4">
              {careerMatches.map((c, idx) => (
                <Card key={idx} className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-all">
                  <CardHeader className="p-4 mb-2 flex flex-row items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 font-bold text-sm">
                        #{idx + 1}
                      </div>
                      <div>
                        <CardTitle className="text-sm font-bold text-slate-100">{c.title}</CardTitle>
                        <p className="text-xs text-slate-400 mt-0.5">{c.description}</p>
                      </div>
                    </div>
                    <Badge variant="success" className="text-sm font-mono">{c.matchScore}% Match</Badge>
                  </CardHeader>

                  <CardContent className="p-4 pt-0 space-y-3 text-xs">
                    <div className="flex flex-wrap gap-2">
                      <span className="text-slate-400 font-semibold">Key Skills:</span>
                      {c.keySkills.map((sk, i) => (
                        <Badge key={i} variant="default" className="text-[10px]">{sk}</Badge>
                      ))}
                    </div>

                    <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
                      <span className="font-bold text-indigo-300 text-[11px] block">Recommended Action Items:</span>
                      {c.nextSteps.map((step, sIdx) => (
                        <div key={sIdx} className="text-slate-300 text-[11px] flex items-center space-x-1.5">
                          <ArrowRight className="w-3 h-3 text-indigo-400" />
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>

      <AIAssistantDrawer isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />
    </div>
  );
}
