export interface RAGDocument {
  id: string;
  subjectId: string;
  conceptId: string;
  title: string;
  branch: 'Computer Engineering' | 'Information Technology' | 'Artificial Intelligence & Data Science' | 'General Engineering';
  year: 'SE' | 'TE' | 'BE';
  semester: 'Semester III' | 'Semester IV' | 'Semester V' | 'Semester VI' | 'Semester VII';
  courseCode: string;
  unit: string;
  documentYear: string;
  sourceUrl: string;
  source: string;
  content: string;
  tags: string[];
}

export const RAG_KNOWLEDGE_BASE: RAGDocument[] = [
  {
    id: 'rag-dsa-01',
    subjectId: 'dsa',
    conceptId: 'dsa-binary-search',
    title: 'Binary Search Algorithm, Invariant Analysis & Boundary Correctness',
    branch: 'Computer Engineering',
    year: 'SE',
    semester: 'Semester III',
    courseCode: '210242 (Data Structures & Algorithms)',
    unit: 'Unit II: Searching and Sorting Algorithms',
    documentYear: '2019 Course Pattern / 2024 Scheme',
    sourceUrl: 'https://www.kkwagh.edu.in/engineering/department/computer-engineering/syllabus',
    source: 'K. K. Wagh Institute of Engineering Education & Research (KKWIEER) — Department of Computer Engineering Official Syllabus (Course Code: 210242)',
    content: `Course Outcome CO2: Analyze and apply searching techniques to solve algorithmic problems efficiently.
Unit II Content: Linear Search, Binary Search on sorted sequences, Analysis of time complexity O(log N).
Key Invariants and Operational Constraints:
1. Pre-condition: Input sequence A[0...N-1] must be strictly ordered (monotonic).
2. Boundary Invariants:
   - low pointer initialized to 0.
   - high pointer initialized strictly to N - 1 (arr.length - 1).
   - Loop invariant: Target value X, if present in array, strictly resides in the index interval [low, high].
   - If high is set to arr.length, accessing arr[high] causes an Out-of-Bounds index evaluation in zero-indexed structures.
3. Midpoint Calculation:
   - mid = low + Math.floor((high - low) / 2) prevents integer overflow during index addition.
4. Pointer Update Invariants:
   - arr[mid] < target: target resides in right subarray, set low = mid + 1.
   - arr[mid] > target: target resides in left subarray, set high = mid - 1.
   - Setting low = mid or high = mid leads to convergence stasis (infinite loop) when high - low = 1.`,
    tags: ['dsa', 'binary search', 'boundary', 'prerequisite', 'indexing', '210242', 'computer engineering']
  },

  {
    id: 'rag-os-01',
    subjectId: 'os',
    conceptId: 'os-cpu-scheduling',
    title: 'Operating System Process Management, CPU Scheduling Algorithms & Gantt Metrics',
    branch: 'Computer Engineering',
    year: 'TE',
    semester: 'Semester V',
    courseCode: '310242 (Operating Systems)',
    unit: 'Unit III: Process Management and CPU Scheduling',
    documentYear: '2019 Course Pattern / 2024 Scheme',
    sourceUrl: 'https://www.kkwagh.edu.in/engineering/department/computer-engineering/syllabus',
    source: 'K. K. Wagh Institute of Engineering Education & Research (KKWIEER) — Department of Computer Engineering Official Syllabus (Course Code: 310242)',
    content: `Course Outcome CO3: Formulate and evaluate CPU scheduling policies for multi-programming systems.
Unit III Content: Process states, Process Control Block (PCB), Context Switch, Scheduling criteria, Scheduling algorithms:
1. First-Come, First-Served (FCFS):
   - Non-preemptive scheduling governed strictly by arrival timestamp.
   - Susceptible to Convoy Effect where long CPU-burst processes delay short subsequent I/O bound jobs.
2. Shortest Job First (SJF):
   - Provably optimal for minimizing average waiting time. Preemptive variant is Shortest Remaining Time First (SRTF).
3. Round Robin (RR):
   - Preemptive scheduling with a defined Time Quantum (TQ).
   - If TQ >> max(burst), RR degenerates to FCFS.
   - If TQ -> 0, CPU context-switching overhead dominates overall CPU cycles.
Deterministic Evaluation Formulas:
- Turnaround Time (TAT) = Completion Time - Arrival Time.
- Waiting Time (WT) = Turnaround Time - Burst Time.
- Average WT = (Sum of all process WT) / Total Processes.`,
    tags: ['os', 'cpu scheduling', 'round robin', 'fcfs', 'gantt', '310242', 'computer engineering']
  },

  {
    id: 'rag-digital-01',
    subjectId: 'digital-electronics',
    conceptId: 'digital-logic-gates',
    title: 'Combinational Logic Circuit Design, Universal Gates & Fault Diagnosis',
    branch: 'Information Technology',
    year: 'SE',
    semester: 'Semester III',
    courseCode: '214442 (Digital Electronics & Logic Design)',
    unit: 'Unit I: Combinational Logic Analysis and Fault Detection',
    documentYear: '2019 Course Pattern / 2024 Scheme',
    sourceUrl: 'https://www.kkwagh.edu.in/engineering/department/information-technology/syllabus',
    source: 'K. K. Wagh Institute of Engineering Education & Research (KKWIEER) — Department of Information Technology Official Syllabus (Course Code: 214442)',
    content: `Course Outcome CO1: Design and verify digital combinational circuits using standard logic gates.
Unit I Content: Standard gates (AND, OR, NOT, XOR), Universal gates (NAND, NOR), Circuit synthesis, Fault analysis in combinational networks.
Key Logic Principles:
1. Universal Synthesis:
   - Any arbitrary Boolean function can be constructed using exclusively NAND gates or NOR gates.
2. Exclusive OR (XOR) Operation:
   - Output Y = A ^ B = A'B + AB'.
   - Output is HIGH (1) if and only if inputs differ (parity check).
3. Fault Modeling & Diagnosis:
   - Stuck-at Fault Model: Signal line permanently locked at Logic 0 (s-a-0) or Logic 1 (s-a-1).
   - Test vector generation: To detect a Stuck-at-0 fault on line A, apply input vector with A = 1 and verify whether output correctly propagates the HIGH state.`,
    tags: ['digital-electronics', 'gates', 'xor', 'nand', 'fault', '214442', 'information technology']
  },

  {
    id: 'rag-mp-01',
    subjectId: 'microprocessor',
    conceptId: 'mp-8086-registers',
    title: '8086 16-Bit Microprocessor Architecture, Register Model & Bus Interface',
    branch: 'Computer Engineering',
    year: 'SE',
    semester: 'Semester IV',
    courseCode: '210243 (Microprocessor)',
    unit: 'Unit I: 8086 Microprocessor Architecture and Register Organization',
    documentYear: '2019 Course Pattern / 2024 Scheme',
    sourceUrl: 'https://www.kkwagh.edu.in/engineering/department/computer-engineering/syllabus',
    source: 'K. K. Wagh Institute of Engineering Education & Research (KKWIEER) — Department of Computer Engineering Official Syllabus (Course Code: 210243)',
    content: `Course Outcome CO1: Describe internal architecture and programming model of 16-bit 8086 microprocessor.
Unit I Content: Bus Interface Unit (BIU) and Execution Unit (EU), 16-bit General Purpose Registers, Segment Registers, Pointer & Index Registers, Flag Register, 20-bit Physical Address generation.
Architectural Principles:
1. Register Organization:
   - General Purpose: AX (Accumulator: AH/AL), BX (Base), CX (Count), DX (Data).
   - Pointers & Indices: SP (Stack Pointer), BP (Base Pointer), SI (Source Index), DI (Destination Index), IP (Instruction Pointer).
   - Segment Registers: CS (Code), DS (Data), SS (Stack), ES (Extra).
2. Physical Address Calculation:
   - Physical Address (20-bit) = (Segment Base Address * 16) + Offset Address = (Segment << 4) + Offset.
3. Status Flags:
   - Zero Flag (ZF): Set to 1 when arithmetic/logic result is 0000H.
   - Carry Flag (CF): Set when operation yields carry out of MSB.
   - Sign Flag (SF): Reflects MSB of result (1 for negative in 2's complement).`,
    tags: ['microprocessor', '8086', 'assembly', 'registers', 'flags', '210243', 'computer engineering']
  },

  {
    id: 'rag-cloud-01',
    subjectId: 'cloud',
    conceptId: 'cloud-architecture',
    title: 'Cloud Computing Infrastructure, Resilience, Multi-Tier Systems & Autoscaling',
    branch: 'Computer Engineering',
    year: 'BE',
    semester: 'Semester VII',
    courseCode: '410244 (Principles of Cloud Computing)',
    unit: 'Unit IV: Cloud Architecture Design, Autoscaling and Managed Data Stores',
    documentYear: '2019 Course Pattern / 2024 Scheme',
    sourceUrl: 'https://www.kkwagh.edu.in/engineering/department/computer-engineering/syllabus',
    source: 'K. K. Wagh Institute of Engineering Education & Research (KKWIEER) — Department of Computer Engineering Official Syllabus (Course Code: 410244)',
    content: `Course Outcome CO4: Architect fault-tolerant and scalable cloud computing solutions.
Unit IV Content: Service models (IaaS, PaaS, SaaS), Elastic Load Balancing, Horizontal vs. Vertical Auto-scaling, Cache-aside pattern, Managed databases and data warehousing (e.g. Amazon Redshift, BigQuery).
Architectural Principles:
1. Tier Decoupling:
   - Client traffic -> Application Load Balancer -> Stateless Web/Compute Tier -> Cache Layer -> Persistent Relational/NoSQL Database.
2. Resilience Under Traffic Spikes:
   - In-memory caching (e.g., Redis/Memcached) absorbs frequent read traffic, preventing database connection exhaustion during surges (e.g., 100K RPS).
   - Auto-scaling policies adjust instance capacity horizontally based on CPU utilization or queue latency thresholds.
3. Analytical Data Warehousing:
   - Columnar data stores (such as AWS Redshift) are optimized for complex aggregations and OLAP workloads, completely decoupled from operational OLTP transactions.`,
    tags: ['cloud', 'architecture', 'load balancer', 'autoscaling', 'resilience', '410244', 'computer engineering']
  },

  {
    id: 'rag-comm-01',
    subjectId: 'communication',
    conceptId: 'comm-viva',
    title: 'Professional Engineering Communication, Technical Viva & Defense Standards',
    branch: 'General Engineering',
    year: 'SE',
    semester: 'Semester III',
    courseCode: '210245 (Humanities & Engineering Communication)',
    unit: 'Unit II: Technical Defense, Viva Voce and Engineering Presentations',
    documentYear: '2019 Course Pattern / 2024 Scheme',
    sourceUrl: 'https://www.kkwagh.edu.in/engineering/department/artificial-intelligence-and-data-science/syllabus',
    source: 'K. K. Wagh Institute of Engineering Education & Research (KKWIEER) — Official Humanities & Communication Standard (Course Code: 210245)',
    content: `Course Outcome CO2: Communicate technical engineering concepts with professional precision in English.
Unit II Content: Viva-voce structure, technical articulation, distinguishing conceptual comprehension from linguistic formulation.
Evaluation Rubric:
1. Technical Accuracy (Dimension 1):
   - Correctness of definitions, operational constraints, time/space complexities, formulas, and architecture principles.
2. English Communication & Formulation (Dimension 2):
   - Formal introductory thesis statement -> Operational mechanism -> Comparison contrast -> Practical trade-off.
   - Use of standardized engineering terminology (e.g., "deterministic convergence", "preemptive time slice", "stuck-at fault model") rather than informal colloquial speech.`,
    tags: ['communication', 'technical english', 'viva', 'interview', 'presentation', '210245']
  }
];
