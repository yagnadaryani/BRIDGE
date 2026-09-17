import { DiagnosisResult, DiagnosisCategory, InterventionType } from '@/types/diagnosis';
import { findRootPrerequisiteGap, PREREQUISITE_GRAPH } from './prerequisiteGraph';

export interface CodeErrorEvidence {
  subjectId: string;
  conceptId: string;
  errorType: string;
  codeSnippet: string;
  failedTestCases: string[];
  confidence?: string;
  attemptNumber: number;
}

export function diagnoseCodeFailure(
  studentId: string,
  evidence: CodeErrorEvidence,
  currentMasteryScore: number = 40
): DiagnosisResult {
  const { conceptId, errorType, codeSnippet } = evidence;
  let category: DiagnosisCategory = 'CONCEPT_GAP';
  let recommendedIntervention: InterventionType = 'SIMPLE_EXPLANATION';
  let title = 'Learning Problem Identified';
  let explanation = '';
  let evidenceList: string[] = [];

  // Check for boundary / indexing off-by-one errors (Classic Prerequisite Gap)
  if (
    errorType.includes('BOUNDARY') ||
    errorType.includes('OFF_BY_ONE') ||
    errorType.includes('OUT_OF_BOUNDS') ||
    codeSnippet.includes('arr.length') && !codeSnippet.includes('arr.length - 1')
  ) {
    category = 'PREREQUISITE_GAP';
    recommendedIntervention = 'PREREQUISITE_REPAIR';
    title = 'Prerequisite Gap: Array Index & Boundary Pointer Handling';
    explanation = `Analysis indicates an off-by-one boundary condition. You attempted Binary Search using index \`high = arr.length\`, which points past the last element of a zero-indexed array. This stems from a root prerequisite gap in Array Boundary Invariants.`;
    evidenceList = [
      `Code snippet uses invalid upper bound pointer`,
      `Failed on array edge test cases (size 1 and last element lookup)`,
      `Observed recurring boundary failure (${evidence.attemptNumber} attempts)`
    ];
  } else if (errorType.includes('INFINITE_LOOP') || errorType.includes('STUCK')) {
    category = 'MISCONCEPTION';
    recommendedIntervention = 'CONTRAST_EXAMPLE';
    title = 'Misconception: Loop Pointer Update Rule';
    explanation = 'Setting pointers directly to `mid` without adding/subtracting 1 (`low = mid` or `high = mid`) causes pointer convergence stasis when `low` and `high` are adjacent.';
    evidenceList = [
      'Infinite loop execution detected',
      'Pointers failed to converge towards base case'
    ];
  } else if (errorType.includes('LOGIC') || errorType.includes('WRONG_ANSWER')) {
    category = 'APPLICATION_GAP';
    recommendedIntervention = 'GUIDED_PRACTICE';
    title = 'Application Gap: Algorithm Execution Flow';
    explanation = 'Conceptual understanding is present, but applying the comparison rule to narrow the search space contains logic mismatches.';
    evidenceList = [
      'Output values did not match expected test results',
      'Correct definitions provided in quiz, but code logic mismatched'
    ];
  }

  // Find root gap node from prerequisite graph
  const rootNode = findRootPrerequisiteGap(conceptId);
  const targetGraphNode = PREREQUISITE_GRAPH[conceptId];

  return {
    id: `diag-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    studentId,
    subjectId: evidence.subjectId,
    conceptId: evidence.conceptId,
    category,
    title,
    explanation,
    evidence: evidenceList,
    rootGapConceptId: rootNode?.id || conceptId,
    rootGapTitle: rootNode?.title || targetGraphNode?.title || 'Boundary Handling',
    recommendedIntervention,
    interventionTitle: `Targeted Repair: ${rootNode?.title || 'Prerequisite Repair'}`,
    interventionContent: {
      explanation: rootNode?.repairExercise.explanation || 'Review array indexing invariants.',
      prerequisiteTopic: rootNode?.title || 'Zero-Indexed Arrays',
      contrastExample: {
        wrong: 'let high = arr.length; // Out of bounds!',
        right: 'let high = arr.length - 1; // Correct upper index',
        why: 'In zero-indexed arrays of size N, valid indices range from 0 to N-1.'
      },
      practiceProblem: rootNode?.repairExercise ? {
        title: rootNode.repairExercise.question,
        prompt: rootNode.repairExercise.question,
        options: rootNode.repairExercise.options,
        correctAnswerIndex: typeof rootNode.repairExercise.correctAnswer === 'number'
          ? rootNode.repairExercise.correctAnswer
          : 1
      } : undefined
    },
    beforeScore: currentMasteryScore,
    verified: false,
    timestamp: Date.now(),
  };
}
