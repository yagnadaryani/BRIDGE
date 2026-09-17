export interface DoubtMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'STUDENT' | 'TEACHER';
  content: string;
  timestamp: number;
}

export interface DoubtThread {
  id: string;
  studentId: string;
  studentName: string;
  subjectId: string;
  conceptId?: string;
  conceptTitle?: string;
  title: string;
  description: string;
  status: 'OPEN' | 'RESOLVED';
  createdAt: number;
  updatedAt: number;
  messages: DoubtMessage[];
  attachedContext?: {
    codeSnippet?: string;
    errorType?: string;
    labState?: string;
  };
}
