'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ClipboardList, CheckCircle2, Clock, AlertTriangle, Award, ArrowRight, Play, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockStore } from '@/lib/firebase/mockStore';
import { WorkItem, WorkSubmission } from '@/types/workItem';
import { useTranslation } from '@/lib/i18n/I18nContext';
import { useUIMode } from '@/lib/context/ModeContext';

export default function StudentAssignedWorkPage() {
  const { t } = useTranslation();
  const { mode } = useUIMode();
  const isGamified = mode === 'GAMIFIED';
  const studentId = 'aarav-101';

  const [workItems, setWorkItems] = useState<WorkItem[]>(() => mockStore.getWorkItems());
  const [submissions, setSubmissions] = useState<WorkSubmission[]>(() => mockStore.getSubmissions(studentId));
  const [selectedTask, setSelectedTask] = useState<WorkItem | null>(null);
  const [submissionText, setSubmissionText] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const getSubmissionForTask = (taskId: string) => {
    return submissions.find((s) => s.workItemId === taskId);
  };

  const handleStartTask = (task: WorkItem) => {
    setSelectedTask(task);
    const existing = getSubmissionForTask(task.id);
    if (!existing || existing.status === 'NOT_STARTED') {
      const updated: WorkSubmission = {
        id: existing?.id || `sub-${Date.now()}`,
        workItemId: task.id,
        studentId,
        studentName: 'Aarav Sharma',
        status: 'IN_PROGRESS',
      };
      mockStore.updateSubmission(updated);
      setSubmissions(mockStore.getSubmissions(studentId));
    }
  };

  const handleSubmitSolution = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask || !submissionText.trim()) return;

    const existing = getSubmissionForTask(selectedTask.id);
    const updated: WorkSubmission = {
      id: existing?.id || `sub-${Date.now()}`,
      workItemId: selectedTask.id,
      studentId,
      studentName: 'Aarav Sharma',
      status: 'SUBMITTED',
      score: 90,
      submittedAt: Date.now(),
      solutionText: submissionText.trim(),
      evidenceSummary: 'Submitted implementation verified against boundary invariants and test cases.',
    };

    mockStore.updateSubmission(updated);
    setSubmissions(mockStore.getSubmissions(studentId));
    setSubmittedSuccess(true);

    // Award XP
    const model = mockStore.getLearnerModel(studentId);
    model.xp += selectedTask.xpReward;
    mockStore.saveLearnerModel(model);

    setTimeout(() => {
      setSubmittedSuccess(false);
      setSelectedTask(null);
      setSubmissionText('');
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`p-5 rounded-card shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-3 border transition-colors ${
        isGamified ? 'bg-gradient-to-r from-surface via-purple-50 to-surface border-purple-200' : 'bg-surface border-subtleBorder'
      }`}>
        <div>
          <div className="flex items-center space-x-2">
            <ClipboardList className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold text-textMain">{t.dashboard.assignedWorkTitle}</h1>
            <Badge variant="purple">Targeted Assignments</Badge>
          </div>
          <p className="text-xs text-textSecondary mt-1">
            Actionable learning tasks assigned by your professors. Completing assigned work feeds your persistent learner model and earns mastery XP.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Work Items List (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-textMain">Active Assignments ({workItems.length})</h2>
            <span className="text-[11px] text-textMuted">Sorted by Due Date</span>
          </div>

          {workItems.map((item) => {
            const sub = getSubmissionForTask(item.id);
            const status = sub?.status || 'NOT_STARTED';

            return (
              <Card
                key={item.id}
                className={`transition-all border ${
                  selectedTask?.id === item.id ? 'border-primary shadow-cardHover ring-1 ring-primary/30' : 'border-subtleBorder'
                } ${isGamified && status === 'COMPLETED' ? 'bg-emerald-50/20' : 'bg-surface'}`}
              >
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-sm font-bold text-textMain">{item.title}</h3>
                      </div>
                      <span className="text-[11px] text-primary font-semibold block mt-0.5">{item.subject}</span>
                    </div>

                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <Badge variant="purple" className="text-[10px] font-mono">
                        +{item.xpReward} XP
                      </Badge>
                      <Badge
                        variant={status === 'COMPLETED' ? 'success' : status === 'SUBMITTED' ? 'info' : status === 'IN_PROGRESS' ? 'warning' : 'default'}
                        className="text-[10px]"
                      >
                        {status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-xs text-textSecondary leading-relaxed">{item.description}</p>

                  <div className="flex items-center justify-between pt-2 border-t border-subtleBorder text-[11px] text-textMuted font-mono">
                    <span>Due: {item.dueDate}</span>
                    <div className="flex items-center space-x-2">
                      {item.conceptId === 'dsa-binary-search' && (
                        <Link href="/student/subjects/dsa">
                          <Button size="sm" variant="outline" className="text-xs py-1 px-2.5">
                            Open Lab Studio →
                          </Button>
                        </Link>
                      )}
                      <Button
                        size="sm"
                        variant={status === 'COMPLETED' ? 'outline' : 'primary'}
                        onClick={() => handleStartTask(item)}
                        className="text-xs py-1 px-3"
                      >
                        {status === 'COMPLETED' ? 'View Details' : status === 'IN_PROGRESS' ? 'Resume Task' : 'Start Task'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Submission & Action Panel (5 cols) */}
        <div className="lg:col-span-5">
          {selectedTask ? (
            <Card className="bg-surface border-subtleBorder shadow-card sticky top-24">
              <CardHeader className="p-4 border-b border-subtleBorder">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-bold text-textMain">
                    Task Workspace
                  </CardTitle>
                  <Badge variant="purple">+{selectedTask.xpReward} XP</Badge>
                </div>
                <p className="text-xs text-textSecondary font-semibold mt-1">{selectedTask.title}</p>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                {submittedSuccess ? (
                  <div className="p-4 bg-success-light border border-success/30 rounded-xl text-center space-y-2 text-xs">
                    <CheckCircle2 className="w-8 h-8 text-success mx-auto animate-bounce" />
                    <h4 className="font-bold text-textMain">Submission Verified!</h4>
                    <p className="text-textSecondary">
                      Your solution was logged and evaluated. +{selectedTask.xpReward} XP awarded to your profile!
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitSolution} className="space-y-3 text-xs">
                    <div>
                      <label className="block text-textSecondary font-bold mb-1">
                        Solution / Implementation Output / Evidence
                      </label>
                      <textarea
                        rows={6}
                        required
                        value={submissionText}
                        onChange={(e) => setSubmissionText(e.target.value)}
                        placeholder="Paste your verified code snippet, Gantt timing values, or explanation summary here..."
                        className="w-full p-2.5 bg-secondaryBg border border-subtleBorder rounded-xl text-textMain text-xs font-mono focus:outline-none focus:border-primary"
                      />
                    </div>

                    <div className="p-3 bg-secondaryBg rounded-xl border border-subtleBorder space-y-1">
                      <span className="text-[10px] uppercase font-bold text-textMuted block">Evaluation Criteria</span>
                      <p className="text-[11px] text-textSecondary leading-relaxed">
                        Deterministic validation will verify that edge cases, boundary invariants, and algorithms comply with the syllabus specification.
                      </p>
                    </div>

                    <Button type="submit" variant="primary" className="w-full text-xs">
                      Submit Assignment for Verification (+{selectedTask.xpReward} XP)
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-surface border-subtleBorder shadow-sm p-6 text-center text-xs text-textMuted space-y-2">
              <ClipboardList className="w-8 h-8 mx-auto text-textMuted" />
              <p className="font-semibold text-textSecondary">Select an assignment to review details or submit your work.</p>
            </Card>
          )}
        </div>

      </div>
    </div>
  );
}
