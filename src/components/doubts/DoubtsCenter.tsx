import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storage';
import { DoubtItem } from '../../types';
import { SUBJECTS } from '../../data/mockData';
import { HelpCircle, MessageSquare, Send, CheckCircle2, Clock, User } from 'lucide-react';

export const DoubtsCenter: React.FC = () => {
  const { currentUser, role } = useAuth();
  const [doubts, setDoubts] = useState<DoubtItem[]>(() => storageService.getDoubts());
  const [selectedDoubt, setSelectedDoubt] = useState<DoubtItem | null>(doubts[0] || null);

  // New Doubt Form
  const [showNewModal, setShowNewModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newQuestion, setNewQuestion] = useState('');
  const [newSubject, setNewSubject] = useState('dsa');
  const [newSnippet, setNewSnippet] = useState('');

  // Reply
  const [replyText, setReplyText] = useState('');

  const handleCreateDoubt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newQuestion) return;

    const created = storageService.createDoubt({
      studentId: currentUser?.id || 'student_aarav_01',
      studentName: currentUser?.name || 'Aarav Sharma',
      subjectId: newSubject as any,
      conceptId: `${newSubject}_inquiry`,
      title: newTitle,
      question: newQuestion,
      contextSnippet: newSnippet || undefined
    });

    const refreshed = storageService.getDoubts();
    setDoubts(refreshed);
    setSelectedDoubt(created);
    setShowNewModal(false);
    setNewTitle('');
    setNewQuestion('');
    setNewSnippet('');
  };

  const handleSendReply = () => {
    if (!selectedDoubt || !replyText) return;

    storageService.replyDoubt(selectedDoubt.id, {
      authorId: currentUser?.id || 'user_demo',
      authorName: currentUser?.name || 'Faculty Mentor',
      authorRole: role,
      message: replyText
    });

    const refreshed = storageService.getDoubts();
    setDoubts(refreshed);
    setSelectedDoubt(refreshed.find(d => d.id === selectedDoubt.id) || null);
    setReplyText('');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded">
              Academic Inquiry & Doubts
            </span>
            <span className="text-xs text-slate-400 font-semibold">Grounded Faculty Q&A</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 mt-1">
            Engineering Inquiry Center
          </h1>
        </div>

        {role === 'STUDENT' && (
          <button
            type="button"
            onClick={() => setShowNewModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Raise New Inquiry</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Doubts List */}
        <div className="lg:col-span-5 space-y-3">
          {doubts.map(d => {
            const isSelected = selectedDoubt?.id === d.id;
            return (
              <div
                key={d.id}
                onClick={() => setSelectedDoubt(d)}
                className={`cursor-pointer p-4 rounded-2xl border transition-all ${
                  isSelected
                    ? 'bg-violet-50/80 border-violet-400 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="font-bold text-violet-600 uppercase">{d.subjectId}</span>
                  <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                    d.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {d.status}
                  </span>
                </div>
                <h4 className="font-bold text-xs sm:text-sm text-slate-900 line-clamp-1">{d.title}</h4>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{d.question}</p>
                <div className="mt-3 pt-2 border-t border-slate-100 flex justify-between text-[11px] text-slate-400">
                  <span>By {d.studentName}</span>
                  <span>{d.replies.length} replies</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Detailed Thread */}
        <div className="lg:col-span-7">
          {selectedDoubt ? (
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col h-full min-h-[500px]">
              <div className="pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2 mb-1 text-xs">
                  <span className="font-bold text-violet-600 uppercase">{selectedDoubt.subjectId}</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-400">{new Date(selectedDoubt.createdAt).toLocaleDateString()}</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold font-heading text-slate-900">{selectedDoubt.title}</h3>
                <p className="text-xs sm:text-sm text-slate-700 mt-2 leading-relaxed">{selectedDoubt.question}</p>

                {selectedDoubt.contextSnippet && (
                  <pre className="mt-3 p-3 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs overflow-x-auto">
                    {selectedDoubt.contextSnippet}
                  </pre>
                )}
              </div>

              {/* Replies Conversation */}
              <div className="flex-1 py-4 space-y-3 overflow-y-auto max-h-[300px]">
                {selectedDoubt.replies.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-400">
                    Awaiting faculty or peer review.
                  </div>
                ) : (
                  selectedDoubt.replies.map(r => (
                    <div
                      key={r.id}
                      className={`p-3.5 rounded-2xl text-xs space-y-1 ${
                        r.authorRole === 'TEACHER'
                          ? 'bg-indigo-50 border border-indigo-200 text-indigo-950'
                          : 'bg-slate-50 border border-slate-200 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold">
                        <span className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5" />
                          <span>{r.authorName}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-white text-slate-600">
                            {r.authorRole}
                          </span>
                        </span>
                        <span className="text-[10px] text-slate-400 font-normal">
                          {new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="leading-relaxed pt-1">{r.message}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Send Reply */}
              <div className="pt-3 border-t border-slate-100 flex gap-2">
                <input
                  type="text"
                  placeholder={`Reply as ${currentUser?.name}...`}
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                />
                <button
                  type="button"
                  onClick={handleSendReply}
                  className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Reply</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400 text-xs">
              Select an inquiry to view replies.
            </div>
          )}
        </div>
      </div>

      {/* New Inquiry Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-lg font-heading text-slate-900">Raise Academic Inquiry</h3>
            <form onSubmit={handleCreateDoubt} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
                <select
                  value={newSubject}
                  onChange={e => setNewSubject(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold"
                >
                  {SUBJECTS.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Inquiry Title</label>
                <input
                  type="text"
                  placeholder="e.g. Why does mid calculation overflow?"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Question</label>
                <textarea
                  rows={3}
                  placeholder="Describe your reasoning and where you hit a contradiction..."
                  value={newQuestion}
                  onChange={e => setNewQuestion(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Code / Circuit Context (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="Paste snippet or equation..."
                  value={newSnippet}
                  onChange={e => setNewSnippet(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-violet-600 hover:bg-violet-700 text-white rounded-xl shadow-xs"
                >
                  Submit Inquiry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
