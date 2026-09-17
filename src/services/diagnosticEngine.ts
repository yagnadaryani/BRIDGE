import {
  RootGapCategory,
  InterventionType,
  Intervention,
  SubjectId
} from '../types';

export interface DiagnosticResult {
  gapCategory: RootGapCategory;
  prerequisiteConcept: string;
  rootDiagnosis: string;
  interventionType: InterventionType;
  recommendedTitle: string;
  recommendedContent: string;
  prerequisitePath: string[];
  interactiveExercise?: Intervention['interactiveExercise'];
}

export function diagnoseLearningError(
  subjectId: SubjectId,
  conceptId: string,
  evidence: {
    codeSnippet?: string;
    errorMessage?: string;
    circuitState?: any;
    userSelectedOption?: number;
    userConfidence?: 'low' | 'medium' | 'high';
  }
): DiagnosticResult {
  // Case 1: Binary Search off-by-one or infinite loop
  if (subjectId === 'dsa' && conceptId.includes('binary_search')) {
    const code = evidence.codeSnippet || '';
    const error = evidence.errorMessage || '';

    const hasInfiniteLoop = error.includes('timeout') || error.includes('infinite') || error.includes('time limit');
    const hasHighMid = code.includes('high = mid') && !code.includes('high = mid - 1');
    const hasLowMid = code.includes('low = mid') && !code.includes('low = mid + 1');
    const hasLoopBoundary = code.includes('low < high') && !code.includes('low <= high');

    if (hasHighMid || hasLowMid || hasInfiniteLoop || hasLoopBoundary) {
      return {
        gapCategory: 'PREREQUISITE_GAP',
        prerequisiteConcept: 'Array Index Boundaries & Invariant Preservation',
        rootDiagnosis: 'Root Cause: You are maintaining an inclusive search interval [low, high], but updating boundaries with `high = mid` (or `low = mid`) instead of eliminating the checked element. When search space narrows to two elements, `mid` stops moving, resulting in an infinite execution loop.',
        interventionType: 'PREREQUISITE_REPAIR',
        recommendedTitle: 'Prerequisite Repair: Sub-Interval Index Invariants',
        recommendedContent: `When searching sorted elements:
1. Target comparison: At index \`mid\`, we already know \`arr[mid] != target\`.
2. Strict Shrinking: Because \`arr[mid]\` was inspected, it CANNOT be part of the future search pool.
   - If target is smaller: strictly set \`high = mid - 1\`.
   - If target is larger: strictly set \`low = mid + 1\`.
3. Range Termination: With \`while (low <= high)\`, when \`low == high\`, exactly 1 candidate remains. The interval shrinks to 0 candidates only when \`low > high\`.`,
        prerequisitePath: ['Arrays', 'Zero-Based Indexing', 'Candidate Set Reduction', 'Boundary Invariants'],
        interactiveExercise: {
          question: 'If arr[mid] > target in an inclusive search interval [low, high], which boundary update preserves convergence?',
          type: 'contrast',
          options: [
            'high = mid (preserves mid in case target was nearby)',
            'high = mid - 1 (eliminates mid and guarantees the interval strictly shrinks)',
            'low = mid + 1 (expands search to right half)',
            'high = high - 1 (decrements high regardless of mid)'
          ],
          correctOptionIndex: 1,
          explanation: 'Since arr[mid] > target, arr[mid] is strictly eliminated from the remaining search range, requiring high = mid - 1.'
        }
      };
    }

    return {
      gapCategory: 'CONCEPT_GAP',
      prerequisiteConcept: 'Binary Search Midpoint Calculation',
      rootDiagnosis: 'Midpoint indexing discrepancy: Review integer division rules and comparison ordering.',
      interventionType: 'SIMPLE_EXPLANATION',
      recommendedTitle: 'Conceptual Guide: Binary Search Midpoint',
      recommendedContent: 'Binary search repeatedly halves the search space. Ensure your target comparisons branch cleanly into left, right, and match cases.',
      prerequisitePath: ['Divide and Conquer', 'Midpoint Algebra']
    };
  }

  // Case 2: Digital Electronics XOR Difference Detection
  if (subjectId === 'digital-electronics') {
    const isCircuitFault = evidence.circuitState?.hasFault || evidence.errorMessage?.includes('difference');
    if (isCircuitFault || conceptId.includes('xor')) {
      return {
        gapCategory: 'MISCONCEPTION',
        prerequisiteConcept: 'Disjunction (OR) vs Parity/Difference (XOR)',
        rootDiagnosis: 'Misconception between Logical OR and Exclusive OR: Logical OR (A + B) produces HIGH whenever at least one input is 1 (including A=1, B=1). For difference detection, both inputs being 1 is an equivalence state and must output LOW (0).',
        interventionType: 'CONTRAST_EXAMPLE',
        recommendedTitle: 'Contrast Example: OR Gate vs XOR Gate Behavior',
        recommendedContent: `Notice the critical difference in the 4th row of the truth table:
| A | B | OR (A+B) | XOR (A ⊕ B) | Difference Detected? |
|---|---|----------|-------------|----------------------|
| 0 | 0 |    0     |      0      | No (both identical)  |
| 0 | 1 |    1     |      1      | Yes (0 != 1)         |
| 1 | 0 |    1     |      1      | Yes (1 != 0)         |
| 1 | 1 |    1     |      0      | No (both identical!) |

An OR gate detects "at least one active". An XOR gate detects "strictly dissimilar inputs".`,
        prerequisitePath: ['Boolean Logic', 'Truth Tables', 'Parity Detection', 'XOR Realization'],
        interactiveExercise: {
          question: 'What is the output of an XOR gate when input A is 1 and input B is 1?',
          type: 'concept_check',
          options: ['1 (HIGH)', '0 (LOW)', 'Undefined', 'Floating'],
          correctOptionIndex: 1,
          explanation: 'When both inputs are identical (1 and 1), an XOR gate outputs 0 (LOW), unlike an OR gate which outputs 1.'
        }
      };
    }

    return {
      gapCategory: 'APPLICATION_GAP',
      prerequisiteConcept: 'Logic Gate Pin Connections',
      rootDiagnosis: 'Wiring connection incomplete: One or more gate pins lack a driven signal or terminating load.',
      interventionType: 'GUIDED_PRACTICE',
      recommendedTitle: 'Guided Wiring Practice',
      recommendedContent: 'Every logic gate input requires an explicit driver (Switch, Constant, or Gate Output). Unconnected inputs lead to undefined states.',
      prerequisitePath: ['Circuit Schematics', 'Signal Flow']
    };
  }

  // Case 3: Operating Systems Scheduling
  if (subjectId === 'os') {
    return {
      gapCategory: 'CONCEPT_GAP',
      prerequisiteConcept: 'Preemption vs Non-preemption in CPU Scheduling',
      rootDiagnosis: 'Conceptual confusion regarding when the CPU is forcibly revoked from an executing process.',
      interventionType: 'SIMPLE_EXPLANATION',
      recommendedTitle: 'Understanding Preemptive Scheduling',
      recommendedContent: 'In non-preemptive scheduling (e.g. FCFS, non-preemptive SJF), a process keeps the CPU until it terminates or blocks for I/O. In preemptive scheduling (e.g. Round Robin, SRTF), higher priority or timer interrupts can swap the process out.',
      prerequisitePath: ['Process States', 'Context Switching', 'Preemption']
    };
  }

  // Case 4: Microprocessors
  if (subjectId === 'microprocessor') {
    return {
      gapCategory: 'APPLICATION_GAP',
      prerequisiteConcept: '8085 Flag Register Updates',
      rootDiagnosis: 'Flag sensitivity gap: MOV instructions do NOT affect arithmetic flags, while ADD/SUB/INR modify Zero and Carry flags.',
      interventionType: 'GUIDED_PRACTICE',
      recommendedTitle: 'Instruction Flag Behavior in 8085',
      recommendedContent: 'Remember: Data transfer instructions (MOV, MVI, LXI, LDA) leave all status flags untouched. Arithmetic and Logical instructions (ADD, SUB, ANA, ORA) update the PSW flags.',
      prerequisitePath: ['8085 Registers', 'Status Flags', 'Instruction Cycles']
    };
  }

  // Default fallback
  return {
    gapCategory: 'RETENTION_GAP',
    prerequisiteConcept: 'Core Architectural Concepts',
    rootDiagnosis: 'Review needed for retention of architectural principles.',
    interventionType: 'RETRIEVAL_CHALLENGE',
    recommendedTitle: 'Knowledge Retrieval Refresh',
    recommendedContent: 'Active recall helps solidify engineering fundamentals. Practice with quick conceptual checks.',
    prerequisitePath: ['Core Principles']
  };
}
