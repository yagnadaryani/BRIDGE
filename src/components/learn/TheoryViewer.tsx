'use client';

import React, { useState } from 'react';
import { BookOpen, Languages, Sparkles, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Concept } from '@/types/subject';

interface TheoryViewerProps {
  concept: Concept;
  onOpenAIAssistant?: () => void;
}

export function TheoryViewer({ concept, onOpenAIAssistant }: TheoryViewerProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<'EN' | 'HI' | 'MR'>('EN');

  const getExplanation = () => {
    if (selectedLanguage === 'HI' && concept.theory.hindiExplanation) {
      return concept.theory.hindiExplanation;
    }
    if (selectedLanguage === 'MR' && concept.theory.marathiExplanation) {
      return concept.theory.marathiExplanation;
    }
    return concept.theory.overview;
  };

  return (
    <div className="space-y-4">
      {/* Header & Language Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface border border-subtleBorder p-4 rounded-card shadow-card">
        <div>
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <h2 className="text-base font-bold text-textMain">{concept.title}</h2>
            <Badge variant="info">{concept.difficulty}</Badge>
          </div>
          <p className="text-xs text-textSecondary mt-1">{concept.description}</p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-textSecondary font-medium flex items-center">
            <Languages className="w-3.5 h-3.5 mr-1" /> Language:
          </span>
          {(['EN', 'HI', 'MR'] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => setSelectedLanguage(lang)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                selectedLanguage === lang
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-secondaryBg text-textSecondary hover:text-textMain'
              }`}
            >
              {lang === 'EN' ? 'English' : lang === 'HI' ? 'हिंदी' : 'मराठी'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Theory Explanation */}
      <Card>
        <CardHeader className="p-4 mb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-bold text-textMain">
            Core Engineering Concept Explanation ({selectedLanguage})
          </CardTitle>
          {onOpenAIAssistant && (
            <Button size="sm" variant="ghost" onClick={onOpenAIAssistant} className="text-xs text-primary">
              <Sparkles className="w-3.5 h-3.5 mr-1 text-primary" /> Explain Differently with AI
            </Button>
          )}
        </CardHeader>
        <CardContent className="p-4 pt-0 space-y-4 text-xs leading-relaxed text-textSecondary">
          <p className="text-sm text-textMain bg-secondaryBg p-4 rounded-xl border border-subtleBorder leading-relaxed">
            {getExplanation()}
          </p>

          <div>
            <h4 className="font-bold text-textMain text-xs mb-2">Key Invariants & Mechanics:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {concept.theory.keyPoints.map((point, idx) => (
                <div key={idx} className="p-3 bg-secondaryBg border border-subtleBorder rounded-xl flex items-center space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span className="text-textMain font-medium">{point}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
