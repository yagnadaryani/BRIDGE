import { LearnerModel, ConceptMastery } from '@/types/learnerModel';
import { mockStore } from '@/lib/firebase/mockStore';

export function getOrInitLearnerModel(studentId: string): LearnerModel {
  return mockStore.getLearnerModel(studentId);
}

export function updateConceptMastery(
  studentId: string,
  conceptId: string,
  subjectId: string,
  scoreDelta: number,
  category: 'mastery' | 'application' | 'debugging' | 'retention' = 'mastery'
): LearnerModel {
  const model = mockStore.getLearnerModel(studentId);
  const current: ConceptMastery = model.conceptMastery[conceptId] || {
    conceptId,
    subjectId,
    masteryScore: 50,
    applicationScore: 50,
    debuggingScore: 50,
    retentionScore: 50,
    confidenceCalibration: 0,
    attemptsCount: 0,
    lastAttemptAt: Date.now(),
  };

  const newScore = Math.min(100, Math.max(0, current.masteryScore + scoreDelta));

  if (category === 'mastery') current.masteryScore = newScore;
  if (category === 'application') current.applicationScore = Math.min(100, Math.max(0, current.applicationScore + scoreDelta));
  if (category === 'debugging') current.debuggingScore = Math.min(100, Math.max(0, current.debuggingScore + scoreDelta));
  if (category === 'retention') current.retentionScore = Math.min(100, Math.max(0, current.retentionScore + scoreDelta));

  current.attemptsCount += 1;
  current.lastAttemptAt = Date.now();

  model.conceptMastery[conceptId] = current;

  // Recalculate average
  const allMasteries = Object.values(model.conceptMastery).map((c) => c.masteryScore);
  model.overallMastery = Math.round(allMasteries.reduce((a, b) => a + b, 0) / allMasteries.length);

  model.updatedAt = Date.now();
  mockStore.saveLearnerModel(model);
  return model;
}
