export type TargetAudience = 'ENTIRE_CLASS' | 'SUBJECT' | 'BRANCH' | 'SELECTED_STUDENTS';
export type PriorityLevel = 'NORMAL' | 'IMPORTANT' | 'URGENT';

export interface Broadcast {
  id: string;
  teacherId: string;
  teacherName: string;
  title: string;
  message: string;
  subject?: string;
  targetAudience: TargetAudience;
  priority: PriorityLevel;
  attachmentUrl?: string;
  attachmentName?: string;
  createdAt: number;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  subject?: string;
  priority: PriorityLevel;
  type: 'BROADCAST' | 'ASSIGNMENT' | 'INTERVENTION_REMINDER';
  referenceId?: string;
  read: boolean;
  createdAt: number;
}
