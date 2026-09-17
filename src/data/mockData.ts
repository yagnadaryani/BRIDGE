import {
  SubjectInfo,
  LearnerModel,
  GamificationProfile,
  DoubtItem,
  Intervention,
  UserProfile,
  AssessmentQuestion
} from '../types';

export const DEMO_STUDENT: UserProfile = {
  id: 'student_aarav_01',
  name: 'Aarav Sharma',
  email: 'aarav.sharma@eng.edu',
  role: 'STUDENT',
  department: 'Computer Science & Engineering',
  semester: 4,
  rollNo: 'CS2024-042',
  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
};

export const DEMO_TEACHER: UserProfile = {
  id: 'teacher_kulkarni_01',
  name: 'Prof. Ramesh Kulkarni',
  email: 'r.kulkarni@eng.edu',
  role: 'TEACHER',
  department: 'School of Computing & Systems',
  avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
};

export const SUBJECTS: SubjectInfo[] = [
  {
    id: 'dsa',
    name: 'Data Structures & Algorithms',
    code: 'CS401',
    description: 'Master computational efficiency, search/sort algorithmic rigor, trees, graphs, and boundary mechanics.',
    iconName: 'Code2',
    color: '#3B82F6',
    totalConcepts: 28,
    labName: 'Code Studio'
  },
  {
    id: 'digital-electronics',
    name: 'Digital Electronics & Logic Design',
    code: 'EC302',
    description: 'Design, simulate, and verify boolean expressions, combinational logic, flip-flops, and hardware nodes.',
    iconName: 'Cpu',
    color: '#8B5CF6',
    totalConcepts: 22,
    labName: 'Circuit Lab'
  },
  {
    id: 'os',
    name: 'Operating Systems',
    code: 'CS403',
    description: 'Process management, CPU scheduling heuristics, deadlocks, memory virtualization, and IPC.',
    iconName: 'Layers',
    color: '#10B981',
    totalConcepts: 24,
    labName: 'OS Simulator'
  },
  {
    id: 'microprocessor',
    name: 'Microprocessors & Architecture',
    code: 'EC404',
    description: 'Instruction sets, 8085 register simulation, memory addressing, flags, and assembly execution cycles.',
    iconName: 'Binary',
    color: '#F59E0B',
    totalConcepts: 18,
    labName: 'Processor Studio'
  },
  {
    id: 'cloud',
    name: 'Cloud Computing & Distributed Systems',
    code: 'IT405',
    description: 'Cloud tier design, load balancing, autoscaling triggers, replication, and fault-tolerant topologies.',
    iconName: 'Cloud',
    color: '#06B6D4',
    totalConcepts: 20,
    labName: 'Architecture Lab'
  }
];

export const INITIAL_LEARNER_MODEL: LearnerModel = {
  studentId: 'student_aarav_01',
  conceptMastery: {
    'dsa_arrays': 85,
    'dsa_linear_search': 90,
    'dsa_binary_search': 48,
    'dsa_recursion': 60,
    'dsa_stack': 78,
    'de_logic_gates': 88,
    'de_boolean_algebra': 75,
    'de_xor_design': 52,
    'de_half_adder': 65,
    'os_process_lifecycle': 82,
    'os_cpu_scheduling_fcfs': 90,
    'os_cpu_scheduling_sjf': 70,
    'os_round_robin': 58,
    'mp_registers': 74,
    'mp_8085_instructions': 62,
    'cloud_load_balancing': 80,
    'cloud_redundancy': 68
  },
  subjectMastery: {
    'dsa': 68,
    'digital-electronics': 70,
    'os': 75,
    'microprocessor': 64,
    'cloud': 72
  },
  applicationScore: 65,
  debuggingScore: 58,
  retentionScore: 72,
  communicationScore: 61,
  confidenceCalibration: {
    overconfidentRate: 24,
    underconfidentRate: 14,
    calibratedRate: 62
  },
  recurringErrors: [
    {
      id: 'err_dsa_bs_boundary',
      subjectId: 'dsa',
      conceptId: 'dsa_binary_search',
      errorType: 'Off-by-one mid boundary update (high = mid instead of mid - 1, causing infinite loop or missed elements)',
      count: 3,
      lastOccurred: Date.now() - 3600000 * 5
    },
    {
      id: 'err_de_xor_difference',
      subjectId: 'digital-electronics',
      conceptId: 'de_xor_design',
      errorType: 'Used standard OR gate instead of XOR for difference detection, firing HIGH when both inputs are 1',
      count: 2,
      lastOccurred: Date.now() - 3600000 * 22
    }
  ],
  rootGaps: [
    {
      id: 'gap_index_boundaries',
      subjectId: 'dsa',
      conceptId: 'dsa_binary_search',
      gapCategory: 'PREREQUISITE_GAP',
      description: 'Index & Boundary Invariants: Confusion between inclusive range [low, high] and pointer updates upon comparison.',
      prerequisiteConcept: 'Array Indexing & Invariant Preservation',
      status: 'ACTIVE',
      detectedAt: Date.now() - 3600000 * 5
    }
  ],
  effectiveInterventions: ['interv_linear_search_guards'],
  failedInterventions: [],
  learningHistory: [
    {
      timestamp: Date.now() - 3600000 * 48,
      summary: 'Completed Linear Search with 100% test cases passed',
      type: 'ATTEMPT',
      subjectId: 'dsa',
      conceptId: 'dsa_linear_search'
    },
    {
      timestamp: Date.now() - 3600000 * 5,
      summary: 'Binary Search submission failed: Test case 4 (element at last index) resulted in infinite timeout.',
      type: 'ERROR',
      subjectId: 'dsa',
      conceptId: 'dsa_binary_search'
    },
    {
      timestamp: Date.now() - 3600000 * 4.9,
      summary: 'Root cause identified: Prerequisite gap in Sub-array Index Boundary Invariants (low <= high vs low < high).',
      type: 'ROOT_GAP',
      subjectId: 'dsa',
      conceptId: 'dsa_binary_search'
    }
  ],
  updatedAt: Date.now()
};

export const INITIAL_INTERVENTIONS: Intervention[] = [
  {
    id: 'interv_bs_boundary_repair',
    studentId: 'student_aarav_01',
    subjectId: 'dsa',
    conceptId: 'dsa_binary_search',
    gapCategory: 'PREREQUISITE_GAP',
    type: 'PREREQUISITE_REPAIR',
    title: 'Prerequisite Repair: Array Index & Sub-Interval Invariants',
    rootDiagnosis: 'Your binary search code encountered an infinite loop because `high` was reset to `mid` instead of `mid - 1`, violating the strict exclusion of already-tested elements.',
    prerequisitePath: ['Arrays', 'Zero-Based Indexing', 'Inclusive Intervals [low, high]', 'Binary Search Invariants'],
    content: `When searching in a sorted array using inclusive search interval \`[low, high]\`:
1. If \`arr[mid] == target\`, return \`mid\`.
2. If \`arr[mid] > target\`, the target CANNOT be at \`mid\`. The remaining candidate pool strictly shrinks to \`[low, mid - 1]\`. Setting \`high = mid\` causes an infinite cycle when \`low == mid\`.
3. If \`arr[mid] < target\`, the target strictly lies in \`[mid + 1, high]\`.
4. Loop condition MUST be \`while (low <= high)\` so single-element intervals are checked.`,
    interactiveExercise: {
      question: 'Identify the invariant violation in this snippet: `if (arr[mid] > target) high = mid;`',
      type: 'contrast',
      options: [
        'It is correct for all cases',
        'If target is smaller, arr[mid] is already ruled out, so high must be updated to mid - 1 to guarantee termination',
        'low must be incremented by 2',
        'mid must be calculated as (low + high + 1) / 2'
      ],
      correctOptionIndex: 1,
      explanation: 'Because arr[mid] is strictly greater than target, mid is eliminated. Setting high = mid keeps mid in the candidate search space, causing an infinite loop when low and high converge.'
    },
    beforeScore: 48,
    verified: false,
    status: 'PENDING',
    createdAt: Date.now() - 3600000 * 4
  }
];

export const INITIAL_GAMIFICATION_PROFILE: GamificationProfile = {
  studentId: 'student_aarav_01',
  xp: 1450,
  level: 4,
  title: 'Logic Architect',
  streakDays: 6,
  lastActiveDate: new Date().toISOString().split('T')[0],
  xpBreakdown: {
    masteryXP: 550,
    debuggingXP: 380,
    repairXP: 220,
    labXP: 180,
    growthXP: 70,
    communicationXP: 50
  },
  achievements: [
    {
      id: 'first_debug',
      title: 'Root-Cause Detective',
      description: 'Successfully isolate a root prerequisite gap and fix it.',
      icon: 'SearchCheck',
      unlockedAt: Date.now() - 86400000 * 2,
      progress: 1,
      maxProgress: 1,
      category: 'repair'
    },
    {
      id: 'circuit_master',
      title: 'Silicon Whisperer',
      description: 'Build and verify an interactive digital logic circuit with 0 simulation faults.',
      icon: 'Cpu',
      progress: 2,
      maxProgress: 3,
      category: 'lab'
    },
    {
      id: 'streak_week',
      title: 'Consistent Engineer',
      description: 'Maintain a 7-day engineering learning streak.',
      icon: 'Flame',
      progress: 6,
      maxProgress: 7,
      category: 'streak'
    },
    {
      id: 'communication_viva',
      title: 'Viva Champion',
      description: 'Score above 85% on an Examiner-Mode technical explanation.',
      icon: 'Mic',
      progress: 0,
      maxProgress: 1,
      category: 'mastery'
    }
  ],
  activeMissions: [
    {
      id: 'mission_repair_bs',
      title: 'Mission: Repair Binary Search Boundary Invariant',
      description: 'Complete the prerequisite repair exercise and verify with edge test cases.',
      subjectId: 'dsa',
      xpReward: 250,
      type: 'repair_prereq',
      completed: false
    },
    {
      id: 'mission_build_xor',
      title: 'Mission: Construct XOR Difference Circuit',
      description: 'In the Digital Electronics Lab, wire an XOR circuit that fires HIGH only when inputs differ.',
      subjectId: 'digital-electronics',
      xpReward: 200,
      type: 'circuit_build',
      completed: false
    },
    {
      id: 'mission_viva_scheduler',
      title: 'Mission: Explain Preemptive CPU Scheduling',
      description: 'Deliver a 4-mark technical explanation of Round Robin vs SRTF in the Communication Lab.',
      subjectId: 'os',
      xpReward: 180,
      type: 'viva_voice',
      completed: false
    }
  ]
};

export const INITIAL_DOUBTS: DoubtItem[] = [
  {
    id: 'doubt_01',
    studentId: 'student_aarav_01',
    studentName: 'Aarav Sharma',
    subjectId: 'dsa',
    conceptId: 'dsa_binary_search',
    title: 'Why do we need (low + (high - low) / 2) instead of (low + high) / 2?',
    question: 'Both mathematically produce the same mid point. Why do competitive programming guides and textbooks insist on the subtraction formula?',
    contextSnippet: 'int mid = low + (high - low) / 2;',
    status: 'RESOLVED',
    createdAt: Date.now() - 3600000 * 24,
    replies: [
      {
        id: 'reply_01',
        authorId: 'teacher_kulkarni_01',
        authorName: 'Prof. Ramesh Kulkarni',
        authorRole: 'TEACHER',
        message: 'Great observation, Aarav! While algebraically identical, in 32-bit signed integers, `low + high` can exceed 2,147,483,647 when both are large, resulting in integer overflow and a negative midpoint. Using `low + (high - low) / 2` avoids any overflow.',
        timestamp: Date.now() - 3600000 * 18
      }
    ]
  },
  {
    id: 'doubt_02',
    studentId: 'student_aarav_01',
    studentName: 'Aarav Sharma',
    subjectId: 'digital-electronics',
    conceptId: 'de_xor_design',
    title: 'How can XOR be implemented using only NAND gates?',
    question: 'I want to minimize component count on a PCB. What is the minimum number of 2-input NAND gates required for A ⊕ B?',
    status: 'IN_REVIEW',
    createdAt: Date.now() - 3600000 * 8,
    replies: []
  }
];

export const SUBJECT_ASSESSMENTS: Record<string, AssessmentQuestion[]> = {
  'dsa': [
    {
      id: 'q_dsa_1',
      subjectId: 'dsa',
      conceptId: 'dsa_binary_search',
      type: 'mcq',
      prompt: 'In a binary search on an array of size N = 1024, what is the maximum number of comparisons needed in the worst-case?',
      options: ['10 comparisons', '11 comparisons', '512 comparisons', '1024 comparisons'],
      correctOptionIndex: 1,
      explanation: 'Floor(log2(N)) + 1 = 10 + 1 = 11 comparisons for binary search where element is absent or at the last position.',
      requiresConfidence: true
    },
    {
      id: 'q_dsa_2',
      subjectId: 'dsa',
      conceptId: 'dsa_binary_search',
      type: 'code_snippet',
      prompt: 'What happens if we initialize `low = 0`, `high = n` and update `high = mid - 1` while checking `while(low <= high)`?',
      codeSnippet: `int search(int arr[], int n, int target) {
    int low = 0, high = n;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}`,
      options: [
        'It works flawlessly for all inputs',
        'arr[mid] will throw an ArrayIndexOutOfBoundsException when target > all elements and mid reaches index n',
        'It terminates too early and skips index 0',
        'Compilation error'
      ],
      correctOptionIndex: 1,
      explanation: 'Since high is initialized to n (exclusive index), when low = high = n, arr[mid] tries to access arr[n], causing an out-of-bounds error!',
      requiresConfidence: true
    }
  ],
  'digital-electronics': [
    {
      id: 'q_de_1',
      subjectId: 'digital-electronics',
      conceptId: 'de_logic_gates',
      type: 'mcq',
      prompt: 'Which digital logic gate produces a LOW (0) output ONLY when all of its inputs are HIGH (1)?',
      options: ['NOR gate', 'NAND gate', 'AND gate', 'XOR gate'],
      correctOptionIndex: 1,
      explanation: 'The NAND gate outputs LOW (0) strictly when every input is HIGH (1). For all other combinations, its output is HIGH (1).',
      requiresConfidence: true
    },
    {
      id: 'q_de_2',
      subjectId: 'digital-electronics',
      conceptId: 'de_xor_design',
      type: 'mcq',
      prompt: 'For an XOR gate with inputs A and B, the Boolean expression is:',
      options: ['A·B + A\'·B\'', 'A·B\' + A\'·B', '(A + B)·(A\' + B\')\'', 'A\' + B\''],
      correctOptionIndex: 1,
      explanation: 'XOR (exclusive OR) is defined as A·B\' + A\'·B, producing true (1) if and only if exactly one input is 1.',
      requiresConfidence: true
    }
  ],
  'os': [
    {
      id: 'q_os_1',
      subjectId: 'os',
      conceptId: 'os_cpu_scheduling_fcfs',
      type: 'mcq',
      prompt: 'What is the primary drawback of First-Come-First-Served (FCFS) CPU scheduling?',
      options: [
        'High scheduling overhead due to frequent context switching',
        'The Convoy Effect, where short CPU-burst processes wait behind a long burst process',
        'Unbounded process starvation',
        'Complex priority calculation'
      ],
      correctOptionIndex: 1,
      explanation: 'FCFS suffers from the Convoy Effect: short processes are blocked waiting for one CPU-intensive process to complete, causing elevated average waiting times.',
      requiresConfidence: true
    }
  ],
  'microprocessor': [
    {
      id: 'q_mp_1',
      subjectId: 'microprocessor',
      conceptId: 'mp_registers',
      type: 'mcq',
      prompt: 'In the 8085 microprocessor architecture, which register holds the address of the next instruction to be fetched and executed?',
      options: ['Instruction Register (IR)', 'Stack Pointer (SP)', 'Program Counter (PC)', 'Accumulator (A)'],
      correctOptionIndex: 2,
      explanation: 'The Program Counter (PC) is a 16-bit register that sequences memory execution by holding the memory address of the next instruction.',
      requiresConfidence: true
    }
  ],
  'cloud': [
    {
      id: 'q_cloud_1',
      subjectId: 'cloud',
      conceptId: 'cloud_load_balancing',
      type: 'mcq',
      prompt: 'In cloud architecture, how does an Application Load Balancer (Layer 7) differ from a Network Load Balancer (Layer 4)?',
      options: [
        'Layer 7 routes traffic based on HTTP headers, URLs, and cookies; Layer 4 routes purely on IP and TCP/UDP ports.',
        'Layer 4 is slower than Layer 7 because it inspects payload data.',
        'Layer 7 cannot handle SSL/TLS termination.',
        'Layer 4 provides URL path-based routing.'
      ],
      correctOptionIndex: 0,
      explanation: 'Layer 7 operates at the application level inspecting HTTP paths and headers, whereas Layer 4 operates at the transport layer for ultra-high throughput TCP/UDP packet forwarding.',
      requiresConfidence: true
    }
  ]
};

// Grounded Syllabus RAG Database
export const VERIFIED_RAG_CORPUS: Record<string, { topic: string; concepts: string[]; groundedContent: string }[]> = {
  'dsa': [
    {
      topic: 'Binary Search Mechanics and Boundary Invariants',
      concepts: ['binary_search', 'sorted_arrays', 'divide_and_conquer', 'off_by_one'],
      groundedContent: `Syllabus CS401 Unit 2: Binary Search requires an array sorted in ascending (or descending) order.
Invariant 1: If searching in range [low, high], the candidate target MUST reside between indices low and high inclusive.
Invariant 2: When target != arr[mid], the mid element is conclusively eliminated.
If target < arr[mid]: high = mid - 1.
If target > arr[mid]: low = mid + 1.
Setting high = mid when low == mid leads to infinite loop condition in while (low <= high).
Time Complexity: O(log N). Space Complexity: O(1) iterative, O(log N) recursive.`
    },
    {
      topic: 'Linear Search & Elementary Bounds',
      concepts: ['linear_search', 'arrays', 'sequential_access'],
      groundedContent: `Syllabus CS401 Unit 1: Linear Search traverses an array sequentially from index 0 to N-1.
Does not require sorted data. Best case O(1), worst case O(N), average case O(N).
Sentinel linear search can eliminate boundary checks on each iteration.`
    }
  ],
  'digital-electronics': [
    {
      topic: 'Combinational Logic & Universal Gates',
      concepts: ['nand', 'nor', 'xor', 'xnor', 'de_morgans_laws'],
      groundedContent: `Syllabus EC302 Unit 1: Universal Gates are NAND and NOR because any boolean function can be realized using them exclusively.
XOR Gate Truth Table:
A=0, B=0 => 0
A=0, B=1 => 1
A=1, B=0 => 1
A=1, B=1 => 0
Output is HIGH strictly when inputs differ (parity detector).
Expression: Y = A ⊕ B = A·B' + A'·B.`
    }
  ],
  'os': [
    {
      topic: 'CPU Scheduling Algorithms & Metrics',
      concepts: ['fcfs', 'sjf', 'round_robin', 'priority', 'turnaround_time'],
      groundedContent: `Syllabus CS403 Unit 3: Process Scheduling.
Metrics:
- Arrival Time (AT): Time at which process enters ready queue.
- Burst Time (BT): CPU time required.
- Completion Time (CT): Time when process finishes execution.
- Turnaround Time (TAT) = CT - AT.
- Waiting Time (WT) = TAT - BT.
- Response Time (RT) = Time of first CPU allocation - AT.
SJF (Shortest Job First) is optimal for minimizing average waiting time, but suffers from starvation of long jobs.`
    }
  ],
  'microprocessor': [
    {
      topic: '8085 Architecture, Registers, and Flag Register',
      concepts: ['8085', 'accumulator', 'registers', 'flags', 'program_counter'],
      groundedContent: `Syllabus EC404 Unit 2: 8085 8-bit Microprocessor.
Registers:
- Accumulator (A): 8-bit register storing operand and ALU results.
- General Purpose Registers: B, C, D, E, H, L (8-bit each, combinable into 16-bit pairs BC, DE, HL).
- Program Counter (PC): 16-bit, holds next instruction address.
- Stack Pointer (SP): 16-bit, points to top of stack in RAM.
Flags: Sign (S), Zero (Z), Auxiliary Carry (AC), Parity (P), Carry (CY).`
    }
  ],
  'cloud': [
    {
      topic: 'Cloud Tiering, Load Balancing & High Availability',
      concepts: ['load_balancer', 'autoscaling', 'horizontal_scaling', 'failover'],
      groundedContent: `Syllabus IT405 Unit 4: Cloud Infrastructure Architecture.
- Horizontal Scaling (Scale Out/In): Adding or removing instances behind an elastic load balancer.
- High Availability (HA): Redundant instances across multiple Availability Zones with automated health checks.
- Circuit Breaker Pattern: Prevents cascading failures when a downstream database or microservice is degraded.`
    }
  ]
};
