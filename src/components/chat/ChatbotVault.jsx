import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Bot, 
  Send, 
  FileText, 
  UploadCloud, 
  Video, 
  HelpCircle, 
  Sparkles, 
  CheckCircle2, 
  BookOpen,
  Sliders,
  Layers,
  HelpCircle as QuestionMark
} from 'lucide-react';

export const ChatbotVault = () => {
  const { notes, addNote, setActiveTab, addXP, gamification, language, t } = useApp();
  
  // Explanation Modes: 'simple' | 'example' | 'visual' | 'step' | 'practice'
  const [explanationMode, setExplanationMode] = useState('simple');

  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: `Hello! I am your **AI Personal Learning Companion**. 🚀\n\nI adapt to your curriculum and learning style. Ask me academic questions in any language (e.g. Marathi, Hindi, English), choose an explanation style below, or click any note to generate animated videos or personalized quizzes!`
    }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [uploadModal, setUploadModal] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteCategory, setNewNoteCategory] = useState('Lecture Notes');
  const [newNoteContent, setNewNoteContent] = useState('');

  const suggestions = [
    "Explain CPU scheduling in Marathi 🚩",
    "Explain 8085 ALE Pin & Machine Cycles 💻",
    "How does Round Robin scheduling work? ⚙️",
    "Design a Half Adder using logic gates ⚡",
    "Explain Cloud Load Balancing & Auto-Scaling ☁️"
  ];

  const handleSend = (textToSend) => {
    const text = textToSend || inputMsg;
    if (!text.trim()) return;

    const userMsg = { sender: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInputMsg('');

    setTimeout(() => {
      let aiText = ``;
      const isMarathi = text.toLowerCase().includes('marathi') || text.toLowerCase().includes('मराठी') || language === 'mr';
      const isHindi = text.toLowerCase().includes('hindi') || text.toLowerCase().includes('हिंदी') || language === 'hi';

      if (isMarathi) {
        aiText += `**[मराठीत स्पष्टीकरण - ${explanationMode.toUpperCase()} MODE]**\n\n`;
        if (text.toLowerCase().includes('cpu') || text.toLowerCase().includes('scheduling')) {
          aiText += `१. **CPU शेड्यूलिंग (CPU Scheduling)** म्हणजे कर्नलद्वारे प्रोसेस रन करण्यासाठी CPU वाटप करण्याची पद्धत.\n२. **Round Robin**: प्रत्येक प्रोसेसला निश्चित टाइम क्वांटम (Time Quantum) दिला जातो.\n\n💡 *टिप: ऑपरेटिंग सिस्टीम लॅबमध्ये याचे जिवंत गॅंट चार्ट सिमुलेशन पहा!*`;
        } else {
          aiText += `तुमचा प्रश्न **"${text}"** साठी उत्तर:\nअभियांत्रिकीमध्ये सिस्टीमची कार्यक्षमता वाढवण्यासाठी योग्य डेटा स्ट्रक्चर आणि अल्गोरिदम वापरणे आवश्यक आहे.`;
        }
      } else if (isHindi) {
        aiText += `**[हिंदी में व्याख्या - ${explanationMode.toUpperCase()} MODE]**\n\n`;
        if (text.toLowerCase().includes('cpu') || text.toLowerCase().includes('scheduling')) {
          aiText += `१. **CPU शेड्यूलिंग**: तैयार कतार (Ready Queue) से प्रक्रियाओं को CPU में निष्पादित करने की तकनीक है।\n२. **Round Robin**: इसमें प्रत्येक प्रोसेस को समान समय (Time Quantum) दिया जाता है।`;
        } else {
          aiText += `आपके प्रश्न **"${text}"** के लिए:\nसिस्टम दक्षता बढ़ाने के लिए एल्गोरिदम और डेटा संरचना का अनुकूलन आवश्यक है।`;
        }
      } else {
        // English / Default with Explanation Mode formatting
        aiText += `**[AI Learning Companion - ${explanationMode.toUpperCase()} MODE]**\n\n`;

        if (explanationMode === 'simple') {
          aiText += `**Simple Explanation for "${text}":**\nCPU scheduling is like a bank teller managing a line of customers. The operating system decides which process gets CPU time next to ensure fast and fair execution.`;
        } else if (explanationMode === 'example') {
          aiText += `**Real-World Example:**\nThink of Round Robin scheduling like a chess clock in a multiplayer game: Player 1 gets 2 minutes, then Player 2 gets 2 minutes, ensuring nobody starves!`;
        } else if (explanationMode === 'visual') {
          aiText += `**Visual Breakdown:**\nReady Queue: [ P1 (5s) ] ➔ [ P2 (3s) ] ➔ [ P3 (2s) ]\n  ↓\nCPU Core:   [ Executing P1 (q = 2s) ] ➔ Swapped to Ready Queue`;
        } else if (explanationMode === 'step') {
          aiText += `**Step-by-Step Breakdown:**\n1. Process P1 enters Ready Queue at time t=0s.\n2. Scheduler assigns P1 to CPU for 2 seconds.\n3. P1 remaining burst time becomes 3s and returns to queue.\n4. Process P2 gets CPU time slot.`;
        } else if (explanationMode === 'practice') {
          aiText += `**Practice Question:**\nIf Process P1 has burst time 5s and time quantum q=2s, how many times will P1 enter the CPU before finishing execution?\n\n*A) 2 times   B) 3 times (Correct: 2s + 2s + 1s)   C) 5 times*`;
        }
      }

      setMessages(prev => [...prev, { sender: 'ai', text: aiText }]);
      addXP(20);
    }, 600);
  };

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!newNoteTitle.trim()) return;

    addNote({
      id: `note-${Date.now()}`,
      title: `${newNoteTitle} [${newNoteCategory}]`,
      date: 'Just now',
      size: '1.2 MB',
      content: newNoteContent || 'Uploaded curriculum notes & syllabus study material.'
    });

    setNewNoteTitle('');
    setNewNoteContent('');
    setUploadModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`flex flex-wrap items-center justify-between gap-4 p-6 rounded-2xl border transition-all ${
        gamification ? 'glass-panel border-cyan-500/30 text-white' : 'bg-white border-black text-black shadow-md'
      }`}>
        <div>
          <div className="flex items-center gap-2">
            <h1 className={`text-2xl font-extrabold tracking-tight font-['Outfit'] ${
              gamification ? 'text-gradient' : 'text-black'
            }`}>
              {t.chatHeader}
            </h1>
            {gamification && (
              <span className="badge-gamified">
                +100 XP / Note Upload
              </span>
            )}
          </div>
          <p className={`text-sm mt-1 font-semibold ${gamification ? 'text-white' : 'text-black'}`}>
            Context-aware AI study assistant. Supports multilingual responses (Marathi, Hindi, Tamil, English) and 5 explanation styles.
          </p>
        </div>

        <button
          onClick={() => setUploadModal(true)}
          className="btn-primary bg-gradient-to-r from-cyan-600 to-indigo-600 text-white"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload Study Material</span>
        </button>
      </div>

      {/* Explanation Style Selector Bar */}
      <div className={`p-3.5 rounded-2xl border flex items-center justify-between flex-wrap gap-3 ${
        gamification ? 'glass-panel border-white/10 text-white' : 'bg-white border-black text-black shadow-sm'
      }`}>
        <span className={`text-xs font-extrabold uppercase flex items-center gap-1.5 ${
          gamification ? 'text-cyan-400' : 'text-black'
        }`}>
          <Sliders className="w-4 h-4 text-cyan-600" />
          AI Explanation Style:
        </span>

        <div className="flex flex-wrap gap-2">
          {[
            { id: 'simple', label: t.modeSimple || 'Simple Explanation' },
            { id: 'example', label: t.modeExample || 'Example' },
            { id: 'visual', label: t.modeVisual || 'Visual Explanation' },
            { id: 'step', label: t.modeStep || 'Step-by-Step' },
            { id: 'practice', label: t.modePractice || 'Practice Question' }
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => setExplanationMode(mode.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                explanationMode === mode.id
                  ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-md'
                  : gamification
                    ? 'bg-slate-900 border border-white/10 text-white hover:bg-slate-800'
                    : 'bg-slate-100 border border-black text-black hover:bg-slate-200'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Chat Left (60%), Notes Vault Right (40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chatbot Interface */}
        <div className={`lg:col-span-7 p-5 rounded-2xl border flex flex-col h-[580px] ${
          gamification ? 'glass-panel border-white/10 text-white' : 'bg-white border-black text-black shadow-md'
        }`}>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed font-semibold ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold rounded-tr-none shadow-md'
                      : gamification
                        ? 'bg-slate-900 border border-white/10 text-white rounded-tl-none whitespace-pre-wrap'
                        : 'bg-slate-100 border border-black text-black rounded-tl-none whitespace-pre-wrap'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Suggestion Chips */}
          <div className="my-3 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {suggestions.map((sug, i) => (
              <button
                key={i}
                onClick={() => handleSend(sug)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-bold shrink-0 transition-colors ${
                  gamification
                    ? 'bg-white/10 border-white/20 text-cyan-300 hover:bg-white/20'
                    : 'bg-slate-100 border-black text-black hover:bg-slate-200'
                }`}
              >
                {sug}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className={`flex items-center gap-2 pt-2 border-t ${
            gamification ? 'border-white/10' : 'border-slate-300'
          }`}>
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={t.chatPlaceholder}
              className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none ${
                gamification
                  ? 'bg-slate-900 border border-white/10 text-white placeholder-slate-400 focus:border-cyan-500'
                  : 'bg-white border border-black text-black placeholder-slate-600 focus:border-cyan-700'
              }`}
            />
            <button
              onClick={() => handleSend()}
              className="p-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:opacity-90 font-bold shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notes & Study Materials Vault */}
        <div className={`lg:col-span-5 p-5 rounded-2xl border flex flex-col h-[580px] ${
          gamification ? 'glass-panel border-white/10 text-white' : 'bg-white border-black text-black shadow-md'
        }`}>
          <div className={`flex items-center justify-between mb-4 pb-3 border-b ${
            gamification ? 'border-white/10' : 'border-slate-300'
          }`}>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              <h2 className={`font-bold text-lg ${gamification ? 'text-white' : 'text-black'}`}>
                Curriculum Study Material
              </h2>
            </div>
            <span className={`text-xs font-bold ${gamification ? 'text-white' : 'text-black'}`}>
              {notes.length} Files
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {notes.map((note) => (
              <div
                key={note.id}
                className={`p-4 space-y-3 rounded-xl border transition-all ${
                  gamification
                    ? 'bg-slate-900 border-white/10 text-white'
                    : 'bg-slate-50 border-black text-black shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-5 h-5 text-cyan-600 shrink-0" />
                    <div>
                      <h3 className={`text-sm font-bold line-clamp-1 ${gamification ? 'text-white' : 'text-black'}`}>
                        {note.title}
                      </h3>
                      <p className={`text-[11px] font-semibold ${gamification ? 'text-slate-200' : 'text-black'}`}>
                        {note.date} • {note.size}
                      </p>
                    </div>
                  </div>
                </div>

                <p className={`text-xs line-clamp-2 italic p-2 rounded-lg border ${
                  gamification ? 'bg-slate-950 border-white/10 text-slate-200' : 'bg-white border-black text-black'
                }`}>
                  "{note.content}"
                </p>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => setActiveTab('video')}
                    className="flex-1 py-1.5 px-2 rounded-lg bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 text-indigo-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Generate Video</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('quiz')}
                    className="flex-1 py-1.5 px-2 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Custom Quiz</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {uploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md p-6 space-y-4 border-indigo-500/30">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-bold text-lg text-slate-100 flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-cyan-400" />
                Upload Resource (PDF, Notes, PPT)
              </h3>
              <button
                onClick={() => setUploadModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                  Resource Type
                </label>
                <select
                  value={newNoteCategory}
                  onChange={(e) => setNewNoteCategory(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-sm text-slate-200"
                >
                  <option value="Lecture Notes">📄 Lecture Notes</option>
                  <option value="PDF Textbook">📚 PDF Textbook</option>
                  <option value="PPT Presentation">📊 PPT Presentation</option>
                  <option value="Syllabus Document">📝 Syllabus Document</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                  Document Title
                </label>
                <input
                  type="text"
                  required
                  value={newNoteTitle}
                  onChange={(e) => setNewNoteTitle(e.target.value)}
                  placeholder="e.g. OS Unit 2 CPU Scheduling.pdf"
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                  Content Extract / Notes Text
                </label>
                <textarea
                  rows={4}
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  placeholder="Paste lecture notes or textbook summary here..."
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setUploadModal(false)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary text-xs">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Upload & Add to Vault</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
