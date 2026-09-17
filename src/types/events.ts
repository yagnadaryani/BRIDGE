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
  | 'simulation_failed'
  | 'intervention_started'
  | 'intervention_completed'
  | 'retry_started'
  | 'retry_completed'
  | 'improvement_verified'
  | 'communication_attempted'
  | 'communication_feedback_received';

export interface LearningEvent {
  id: string;
  studentId: string;
  subjectId: string;
  conceptId: string;
  eventType: LearningEventType;
  result?: 'SUCCESS' | 'FAILURE' | 'PARTIAL';
  score?: number;
  confidence?: 'LOW' | 'MEDIUM' | 'HIGH';
  errorType?: string;
  codeSnippet?: string;
  attemptNumber: number;
  timestamp: number;
  metadata?: Record<string, any>;
}
