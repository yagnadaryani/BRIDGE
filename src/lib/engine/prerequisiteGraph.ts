import { PrerequisiteNode } from '@/types/diagnosis';

export const PREREQUISITE_GRAPH: Record<string, PrerequisiteNode> = {
  'dsa-binary-search': {
    id: 'dsa-binary-search',
    title: 'Binary Search Algorithm',
    subjectId: 'dsa',
    description: 'Efficient divide-and-conquer algorithm to locate target items in a sorted array in O(log N) time.',
    prerequisites: ['dsa-sorted-arrays'],
    repairExercise: {
      question: 'Why does Binary Search require the array to be sorted first?',
      explanation: 'Binary Search eliminates half the remaining elements at each step based on comparing the middle element with the target. If the array is unsorted, discarding half could accidentally discard the target!',
      options: [
        'Sorting reduces the array size',
        'Comparing mid element guarantees discarding the correct half only if array is ordered',
        'Binary Search works on unsorted arrays too',
        'Sorting makes elements equal'
      ],
      correctAnswer: 1
    }
  },

  'dsa-sorted-arrays': {
    id: 'dsa-sorted-arrays',
    title: 'Sorted Array Invariants & Properties',
    subjectId: 'dsa',
    description: 'Array structure where elements adhere to strict monotonically non-decreasing or non-increasing order.',
    prerequisites: ['dsa-boundary-indexing'],
    repairExercise: {
      question: 'Which invariant holds for a sorted ascending array `arr` of size `N`?',
      explanation: 'For all valid indices `0 <= i < N-1`, `arr[i] <= arr[i+1]`.',
      options: [
        'arr[i] > arr[i+1]',
        'arr[0] is always the maximum',
        'arr[i] <= arr[i+1] for all valid consecutive indices',
        'arr[N-1] is undefined'
      ],
      correctAnswer: 2
    }
  },

  'dsa-boundary-indexing': {
    id: 'dsa-boundary-indexing',
    title: 'Array Indexing & Boundary Pointer Handling',
    subjectId: 'dsa',
    description: 'Understanding zero-indexed arrays, start index 0, end index N-1, and pointer arithmetic without off-by-one errors.',
    prerequisites: [],
    repairExercise: {
      question: 'In a zero-indexed array `let arr = [12, 24, 36, 48]`, what are the valid index bounds and what is `arr[arr.length]`?',
      explanation: 'Indices range from 0 to `arr.length - 1` (0 to 3). `arr[4]` is out of bounds (`undefined`), which causes boundary bugs if used as a search index!',
      options: [
        'Valid indices: 1 to 4; arr[4] is 48',
        'Valid indices: 0 to 3; arr[4] is undefined (Out of Bounds)',
        'Valid indices: 0 to 4; arr[4] is 48',
        'Valid indices: 0 to 3; arr[4] is 0'
      ],
      correctAnswer: 1
    }
  },

  'os-cpu-scheduling': {
    id: 'os-cpu-scheduling',
    title: 'CPU Scheduling Algorithms',
    subjectId: 'os',
    description: 'FCFS, SJF, Round Robin, and Priority scheduling mechanisms in operating systems.',
    prerequisites: ['os-process-states'],
    repairExercise: {
      question: 'In Round Robin scheduling, what happens if the time quantum is set extremely large?',
      explanation: 'If the time quantum exceeds the longest process burst time, Round Robin degrades into First-Come First-Served (FCFS)!',
      options: [
        'It degrades into FCFS',
        'It degrades into SJF',
        'Processes deadlock',
        'System throughput becomes infinite'
      ],
      correctAnswer: 0
    }
  },

  'os-process-states': {
    id: 'os-process-states',
    title: 'Process Lifecycle & State Transitions',
    subjectId: 'os',
    description: 'New, Ready, Running, Waiting/Blocked, and Terminated states.',
    prerequisites: [],
    repairExercise: {
      question: 'When a running process requests I/O, to which state does it transition?',
      explanation: 'When waiting for I/O completion, the CPU yields control and moves the process from Running to Waiting/Blocked.',
      options: [
        'Ready',
        'Waiting / Blocked',
        'Terminated',
        'New'
      ],
      correctAnswer: 1
    }
  },

  'digital-logic-gates': {
    id: 'digital-logic-gates',
    title: 'Digital Logic Gates & Truth Tables',
    subjectId: 'digital-electronics',
    description: 'Fundamental gates: AND, OR, NOT, XOR, NAND, NOR.',
    prerequisites: ['digital-boolean-algebra'],
    repairExercise: {
      question: 'What is the output of a 2-input XOR gate when both inputs are 1?',
      explanation: 'XOR outputs 1 only when inputs differ. When both inputs are equal (1 and 1), XOR outputs 0.',
      options: ['1', '0', 'Undefined', 'High Z'],
      correctAnswer: 1
    }
  },

  'digital-boolean-algebra': {
    id: 'digital-boolean-algebra',
    title: 'Boolean Algebra & De Morgan Laws',
    subjectId: 'digital-electronics',
    description: 'Laws of boolean algebra, simplification, and universal NAND/NOR logic.',
    prerequisites: [],
    repairExercise: {
      question: 'According to De Morgan\'s Law, what is `NOT(A AND B)` equal to?',
      explanation: 'De Morgan law states: NOT(A AND B) = (NOT A) OR (NOT B).',
      options: [
        '(NOT A) AND (NOT B)',
        '(NOT A) OR (NOT B)',
        'A OR B',
        'A XOR B'
      ],
      correctAnswer: 1
    }
  },

  'mp-8086-registers': {
    id: 'mp-8086-registers',
    title: '8086 Architecture & Register Set',
    subjectId: 'microprocessor',
    description: 'General purpose registers (AX, BX, CX, DX), Program Counter (IP), and Flags.',
    prerequisites: ['mp-memory-segmentation'],
    repairExercise: {
      question: 'Which register is automatically used as a loop counter in 8086 `LOOP` instructions?',
      explanation: 'The CX (Count) register is automatically decremented by the LOOP instruction until it reaches 0.',
      options: ['AX', 'BX', 'CX', 'DX'],
      correctAnswer: 2
    }
  },

  'mp-memory-segmentation': {
    id: 'mp-memory-segmentation',
    title: '8086 Memory Segmentation & Physical Address Calculation',
    subjectId: 'microprocessor',
    description: 'Calculating 20-bit physical addresses using Segment Register * 16 + Offset.',
    prerequisites: [],
    repairExercise: {
      question: 'If Code Segment CS = 2000H and Instruction Pointer IP = 0100H, what is the physical address?',
      explanation: 'Physical Address = CS * 10H + IP = 20000H + 0100H = 20100H.',
      options: ['20100H', '21000H', '02100H', '20010H'],
      correctAnswer: 0
    }
  },

  'cloud-architecture': {
    id: 'cloud-architecture',
    title: 'Cloud System Architecture & Resilience',
    subjectId: 'cloud',
    description: 'Designing scalable multi-tier architectures with Load Balancers, Auto-scaling, and Databases.',
    prerequisites: ['cloud-load-balancing'],
    repairExercise: {
      question: 'What component prevents a single server overload by distributing incoming user traffic across multiple web servers?',
      explanation: 'A Load Balancers routes incoming network traffic evenly across healthy target servers.',
      options: ['Load Balancer', 'Database Replica', 'Cache Cluster', 'Storage Bucket'],
      correctAnswer: 0
    }
  },

  'cloud-load-balancing': {
    id: 'cloud-load-balancing',
    title: 'Load Balancing & Health Checks',
    subjectId: 'cloud',
    description: 'Routing algorithms (Round Robin, Least Connections) and health probe mechanics.',
    prerequisites: [],
    repairExercise: {
      question: 'What happens when a load balancer health check fails for an application instance?',
      explanation: 'The load balancer removes the unhealthy instance from the active routing pool until health checks pass again.',
      options: [
        'Traffic continues to be sent',
        'The instance is removed from the active pool and traffic is re-routed',
        'The entire cluster crashes',
        'All client connections are reset immediately'
      ],
      correctAnswer: 1
    }
  }
};

/**
 * Traverses the prerequisite graph upwards to discover the root-cause gap
 */
export function findRootPrerequisiteGap(conceptId: string): PrerequisiteNode | null {
  const current = PREREQUISITE_GRAPH[conceptId];
  if (!current) return null;

  if (!current.prerequisites || current.prerequisites.length === 0) {
    return current; // Node itself has no prerequisites, it is the fundamental root gap
  }

  // Follow the first prerequisite recursively to find root
  const parentId = current.prerequisites[0];
  const root = findRootPrerequisiteGap(parentId);
  return root || PREREQUISITE_GRAPH[parentId] || current;
}
