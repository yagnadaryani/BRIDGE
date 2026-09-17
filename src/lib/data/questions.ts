import { AssessmentQuestion } from '@/types/subject';

export const ASSESSMENT_QUESTIONS: Record<string, AssessmentQuestion[]> = {
  'dsa-binary-search': [
    {
      id: 'q-dsa-1',
      subjectId: 'dsa',
      conceptId: 'dsa-binary-search',
      type: 'MCQ',
      question: 'What is the worst-case time complexity of Binary Search on a sorted array of N elements?',
      options: ['O(N)', 'O(N log N)', 'O(log N)', 'O(1)'],
      correctAnswer: 2,
      explanation: 'Binary Search reduces the search space by half in each step, yielding logarithmic time complexity O(log N).'
    },
    {
      id: 'q-dsa-2',
      subjectId: 'dsa',
      conceptId: 'dsa-binary-search',
      type: 'APPLICATION',
      question: 'In a zero-indexed array `arr = [10, 20, 30, 40, 50]`, what are the initial indices for `low` and `high` for a valid Binary Search?',
      options: ['low = 0, high = 5', 'low = 0, high = 4', 'low = 1, high = 5', 'low = 0, high = 3'],
      correctAnswer: 1,
      explanation: 'Array size is 5, so valid zero-based indices are 0 to 4. Therefore, low = 0 and high = 4 (which is arr.length - 1).'
    },
    {
      id: 'q-dsa-3',
      subjectId: 'dsa',
      conceptId: 'dsa-binary-search',
      type: 'CONCEPTUAL',
      question: 'What happens if you calculate midpoint as `let mid = Math.floor((low + high) / 2)` in language with fixed 32-bit signed integers when low and high are large (e.g. 1.5 billion)?',
      options: [
        'It works perfectly without issues',
        'It causes integer overflow because (low + high) exceeds 2^31 - 1, producing a negative index',
        'It automatically rounds down',
        'It returns 0'
      ],
      correctAnswer: 1,
      explanation: 'Summing two large 32-bit integers can exceed MAX_INT, wrapping around into a negative number. Safe formula: mid = low + Math.floor((high - low) / 2).'
    }
  ],
  'os-cpu-scheduling': [
    {
      id: 'q-os-1',
      subjectId: 'os',
      conceptId: 'os-cpu-scheduling',
      type: 'MCQ',
      question: 'Which CPU scheduling algorithm can suffer from the "Convoy Effect"?',
      options: ['Round Robin', 'FCFS (First-Come First-Served)', 'SJF Preemptive', 'Priority Scheduling'],
      correctAnswer: 1,
      explanation: 'In FCFS, if a CPU-bound process with a long burst time arrives first, all short I/O-bound processes get stuck waiting behind it (Convoy Effect).'
    },
    {
      id: 'q-os-2',
      subjectId: 'os',
      conceptId: 'os-cpu-scheduling',
      type: 'APPLICATION',
      question: 'Processes P1 (burst 10ms) and P2 (burst 2ms) arrive at time t=0. In Round Robin with Quantum = 4ms, when does P2 complete?',
      options: ['t = 2ms', 't = 6ms', 't = 12ms', 't = 4ms'],
      correctAnswer: 1,
      explanation: 'P1 runs from 0ms to 4ms (remaining burst 6ms). P2 runs next from 4ms to 6ms and completes at t = 6ms!'
    }
  ],
  'digital-logic-gates': [
    {
      id: 'q-digital-1',
      subjectId: 'digital-electronics',
      conceptId: 'digital-logic-gates',
      type: 'MCQ',
      question: 'Which of the following gate combinations forms a Universal Gate family capable of building any logic circuit?',
      options: ['AND & OR', 'NAND or NOR', 'XOR & NOT', 'OR & XOR'],
      correctAnswer: 1,
      explanation: 'NAND and NOR gates are universal because AND, OR, and NOT functions can be synthesized entirely out of either gate alone.'
    }
  ]
};
