export type UIMode = 'NORMAL' | 'GAMIFIED';

export interface Mission {
  id: string;
  title: string;
  description: string;
  subjectId: string;
  xpReward: number;
  badgeReward?: string;
  isCompleted: boolean;
  progress: number; // 0 - 100
  category: 'DEBUGGING' | 'MASTERY' | 'REPAIR' | 'COMMUNICATION' | 'LAB';
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  iconName: string;
  category: string;
  unlockedAt?: number;
}
