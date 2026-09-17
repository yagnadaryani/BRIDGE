'use client';

import React, { useState } from 'react';
import { ClipboardList, PlusCircle, CheckCircle2, Clock, AlertTriangle, Award, Users, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockStore } from '@/lib/firebase/mockStore';
import { WorkItem, WorkType, WorkSubmission } from '@/types/workItem';
import { useTranslation } from '@/lib/i18n/I18nContext';

export default function TeacherWorkAllotmentPage() {
  const { t } = useTranslation();
  const [workItems, setWorkItems] = useState<WorkItem[]>(() => mockStore.getWorkItems());
  const [submissions, setSubmissions] = useState<WorkSubmission[]>(() => mockStore.getSubmissions());

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('Data Structures & Algorithms');
  const [conceptId, setConceptId] = useState('dsa-binary-search');
  const [workType, setWorkType] = useState<WorkType>('CODING_TASK');
  const [targetAudience, setTargetAudience] = useState('Students with Boundary Gaps');
  const [dueDate, setDueDate] = useState('2026-09-25');
  const [priority, setPriority] = useState<'NORMAL' | 'HIGH' | 'URGENT'>('HIGH');
  const [xpReward, setXpReward] = useState<number>(40);
  const [attachmentName, setAttachmentName] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleCreateWorkItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const newItem: WorkItem = {
      id: `work-${Date.now()}`,
      teacherId: 'teacher-202',
      teacherName: 'Dr. Vikramaditya Rao',
      title: title.trim(),
      description: description.trim(),
      subject,
      conceptId,
      workType,
      targetAudience,
      dueDate,
      priority,
      xpReward,
      attachmentName: attachmentName.trim() || undefined,
      createdAt: Date.now(),
    };

    mockStore.addWorkItem(newItem);
    setWorkItems(mockStore.getWorkItems());
    setSubmissions(mockStore.getSubmissions());

    setTitle('');
    setDescription('');
    setAttachmentName('');
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-surface border border-subtleBorder p-5 rounded-card shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <ClipboardList className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold text-textMain">{t.teacher.allotmentTitle}</h1>
            <Badge variant="purple">Actionable Learning Allotment</Badge>
          </div>
          <p className="text-xs text-textSecondary mt-1">
            Assign targeted practice, simulations, coding labs, and communication tasks. Track real-time student completion and diagnostic evidence.
          </p>
        </div>
      </div>

      {/* Overview Analytics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <Card className="bg-surface border-subtleBorder shadow-sm text-center p-3">
          <span className="text-[10px] text-textMuted uppercase font-bold block">Total Assigned</span>
          <span className="text-xl font-bold text-textMain font-mono">{workItems.length}</span>
        </Card>
        <Card className="bg-surface border-subtleBorder shadow-sm text-center p-3">
          <span className="text-[10px] text-textMuted uppercase font-bold block">In Progress</span>
          <span className="text-xl font-bold text-primary font-mono">
            {submissions.filter((s) => s.status === 'IN_PROGRESS').length}
          </span>
        </Card>
        <Card className="bg-surface border-subtleBorder shadow-sm text-center p-3">
          <span className="text-[10px] text-textMuted uppercase font-bold block">Completed</span>
          <span className="text-xl font-bold text-success font-mono">
            {submissions.filter((s) => s.status === 'COMPLETED').length}
          </span>
        </Card>
        <Card className="bg-surface border-subtleBorder shadow-sm text-center p-3">
          <span className="text-[10px] text-textMuted uppercase font-bold block">Not Started</span>
          <span className="text-xl font-bold text-amber-500 font-mono">
            {submissions.filter((s) => s.status === 'NOT_STARTED').length}
          </span>
        </Card>
        <Card className="bg-surface border-subtleBorder shadow-sm text-center p-3 col-span-2 sm:col-span-1">
          <span className="text-[10px] text-textMuted uppercase font-bold block">Avg Score</span>
          <span className="text-xl font-bold text-purpleAccent font-mono">88%</span>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Creation Form (7 cols) */}
        <div className="lg:col-span-7">
          <Card className="bg-surface border-subtleBorder shadow-card">
            <CardHeader className="p-4 border-b border-subtleBorder">
              <CardTitle className="text-sm font-bold text-textMain">
                {t.teacher.newAllotment}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <form onSubmit={handleCreateWorkItem} className="space-y-4 text-xs">

                {isSuccess && (
                  <div className="p-3 bg-success-light border border-success/30 text-success rounded-xl flex items-center space-x-2 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                    <span>Assignment published! Students notified and missions activated.</span>
                  </div>
                )}

                <div>
                  <label className="block text-textSecondary font-bold mb-1">Task Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Binary Search Boundary Repair: Zero-Index Invariants"
                    className="w-full px-3 py-2 bg-secondaryBg border border-subtleBorder rounded-xl text-textMain text-xs focus:outline-none focus:border-primary font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-textSecondary font-bold mb-1">Subject</label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-3 py-2 bg-secondaryBg border border-subtleBorder rounded-xl text-textMain text-xs focus:outline-none focus:border-primary"
                    >
                      <option value="Data Structures & Algorithms">Data Structures & Algorithms</option>
                      <option value="Operating Systems">Operating Systems</option>
                      <option value="Digital Electronics">Digital Electronics</option>
                      <option value="Microprocessor">Microprocessor</option>
                      <option value="Cloud Computing">Cloud Computing</option>
                      <option value="Engineering Communication">Engineering Communication</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-textSecondary font-bold mb-1">{t.teacher.taskType}</label>
                    <select
                      value={workType}
                      onChange={(e) => setWorkType(e.target.value as WorkType)}
                      className="w-full px-3 py-2 bg-secondaryBg border border-subtleBorder rounded-xl text-textMain text-xs focus:outline-none focus:border-primary"
                    >
                      <option value="CODING_TASK">Coding Task (Studio)</option>
                      <option value="SIMULATION">Simulation Challenge</option>
                      <option value="LAB_CHALLENGE">Lab Diagnostic Challenge</option>
                      <option value="PRACTICE">Prerequisite Practice</option>
                      <option value="QUIZ">Concept Evaluation Quiz</option>
                      <option value="COMMUNICATION_TASK">Viva / Technical English</option>
                      <option value="ASSIGNMENT">Written Assignment</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-textSecondary font-bold mb-1">Target Students</label>
                    <input
                      type="text"
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                      placeholder="e.g. Students with Boundary Gaps"
                      className="w-full px-3 py-2 bg-secondaryBg border border-subtleBorder rounded-xl text-textMain text-xs focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-textSecondary font-bold mb-1">{t.teacher.dueDate}</label>
                    <input
                      type="date"
                      required
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full px-3 py-2 bg-secondaryBg border border-subtleBorder rounded-xl text-textMain text-xs focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-textSecondary font-bold mb-1">{t.teacher.xpReward}</label>
                    <input
                      type="number"
                      min={10}
                      max={200}
                      value={xpReward}
                      onChange={(e) => setXpReward(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-secondaryBg border border-subtleBorder rounded-xl text-textMain text-xs focus:outline-none focus:border-primary font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-textSecondary font-bold mb-1">Task Instructions & Goal</label>
                  <textarea
                    rows={4}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide specific engineering instructions, test cases to pass, or invariants to demonstrate..."
                    className="w-full px-3 py-2 bg-secondaryBg border border-subtleBorder rounded-xl text-textMain text-xs focus:outline-none focus:border-primary font-medium"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <Button type="submit" variant="primary" className="text-xs space-x-1.5">
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>{t.teacher.assignTask}</span>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Assigned Tasks & Student Submission Tracker (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="bg-surface border-subtleBorder shadow-card">
            <CardHeader className="p-4 border-b border-subtleBorder flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold text-textMain">Allotted Work Items ({workItems.length})</CardTitle>
              <Badge variant="purple" className="text-[10px]">Actionable</Badge>
            </CardHeader>
            <CardContent className="p-4 space-y-3 max-h-[500px] overflow-y-auto">
              {workItems.map((w) => {
                const sub = submissions.find((s) => s.workItemId === w.id);
                return (
                  <div key={w.id} className="p-3.5 bg-secondaryBg rounded-xl border border-subtleBorder space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-bold text-textMain">{w.title}</span>
                      <Badge variant="purple" className="text-[9px]">+{w.xpReward} XP</Badge>
                    </div>
                    <p className="text-[11px] text-textSecondary leading-relaxed">{w.description}</p>
                    
                    <div className="flex items-center justify-between pt-1 text-[10px] text-textMuted font-mono border-t border-subtleBorder/60">
                      <span>Type: {w.workType}</span>
                      <span>Due: {w.dueDate}</span>
                    </div>

                    {/* Student Status Indicator */}
                    {sub && (
                      <div className="p-2 bg-surface rounded-lg border border-subtleBorder flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-textMain">{sub.studentName}</span>
                        <Badge
                          variant={sub.status === 'COMPLETED' ? 'success' : sub.status === 'IN_PROGRESS' ? 'warning' : 'info'}
                          className="text-[9px]"
                        >
                          {sub.status} {sub.score !== undefined ? `(${sub.score}%)` : ''}
                        </Badge>
                      </div>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
