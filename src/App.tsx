import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { GamificationProvider } from './context/GamificationContext';
import { DeviceModeProvider } from './context/DeviceModeContext';
import { LoginView } from './components/auth/LoginView';
import { AppShell } from './components/layout/AppShell';
import { StudentDashboard } from './components/student/StudentDashboard';
import { SubjectWorkspace } from './components/subjects/SubjectWorkspace';
import { CommunicationLab } from './components/communication/CommunicationLab';
import { CareerGuidance } from './components/career/CareerGuidance';
import { DoubtsCenter } from './components/doubts/DoubtsCenter';
import { GrowthReplay } from './components/progress/GrowthReplay';
import { MissionsView } from './components/missions/MissionsView';
import { TeacherOverview } from './components/teacher/TeacherOverview';
import { StudentIntelligenceProfile } from './components/teacher/StudentIntelligenceProfile';
import { AIAssistantModal } from './components/ai/AIAssistantModal';

function MainRouter() {
  const { isAuthenticated, role } = useAuth();
  const [currentRoute, setCurrentRoute] = useState<string>('/student');
  const [isAssistantOpen, setIsAssistantOpen] = useState<boolean>(false);

  // Default routes per role
  useEffect(() => {
    if (isAuthenticated) {
      if (role === 'TEACHER' && currentRoute.startsWith('/student')) {
        setCurrentRoute('/teacher');
      } else if (role === 'STUDENT' && currentRoute.startsWith('/teacher')) {
        setCurrentRoute('/student');
      }
    }
  }, [role, isAuthenticated]);

  if (!isAuthenticated) {
    return <LoginView />;
  }

  // Determine current active subject for AI context
  let activeSubject = 'dsa';
  let activeConcept = 'Binary Search Boundary Invariants';
  if (currentRoute.includes('digital-electronics')) {
    activeSubject = 'digital-electronics';
    activeConcept = 'XOR Difference Logic & Truth Verification';
  } else if (currentRoute.includes('os')) {
    activeSubject = 'os';
    activeConcept = 'Preemptive CPU Scheduling & Convoy Effect';
  } else if (currentRoute.includes('microprocessor')) {
    activeSubject = 'microprocessor';
    activeConcept = '8085 Instruction Cycles & Status Flags';
  } else if (currentRoute.includes('cloud')) {
    activeSubject = 'cloud';
    activeConcept = 'Distributed Autoscaling & HA Redundancy';
  }

  return (
    <AppShell
      currentRoute={currentRoute}
      onNavigate={setCurrentRoute}
      onOpenAssistant={() => setIsAssistantOpen(true)}
    >
      {/* Student Routes */}
      {currentRoute === '/student' && (
        <StudentDashboard
          onNavigate={setCurrentRoute}
          onOpenAssistant={() => setIsAssistantOpen(true)}
        />
      )}

      {currentRoute.startsWith('/student/subjects/') && (
        <SubjectWorkspace
          subjectId={currentRoute.replace('/student/subjects/', '') as any}
          onNavigate={setCurrentRoute}
          onOpenAssistant={() => setIsAssistantOpen(true)}
        />
      )}

      {currentRoute === '/student/communication' && <CommunicationLab />}
      {currentRoute === '/student/career' && <CareerGuidance />}
      {currentRoute === '/student/doubts' && <DoubtsCenter />}
      {currentRoute === '/student/progress' && <GrowthReplay />}
      {currentRoute === '/student/missions' && <MissionsView onNavigate={setCurrentRoute} />}

      {/* Teacher Routes */}
      {(currentRoute === '/teacher' || currentRoute === '/teacher/students' || currentRoute === '/teacher/interventions' || currentRoute === '/teacher/analytics') && (
        <TeacherOverview onNavigate={setCurrentRoute} />
      )}

      {currentRoute.startsWith('/teacher/students/') && (
        <StudentIntelligenceProfile
          studentId={currentRoute.replace('/teacher/students/', '')}
          onBack={() => setCurrentRoute('/teacher')}
        />
      )}

      {currentRoute === '/teacher/doubts' && <DoubtsCenter />}

      {/* Context-Aware AI Pedagogical Tutor Modal */}
      <AIAssistantModal
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        currentSubject={activeSubject}
        currentConcept={activeConcept}
      />
    </AppShell>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <GamificationProvider>
        <DeviceModeProvider>
          <MainRouter />
        </DeviceModeProvider>
      </GamificationProvider>
    </AuthProvider>
  );
}
