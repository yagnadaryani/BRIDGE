export type WorkType =
  | 'ASSIGNMENT'
  | 'PRACTICE'
  | 'QUIZ'
  | 'LAB_CHALLENGE'
  | 'CODING_TASK'
  | 'SIMULATION'
  | 'COMMUNICATION_TASK';

export type SubmissionStatus =
  | 'NOT_STARTED'
  | 'IN_PROGRESS'
  | 'SUBMITTED'
  | 'COMPLETED'
  | 'OVERDUE';

export interface WorkItem {
  id: string;
  teacherId: string;
  teacherName: string;
  title: string;
  description: string;
  subject: string;
  conceptId: string;
  workType: WorkType;
  targetAudience: string;
  dueDate: string;
  priority: 'NORMAL' | 'HIGH' | 'URGENT';
  xpReward: number;
  attachmentName?: string;
  attachmentUrl?: string;
  createdAt: number;
}

export interface WorkSubmission {
  id: string;
  workItemId: string;
  studentId: string;
  studentName: string;
  status: SubmissionStatus;
  score?: number;
  submittedAt?: number;
  solutionText?: string;
  evidenceSummary?: string;
}
