'use client';

import React, { useState } from 'react';
import { Bot, X, Send, Sparkles, BookOpen, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getCurrentSessionUser } from '@/lib/firebase/auth';
import { mockStore } from '@/lib/firebase/mockStore';

interface AIAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  subjectId?: string;
  conceptId?: string;
}

export function AIAssistantDrawer({ isOpen, onClose, subjectId, conceptId }: AIAssistantDrawerProps) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<
    { role: 'user' | 'assistant'; text: string; sources?: { title: string; source: string }[] }[]
  >([
    {
      role: 'assistant',
      text: 'Hello! I am your BRIDGE AI Learning Assistant. I have full context on your subject progress and prerequisite gaps. How can I help you understand your engineering concepts today?',
    },
  ]);

  const currentUser = getCurrentSessionUser();
  const learnerModel = currentUser ? mockStore.getLearnerModel(currentUser.id) : null;

  if (!isOpen) return null;

  const handleSend = async (customText?: string) => {
    const textToSend = customText || query;
    if (!textToSend.trim() || loading) return;

    const userMsg = { role: 'user' as const, text: textToSend };
    setChatHistory((prev) => [...prev, userMsg]);
    setQuery('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: textToSend,
          studentId: currentUser?.id || 'aarav-101',
          subjectId,
          conceptId,
          learnerModel,
          prerequisiteGaps: learnerModel?.rootGaps,
        }),
      });

      const data = await res.json();
      setChatHistory((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: data.answer || 'Here is the explanation grounded in your course materials.',
          sources: data.groundingSources,
        },
      ]);
    } catch (e) {
      setChatHistory((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'Sorry, I encountered an issue fetching the explanation. Please try again.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-slate-900/30 backdrop-blur-sm transition-opacity animate-in fade-in">
      <div className="w-full max-w-md bg-surface border-l border-subtleBorder h-full flex flex-col shadow-drawer">

        {/* Drawer Header */}
        <div className="p-4 border-b border-subtleBorder flex items-center justify-between bg-surface">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary-light border border-indigo-200 flex items-center justify-center text-primary font-bold">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-textMain flex items-center">
                BRIDGE Context-Aware AI <Sparkles className="w-3.5 h-3.5 ml-1 text-amber-500 fill-amber-500/20" />
              </h3>
              <p className="text-[10px] text-textSecondary">Grounded in Approved Engineering Syllabi</p>
            </div>
          </div>
          <button onClick={onClose} className="text-textMuted hover:text-textMain p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Learner Context Readout Banner */}
        {learnerModel && (
          <div className="px-4 py-2 bg-primary-light/60 border-b border-indigo-100 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2 text-textMain">
              <span className="font-bold text-primary">{learnerModel.studentName}</span>
              <Badge variant="info" className="text-[10px]">{learnerModel.overallMastery}% Mastery</Badge>
            </div>
            {learnerModel.rootGaps.length > 0 && (
              <Badge variant="warning" className="text-[9px]">
                Gap: {learnerModel.rootGaps[0].split('-').pop()}
              </Badge>
            )}
          </div>
        )}

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs bg-page">
          {chatHistory.map((msg, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed text-textMain shadow-sm border ${
                  msg.role === 'user'
                    ? 'bg-[#EEF7FA] border-cyanAccent/30 rounded-br-none' // Student Message #EEF7FA
                    : 'bg-[#F3F4FF] border-primary/20 rounded-bl-none' // AI Message #F3F4FF
                }`}
              >
                <div className="whitespace-pre-line text-xs">{msg.text}</div>

                {/* Grounding Sources */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-indigo-100 text-[10px] space-y-1">
                    <span className="text-primary font-bold flex items-center">
                      <BookOpen className="w-3 h-3 mr-1" /> Grounded Syllabus Sources:
                    </span>
                    {msg.sources.map((src, i) => (
                      <div key={i} className="text-textSecondary italic">
                        • {src.title} ({src.source})
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center space-x-2 text-xs text-primary italic">
              <Sparkles className="w-4 h-4 animate-spin" /> Retrieving grounded engineering explanation...
            </div>
          )}
        </div>

        {/* Suggested Queries */}
        <div className="px-4 py-2 border-t border-subtleBorder bg-surface flex gap-1.5 overflow-x-auto">
          <button
            onClick={() => handleSend('Why does binary search boundary condition fail?')}
            className="text-[10px] bg-secondaryBg hover:bg-subtleBorder text-textMain px-2.5 py-1 rounded-full whitespace-nowrap border border-subtleBorder"
          >
            Fix Boundary Error
          </button>
          <button
            onClick={() => handleSend('Explain FCFS vs Round Robin CPU scheduling')}
            className="text-[10px] bg-secondaryBg hover:bg-subtleBorder text-textMain px-2.5 py-1 rounded-full whitespace-nowrap border border-subtleBorder"
          >
            FCFS vs Round Robin
          </button>
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-subtleBorder bg-surface flex items-center space-x-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask AI tutor about your concepts or bugs..."
            className="flex-1 bg-secondaryBg border border-subtleBorder rounded-xl px-3 py-2 text-xs text-textMain placeholder-textMuted focus:outline-none focus:border-primary"
          />
          <Button size="sm" onClick={() => handleSend()} disabled={loading} className="px-3">
            <Send className="w-3.5 h-3.5" />
          </Button>
        </div>

      </div>
    </div>
  );
}
