export interface ConceptMastery {
  conceptId: string;
  subjectId: string;
  masteryScore: number; // 0 to 100
  applicationScore: number; // 0 to 100
  debuggingScore: number; // 0 to 100
  retentionScore: number; // 0 to 100
  confidenceCalibration: number; // -100 (overconfident) to +100 (well calibrated)
  attemptsCount: number;
  lastAttemptAt: number;
}

export interface RecurringError {
  errorType: string;
  conceptId: string;
  count: number;
  lastOccurredAt: number;
  description: string;
}

export interface LearnerModel {
  studentId: string;
  studentName: string;
  overallMastery: number; // 0 - 100
  conceptMastery: Record<string, ConceptMastery>; // conceptId -> ConceptMastery
  applicationScore: number;
  debuggingScore: number;
  retentionScore: number;
  communicationScore: number;
  confidenceCalibration: number;
  recurringErrors: RecurringError[];
  rootGaps: string[]; // List of concept IDs representing active root prerequisite gaps
  effectiveInterventions: string[];
  failedInterventions: string[];
  xp: number;
  level: number;
  streakDays: number;
  unlockedBadges: string[];
  completedMissions: string[];
  updatedAt: number;
}
