import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
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

const MainContent = () => {
  const { activeTab, role } = useApp();

  const renderTab = () => {
    if (role === 'teacher' && activeTab === 'teacher') return <TeacherDashboard />;

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
        return <TeacherDashboard />;
      default:
        return <ChatbotVault />;
    }
  };

  return (
    <div className="flex-1 min-w-0 pr-2 sm:pr-4 pb-12">
      {renderTab()}
    </div>
  );
};

const AppShell = () => {
  const { gamification } = useApp();

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
