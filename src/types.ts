export type UserRole = 'STUDENT' | 'TEACHER';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  department?: string;
  semester?: number;
  rollNo?: string;
}

export type SubjectId = 'dsa' | 'os' | 'digital-electronics' | 'microprocessor' | 'cloud';

export interface SubjectInfo {
  id: SubjectId;
  name: string;
  code: string;
  description: string;
  iconName: string;
  color: string;
  totalConcepts: number;
  labName: string;
}

export type LearningEventType =
  | 'concept_viewed'
  | 'question_answered'
  | 'quiz_attempted'
  | 'answer_correct'
  | 'answer_wrong'
  | 'code_submitted'
  | 'code_passed'
  | 'code_failed'
  | 'hint_requested'
  | 'lab_completed'
  | 'simulation_started'
  | 'simulation_passed'
  | 'simulation_failed'
  | 'circuit_created'
  | 'component_added'
  | 'component_connected'
  | 'circuit_fault_detected'
  | 'circuit_repaired'
  | 'circuit_verified'
  | 'intervention_started'
  | 'intervention_completed'
  | 'retry_started'
  | 'retry_completed'
  | 'improvement_verified'
  | 'communication_attempted'
  | 'communication_feedback_received'
  | 'doubt_raised';

export interface LearningEvent {
  id: string;
  studentId: string;
  subjectId: SubjectId;
  conceptId: string;
  eventType: LearningEventType;
  timestamp: number;
  metadata?: Record<string, any>;
  evidence?: {
    codeSnippet?: string;
    errorMessage?: string;
    score?: number;
    testCasesPassed?: number;
    totalTestCases?: number;
    circuitState?: any;
    userConfidence?: 'low' | 'medium' | 'high';
    [key: string]: any;
  };
}

export type RootGapCategory =
  | 'CONCEPT_GAP'
  | 'PREREQUISITE_GAP'
  | 'APPLICATION_GAP'
  | 'MISCONCEPTION'
  | 'RETENTION_GAP'
  | 'COMMUNICATION_GAP';

export type InterventionType =
  | 'SIMPLE_EXPLANATION'
  | 'PREREQUISITE_REPAIR'
  | 'GUIDED_PRACTICE'
  | 'CONTRAST_EXAMPLE'
  | 'RETRIEVAL_CHALLENGE'
  | 'EXPLAIN_AND_REFORMULATE';

export interface Intervention {
  id: string;
  studentId: string;
  subjectId: SubjectId;
  conceptId: string;
  gapCategory: RootGapCategory;
  type: InterventionType;
  title: string;
  rootDiagnosis: string;
  prerequisitePath?: string[];
  content: string;
  interactiveExercise?: {
    question: string;
    type: 'code_fix' | 'concept_check' | 'circuit_check' | 'contrast';
    initialCode?: string;
    expectedFix?: string;
    options?: string[];
    correctOptionIndex?: number;
    explanation: string;
  };
  beforeScore: number;
  afterScore?: number;
  verified: boolean;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  createdAt: number;
  completedAt?: number;
}

export interface LearnerModel {
  studentId: string;
  conceptMastery: Record<string, number>; // conceptId -> 0 to 100
  subjectMastery: Record<SubjectId, number>; // 0 to 100
  applicationScore: number; // 0 to 100
  debuggingScore: number; // 0 to 100
  retentionScore: number; // 0 to 100
  communicationScore: number; // 0 to 100
  confidenceCalibration: {
    overconfidentRate: number; // marked high confident but failed
    underconfidentRate: number; // marked low confident but passed
    calibratedRate: number; // accurately estimated
  };
  recurringErrors: Array<{
    id: string;
    subjectId: SubjectId;
    conceptId: string;
    errorType: string;
    count: number;
    lastOccurred: number;
  }>;
  rootGaps: Array<{
    id: string;
    subjectId: SubjectId;
    conceptId: string;
    gapCategory: RootGapCategory;
    description: string;
    prerequisiteConcept: string;
    status: 'ACTIVE' | 'ADDRESSED' | 'VERIFIED';
    detectedAt: number;
  }>;
  effectiveInterventions: string[];
  failedInterventions: string[];
  learningHistory: Array<{
    timestamp: number;
    summary: string;
    type: 'ATTEMPT' | 'ERROR' | 'ROOT_GAP' | 'INTERVENTION' | 'RETRY' | 'VERIFICATION';
    subjectId: SubjectId;
    conceptId: string;
  }>;
  updatedAt: number;
}

export interface GamificationProfile {
  studentId: string;
  xp: number;
  level: number;
  title: string;
  streakDays: number;
  lastActiveDate: string;
  xpBreakdown: {
    masteryXP: number;
    debuggingXP: number;
    repairXP: number;
    labXP: number;
    growthXP: number;
    communicationXP: number;
  };
  achievements: Array<{
    id: string;
    title: string;
    description: string;
    icon: string;
    unlockedAt?: number;
    progress: number;
    maxProgress: number;
    category: 'debug' | 'mastery' | 'repair' | 'lab' | 'streak';
  }>;
  activeMissions: Array<{
    id: string;
    title: string;
    description: string;
    subjectId: SubjectId;
    xpReward: number;
    type: 'debug_challenge' | 'circuit_build' | 'repair_prereq' | 'viva_voice';
    completed: boolean;
  }>;
}

export interface DoubtItem {
  id: string;
  studentId: string;
  studentName: string;
  subjectId: SubjectId;
  conceptId: string;
  title: string;
  question: string;
  contextSnippet?: string;
  status: 'OPEN' | 'IN_REVIEW' | 'RESOLVED';
  createdAt: number;
  replies: Array<{
    id: string;
    authorId: string;
    authorName: string;
    authorRole: UserRole;
    message: string;
    timestamp: number;
  }>;
}

export interface AssessmentQuestion {
  id: string;
  subjectId: SubjectId;
  conceptId: string;
  type: 'mcq' | 'code_snippet' | 'conceptual' | 'scenario';
  prompt: string;
  codeSnippet?: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  requiresConfidence: boolean;
  userConfidence?: 'low' | 'medium' | 'high';
  userSelectedOption?: number;
  isCorrect?: boolean;
}

export interface CommunicationEvaluation {
  id: string;
  studentId: string;
  mode: '2_mark' | '4_mark' | '6_mark' | 'viva' | 'interview' | 'presentation';
  topic: string;
  studentResponse: string;
  timestamp: number;
  scores: {
    technicalAccuracy: number; // 0-100
    technicalVocabulary: number; // 0-100
    structure: number; // 0-100
    clarity: number; // 0-100
    fluency: number; // 0-100
    confidence: number; // 0-100
  };
  knowledgeScore: number; // 0-100
  communicationScore: number; // 0-100
  strengths: string[];
  growthAreas: string[];
  modelAnswer: string;
  examinerFeedback: string;
}

export interface CareerProfile {
  studentId: string;
  recommendedTracks: Array<{
    title: string;
    category: string;
    matchScore: number; // 0-100
    reason: string;
    keySkills: string[];
    recommendedSubjects: SubjectId[];
  }>;
  completedQuiz: boolean;
  domainInterests: Record<string, number>;
}
