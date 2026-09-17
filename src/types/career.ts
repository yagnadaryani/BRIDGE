export interface CareerInterestProfile {
  studentId: string;
  problemSolving: number; // 0-100
  coding: number;
  systems: number;
  hardware: number;
  cloud: number;
  communication: number;
  analytical: number;
  updatedAt: number;
}

export interface CareerOption {
  id: string;
  title: string;
  category: string;
  description: string;
  matchScore: number; // 0-100
  keySkillsRequired: string[];
  recommendedFocusSubjects: string[];
  nextSteps: string[];
}
