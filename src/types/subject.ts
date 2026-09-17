export type SubjectId =
  | 'dsa'
  | 'os'
  | 'digital-electronics'
  | 'microprocessor'
  | 'cloud'
  | 'communication';

export interface Concept {
  id: string;
  subjectId: SubjectId;
  title: string;
  description: string;
  prerequisites: string[];
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  theory: {
    overview: string;
    keyPoints: string[];
    diagramType?: string;
    hindiExplanation?: string;
    marathiExplanation?: string;
  };
}

export interface Subject {
  id: SubjectId;
  title: string;
  code: string;
  description: string;
  iconName: string;
  color: string;
  concepts: Concept[];
}

export interface AssessmentQuestion {
  id: string;
  subjectId: SubjectId;
  conceptId: string;
  type: 'MCQ' | 'CONCEPTUAL' | 'APPLICATION' | 'CODING' | 'SCENARIO';
  question: string;
  options?: string[];
  correctAnswer: string | number; // index or string
  explanation: string;
  codeSnippet?: string;
}
