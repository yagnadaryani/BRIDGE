'use client';

import React, { useState } from 'react';
import { Radio, Send, Paperclip, CheckCircle2, AlertCircle, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockStore } from '@/lib/firebase/mockStore';
import { Broadcast, TargetAudience, PriorityLevel } from '@/types/broadcast';
import { useTranslation } from '@/lib/i18n/I18nContext';

export default function TeacherBroadcastPage() {
  const { t } = useTranslation();
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>(() => mockStore.getBroadcasts());
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('Data Structures & Algorithms');
  const [targetAudience, setTargetAudience] = useState<TargetAudience>('ENTIRE_CLASS');
  const [priority, setPriority] = useState<PriorityLevel>('NORMAL');
  const [attachmentName, setAttachmentName] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    const newBroadcast: Broadcast = {
      id: `bcast-${Date.now()}`,
      teacherId: 'teacher-202',
      teacherName: 'Dr. Vikramaditya Rao',
      title: title.trim(),
      message: message.trim(),
      subject,
      targetAudience,
      priority,
      attachmentName: attachmentName.trim() || undefined,
      createdAt: Date.now(),
    };

    mockStore.addBroadcast(newBroadcast);
    setBroadcasts(mockStore.getBroadcasts());

    setTitle('');
    setMessage('');
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
            <Radio className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold text-textMain">{t.teacher.broadcastTitle}</h1>
            <Badge variant="purple">Communication Center</Badge>
          </div>
          <p className="text-xs text-textSecondary mt-1">
            Dispatch announcements to classes, branches, or student groups. Notifications sync instantly to student dashboards.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Creation Form (7 cols) */}
        <div className="lg:col-span-7">
          <Card className="bg-surface border-subtleBorder shadow-card">
            <CardHeader className="p-4 border-b border-subtleBorder">
              <CardTitle className="text-sm font-bold text-textMain">
                {t.teacher.newBroadcast}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <form onSubmit={handleSendBroadcast} className="space-y-4 text-xs">

                {isSuccess && (
                  <div className="p-3 bg-success-light border border-success/30 text-success rounded-xl flex items-center space-x-2 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                    <span>Broadcast published! Student notifications dispatched successfully.</span>
                  </div>
                )}

                <div>
                  <label className="block text-textSecondary font-bold mb-1">Announcement Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Critical: Boundary Pointer Invariant Review Session"
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
                    <label className="block text-textSecondary font-bold mb-1">Target Audience</label>
                    <select
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value as TargetAudience)}
                      className="w-full px-3 py-2 bg-secondaryBg border border-subtleBorder rounded-xl text-textMain text-xs focus:outline-none focus:border-primary"
                    >
                      <option value="ENTIRE_CLASS">Entire Class (CSE 3-A)</option>
                      <option value="SUBJECT">Subject Students</option>
                      <option value="BRANCH">Department Branch</option>
                      <option value="SELECTED_STUDENTS">Students with Boundary Gaps</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-textSecondary font-bold mb-1">Priority Level</label>
                  <div className="flex space-x-2">
                    {(['NORMAL', 'IMPORTANT', 'URGENT'] as PriorityLevel[]).map((p) => (
                      <button
                        type="button"
                        key={p}
                        onClick={() => setPriority(p)}
                        className={`flex-1 py-1.5 px-3 rounded-xl border text-xs font-bold transition-all ${
                          priority === p
                            ? p === 'URGENT'
                              ? 'bg-red-50 border-red-300 text-red-700 shadow-sm'
                              : p === 'IMPORTANT'
                              ? 'bg-amber-50 border-amber-300 text-amber-700 shadow-sm'
                              : 'bg-primary-light border-indigo-200 text-primary shadow-sm'
                            : 'bg-surface border-subtleBorder text-textSecondary hover:bg-secondaryBg'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-textSecondary font-bold mb-1">Announcement Message</label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type details of your announcement here..."
                    className="w-full px-3 py-2 bg-secondaryBg border border-subtleBorder rounded-xl text-textMain text-xs focus:outline-none focus:border-primary font-medium"
                  />
                </div>

                <div>
                  <label className="block text-textSecondary font-bold mb-1">Attachment Resource (Optional)</label>
                  <div className="flex items-center space-x-2">
                    <Paperclip className="w-4 h-4 text-textMuted" />
                    <input
                      type="text"
                      value={attachmentName}
                      onChange={(e) => setAttachmentName(e.target.value)}
                      placeholder="e.g. Chapter4_Array_Invariants.pdf"
                      className="flex-1 px-3 py-1.5 bg-secondaryBg border border-subtleBorder rounded-xl text-textMain text-xs focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <Button type="submit" variant="primary" className="text-xs space-x-1.5">
                    <Send className="w-3.5 h-3.5" />
                    <span>{t.teacher.sendBroadcast}</span>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Broadcast History (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="bg-surface border-subtleBorder shadow-card">
            <CardHeader className="p-4 border-b border-subtleBorder flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold text-textMain">Broadcast Log ({broadcasts.length})</CardTitle>
              <Badge variant="info" className="text-[10px]">Real-time</Badge>
            </CardHeader>
            <CardContent className="p-4 space-y-3 max-h-[500px] overflow-y-auto">
              {broadcasts.map((b) => (
                <div key={b.id} className="p-3 bg-secondaryBg rounded-xl border border-subtleBorder space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-textMain line-clamp-1">{b.title}</span>
                    <Badge
                      variant={b.priority === 'URGENT' ? 'destructive' : b.priority === 'IMPORTANT' ? 'warning' : 'info'}
                      className="text-[9px]"
                    >
                      {b.priority}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-textSecondary leading-relaxed">{b.message}</p>
                  {b.attachmentName && (
                    <div className="inline-flex items-center space-x-1 text-[10px] text-primary font-semibold bg-surface px-2 py-0.5 rounded-md border border-subtleBorder">
                      <Paperclip className="w-3 h-3" />
                      <span>{b.attachmentName}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-[10px] text-textMuted font-mono pt-1 border-t border-subtleBorder/60">
                    <span>Audience: {b.targetAudience}</span>
                    <span>{new Date(b.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
