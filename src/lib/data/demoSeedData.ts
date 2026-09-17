import { UserProfile } from '@/types/user';
import { LearnerModel } from '@/types/learnerModel';
import { DoubtThread } from '@/types/doubt';
import { DiagnosisResult } from '@/types/diagnosis';

export const DEMO_STUDENT: UserProfile = {
  id: 'aarav-101',
  email: 'aarav@bridge.edu',
  name: 'Aarav Sharma',
  role: 'STUDENT',
  department: 'Computer Science & Engineering',
  year: '3rd Year',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
};

export const DEMO_TEACHER: UserProfile = {
  id: 'teacher-202',
  email: 'teacher@bridge.edu',
  name: 'Dr. Vikramaditya Rao',
  role: 'TEACHER',
  department: 'Computer Science & Engineering',
  avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  createdAt: Date.now() - 365 * 24 * 60 * 60 * 1000,
};

export const INITIAL_AARAV_LEARNER_MODEL: LearnerModel = {
  studentId: 'aarav-101',
  studentName: 'Aarav Sharma',
  overallMastery: 64,
  conceptMastery: {
    'dsa-binary-search': {
      conceptId: 'dsa-binary-search',
      subjectId: 'dsa',
      masteryScore: 42,
      applicationScore: 38,
      debuggingScore: 35,
      retentionScore: 50,
      confidenceCalibration: -25, // Slightly overconfident
      attemptsCount: 4,
      lastAttemptAt: Date.now() - 2 * 60 * 60 * 1000,
    },
    'dsa-sorted-arrays': {
      conceptId: 'dsa-sorted-arrays',
      subjectId: 'dsa',
      masteryScore: 55,
      applicationScore: 50,
      debuggingScore: 45,
      retentionScore: 60,
      confidenceCalibration: 0,
      attemptsCount: 3,
      lastAttemptAt: Date.now() - 24 * 60 * 60 * 1000,
    },
    'dsa-boundary-indexing': {
      conceptId: 'dsa-boundary-indexing',
      subjectId: 'dsa',
      masteryScore: 30, // ROOT GAP
      applicationScore: 25,
      debuggingScore: 20,
      retentionScore: 40,
      confidenceCalibration: -40,
      attemptsCount: 6,
      lastAttemptAt: Date.now() - 1 * 60 * 60 * 1000,
    },
    'os-cpu-scheduling': {
      conceptId: 'os-cpu-scheduling',
      subjectId: 'os',
      masteryScore: 78,
      applicationScore: 82,
      debuggingScore: 75,
      retentionScore: 76,
      confidenceCalibration: 10,
      attemptsCount: 5,
      lastAttemptAt: Date.now() - 3600000,
    },
    'digital-logic-gates': {
      conceptId: 'digital-logic-gates',
      subjectId: 'digital-electronics',
      masteryScore: 85,
      applicationScore: 88,
      debuggingScore: 80,
      retentionScore: 86,
      confidenceCalibration: 15,
      attemptsCount: 7,
      lastAttemptAt: Date.now() - 7200000,
    },
    'mp-8086-registers': {
      conceptId: 'mp-8086-registers',
      subjectId: 'microprocessor',
      masteryScore: 62,
      applicationScore: 60,
      debuggingScore: 58,
      retentionScore: 65,
      confidenceCalibration: -10,
      attemptsCount: 3,
      lastAttemptAt: Date.now() - 43200000,
    },
    'cloud-architecture': {
      conceptId: 'cloud-architecture',
      subjectId: 'cloud',
      masteryScore: 71,
      applicationScore: 75,
      debuggingScore: 68,
      retentionScore: 70,
      confidenceCalibration: 5,
      attemptsCount: 4,
      lastAttemptAt: Date.now() - 14400000,
    }
  },
  applicationScore: 61,
  debuggingScore: 54,
  retentionScore: 64,
  communicationScore: 58,
  confidenceCalibration: -12,
  recurringErrors: [
    {
      errorType: 'BOUNDARY_OFF_BY_ONE',
      conceptId: 'dsa-binary-search',
      count: 4,
      lastOccurredAt: Date.now() - 3600000,
      description: 'Using low <= high with high = arr.length instead of arr.length - 1, causing infinite loops / out of bounds.',
    },
    {
      errorType: 'MIDPOINT_OVERFLOW',
      conceptId: 'dsa-binary-search',
      count: 2,
      lastOccurredAt: Date.now() - 7200000,
      description: 'Using (low + high) / 2 without handling large index integer overflow.',
    }
  ],
  rootGaps: ['dsa-boundary-indexing'],
  effectiveInterventions: ['PREREQUISITE_REPAIR: Boundary Handling Visualizer'],
  failedInterventions: [],
  xp: 1420,
  level: 4,
  streakDays: 5,
  unlockedBadges: ['first_lab', 'debugging_detective', 'streak_3'],
  completedMissions: ['mission_binary_search_attempt'],
  updatedAt: Date.now(),
};

export const DEMO_DIAGNOSES: DiagnosisResult[] = [
  {
    id: 'diag-001',
    studentId: 'aarav-101',
    subjectId: 'dsa',
    conceptId: 'dsa-binary-search',
    category: 'PREREQUISITE_GAP',
    title: 'Off-By-One Boundary Condition Gap',
    explanation: 'Aarav repeatedly experiences infinite loops or array out-of-bounds in Binary Search because of a fundamental prerequisite gap in Array Indexing & Boundary Pointer calculation.',
    evidence: [
      'Submitted `while(low <= high)` with `high = arr.length`',
      'Failed test cases with array size 1 and target at last position',
      'Repeated error count: 4 boundary failures'
    ],
    rootGapConceptId: 'dsa-boundary-indexing',
    rootGapTitle: 'Array Indexing & Boundary Handling',
    recommendedIntervention: 'PREREQUISITE_REPAIR',
    interventionTitle: 'Targeted Prerequisite Repair: Array Boundary Invariants',
    interventionContent: {
      explanation: 'In Binary Search, the pointer `high` must point to the last valid index (`arr.length - 1`). If `high = arr.length`, the element `arr[high]` is `undefined`!',
      prerequisiteTopic: 'Array Indexing (0 to N-1)',
      contrastExample: {
        wrong: 'let high = arr.length;\nwhile (low <= high) { ... }',
        right: 'let high = arr.length - 1;\nwhile (low <= high) { ... }',
        why: 'In zero-indexed arrays, index arr.length is out of bounds! High must start at arr.length - 1.'
      },
      practiceProblem: {
        title: 'Boundary Repair Check',
        prompt: 'For an array of 5 elements `[10, 20, 30, 40, 50]`, what are the initial values of `low` and `high` for a valid Binary Search?',
        options: [
          'low = 0, high = 5',
          'low = 0, high = 4',
          'low = 1, high = 5',
          'low = 0, high = 3'
        ],
        correctAnswerIndex: 1
      }
    },
    beforeScore: 42,
    afterScore: 88,
    verified: true,
    timestamp: Date.now() - 3600000,
  }
];

export const DEMO_DOUBTS: DoubtThread[] = [
  {
    id: 'doubt-101',
    studentId: 'aarav-101',
    studentName: 'Aarav Sharma',
    subjectId: 'dsa',
    conceptId: 'dsa-binary-search',
    conceptTitle: 'Binary Search Boundary Conditions',
    title: 'Why does my binary search get stuck in an infinite loop on target not found?',
    description: 'Whenever I search for a number that is not present in the array, my loop never terminates. I set `low = mid` instead of `low = mid + 1`. Is that the reason?',
    status: 'RESOLVED',
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now() - 43200000,
    messages: [
      {
        id: 'msg-1',
        senderId: 'aarav-101',
        senderName: 'Aarav Sharma',
        senderRole: 'STUDENT',
        content: 'Whenever I search for a number that is not present in the array, my loop never terminates. I set `low = mid` instead of `low = mid + 1`. Is that the reason?',
        timestamp: Date.now() - 86400000,
      },
      {
        id: 'msg-2',
        senderId: 'teacher-202',
        senderName: 'Dr. Vikramaditya Rao',
        senderRole: 'TEACHER',
        content: 'Yes, Aarav! When `low = mid`, if `low` and `high` are adjacent, `mid` evaluates to `low`, so `low` never increments, causing an infinite loop. Always move past `mid` using `low = mid + 1` or `high = mid - 1`.',
        timestamp: Date.now() - 43200000,
      }
    ],
    attachedContext: {
      codeSnippet: 'while(low < high) {\n  let mid = Math.floor((low+high)/2);\n  if(arr[mid] < target) low = mid;\n}',
      errorType: 'INFINITE_LOOP'
    }
  }
];

export const DEMO_BROADCASTS: import('@/types/broadcast').Broadcast[] = [
  {
    id: 'bcast-001',
    teacherId: 'teacher-202',
    teacherName: 'Dr. Vikramaditya Rao',
    title: 'Urgent: Array Boundary Invariants Study Material',
    message: 'Students attempting the Binary Search Lab must review Chapter 4 on off-by-one pointer errors. Ensure your upper bound pointer is initialized to arr.length - 1.',
    subject: 'Data Structures & Algorithms',
    targetAudience: 'ENTIRE_CLASS',
    priority: 'URGENT',
    attachmentName: 'Binary_Search_Invariants_Guide.pdf',
    createdAt: Date.now() - 3600000,
  },
  {
    id: 'bcast-002',
    teacherId: 'teacher-202',
    teacherName: 'Dr. Vikramaditya Rao',
    title: 'Upcoming OS Scheduling Simulation Submission',
    message: 'The Round Robin vs SJF comparative Gantt simulation is due on Friday. Check the Work Allotment section for assignment guidelines.',
    subject: 'Operating Systems',
    targetAudience: 'BRANCH',
    priority: 'IMPORTANT',
    attachmentName: 'OS_Scheduling_Rubric.pdf',
    createdAt: Date.now() - 86400000,
  }
];

export const DEMO_NOTIFICATIONS: import('@/types/broadcast').NotificationItem[] = [
  {
    id: 'notif-001',
    userId: 'aarav-101',
    title: 'Urgent: Array Boundary Invariants Study Material',
    message: 'Dr. Vikramaditya Rao published an urgent announcement regarding Binary Search pointer invariants.',
    subject: 'Data Structures & Algorithms',
    priority: 'URGENT',
    type: 'BROADCAST',
    referenceId: 'bcast-001',
    read: false,
    createdAt: Date.now() - 3600000,
  },
  {
    id: 'notif-002',
    userId: 'aarav-101',
    title: 'New Assignment: Binary Search Boundary Repair',
    message: 'A targeted practice mission has been allotted to you. Earn +40 XP upon verified completion.',
    subject: 'Data Structures & Algorithms',
    priority: 'IMPORTANT',
    type: 'ASSIGNMENT',
    referenceId: 'work-001',
    read: false,
    createdAt: Date.now() - 7200000,
  },
  {
    id: 'notif-003',
    userId: 'aarav-101',
    title: 'Upcoming OS Scheduling Simulation Submission',
    message: 'Check the Work Allotment section for Round Robin vs SJF guidelines.',
    subject: 'Operating Systems',
    priority: 'NORMAL',
    type: 'BROADCAST',
    referenceId: 'bcast-002',
    read: true,
    createdAt: Date.now() - 86400000,
  }
];

export const DEMO_WORK_ITEMS: import('@/types/workItem').WorkItem[] = [
  {
    id: 'work-001',
    teacherId: 'teacher-202',
    teacherName: 'Dr. Vikramaditya Rao',
    title: 'Binary Search Boundary & Zero-Index Repair',
    description: 'Implement a zero-indexed Binary Search that correctly handles arrays of odd/even length and bounds check without out-of-bounds exceptions.',
    subject: 'Data Structures & Algorithms',
    conceptId: 'dsa-binary-search',
    workType: 'CODING_TASK',
    targetAudience: 'Students with Boundary Gap',
    dueDate: '2026-09-22',
    priority: 'HIGH',
    xpReward: 50,
    attachmentName: 'BinarySearch_Specification.pdf',
    createdAt: Date.now() - 7200000,
  },
  {
    id: 'work-002',
    teacherId: 'teacher-202',
    teacherName: 'Dr. Vikramaditya Rao',
    title: 'OS Scheduling Gantt Chart & Turnaround Time Evaluation',
    description: 'Compute and verify average Turnaround Time and Waiting Time for 4 processes under Round Robin (TQ=4) and compare with SJF.',
    subject: 'Operating Systems',
    conceptId: 'os-cpu-scheduling',
    workType: 'SIMULATION',
    targetAudience: 'Entire Class',
    dueDate: '2026-09-25',
    priority: 'NORMAL',
    xpReward: 40,
    attachmentName: 'Process_Workload_Specs.pdf',
    createdAt: Date.now() - 86400000,
  },
  {
    id: 'work-003',
    teacherId: 'teacher-202',
    teacherName: 'Dr. Vikramaditya Rao',
    title: 'Combinational Logic: Stuck-at Fault Diagnosis',
    description: 'Construct an XOR logic gate on the digital board, inject a Stuck-at-0 fault, and submit the diagnosed truth table discrepancy.',
    subject: 'Digital Electronics',
    conceptId: 'digital-logic-gates',
    workType: 'LAB_CHALLENGE',
    targetAudience: 'Entire Class',
    dueDate: '2026-09-28',
    priority: 'NORMAL',
    xpReward: 40,
    attachmentName: 'Fault_Injection_Protocol.pdf',
    createdAt: Date.now() - 172800000,
  }
];

export const DEMO_SUBMISSIONS: import('@/types/workItem').WorkSubmission[] = [
  {
    id: 'sub-001',
    workItemId: 'work-001',
    studentId: 'aarav-101',
    studentName: 'Aarav Sharma',
    status: 'IN_PROGRESS',
    score: 40,
    solutionText: 'function binarySearch(arr, target) { let low = 0; let high = arr.length; ... }',
    evidenceSummary: 'Initial run failed on boundary conditions (attempt 1). Prerequisite repair intervention pending retry.',
  },
  {
    id: 'sub-002',
    workItemId: 'work-002',
    studentId: 'aarav-101',
    studentName: 'Aarav Sharma',
    status: 'COMPLETED',
    score: 95,
    submittedAt: Date.now() - 43200000,
    solutionText: 'Round Robin TQ=4 generated avg TAT = 14.8ms, avg WT = 9.3ms.',
    evidenceSummary: 'Gantt chart verified accurately against mathematical model.',
  }
];

