import { Subject } from '@/types/subject';

export const ALL_SUBJECTS: Subject[] = [
  {
    id: 'dsa',
    title: 'Data Structures & Algorithms',
    code: 'CS301',
    description: 'Arrays, Binary Search, Stacks, Queues, Graphs, and Algorithmic Efficiency.',
    iconName: 'Code',
    color: 'from-blue-500 to-indigo-600',
    concepts: [
      {
        id: 'dsa-binary-search',
        subjectId: 'dsa',
        title: 'Binary Search Algorithm',
        description: 'Logarithmic search algorithm in sorted arrays.',
        prerequisites: ['dsa-sorted-arrays'],
        difficulty: 'INTERMEDIATE',
        theory: {
          overview: 'Binary search finds the position of a target value within a sorted array. Binary search compares the target value to the middle element of the array. If they are not equal, the half in which the target cannot lie is eliminated and the search continues on the remaining half.',
          keyPoints: [
            'Requires sorted data',
            'Time Complexity: O(log N)',
            'Space Complexity: O(1) iterative',
            'Key Invariant: low <= high'
          ],
          diagramType: 'binary-search',
          hindiExplanation: 'बायनरी सर्च केवल सॉर्ट किए गए (Sorted) ऐरे पर काम करता है। यह हर कदम पर मध्य (Middle) एलिमेंट से तुलना करके आधे ऐरे को हटा देता है।',
          marathiExplanation: 'बायनरी सर्च फक्त सॉर्ट केलेल्या अरेवर (Sorted Array) कार्य करतो. प्रत्येक टप्प्यावर मधल्या घटकाशी तुलना करून अर्धा भाग वगळला जातो.'
        }
      },
      {
        id: 'dsa-sorted-arrays',
        subjectId: 'dsa',
        title: 'Sorted Arrays & Invariants',
        description: 'Properties of ordered sequential data structures.',
        prerequisites: ['dsa-boundary-indexing'],
        difficulty: 'BEGINNER',
        theory: {
          overview: 'A sorted array maintains elements in monotonic order (ascending or descending). This enables binary decision-making during lookups.',
          keyPoints: ['arr[i] <= arr[i+1] for all valid i', 'Enables O(log N) search'],
        }
      },
      {
        id: 'dsa-boundary-indexing',
        subjectId: 'dsa',
        title: 'Array Indexing & Boundary Handling',
        description: 'Zero-indexed array boundaries and index pointer calculations.',
        prerequisites: [],
        difficulty: 'BEGINNER',
        theory: {
          overview: 'In 0-indexed arrays of length N, indices range from 0 to N-1. Accessing index N causes out-of-bounds errors.',
          keyPoints: ['First element: index 0', 'Last valid element: index N-1', 'Index N is OUT OF BOUNDS'],
        }
      }
    ]
  },
  {
    id: 'os',
    title: 'Operating Systems',
    code: 'CS302',
    description: 'Process Scheduling, Memory Management, CPU Algorithms, Concurrency.',
    iconName: 'Cpu',
    color: 'from-purple-500 to-violet-600',
    concepts: [
      {
        id: 'os-cpu-scheduling',
        subjectId: 'os',
        title: 'CPU Scheduling Algorithms',
        description: 'FCFS, SJF, Round Robin, and Priority Scheduling.',
        prerequisites: ['os-process-states'],
        difficulty: 'INTERMEDIATE',
        theory: {
          overview: 'CPU scheduling decides which ready process gets CPU allocation. Round Robin uses time quanta, while FCFS executes in arrival order.',
          keyPoints: [
            'FCFS: Non-preemptive, Convoy Effect',
            'SJF: Minimum average waiting time',
            'Round Robin: Time-sliced preemptive execution',
            'Turnaround Time = Completion - Arrival'
          ],
          hindiExplanation: 'सीपीयू शेड्यूलिंग तय करती है कि रेडी क्यू में से किस प्रोसेस को पहले प्रोसेसर दिया जाए।',
          marathiExplanation: 'सीपीयू शेड्यूलिंग हे ठरवते की रेडी क्यू मधील कोणत्या प्रोसेसला आधी प्रोसेसर द्यावा.'
        }
      },
      {
        id: 'os-process-states',
        subjectId: 'os',
        title: 'Process States & Transitions',
        description: 'New, Ready, Running, Waiting, Terminated.',
        prerequisites: [],
        difficulty: 'BEGINNER',
        theory: {
          overview: 'Processes transition through lifecycle states during execution.',
          keyPoints: ['Ready -> Running (Scheduled)', 'Running -> Waiting (I/O block)', 'Waiting -> Ready (I/O complete)'],
        }
      }
    ]
  },
  {
    id: 'digital-electronics',
    title: 'Digital Electronics',
    code: 'EC201',
    description: 'Logic Gates, Boolean Algebra, Multiplexers, Counters, Circuit Simulation.',
    iconName: 'Zap',
    color: 'from-amber-500 to-orange-600',
    concepts: [
      {
        id: 'digital-logic-gates',
        subjectId: 'digital-electronics',
        title: 'Logic Gates & Universal Circuit Design',
        description: 'AND, OR, NOT, XOR, NAND, NOR gate mechanics.',
        prerequisites: [],
        difficulty: 'BEGINNER',
        theory: {
          overview: 'Digital systems use binary signals (0 and 1). Logic gates combine signals according to truth tables.',
          keyPoints: ['NAND & NOR are Universal Gates', 'XOR outputs 1 when inputs differ'],
        }
      }
    ]
  },
  {
    id: 'microprocessor',
    title: 'Microprocessors',
    code: 'EC302',
    description: '8086 Assembly Language, Registers, Flags, Memory Segmentation.',
    iconName: 'CircuitBoard',
    color: 'from-emerald-500 to-teal-600',
    concepts: [
      {
        id: 'mp-8086-registers',
        subjectId: 'microprocessor',
        title: '8086 Registers & Assembly Instructions',
        description: 'AX, BX, CX, DX, IP, Flags, MOV, ADD, SUB, JMP.',
        prerequisites: [],
        difficulty: 'INTERMEDIATE',
        theory: {
          overview: 'The 8086 microprocessor uses internal registers for fast data manipulation during instruction execution.',
          keyPoints: ['AX: Accumulator', 'CX: Counter', 'IP: Instruction Pointer', 'Physical Address = CS * 16 + IP'],
        }
      }
    ]
  },
  {
    id: 'cloud',
    title: 'Cloud Computing',
    code: 'CS401',
    description: 'Cloud Architecture, Load Balancers, Auto-scaling, Storage, Multi-tier Design.',
    iconName: 'Cloud',
    color: 'from-sky-500 to-cyan-600',
    concepts: [
      {
        id: 'cloud-architecture',
        subjectId: 'cloud',
        title: 'Resilient Cloud Systems Architecture',
        description: 'Load Balancing, Application Clusters, DB Replication.',
        prerequisites: [],
        difficulty: 'ADVANCED',
        theory: {
          overview: 'Modern cloud applications distribute work across load balancers, web app tiers, and database replicas.',
          keyPoints: ['Load balancers prevent server overload', 'Autoscaling handles traffic spikes', 'Failover replaces crashed nodes'],
        }
      }
    ]
  },
  {
    id: 'communication',
    title: 'Technical English & Communication',
    code: 'HU101',
    description: 'Technical Vocabulary, Engineering Viva, Technical Presentations, Interview Practice.',
    iconName: 'Mic',
    color: 'from-pink-500 to-rose-600',
    concepts: [
      {
        id: 'comm-viva',
        subjectId: 'communication',
        title: 'Technical Examiner Viva & Speaking Skills',
        description: 'Structuring clear engineering answers in English.',
        prerequisites: [],
        difficulty: 'INTERMEDIATE',
        theory: {
          overview: 'Technical communication requires structured explanations: Definition -> Mechanism -> Comparison -> Example.',
          keyPoints: ['Precision terminology', 'Clear structure', 'Confidence without conversational filler'],
        }
      }
    ]
  }
];
