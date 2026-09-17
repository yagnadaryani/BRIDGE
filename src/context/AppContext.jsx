import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { translations } from '../i18n/translations';
import { db } from '../backend/db';

const AppContext = createContext();

const initialNotes = [
  {
    id: 'note-1',
    title: 'Digital Logic & Boolean Algebra Fundamentals.pdf',
    date: 'Sep 15, 2026',
    size: '1.4 MB',
    content: `Boolean algebra handles binary variables and logic gates. Basic operations:
1. AND Gate: Output is HIGH (1) only if both inputs are HIGH. (Y = A · B)
2. OR Gate: Output is HIGH if at least one input is HIGH. (Y = A + B)
3. NOT Gate: Output is inverse of input. (Y = A')
Half Adder circuit combines XOR gate (Sum) and AND gate (Carry).
Full Adder adds three 1-bit numbers including Carry In.`
  },
  {
    id: 'note-2',
    title: 'Operating Systems - CPU Scheduling Cheatsheet.txt',
    date: 'Sep 16, 2026',
    size: '840 KB',
    content: `CPU scheduling algorithms schedule processes from Ready Queue into CPU core:
- First-Come First-Served (FCFS): Non-preemptive, FIFO execution. High convoy effect.
- Shortest Job First (SJF): Schedules process with smallest Burst Time. Optimal waiting time.
- Round Robin (RR): Preemptive time sharing with Time Quantum 'q'. Prevents starvation.
- Priority Scheduling: Schedules process with highest priority integer.`
  },
  {
    id: 'note-3',
    title: 'Cloud High Availability & Load Balancing Patterns.md',
    date: 'Sep 17, 2026',
    size: '2.1 MB',
    content: `Cloud System Architecture Principles:
- Load Balancers (NGINX/ALB) distribute incoming HTTP requests across web application instances.
- Auto Scaling Groups dynamically spawn EC2 nodes based on CPU threshold (>80%).
- Caching layer (Redis/Memcached) reduces DB pressure by serving read-heavy requests.
- Target latency under 120ms with 99.99% SLA availability.`
  }
];

const initialRoster = [
  { 
    id: 's1', 
    name: 'Priya Sharma', 
    email: 'priya@bridge.edu', 
    xp: 1420, 
    level: 5, 
    labsCompleted: 5, 
    quizAvg: 94, 
    status: 'Top Performer', 
    lastActive: '2 mins ago',
    conceptualProgress: { digital: 96, os: 92, cloud: 88, dsa: 95, micro: 90 },
    topicBreakdown: {
      digital: [
        { topic: 'Logic Gates & Boolean Algebra', score: 98, status: 'Mastered', failureReason: 'None. Strong mastery of AND/OR/XOR tables.' },
        { topic: 'Combinational Circuits (Adders / MUX)', score: 95, status: 'Mastered', failureReason: 'None. Solved 4-bit Full Adder timing.' },
        { topic: 'Flip-Flops & Sequential Circuits (JK-FF)', score: 94, status: 'Mastered', failureReason: 'Minor delay on toggle state clocking.' }
      ],
      os: [
        { topic: 'CPU Scheduling Algorithms (FCFS, SJF, RR)', score: 96, status: 'Mastered', failureReason: 'None.' },
        { topic: 'Process Synchronization & Semaphores', score: 92, status: 'Mastered', failureReason: 'None.' },
        { topic: 'Deadlocks & Deadlock Prevention', score: 88, status: 'On Track', failureReason: 'Calculated Banker\'s Algorithm safety state slowly.' }
      ],
      cloud: [
        { topic: 'Cloud Load Balancing (NGINX ALB)', score: 94, status: 'Mastered', failureReason: 'None.' },
        { topic: 'Auto-Scaling Groups & CPU Limits', score: 85, status: 'On Track', failureReason: 'Slight delay in coining scale-down threshold.' },
        { topic: 'Database Replication & Redis Caching', score: 86, status: 'On Track', failureReason: 'Over-purged cache during traffic spike.' }
      ],
      dsa: [
        { topic: 'Arrays & Sorting Algorithms (Bubble/Quick)', score: 98, status: 'Mastered', failureReason: 'None.' },
        { topic: 'Singly & Doubly Linked Lists', score: 94, status: 'Mastered', failureReason: 'None.' },
        { topic: 'Trees & Graph Traversals (BST, BFS)', score: 92, status: 'Mastered', failureReason: 'None.' }
      ],
      micro: [
        { topic: '8085 Opcode Fetch & Machine Cycles', score: 94, status: 'Mastered', failureReason: 'None.' },
        { topic: 'CPU Registers & Flags (Z, CY, S)', score: 90, status: 'Mastered', failureReason: 'None.' },
        { topic: 'Digital 8-Bit I/O Port Addressing', score: 86, status: 'On Track', failureReason: 'Misread IN/OUT port hex address.' }
      ]
    },
    weakConcept: 'None (Consistently High Performance)',
    recommendation: 'Encourage peer tutoring in Cloud Architecture.'
  },
  { 
    id: 's2', 
    name: 'Alex Vance', 
    email: 'alex@bridge.edu', 
    xp: 1100, 
    level: 4, 
    labsCompleted: 4, 
    quizAvg: 88, 
    status: 'On Track', 
    lastActive: '15 mins ago',
    conceptualProgress: { digital: 86, os: 90, cloud: 92, dsa: 64, micro: 84 },
    topicBreakdown: {
      digital: [
        { topic: 'Logic Gates & Boolean Algebra', score: 90, status: 'Mastered', failureReason: 'None.' },
        { topic: 'Combinational Circuits (Adders / MUX)', score: 85, status: 'On Track', failureReason: 'Slight confusion on Carry look-ahead logic.' },
        { topic: 'Flip-Flops & Sequential Circuits', score: 82, status: 'On Track', failureReason: 'Struggled with setup vs hold timing.' }
      ],
      os: [
        { topic: 'CPU Scheduling Algorithms', score: 92, status: 'Mastered', failureReason: 'None.' },
        { topic: 'Process Synchronization', score: 88, status: 'On Track', failureReason: 'Mutex lock release missing in edge case.' },
        { topic: 'Deadlocks & Resource Allocation', score: 86, status: 'On Track', failureReason: 'Slight delay calculating resource matrix.' }
      ],
      cloud: [
        { topic: 'Cloud Load Balancing & CDN', score: 96, status: 'Mastered', failureReason: 'None.' },
        { topic: 'Auto-Scaling Group Allocation', score: 90, status: 'Mastered', failureReason: 'None.' },
        { topic: 'Redis In-Memory Cache Optimization', score: 90, status: 'Mastered', failureReason: 'None.' }
      ],
      dsa: [
        { topic: 'Arrays & Sorting Algorithms', score: 88, status: 'On Track', failureReason: 'None.' },
        { topic: 'Linked Lists & Stack Operations', score: 80, status: 'On Track', failureReason: 'Pointer dereference error on list tail insertion.' },
        { topic: 'Trees & Graph Traversals (BST)', score: 52, status: 'Weak Topic', failureReason: 'Fails recursive Post-Order traversal termination condition. Repeatedly returns stack overflow in DSA Lab.' }
      ],
      micro: [
        { topic: '8085 Assembly Instructions', score: 86, status: 'On Track', failureReason: 'None.' },
        { topic: 'CPU Registers & Flags', score: 84, status: 'On Track', failureReason: 'Confused Parity flag with Zero flag logic.' },
        { topic: 'Digital I/O Port Output', score: 82, status: 'On Track', failureReason: 'None.' }
      ]
    },
    weakConcept: 'DSA Binary Search Tree Recursion & Traversals',
    recommendation: 'Assign extra practice on BST tree recursion in DSA Lab.'
  },
  { 
    id: 's4', 
    name: 'Marcus Miller', 
    email: 'marcus@bridge.edu', 
    xp: 420, 
    level: 2, 
    labsCompleted: 1, 
    quizAvg: 65, 
    status: 'Needs Assistance', 
    lastActive: '2 days ago',
    conceptualProgress: { digital: 58, os: 52, cloud: 45, dsa: 62, micro: 50 },
    topicBreakdown: {
      digital: [
        { topic: 'Logic Gates & Boolean Algebra', score: 70, status: 'On Track', failureReason: 'Slight confusion on NAND vs NOR truth table output.' },
        { topic: 'Combinational Adders', score: 55, status: 'Weak Topic', failureReason: 'Fails Full Adder Carry-Out equation derivation ($C_{out} = AB + BC + AC$). Missed 3 quiz questions.' },
        { topic: 'Flip-Flops & Sequential Logic (JK-FF)', score: 48, status: 'Weak Topic', failureReason: 'Confused invalid $J=1, K=1$ toggle state with D-FlipFlop latch logic.' }
      ],
      os: [
        { topic: 'CPU Scheduling Algorithms (FCFS, SJF)', score: 62, status: 'On Track', failureReason: 'SJF shortest remaining time calculation error.' },
        { topic: 'Round Robin & Time Quantum Math', score: 45, status: 'Weak Topic', failureReason: 'Fails to update ready queue timeline after process preempts. Turnaround time error +18ms.' },
        { topic: 'Turnaround & Waiting Time Formulas', score: 48, status: 'Weak Topic', failureReason: 'Confuses $WT = TAT - BT$ with completion timestamp.' }
      ],
      cloud: [
        { topic: 'Cloud Load Balancing', score: 55, status: 'Weak Topic', failureReason: 'Failed round-robin target weight distribution setup.' },
        { topic: 'Auto-Scaling Group Budget Limits', score: 40, status: 'Weak Topic', failureReason: 'Triggered 50k req/s traffic spike without autoscaler bounds, crashing database.' },
        { topic: 'Database Crash Recovery', score: 40, status: 'Weak Topic', failureReason: 'Forgot read-replica promotion sequence.' }
      ],
      dsa: [
        { topic: 'Arrays & Bubble Sort', score: 72, status: 'On Track', failureReason: 'None.' },
        { topic: 'Singly Linked List Insertion', score: 60, status: 'Weak Topic', failureReason: 'Null pointer dereference on head pointer assignment.' },
        { topic: 'Trees & Graph Traversal', score: 54, status: 'Weak Topic', failureReason: 'Confuses Breadth-First Search queue with Depth-First Search stack.' }
      ],
      micro: [
        { topic: '8085 Assembly Code Syntax', score: 58, status: 'Weak Topic', failureReason: 'Syntax error on `MVI A, 05H` operand formatting.' },
        { topic: 'CPU Registers & Accumulator', score: 50, status: 'Weak Topic', failureReason: 'Confused Register Pair H-L memory pointer addressing.' },
        { topic: 'Digital LED Output Port', score: 42, status: 'Weak Topic', failureReason: 'Failed to output data to Port 01H in 8085 Microprocessor Lab.' }
      ]
    },
    weakConcept: 'Round Robin CPU Scheduling & Cloud Auto-Scaling Recovery',
    recommendation: 'Assign 1-on-1 remediation on OS Gantt Timeline & DELD Logic Gate Breadboard.'
  }
];

export const AppProvider = ({ children }) => {
  const [role, setRole] = useState('student');
  const [gamification, setGamification] = useState(false);
  const [language, setLanguage] = useState('en');
  const [activeTab, setActiveTab] = useState('chat');
  const [notes, setNotes] = useState(initialNotes);
  const [roster, setRoster] = useState(initialRoster);
  
  // Authentication & DB State
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  useEffect(() => {
    const session = db.getSession();
    if (session) {
      setCurrentUser(session.user);
      setRole(session.user.role);
    }
  }, []);

  const loginUser = async (email, password) => {
    const session = db.login(email, password);
    setCurrentUser(session.user);
    setRole(session.user.role);
    if (session.user.role === 'teacher') {
      setActiveTab('teacher');
    }
    return session;
  };

  const registerUser = async ({ name, email, password, role }) => {
    const session = db.register({ name, email, password, role });
    setCurrentUser(session.user);
    setRole(session.user.role);
    if (role === 'teacher') {
      setActiveTab('teacher');
    }
    return session;
  };

  const logoutUser = () => {
    db.logout();
    setCurrentUser(null);
    setRole('student');
    setActiveTab('chat');
  };

  const [userStats, setUserStats] = useState({
    name: 'Ethan Cole',
    level: 3,
    xp: 850,
    maxXp: 1000,
    streak: 7,
    coins: 350,
    completedLabs: ['Digital Logic Gate Basics', 'OS Gantt Simulator', 'Cloud Traffic Test'],
    badges: [
      { id: 'b1', name: 'Logic Gate Master', desc: 'Built a 2-bit Binary Adder circuit', icon: '⚡' },
      { id: 'b2', name: 'Cloud Architect', desc: 'Handled 50k req/s traffic spike', icon: '☁️' },
      { id: 'b3', name: 'Scheduler Analyst', desc: 'Solved Round Robin quantum optimization', icon: '⚙️' },
      { id: 'b4', name: 'Assembly Hacker', desc: 'Executed 8085 LED port output', icon: '💻' }
    ]
  });

  const t = translations[language] || translations.en;

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.log('Confetti effect triggered');
    }
  };

  const addXP = (amount) => {
    if (!gamification) return;
    setUserStats(prev => {
      let newXp = prev.xp + amount;
      let newLevel = prev.level;
      let newMaxXp = prev.maxXp;
      
      if (newXp >= prev.maxXp) {
        newLevel += 1;
        newXp = newXp - prev.maxXp;
        newMaxXp = Math.floor(prev.maxXp * 1.3);
        triggerConfetti();
      }

      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        maxXp: newMaxXp,
        coins: prev.coins + Math.floor(amount / 2)
      };
    });
  };

  const addNote = (newNote) => {
    setNotes(prev => [newNote, ...prev]);
    addXP(100);
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        gamification,
        setGamification,
        language,
        setLanguage,
        activeTab,
        setActiveTab,
        userStats,
        addXP,
        triggerConfetti,
        notes,
        addNote,
        roster,
        setRoster,
        currentUser,
        isAuthOpen,
        setIsAuthOpen,
        loginUser,
        registerUser,
        logoutUser,
        t
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);

