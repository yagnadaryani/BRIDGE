import React, { useEffect, useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { AuthView } from './components/auth/AuthView';
import { ChatbotVault } from './components/chat/ChatbotVault';
import { VideoGenerator } from './components/video/VideoGenerator';
import { DigitalLab } from './components/labs/DigitalLab';
import { CloudLab } from './components/labs/CloudLab';
import { OsLab } from './components/labs/OsLab';
import { MicroprocessorLab } from './components/labs/MicroprocessorLab';
import { DsaLab } from './components/labs/DsaLab';
import { QuizCareerPanel } from './components/quiz/QuizCareerPanel';
import { StudentProgress } from './components/progress/StudentProgress';
import { TeacherDashboard } from './components/teacher/TeacherDashboard';
import { ShieldAlert } from 'lucide-react';

const MainContent = () => {
  const { activeTab, setActiveTab, role } = useApp();
  const [securityToast, setSecurityToast] = useState('');

  // Enforce Route-Level Authorization & Protection
  useEffect(() => {
    if (role === 'student' && activeTab === 'teacher') {
      setSecurityToast('Access Denied: The Teacher Command Center is restricted to Faculty accounts only.');
      setActiveTab('chat');
      setTimeout(() => setSecurityToast(''), 4000);
    }
  }, [role, activeTab, setActiveTab]);

  const renderTab = () => {
    // Role-based protection check
    if (role === 'student' && activeTab === 'teacher') {
      return <ChatbotVault />;
    }

    switch (activeTab) {
      case 'chat':
        return <ChatbotVault />;
      case 'video':
        return <VideoGenerator />;
      case 'digital':
        return <DigitalLab />;
      case 'cloud':
        return <CloudLab />;
      case 'os':
        return <OsLab />;
      case 'micro':
        return <MicroprocessorLab />;
      case 'dsa':
        return <DsaLab />;
      case 'quiz':
        return <QuizCareerPanel />;
      case 'progress':
        return <StudentProgress />;
      case 'teacher':
        return role === 'teacher' ? <TeacherDashboard /> : <ChatbotVault />;
      default:
        return <ChatbotVault />;
    }
  };

  return (
    <div className="flex-1 min-w-0 pr-2 sm:pr-4 pb-12 space-y-4">
      {securityToast && (
        <div className="p-4 rounded-xl bg-rose-500/20 border border-rose-500 text-rose-300 text-xs font-bold flex items-center gap-2 animate-bounce">
          <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
          <span>{securityToast}</span>
        </div>
      )}
      {renderTab()}
    </div>
  );
};

const AppShell = () => {
  const { gamification, currentUser } = useApp();

  // If user is not logged in, render full Landing/Auth View
  if (!currentUser) {
    return <AuthView />;
  }

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-400 ${
      gamification ? 'dark-gamified bg-[#060911] text-white' : 'bg-white text-black'
    }`}>
      <Header />
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        <Sidebar />
        <MainContent />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
