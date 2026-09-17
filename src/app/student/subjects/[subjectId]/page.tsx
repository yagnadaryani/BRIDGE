'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { BookOpen, FlaskConical, Award, TrendingUp, Sparkles } from 'lucide-react';
import { ALL_SUBJECTS } from '@/lib/data/subjects';
import { TheoryViewer } from '@/components/learn/TheoryViewer';
import { DSACodeStudio } from '@/components/labs/DSACodeStudio';
import { ProcessorStudio } from '@/components/labs/ProcessorStudio';
import { CircuitLab } from '@/components/labs/CircuitLab';
import { OSSimulator } from '@/components/labs/OSSimulator';
import { CloudArchitectureLab } from '@/components/labs/CloudArchitectureLab';
import { AssessmentView } from '@/components/assess/AssessmentView';
import { PerformanceView } from '@/components/performance/PerformanceView';
import { AIAssistantDrawer } from '@/components/ai/AIAssistantDrawer';

type WorkspaceTab = 'LEARN' | 'DO' | 'PROVE' | 'GROW';

export default function SubjectWorkspacePage() {
  const params = useParams();
  const subjectId = (params?.subjectId as string) || 'dsa';
  const subject = ALL_SUBJECTS.find((s) => s.id === subjectId) || ALL_SUBJECTS[0];

  const [activeTab, setActiveTab] = useState<WorkspaceTab>('DO');
  const [isAiOpen, setIsAiOpen] = useState(false);

  const concept = subject.concepts[0];

  const renderVirtualLab = () => {
    switch (subject.id) {
      case 'dsa': return <DSACodeStudio />;
      case 'microprocessor': return <ProcessorStudio />;
      case 'digital-electronics': return <CircuitLab />;
      case 'os': return <OSSimulator />;
      case 'cloud': return <CloudArchitectureLab />;
      default: return <DSACodeStudio />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Workspace Header Tabs */}
      <div className="bg-surface border border-subtleBorder p-4 rounded-card shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-textMain">{subject.title} Workspace</h1>
          <p className="text-xs text-textSecondary mt-0.5">{subject.code} • {subject.description}</p>
        </div>

        {/* The 4 Workspace Tabs: LEARN, DO, PROVE, GROW */}
        <div className="flex bg-secondaryBg p-1 rounded-xl border border-subtleBorder space-x-1">
          <button
            onClick={() => setActiveTab('LEARN')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'LEARN'
                ? 'bg-surface text-primary shadow-sm'
                : 'text-textSecondary hover:text-textMain'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>1. LEARN</span>
          </button>

          <button
            onClick={() => setActiveTab('DO')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'DO'
                ? 'bg-surface text-primary shadow-sm'
                : 'text-textSecondary hover:text-textMain'
            }`}
          >
            <FlaskConical className="w-3.5 h-3.5 text-amber-500" />
            <span>2. DO</span>
          </button>

          <button
            onClick={() => setActiveTab('PROVE')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'PROVE'
                ? 'bg-surface text-primary shadow-sm'
                : 'text-textSecondary hover:text-textMain'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>3. PROVE</span>
          </button>

          <button
            onClick={() => setActiveTab('GROW')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'GROW'
                ? 'bg-surface text-primary shadow-sm'
                : 'text-textSecondary hover:text-textMain'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>4. GROW</span>
          </button>
        </div>
      </div>

      {/* Tab Content rendering */}
      {activeTab === 'LEARN' && (
        <TheoryViewer concept={concept} onOpenAIAssistant={() => setIsAiOpen(true)} />
      )}

      {activeTab === 'DO' && renderVirtualLab()}

      {activeTab === 'PROVE' && (
        <AssessmentView conceptId={concept.id} subjectId={subject.id} />
      )}

      {activeTab === 'GROW' && (
        <PerformanceView subjectId={subject.id} />
      )}

      <AIAssistantDrawer isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} subjectId={subject.id} conceptId={concept.id} />
    </div>
  );
}
