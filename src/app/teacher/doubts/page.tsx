'use client';

import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, Send, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockStore } from '@/lib/firebase/mockStore';
import { getCurrentSessionUser } from '@/lib/firebase/auth';
import { DoubtThread } from '@/types/doubt';

export default function TeacherDoubtsPage() {
  const currentUser = getCurrentSessionUser();
  const [doubts, setDoubts] = useState<DoubtThread[]>(() => mockStore.getDoubts());
  const [selectedDoubt, setSelectedDoubt] = useState<DoubtThread | null>(doubts[0] || null);
  const [replyText, setReplyText] = useState('');

  const handlePostReply = () => {
    if (!selectedDoubt || !replyText.trim()) return;

    const newMsg = {
      id: `msg-${Date.now()}`,
      senderId: currentUser?.id || 'teacher-202',
      senderName: currentUser?.name || 'Dr. Vikramaditya Rao',
      senderRole: 'TEACHER' as const,
      content: replyText,
      timestamp: Date.now(),
    };

    const updated = {
      ...selectedDoubt,
      status: 'RESOLVED' as const,
      updatedAt: Date.now(),
      messages: [...selectedDoubt.messages, newMsg],
    };

    mockStore.updateDoubt(updated);
    setDoubts(mockStore.getDoubts());
    setSelectedDoubt(updated);
    setReplyText('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
        <div className="flex items-center space-x-2">
          <HelpCircle className="w-6 h-6 text-purple-400" />
          <h1 className="text-xl font-bold text-slate-100">Student Doubts Teacher Inbox</h1>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Review student questions with attached code snippets and learning evidence.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-4 space-y-2">
          {doubts.map((d) => (
            <div
              key={d.id}
              onClick={() => setSelectedDoubt(d)}
              className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                selectedDoubt?.id === d.id
                  ? 'bg-purple-950/60 border-purple-500 shadow'
                  : 'bg-slate-900 border-slate-800 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-slate-300">{d.studentName}</span>
                <Badge variant={d.status === 'RESOLVED' ? 'success' : 'warning'} className="text-[9px]">
                  {d.status}
                </Badge>
              </div>
              <h4 className="font-bold text-slate-100 truncate">{d.title}</h4>
            </div>
          ))}
        </div>

        <div className="lg:col-span-8">
          {selectedDoubt ? (
            <Card className="bg-slate-900 border-slate-800 flex flex-col h-full">
              <CardHeader className="p-4 border-b border-slate-800 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-bold text-slate-100">{selectedDoubt.title}</CardTitle>
                  <p className="text-xs text-slate-400">Student: {selectedDoubt.studentName}</p>
                </div>
                <Badge variant={selectedDoubt.status === 'RESOLVED' ? 'success' : 'warning'}>
                  {selectedDoubt.status}
                </Badge>
              </CardHeader>

              <CardContent className="p-4 space-y-4 flex-1 overflow-y-auto">
                {selectedDoubt.attachedContext?.codeSnippet && (
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1 font-mono text-xs">
                    <span className="text-indigo-400 font-bold flex items-center">
                      <Code className="w-3.5 h-3.5 mr-1" /> Attached Code Context:
                    </span>
                    <pre className="text-slate-300 text-[11px] overflow-x-auto p-2 bg-slate-900 rounded">
                      {selectedDoubt.attachedContext.codeSnippet}
                    </pre>
                  </div>
                )}

                {selectedDoubt.messages.map((m) => (
                  <div key={m.id} className={`flex flex-col ${m.senderRole === 'TEACHER' ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                        m.senderRole === 'TEACHER'
                          ? 'bg-purple-600 text-white rounded-br-none'
                          : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none'
                      }`}
                    >
                      <div className="font-bold text-[10px] opacity-80 mb-1">{m.senderName} ({m.senderRole})</div>
                      <p>{m.content}</p>
                    </div>
                  </div>
                ))}
              </CardContent>

              <div className="p-3 border-t border-slate-800 bg-slate-950 flex gap-2">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handlePostReply()}
                  placeholder="Type teacher response & mark resolved..."
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
                <Button size="sm" onClick={handlePostReply} className="px-3 bg-purple-600 hover:bg-purple-500">
                  <Send className="w-3.5 h-3.5" />
                </Button>
              </div>
            </Card>
          ) : (
            <div className="p-8 text-center text-slate-500 text-xs">Select a doubt thread.</div>
          )}
        </div>
      </div>
    </div>
  );
}
