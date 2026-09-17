import { LearningEvent, LearningEventType } from '@/types/events';
import { mockStore } from '@/lib/firebase/mockStore';
import { diagnoseCodeFailure } from './diagnosisEngine';
import { updateConceptMastery } from './learnerModel';

export interface EmitEventParams {
  studentId: string;
  subjectId: string;
  conceptId: string;
  eventType: LearningEventType;
  result?: 'SUCCESS' | 'FAILURE' | 'PARTIAL';
  score?: number;
  confidence?: 'LOW' | 'MEDIUM' | 'HIGH';
  errorType?: string;
  codeSnippet?: string;
  attemptNumber?: number;
  metadata?: Record<string, any>;
}

export function logLearningEvent(params: EmitEventParams): LearningEvent {
  const event: LearningEvent = {
    id: `evt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    studentId: params.studentId,
    subjectId: params.subjectId,
    conceptId: params.conceptId,
    eventType: params.eventType,
    result: params.result,
    score: params.score,
    confidence: params.confidence,
    errorType: params.errorType,
    codeSnippet: params.codeSnippet,
    attemptNumber: params.attemptNumber || 1,
    timestamp: Date.now(),
    metadata: params.metadata,
  };

  // Persist event
  mockStore.addEvent(event);

  // Trigger reactive learning updates
  if (params.result === 'FAILURE' && params.codeSnippet) {
    // Run diagnosis engine
    const diagnosis = diagnoseCodeFailure(params.studentId, {
      subjectId: params.subjectId,
      conceptId: params.conceptId,
      errorType: params.errorType || 'BOUNDARY_OFF_BY_ONE',
      codeSnippet: params.codeSnippet,
      failedTestCases: params.metadata?.failedTestCases || ['Target element lookup at end of array'],
      confidence: params.confidence,
      attemptNumber: params.attemptNumber || 1,
    });
    mockStore.addDiagnosis(diagnosis);

    // Update root gap in learner model
    const learnerModel = mockStore.getLearnerModel(params.studentId);
    if (diagnosis.rootGapConceptId && !learnerModel.rootGaps.includes(diagnosis.rootGapConceptId)) {
      learnerModel.rootGaps.push(diagnosis.rootGapConceptId);
      mockStore.saveLearnerModel(learnerModel);
    }
  } else if (params.result === 'SUCCESS') {
    // Increment mastery score
    updateConceptMastery(params.studentId, params.conceptId, params.subjectId, 10, 'mastery');
  }

  return event;
}
