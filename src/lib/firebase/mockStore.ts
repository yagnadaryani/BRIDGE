import { UserProfile } from '@/types/user';
import { LearnerModel } from '@/types/learnerModel';
import { DoubtThread } from '@/types/doubt';
import { DiagnosisResult } from '@/types/diagnosis';
import { LearningEvent } from '@/types/events';
import { Broadcast, NotificationItem } from '@/types/broadcast';
import { WorkItem, WorkSubmission } from '@/types/workItem';
import {
  DEMO_STUDENT,
  DEMO_TEACHER,
  INITIAL_AARAV_LEARNER_MODEL,
  DEMO_DIAGNOSES,
  DEMO_DOUBTS,
  DEMO_BROADCASTS,
  DEMO_NOTIFICATIONS,
  DEMO_WORK_ITEMS,
  DEMO_SUBMISSIONS,
} from '@/lib/data/demoSeedData';

const STORAGE_KEYS = {
  CURRENT_USER: 'bridge_current_user',
  LEARNER_MODEL: 'bridge_learner_model',
  DIAGNOSES: 'bridge_diagnoses',
  DOUBTS: 'bridge_doubts',
  EVENTS: 'bridge_events',
  MODE: 'bridge_ui_mode',
  BROADCASTS: 'bridge_broadcasts',
  NOTIFICATIONS: 'bridge_notifications',
  WORK_ITEMS: 'bridge_work_items',
  SUBMISSIONS: 'bridge_submissions',
};

// Helper for client-side localStorage access
const getLocalJSON = <T>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback;
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch (e) {
    return fallback;
  }
};

const setLocalJSON = <T>(key: string, value: T): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('LocalStorage write error:', e);
  }
};

export const mockStore = {
  // Current logged in user
  getCurrentUser: (): UserProfile | null => {
    return getLocalJSON<UserProfile | null>(STORAGE_KEYS.CURRENT_USER, DEMO_STUDENT);
  },

  setCurrentUser: (user: UserProfile | null): void => {
    setLocalJSON(STORAGE_KEYS.CURRENT_USER, user);
  },

  // Learner Model
  getLearnerModel: (studentId: string): LearnerModel => {
    const models = getLocalJSON<Record<string, LearnerModel>>(STORAGE_KEYS.LEARNER_MODEL, {
      [DEMO_STUDENT.id]: INITIAL_AARAV_LEARNER_MODEL,
    });
    return models[studentId] || {
      ...INITIAL_AARAV_LEARNER_MODEL,
      studentId,
      studentName: 'Student',
    };
  },

  saveLearnerModel: (model: LearnerModel): void => {
    const models = getLocalJSON<Record<string, LearnerModel>>(STORAGE_KEYS.LEARNER_MODEL, {
      [DEMO_STUDENT.id]: INITIAL_AARAV_LEARNER_MODEL,
    });
    models[model.studentId] = model;
    setLocalJSON(STORAGE_KEYS.LEARNER_MODEL, models);
  },

  // Diagnoses
  getDiagnoses: (studentId?: string): DiagnosisResult[] => {
    const list = getLocalJSON<DiagnosisResult[]>(STORAGE_KEYS.DIAGNOSES, DEMO_DIAGNOSES);
    if (studentId) {
      return list.filter((d) => d.studentId === studentId);
    }
    return list;
  },

  addDiagnosis: (diagnosis: DiagnosisResult): void => {
    const list = getLocalJSON<DiagnosisResult[]>(STORAGE_KEYS.DIAGNOSES, DEMO_DIAGNOSES);
    const updated = [diagnosis, ...list];
    setLocalJSON(STORAGE_KEYS.DIAGNOSES, updated);
  },

  updateDiagnosis: (updatedDiag: DiagnosisResult): void => {
    const list = getLocalJSON<DiagnosisResult[]>(STORAGE_KEYS.DIAGNOSES, DEMO_DIAGNOSES);
    const updated = list.map((d) => (d.id === updatedDiag.id ? updatedDiag : d));
    setLocalJSON(STORAGE_KEYS.DIAGNOSES, updated);
  },

  // Doubts
  getDoubts: (): DoubtThread[] => {
    return getLocalJSON<DoubtThread[]>(STORAGE_KEYS.DOUBTS, DEMO_DOUBTS);
  },

  addDoubt: (doubt: DoubtThread): void => {
    const doubts = mockStore.getDoubts();
    setLocalJSON(STORAGE_KEYS.DOUBTS, [doubt, ...doubts]);
  },

  updateDoubt: (updatedDoubt: DoubtThread): void => {
    const doubts = mockStore.getDoubts();
    const list = doubts.map((d) => (d.id === updatedDoubt.id ? updatedDoubt : d));
    setLocalJSON(STORAGE_KEYS.DOUBTS, list);
  },

  // Learning Events
  addEvent: (event: LearningEvent): void => {
    const events = getLocalJSON<LearningEvent[]>(STORAGE_KEYS.EVENTS, []);
    setLocalJSON(STORAGE_KEYS.EVENTS, [event, ...events.slice(0, 99)]);
  },

  getEvents: (studentId?: string): LearningEvent[] => {
    const events = getLocalJSON<LearningEvent[]>(STORAGE_KEYS.EVENTS, []);
    if (studentId) {
      return events.filter((e) => e.studentId === studentId);
    }
    return events;
  },

  // Broadcasts
  getBroadcasts: (): Broadcast[] => {
    return getLocalJSON<Broadcast[]>(STORAGE_KEYS.BROADCASTS, DEMO_BROADCASTS);
  },

  addBroadcast: (broadcast: Broadcast): void => {
    const list = mockStore.getBroadcasts();
    setLocalJSON(STORAGE_KEYS.BROADCASTS, [broadcast, ...list]);

    // Automatically generate notification for students
    const notification: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: 'aarav-101',
      title: broadcast.title,
      message: broadcast.message,
      subject: broadcast.subject,
      priority: broadcast.priority,
      type: 'BROADCAST',
      referenceId: broadcast.id,
      read: false,
      createdAt: Date.now(),
    };
    mockStore.addNotification(notification);
  },

  // Notifications
  getNotifications: (userId?: string): NotificationItem[] => {
    const list = getLocalJSON<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, DEMO_NOTIFICATIONS);
    if (userId) {
      return list.filter((n) => n.userId === userId || n.userId === 'ALL');
    }
    return list;
  },

  addNotification: (notification: NotificationItem): void => {
    const list = mockStore.getNotifications();
    setLocalJSON(STORAGE_KEYS.NOTIFICATIONS, [notification, ...list]);
  },

  markNotificationAsRead: (notificationId: string): void => {
    const list = mockStore.getNotifications();
    const updated = list.map((n) => (n.id === notificationId ? { ...n, read: true } : n));
    setLocalJSON(STORAGE_KEYS.NOTIFICATIONS, updated);
  },

  markAllNotificationsRead: (userId?: string): void => {
    const list = mockStore.getNotifications();
    const updated = list.map((n) => (!userId || n.userId === userId ? { ...n, read: true } : n));
    setLocalJSON(STORAGE_KEYS.NOTIFICATIONS, updated);
  },

  // Work Items / Assigned Learning
  getWorkItems: (): WorkItem[] => {
    return getLocalJSON<WorkItem[]>(STORAGE_KEYS.WORK_ITEMS, DEMO_WORK_ITEMS);
  },

  addWorkItem: (item: WorkItem): void => {
    const list = mockStore.getWorkItems();
    setLocalJSON(STORAGE_KEYS.WORK_ITEMS, [item, ...list]);

    // Create a notification for the newly assigned work
    const notification: NotificationItem = {
      id: `notif-work-${Date.now()}`,
      userId: 'aarav-101',
      title: `New Assigned Work: ${item.title}`,
      message: `${item.description} (Reward: +${item.xpReward} XP)`,
      subject: item.subject,
      priority: item.priority === 'URGENT' ? 'URGENT' : 'IMPORTANT',
      type: 'ASSIGNMENT',
      referenceId: item.id,
      read: false,
      createdAt: Date.now(),
    };
    mockStore.addNotification(notification);

    // Also initialize a submission for Aarav
    const submission: WorkSubmission = {
      id: `sub-${Date.now()}`,
      workItemId: item.id,
      studentId: 'aarav-101',
      studentName: 'Aarav Sharma',
      status: 'NOT_STARTED',
    };
    const submissions = mockStore.getSubmissions();
    setLocalJSON(STORAGE_KEYS.SUBMISSIONS, [submission, ...submissions]);
  },

  // Submissions
  getSubmissions: (studentId?: string): WorkSubmission[] => {
    const list = getLocalJSON<WorkSubmission[]>(STORAGE_KEYS.SUBMISSIONS, DEMO_SUBMISSIONS);
    if (studentId) {
      return list.filter((s) => s.studentId === studentId);
    }
    return list;
  },

  updateSubmission: (submission: WorkSubmission): void => {
    const list = mockStore.getSubmissions();
    const index = list.findIndex((s) => s.id === submission.id || (s.workItemId === submission.workItemId && s.studentId === submission.studentId));
    if (index >= 0) {
      list[index] = submission;
      setLocalJSON(STORAGE_KEYS.SUBMISSIONS, [...list]);
    } else {
      setLocalJSON(STORAGE_KEYS.SUBMISSIONS, [submission, ...list]);
    }
  },

  // Reset to initial demo state
  resetDemoData: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    localStorage.removeItem(STORAGE_KEYS.LEARNER_MODEL);
    localStorage.removeItem(STORAGE_KEYS.DIAGNOSES);
    localStorage.removeItem(STORAGE_KEYS.DOUBTS);
    localStorage.removeItem(STORAGE_KEYS.EVENTS);
    localStorage.removeItem(STORAGE_KEYS.BROADCASTS);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
    localStorage.removeItem(STORAGE_KEYS.WORK_ITEMS);
    localStorage.removeItem(STORAGE_KEYS.SUBMISSIONS);
  }
};

