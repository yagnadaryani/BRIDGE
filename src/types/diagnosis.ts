export type DiagnosisCategory =
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

export interface PrerequisiteNode {
  id: string;
  title: string;
  subjectId: string;
  description: string;
  prerequisites: string[]; // Concept IDs
  repairExercise: {
    question: string;
    explanation: string;
    options?: string[];
    correctAnswer?: string | number;
    codeTemplate?: string;
    testCase?: string;
  };
}

export interface DiagnosisResult {
  id: string;
  studentId: string;
  subjectId: string;
  conceptId: string;
  category: DiagnosisCategory;
  title: string;
  explanation: string;
  evidence: string[];
  rootGapConceptId?: string;
  rootGapTitle?: string;
  recommendedIntervention: InterventionType;
  interventionTitle: string;
  interventionContent: {
    explanation: string;
    prerequisiteTopic?: string;
    contrastExample?: { wrong: string; right: string; why: string };
    practiceProblem?: {
      title: string;
      prompt: string;
      initialCode?: string;
      expectedOutput?: string;
      options?: string[];
      correctAnswerIndex?: number;
    };
  };
  beforeScore: number;
  afterScore?: number;
  verified?: boolean;
  timestamp: number;
}
