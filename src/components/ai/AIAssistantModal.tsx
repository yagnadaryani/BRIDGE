import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storage';
import {
  Bot,
  X,
  Send,
  Sparkles,
  HelpCircle,
  BookOpen,
  CheckCircle2,
  Cpu,
  Layers,
  Languages
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSubject?: string;
  currentConcept?: string;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: number;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  currentSubject = 'dsa',
  currentConcept = 'Binary Search Boundary Invariants'
}) => {
  const { currentUser } = useAuth();
  const learnerModel = storageService.getLearnerModel();

  const [tutorMode, setTutorMode] = useState<'socratic' | 'direct' | 'examiner' | 'debugging'>('socratic');
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init_1',
      sender: 'ai',
      text: `Hello ${currentUser?.name?.split(' ')[0] || 'Engineer'}! I'm your BRIDGE Pedagogical Tutor. I am aware of your current focus on **${currentConcept}** in **${currentSubject.toUpperCase()}** and your recent boundary invariant diagnosis. How can I guide you?`,
      timestamp: Date.now()
    }
  ]);
  const [isThinking, setIsThinking] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim() || isThinking) return;

    const userText = query;
    setQuery('');

    const newMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      sender: 'user',
      text: userText,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, newMsg]);
    setIsThinking(true);

    try {
      const res = await fetch('/api/gemini/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: currentUser?.name || 'Aarav',
          subject: currentSubject,
          concept: currentConcept,
          currentMode: tutorMode,
          learnerModel,
          userQuery: userText
        })
      });

      const data = await res.json();
      const aiReply: ChatMessage = {
        id: 'reply_' + Date.now(),
        sender: 'ai',
        text: data.reply || 'I am reflecting on your boundary invariants. Let us inspect the candidate set shrinking condition.',
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, aiReply]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: 'err_' + Date.now(),
          sender: 'ai',
          text: 'Remember: In an inclusive search range [low, high], when arr[mid] is compared and rejected, mid MUST be strictly excluded to guarantee convergence.',
          timestamp: Date.now()
        }
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/60 backdrop-blur-xs">
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 16 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 16 }}
          className="w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[600px]"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm sm:text-base font-heading">BRIDGE Contextual Tutor</h3>
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 font-bold">
                    ACTIVE SENSING
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Targeted for {currentUser?.name || 'Aarav'} • {currentConcept}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mode Selector Strip */}
          <div className="flex items-center justify-between p-2 bg-slate-100 border-b border-slate-200 text-xs font-semibold overflow-x-auto">
            <span className="text-[11px] text-slate-400 pl-2">Pedagogical Mode:</span>
            <div className="flex gap-1">
              {(['socratic', 'direct', 'examiner', 'debugging'] as const).map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setTutorMode(m)}
                  className={`px-2.5 py-1 rounded-lg capitalize transition-all ${
                    tutorMode === m
                      ? 'bg-white text-indigo-700 font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-tr-xs'
                      : 'bg-white text-slate-800 border border-slate-200 shadow-xs rounded-tl-xs'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[10px] text-slate-400 mt-1 px-1">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}

            {isThinking && (
              <div className="flex items-center gap-2 text-xs text-slate-400 p-2">
                <Sparkles className="w-4 h-4 animate-spin text-emerald-500" />
                <span>Pedagogical tutor synthesizing guided hint...</span>
              </div>
            )}
          </div>

          {/* Input Box */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              placeholder={`Ask a question or explain your reasoning (${tutorMode} mode)...`}
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
            <button
              type="submit"
              disabled={!query.trim() || isThinking}
              className="p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs transition-all disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
