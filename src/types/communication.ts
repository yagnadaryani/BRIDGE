export type EvaluationScenario =
  | '2_MARK'
  | '4_MARK'
  | '6_MARK'
  | 'VIVA'
  | 'INTERVIEW'
  | 'PRESENTATION';

export interface CommunicationAttempt {
  id: string;
  studentId: string;
  scenario: EvaluationScenario;
  topic: string;
  userResponseText: string;
  audioDurationSeconds?: number;
  technicalAccuracyScore: number; // 0-100
  structureScore: number; // 0-100
  fluencyScore: number; // 0-100
  vocabularyScore: number; // 0-100
  overallScore: number; // 0-100
  knowledgeVsCommunicationGap: string; // Explanation distinguishing conceptual vs language gap
  suggestedStructure: string[];
  improvedVersion: string;
  timestamp: number;
}
