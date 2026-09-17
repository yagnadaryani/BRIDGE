'use client';

import React from 'react';
import Link from 'next/link';
import { BookOpen, Code, Cpu, Zap, CircuitBoard, Cloud, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ALL_SUBJECTS } from '@/lib/data/subjects';

export default function SubjectsOverviewPage() {
  const getIcon = (id: string) => {
    switch (id) {
      case 'dsa': return <Code className="w-6 h-6 text-primary" />;
      case 'os': return <Cpu className="w-6 h-6 text-purpleAccent" />;
      case 'digital-electronics': return <Zap className="w-6 h-6 text-amber-500" />;
      case 'microprocessor': return <CircuitBoard className="w-6 h-6 text-emerald-600" />;
      case 'cloud': return <Cloud className="w-6 h-6 text-cyanAccent" />;
      default: return <BookOpen className="w-6 h-6 text-primary" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-surface border border-subtleBorder p-5 rounded-card shadow-card space-y-1">
        <div className="flex items-center space-x-2">
          <BookOpen className="w-6 h-6 text-primary" />
          <h1 className="text-xl font-bold text-textMain">Engineering Subjects Workspaces</h1>
        </div>
        <p className="text-xs text-textSecondary">
          Select a subject to enter its dedicated Learn, Virtual Lab, Assessment, and Performance workspace.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ALL_SUBJECTS.map((subject) => (
          <Card key={subject.id} className="bg-surface border-subtleBorder hover:shadow-cardHover transition-all flex flex-col">
            <CardHeader className="p-4 mb-2 flex flex-row items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-secondaryBg border border-subtleBorder rounded-xl">
                  {getIcon(subject.id)}
                </div>
                <div>
                  <CardTitle className="text-sm font-bold text-textMain">{subject.title}</CardTitle>
                  <p className="text-[11px] text-textSecondary">{subject.code}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-4 flex-1 flex flex-col justify-between text-xs">
              <p className="text-textSecondary leading-relaxed">{subject.description}</p>

              <div className="pt-2 border-t border-subtleBorder">
                <Link href={`/student/subjects/${subject.id}`}>
                  <Button className="w-full text-xs space-x-1.5 font-semibold">
                    <span>Enter Subject Workspace</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
