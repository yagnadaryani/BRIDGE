import { Mission, Badge } from '@/types/gamification';
import { LearnerModel } from '@/types/learnerModel';
import { mockStore } from '@/lib/firebase/mockStore';

export const SYSTEM_MISSIONS: Mission[] = [
  {
    id: 'mission_binary_search_repair',
    title: 'Repair Binary Search Boundaries',
    description: 'Diagnose and fix the off-by-one boundary bug in Binary Search Code Studio.',
    subjectId: 'dsa',
    xpReward: 250,
    badgeReward: 'boundary_master',
    isCompleted: false,
    progress: 40,
    category: 'REPAIR',
  },
  {
    id: 'mission_os_scheduling',
    title: 'Simulate CPU Scheduling',
    description: 'Run Round Robin and FCFS process simulations in OS Simulator and compare turnaround times.',
    subjectId: 'os',
    xpReward: 150,
    badgeReward: 'process_architect',
    isCompleted: false,
    progress: 75,
    category: 'LAB',
  },
  {
    id: 'mission_digital_circuit',
    title: 'Build Universal NAND Gate',
    description: 'Construct an AND logic gate using only NAND gates in Digital Electronics Circuit Lab.',
    subjectId: 'digital-electronics',
    xpReward: 200,
    badgeReward: 'circuit_wizard',
    isCompleted: false,
    progress: 0,
    category: 'LAB',
  },
  {
    id: 'mission_viva_english',
    title: 'Pass Technical Examiner Viva',
    description: 'Score > 80% on technical structure in English Communication Lab.',
    subjectId: 'communication',
    xpReward: 300,
    badgeReward: 'tech_orator',
    isCompleted: false,
    progress: 50,
    category: 'COMMUNICATION',
  }
];

export const SYSTEM_BADGES: Badge[] = [
  {
    id: 'first_lab',
    title: 'Lab Explorer',
    description: 'Completed your first virtual laboratory simulation.',
    iconName: 'FlaskConical',
    category: 'Exploration',
  },
  {
    id: 'boundary_master',
    title: 'Boundary Master',
    description: 'Diagnosed and verified an off-by-one array index prerequisite gap.',
    iconName: 'ShieldCheck',
    category: 'Mastery',
  },
  {
    id: 'process_architect',
    title: 'Process Scheduler',
    description: 'Analyzed CPU turnaround and waiting time Gantt charts.',
    iconName: 'Cpu',
    category: 'OS',
  },
  {
    id: 'tech_orator',
    title: 'Technical Orator',
    description: 'Demonstrated high technical communication fluency in Technical English Lab.',
    iconName: 'Mic',
    category: 'Communication',
  }
];

export function awardLearningXP(
  studentId: string,
  xpAmount: number,
  reason: string
): { updatedModel: LearnerModel; leveledUp: boolean } {
  const model = mockStore.getLearnerModel(studentId);
  const oldLevel = model.level;

  model.xp += xpAmount;
  const newLevel = Math.floor(model.xp / 500) + 1;
  const leveledUp = newLevel > oldLevel;

  model.level = newLevel;
  model.updatedAt = Date.now();

  mockStore.saveLearnerModel(model);

  return { updatedModel: model, leveledUp };
}
