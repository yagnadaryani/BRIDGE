import { UserProfile, UserRole } from '@/types/user';
import { mockStore } from './mockStore';
import { DEMO_STUDENT, DEMO_TEACHER } from '@/lib/data/demoSeedData';

export const getCurrentSessionUser = (): UserProfile | null => {
  return mockStore.getCurrentUser();
};

export const loginWithRole = async (
  email: string,
  role: UserRole
): Promise<UserProfile> => {
  // Check if it's a demo account request
  if (role === 'TEACHER' || email.includes('teacher')) {
    const teacherUser = { ...DEMO_TEACHER, email: email || DEMO_TEACHER.email };
    mockStore.setCurrentUser(teacherUser);
    return teacherUser;
  } else {
    const studentUser = { ...DEMO_STUDENT, email: email || DEMO_STUDENT.email };
    mockStore.setCurrentUser(studentUser);
    return studentUser;
  }
};

export const logoutUser = async (): Promise<void> => {
  mockStore.setCurrentUser(null);
};
