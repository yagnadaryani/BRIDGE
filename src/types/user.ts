export type UserRole = 'STUDENT' | 'TEACHER';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: number;
  department?: string;
  year?: string;
}
