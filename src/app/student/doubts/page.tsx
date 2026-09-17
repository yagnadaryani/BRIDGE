'use client';

import React, { useState } from 'react';
import { HelpCircle, Plus, MessageSquare, CheckCircle2, Send, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/shell/Navbar';
import { Sidebar } from '@/components/shell/Sidebar';
import { AIAssistantDrawer } from '@/components/ai/AIAssistantDrawer';
import { mockStore } from '@/lib/firebase/mockStore';
import { getCurrentSessionUser } from '@/lib/firebase/auth';
import { DoubtThread } from '@/types/doubt';

export default function StudentDoubtsPage() {
  const [isAiOpen, setIsAiOpen] = useState(false);
  const currentUser = getCurrentSessionUser();
  const studentId = currentUser?.id || 'aarav-101';

  const [doubts, setDoubts] = useState<DoubtThread[]>(() => mockStore.getDoubts());
  const [selectedDoubt, setSelectedDoubt] = useState<DoubtThread | null>(doubts[0] || null);
  const [replyText, setReplyText] = useState('');

  // New Doubt Modal State
  const [showNewModal, setShowNewModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newSubject, setNewSubject] = useState('dsa');

  const handlePostReply = () => {
    if (!selectedDoubt || !replyText.trim()) return;

    const newMsg = {
      id: `msg-${Date.now()}`,
      senderId: studentId,
      senderName: currentUser?.name || 'Aarav Sharma',
      senderRole: 'STUDENT' as const,
      content: replyText,
      timestamp: Date.now(),
    };

    const updated = {
      ...selectedDoubt,
      updatedAt: Date.now(),
      messages: [...selectedDoubt.messages, newMsg],
    };

    mockStore.updateDoubt(updated);
    setDoubts(mockStore.getDoubts());
    setSelectedDoubt(updated);
    setReplyText('');
  };

  const handleCreateDoubt = () => {
    if (!newTitle.trim() || !newDescription.trim()) return;

    const newDoubt: DoubtThread = {
      id: `doubt-${Date.now()}`,
      studentId,
      studentName: currentUser?.name || 'Aarav Sharma',
      subjectId: newSubject,
      conceptId: 'dsa-binary-search',
      conceptTitle: 'Binary Search Indexing',
      title: newTitle,
      description: newDescription,
      status: 'OPEN',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: [
        {
          id: `msg-${Date.now()}`,
          senderId: studentId,
          senderName: currentUser?.name || 'Aarav Sharma',
          senderRole: 'STUDENT',
          content: newDescription,
          timestamp: Date.now(),
        }
      ],
      attachedContext: {
        codeSnippet: 'let high = arr.length; // Attached boundary snippet',
        errorType: 'BOUNDARY_OFF_BY_ONE',
      }
    };

    mockStore.addDoubt(newDoubt);
    const refreshed = mockStore.getDoubts();
    setDoubts(refreshed);
    setSelectedDoubt(newDoubt);
    setShowNewModal(false);
    setNewTitle('');
    setNewDescription('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar onOpenAIAssistant={() => setIsAiOpen(true)} />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-5 rounded-xl">
            <div>
              <div className="flex items-center space-x-2">
                <HelpCircle className="w-6 h-6 text-indigo-400" />
                <h1 className="text-xl font-bold text-slate-100">Ask Teacher & Doubts Portal</h1>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Post questions directly to your subject professor with code & lab context attached.
              </p>
            </div>

            <Button onClick={() => setShowNewModal(true)} className="text-xs space-x-1.5">
              <Plus className="w-4 h-4" />
              <span>Ask New Doubt</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

            {/* Doubt Threads List (4 cols) */}
            <div className="lg:col-span-4 space-y-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Your Doubt Threads</h3>
              {doubts.map((d) => (
                <div
                  key={d.id}
                  onClick={() => setSelectedDoubt(d)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                    selectedDoubt?.id === d.id
                      ? 'bg-indigo-950/60 border-indigo-500 shadow-md shadow-indigo-950/50'
                      : 'bg-slate-900 border-slate-800 hover:bg-slate-800/80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <Badge variant={d.status === 'RESOLVED' ? 'success' : 'warning'} className="text-[9px]">
                      {d.status}
                    </Badge>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(d.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-200 truncate">{d.title}</h4>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">{d.conceptTitle || d.subjectId.toUpperCase()}</p>
                </div>
              ))}
            </div>

            {/* Conversation Messages View (8 cols) */}
            <div className="lg:col-span-8">
              {selectedDoubt ? (
                <Card className="bg-slate-900 border-slate-800 h-full flex flex-col">
                  <CardHeader className="p-4 border-b border-slate-800 flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-sm font-bold text-slate-100">{selectedDoubt.title}</CardTitle>
                      <p className="text-xs text-slate-400">Subject: {selectedDoubt.subjectId.toUpperCase()}</p>
                    </div>
                    <Badge variant={selectedDoubt.status === 'RESOLVED' ? 'success' : 'warning'}>
                      {selectedDoubt.status}
                    </Badge>
                  </CardHeader>

                  <CardContent className="p-4 space-y-4 flex-1 overflow-y-auto">
                    {/* Attached Context */}
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

                    {/* Messages */}
                    {selectedDoubt.messages.map((m) => (
                      <div
                        key={m.id}
                        className={`flex flex-col ${m.senderRole === 'TEACHER' ? 'items-start' : 'items-end'}`}
                      >
                        <div
                          className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                            m.senderRole === 'TEACHER'
                              ? 'bg-purple-950/80 border border-purple-800/80 text-purple-100 rounded-bl-none'
                              : 'bg-indigo-600 text-white rounded-br-none'
                          }`}
                        >
                          <div className="font-bold text-[10px] opacity-80 mb-1">{m.senderName} ({m.senderRole})</div>
                          <p>{m.content}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>

                  {/* Reply Input */}
                  <div className="p-3 border-t border-slate-800 bg-slate-950 flex gap-2">
                    <input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handlePostReply()}
                      placeholder="Type your reply to teacher..."
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                    <Button size="sm" onClick={handlePostReply} className="px-3">
                      <Send className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </Card>
              ) : (
                <div className="p-8 text-center text-slate-500 text-xs">Select a doubt thread to view conversation.</div>
              )}
            </div>

          </div>
        </main>
      </div>

      {/* Ask New Doubt Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <Card className="max-w-md w-full bg-slate-900 border-slate-800">
            <CardHeader className="p-4 mb-2">
              <CardTitle className="text-sm font-bold text-slate-100">Ask Teacher a New Doubt</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Subject</label>
                <select
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200"
                >
                  <option value="dsa">Data Structures & Algorithms</option>
                  <option value="os">Operating Systems</option>
                  <option value="digital-electronics">Digital Electronics</option>
                  <option value="microprocessor">Microprocessors</option>
                  <option value="cloud">Cloud Computing</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Doubt Title / Summary</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Why does my binary search get stuck in an infinite loop?"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Detailed Explanation</label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  rows={3}
                  placeholder="Explain what concept or bug you are struggling with..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <Button size="sm" variant="ghost" onClick={() => setShowNewModal(false)}>Cancel</Button>
                <Button size="sm" onClick={handleCreateDoubt}>Submit to Teacher</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <AIAssistantDrawer isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />
    </div>
  );
}
