import {
  UserProfile,
  LearnerModel,
  LearningEvent,
  Intervention,
  GamificationProfile,
  DoubtItem,
  SubjectId
} from '../types';
import {
  DEMO_STUDENT,
  DEMO_TEACHER,
  INITIAL_LEARNER_MODEL,
  INITIAL_INTERVENTIONS,
  INITIAL_GAMIFICATION_PROFILE,
  INITIAL_DOUBTS
} from '../data/mockData';
import { diagnoseLearningError } from './diagnosticEngine';

const STORAGE_KEYS = {
  CURRENT_USER: 'bridge_current_user',
  USERS: 'bridge_registered_users',
  LEARNER_MODEL: 'bridge_learner_model',
  INTERVENTIONS: 'bridge_interventions',
  GAMIFICATION: 'bridge_gamification_profile',
  DOUBTS: 'bridge_doubts',
  EVENTS: 'bridge_learning_events',
  GAMIFICATION_MODE: 'bridge_mode_gamification',
  DEVICE_MODE: 'bridge_device_mode'
};

class StorageService {
  private get<T>(key: string, fallback: T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  private set(key: string, value: any): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn('Storage set failed:', e);
    }
  }

  // --- Auth & Users ---
  getCurrentUser(): UserProfile {
    return this.get<UserProfile>(STORAGE_KEYS.CURRENT_USER, DEMO_STUDENT);
  }

  setCurrentUser(user: UserProfile): void {
    this.set(STORAGE_KEYS.CURRENT_USER, user);
  }

  getRegisteredUsers(): UserProfile[] {
    const defaultUsers = [DEMO_STUDENT, DEMO_TEACHER];
    return this.get<UserProfile[]>(STORAGE_KEYS.USERS, defaultUsers);
  }

  registerUser(user: UserProfile): void {
    const users = this.getRegisteredUsers();
    const existingIndex = users.findIndex(u => u.email === user.email);
    if (existingIndex >= 0) {
      users[existingIndex] = user;
    } else {
      users.push(user);
    }
    this.set(STORAGE_KEYS.USERS, users);
    this.setCurrentUser(user);
  }

  // --- Learner Model ---
  getLearnerModel(studentId: string = DEMO_STUDENT.id): LearnerModel {
    const model = this.get<LearnerModel>(STORAGE_KEYS.LEARNER_MODEL, INITIAL_LEARNER_MODEL);
    return model.studentId === studentId ? model : INITIAL_LEARNER_MODEL;
  }

  saveLearnerModel(model: LearnerModel): void {
    model.updatedAt = Date.now();
    this.set(STORAGE_KEYS.LEARNER_MODEL, model);
  }

  // --- Events & Continuous Loop ---
  recordLearningEvent(event: Omit<LearningEvent, 'id' | 'timestamp'>): LearningEvent {
    const newEvent: LearningEvent = {
      ...event,
      id: 'event_' + Math.random().toString(36).substring(2, 9),
      timestamp: Date.now()
    };

    const events = this.get<LearningEvent[]>(STORAGE_KEYS.EVENTS, []);
    events.unshift(newEvent);
    if (events.length > 200) events.length = 200;
    this.set(STORAGE_KEYS.EVENTS, events);

    // Update Learner Model based on the event
    const learnerModel = this.getLearnerModel(newEvent.studentId);

    // Add to learning history
    learnerModel.learningHistory.unshift({
      timestamp: newEvent.timestamp,
      summary: this.summarizeEvent(newEvent),
      type: this.mapEventTypeToHistoryType(newEvent.eventType),
      subjectId: newEvent.subjectId,
      conceptId: newEvent.conceptId
    });
    if (learnerModel.learningHistory.length > 50) learnerModel.learningHistory.length = 50;

    // Handle specific event consequences
    if (newEvent.eventType === 'code_failed' || newEvent.eventType === 'simulation_failed' || newEvent.eventType === 'answer_wrong') {
      // Register or update recurring error
      const errorDesc = newEvent.evidence?.errorMessage || 'Logic or boundary constraint failure';
      const existingErr = learnerModel.recurringErrors.find(
        e => e.subjectId === newEvent.subjectId && e.conceptId === newEvent.conceptId
      );
      if (existingErr) {
        existingErr.count += 1;
        existingErr.lastOccurred = Date.now();
      } else {
        learnerModel.recurringErrors.push({
          id: 'err_' + Date.now(),
          subjectId: newEvent.subjectId,
          conceptId: newEvent.conceptId,
          errorType: errorDesc,
          count: 1,
          lastOccurred: Date.now()
        });
      }

      // Check for confidence calibration
      if (newEvent.evidence?.userConfidence === 'high') {
        learnerModel.confidenceCalibration.overconfidentRate = Math.min(
          100,
          learnerModel.confidenceCalibration.overconfidentRate + 4
        );
      }

      // Trigger automatic root-cause diagnosis if it's a significant error
      this.triggerDiagnosticLoop(newEvent, learnerModel);
    } else if (newEvent.eventType === 'code_passed' || newEvent.eventType === 'simulation_passed' || newEvent.eventType === 'answer_correct') {
      // Boost mastery
      const currentVal = learnerModel.conceptMastery[newEvent.conceptId] || 60;
      learnerModel.conceptMastery[newEvent.conceptId] = Math.min(100, currentVal + 8);
      learnerModel.debuggingScore = Math.min(100, learnerModel.debuggingScore + 3);
      learnerModel.applicationScore = Math.min(100, learnerModel.applicationScore + 4);

      if (newEvent.evidence?.userConfidence === 'low') {
        learnerModel.confidenceCalibration.underconfidentRate = Math.min(
          100,
          learnerModel.confidenceCalibration.underconfidentRate + 2
        );
      } else {
        learnerModel.confidenceCalibration.calibratedRate = Math.min(
          100,
          learnerModel.confidenceCalibration.calibratedRate + 2
        );
      }
    }

    this.saveLearnerModel(learnerModel);
    return newEvent;
  }

  private triggerDiagnosticLoop(event: LearningEvent, model: LearnerModel): void {
    const diagnostic = diagnoseLearningError(event.subjectId, event.conceptId, event.evidence || {});

    // Check if root gap already registered
    const existingGap = model.rootGaps.find(
      g => g.subjectId === event.subjectId && g.conceptId === event.conceptId && g.status === 'ACTIVE'
    );

    if (!existingGap) {
      model.rootGaps.push({
        id: 'gap_' + Date.now(),
        subjectId: event.subjectId,
        conceptId: event.conceptId,
        gapCategory: diagnostic.gapCategory,
        description: diagnostic.rootDiagnosis,
        prerequisiteConcept: diagnostic.prerequisiteConcept,
        status: 'ACTIVE',
        detectedAt: Date.now()
      });
    }

    // Auto-create a pending intervention
    const interventions = this.getInterventions();
    const existingIntervention = interventions.find(
      i => i.subjectId === event.subjectId && i.conceptId === event.conceptId && i.status === 'PENDING'
    );

    if (!existingIntervention) {
      const newIntervention: Intervention = {
        id: 'interv_' + Date.now(),
        studentId: event.studentId,
        subjectId: event.subjectId,
        conceptId: event.conceptId,
        gapCategory: diagnostic.gapCategory,
        type: diagnostic.interventionType,
        title: diagnostic.recommendedTitle,
        rootDiagnosis: diagnostic.rootDiagnosis,
        prerequisitePath: diagnostic.prerequisitePath,
        content: diagnostic.recommendedContent,
        interactiveExercise: diagnostic.interactiveExercise,
        beforeScore: model.conceptMastery[event.conceptId] || 45,
        verified: false,
        status: 'PENDING',
        createdAt: Date.now()
      };
      interventions.unshift(newIntervention);
      this.saveInterventions(interventions);
    }
  }

  // --- Interventions ---
  getInterventions(): Intervention[] {
    return this.get<Intervention[]>(STORAGE_KEYS.INTERVENTIONS, INITIAL_INTERVENTIONS);
  }

  saveInterventions(interventions: Intervention[]): void {
    this.set(STORAGE_KEYS.INTERVENTIONS, interventions);
  }

  verifyIntervention(interventionId: string, success: boolean, newScore?: number): Intervention | null {
    const interventions = this.getInterventions();
    const index = interventions.findIndex(i => i.id === interventionId);
    if (index === -1) return null;

    const interv = interventions[index];
    interv.afterScore = newScore || (success ? Math.min(100, interv.beforeScore + 32) : interv.beforeScore + 5);
    interv.verified = success;
    interv.status = success ? 'COMPLETED' : 'FAILED';
    interv.completedAt = Date.now();

    interventions[index] = interv;
    this.saveInterventions(interventions);

    // Update Learner Model
    const model = this.getLearnerModel(interv.studentId);
    if (success) {
      model.effectiveInterventions.push(interv.id);
      model.conceptMastery[interv.conceptId] = interv.afterScore;
      model.retentionScore = Math.min(100, model.retentionScore + 5);
      model.debuggingScore = Math.min(100, model.debuggingScore + 8);

      // Mark root gap as VERIFIED
      const gap = model.rootGaps.find(g => g.conceptId === interv.conceptId && g.status === 'ACTIVE');
      if (gap) gap.status = 'VERIFIED';

      // Log verification history
      model.learningHistory.unshift({
        timestamp: Date.now(),
        summary: `Verified improvement: ${interv.title} raised mastery from ${interv.beforeScore}% to ${interv.afterScore}%!`,
        type: 'VERIFICATION',
        subjectId: interv.subjectId,
        conceptId: interv.conceptId
      });

      // Award Growth XP
      this.addXP(250, 'growthXP', `Verified Repair: ${interv.title}`);
    } else {
      model.failedInterventions.push(interv.id);
      // Re-diagnose
      model.learningHistory.unshift({
        timestamp: Date.now(),
        summary: `Retry unsuccessful for ${interv.title}. Re-initiating diagnostic inquiry.`,
        type: 'ERROR',
        subjectId: interv.subjectId,
        conceptId: interv.conceptId
      });
    }

    this.saveLearnerModel(model);
    return interv;
  }

  // --- Gamification ---
  getGamificationProfile(): GamificationProfile {
    return this.get<GamificationProfile>(STORAGE_KEYS.GAMIFICATION, INITIAL_GAMIFICATION_PROFILE);
  }

  saveGamificationProfile(profile: GamificationProfile): void {
    this.set(STORAGE_KEYS.GAMIFICATION, profile);
  }

  addXP(
    amount: number,
    category: keyof GamificationProfile['xpBreakdown'],
    reason: string
  ): { newXP: number; newLevel: number; leveledUp: boolean } {
    const profile = this.getGamificationProfile();
    profile.xp += amount;
    profile.xpBreakdown[category] = (profile.xpBreakdown[category] || 0) + amount;

    // Calculate level based on XP formula: Level = Math.floor(XP / 500) + 1
    const newLevel = Math.floor(profile.xp / 500) + 1;
    const leveledUp = newLevel > profile.level;
    profile.level = newLevel;

    if (leveledUp) {
      if (newLevel >= 5) profile.title = 'Systems Polymath';
      else if (newLevel >= 4) profile.title = 'Logic Architect';
      else if (newLevel >= 3) profile.title = 'Circuit Crafter';
      else profile.title = 'Engineering Apprentice';
    }

    this.saveGamificationProfile(profile);
    return { newXP: profile.xp, newLevel, leveledUp };
  }

  // --- Doubts ---
  getDoubts(): DoubtItem[] {
    return this.get<DoubtItem[]>(STORAGE_KEYS.DOUBTS, INITIAL_DOUBTS);
  }

  saveDoubts(doubts: DoubtItem[]): void {
    this.set(STORAGE_KEYS.DOUBTS, doubts);
  }

  createDoubt(doubt: Omit<DoubtItem, 'id' | 'createdAt' | 'replies' | 'status'>): DoubtItem {
    const doubts = this.getDoubts();
    const newDoubt: DoubtItem = {
      ...doubt,
      id: 'doubt_' + Date.now(),
      status: 'OPEN',
      createdAt: Date.now(),
      replies: []
    };
    doubts.unshift(newDoubt);
    this.saveDoubts(doubts);

    this.recordLearningEvent({
      studentId: doubt.studentId,
      subjectId: doubt.subjectId,
      conceptId: doubt.conceptId,
      eventType: 'doubt_raised',
      metadata: { title: doubt.title }
    });

    return newDoubt;
  }

  replyDoubt(doubtId: string, reply: { authorId: string; authorName: string; authorRole: any; message: string }): void {
    const doubts = this.getDoubts();
    const doubt = doubts.find(d => d.id === doubtId);
    if (!doubt) return;

    doubt.replies.push({
      ...reply,
      id: 'reply_' + Date.now(),
      timestamp: Date.now()
    });

    if (reply.authorRole === 'TEACHER') {
      doubt.status = 'RESOLVED';
    }

    this.saveDoubts(doubts);
  }

  // --- Helpers ---
  private summarizeEvent(event: LearningEvent): string {
    switch (event.eventType) {
      case 'code_failed':
        return `Code failed test validation: ${event.evidence?.errorMessage || 'Boundary violation'}`;
      case 'code_passed':
        return `Code passed all test cases for ${event.conceptId}`;
      case 'simulation_failed':
        return `Circuit simulation failed logic verification: ${event.evidence?.errorMessage || 'Output mismatch'}`;
      case 'simulation_passed':
        return `Circuit simulation verified successfully`;
      case 'answer_wrong':
        return `Assessment question answered incorrectly (Confidence: ${event.evidence?.userConfidence || 'medium'})`;
      case 'answer_correct':
        return `Assessment question answered correctly`;
      case 'circuit_created':
        return `Created new logic circuit schematic`;
      case 'doubt_raised':
        return `Raised academic inquiry with instructor`;
      default:
        return `Learning activity registered in ${event.subjectId}`;
    }
  }

  private mapEventTypeToHistoryType(type: LearningEvent['eventType']): 'ATTEMPT' | 'ERROR' | 'ROOT_GAP' | 'INTERVENTION' | 'RETRY' | 'VERIFICATION' {
    if (type === 'code_failed' || type === 'simulation_failed' || type === 'answer_wrong') return 'ERROR';
    if (type === 'circuit_fault_detected') return 'ROOT_GAP';
    if (type === 'intervention_started' || type === 'intervention_completed') return 'INTERVENTION';
    if (type === 'retry_started' || type === 'retry_completed') return 'RETRY';
    if (type === 'improvement_verified' || type === 'circuit_verified') return 'VERIFICATION';
    return 'ATTEMPT';
  }

  resetToDemo(): void {
    localStorage.clear();
    this.setCurrentUser(DEMO_STUDENT);
    this.saveLearnerModel(INITIAL_LEARNER_MODEL);
    this.saveInterventions(INITIAL_INTERVENTIONS);
    this.saveGamificationProfile(INITIAL_GAMIFICATION_PROFILE);
    this.saveDoubts(INITIAL_DOUBTS);
  }
}

export const storageService = new StorageService();
