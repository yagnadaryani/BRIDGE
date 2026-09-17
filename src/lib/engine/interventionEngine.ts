import { DiagnosisResult } from '@/types/diagnosis';
import { LearnerModel } from '@/types/learnerModel';
import { mockStore } from '@/lib/firebase/mockStore';

export interface VerificationResult {
  diagnosisId: string;
  beforeScore: number;
  afterScore: number;
  improvementPercentage: number;
  verified: boolean;
  message: string;
  updatedLearnerModel: LearnerModel;
}

/**
 * Verifies if an intervention succeeded by evaluating the retry outcome
 */
export function verifyInterventionRetry(
  studentId: string,
  diagnosisId: string,
  retrySuccess: boolean,
  retryScore: number = 100
): VerificationResult {
  const learnerModel = mockStore.getLearnerModel(studentId);
  const diagnoses = mockStore.getDiagnoses(studentId);
  const targetDiag = diagnoses.find((d) => d.id === diagnosisId);

  const beforeScore = targetDiag?.beforeScore ?? 40;
  const afterScore = retrySuccess ? Math.max(85, retryScore) : Math.min(beforeScore + 10, 50);
  const improvementPercentage = Math.round(((afterScore - beforeScore) / Math.max(beforeScore, 1)) * 100);
  const isVerified = retrySuccess && afterScore >= 75;

  // Update diagnosis record
  if (targetDiag) {
    targetDiag.afterScore = afterScore;
    targetDiag.verified = isVerified;
    mockStore.updateDiagnosis(targetDiag);
  }

  // Update learner model concept mastery
  const conceptId = targetDiag?.conceptId || 'dsa-binary-search';
  const currentConceptMastery = learnerModel.conceptMastery[conceptId] || {
    conceptId,
    subjectId: targetDiag?.subjectId || 'dsa',
    masteryScore: beforeScore,
    applicationScore: beforeScore,
    debuggingScore: beforeScore,
    retentionScore: beforeScore,
    confidenceCalibration: 0,
    attemptsCount: 1,
    lastAttemptAt: Date.now(),
  };

  learnerModel.conceptMastery[conceptId] = {
    ...currentConceptMastery,
    masteryScore: afterScore,
    applicationScore: isVerified ? Math.min(100, currentConceptMastery.applicationScore + 30) : currentConceptMastery.applicationScore,
    debuggingScore: isVerified ? Math.min(100, currentConceptMastery.debuggingScore + 35) : currentConceptMastery.debuggingScore,
    attemptsCount: currentConceptMastery.attemptsCount + 1,
    lastAttemptAt: Date.now(),
  };

  // Remove root gap if verified
  if (isVerified && targetDiag?.rootGapConceptId) {
    learnerModel.rootGaps = learnerModel.rootGaps.filter((g) => g !== targetDiag.rootGapConceptId);
    if (!learnerModel.effectiveInterventions.includes(targetDiag.interventionTitle)) {
      learnerModel.effectiveInterventions.push(targetDiag.interventionTitle);
    }
  }

  // Recalculate overall mastery score
  const conceptScores = Object.values(learnerModel.conceptMastery).map((c) => c.masteryScore);
  learnerModel.overallMastery = Math.round(
    conceptScores.reduce((sum, score) => sum + score, 0) / Math.max(conceptScores.length, 1)
  );

  // Award XP for verified growth
  if (isVerified) {
    learnerModel.xp += 150; // Growth XP
    if (learnerModel.xp >= learnerModel.level * 500) {
      learnerModel.level += 1;
    }
  }

  learnerModel.updatedAt = Date.now();
  mockStore.saveLearnerModel(learnerModel);

  return {
    diagnosisId,
    beforeScore,
    afterScore,
    improvementPercentage,
    verified: isVerified,
    message: isVerified
      ? `Intervention verified! Score improved from ${beforeScore}% to ${afterScore}%. Prerequisite gap closed.`
      : `Retry complete (${afterScore}%). Additional guided practice recommended.`,
    updatedLearnerModel: learnerModel,
  };
}
