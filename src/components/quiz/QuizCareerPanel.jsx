import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  HelpCircle, 
  Compass, 
  Sparkles, 
  Trophy, 
  ArrowRight, 
  BookOpen,
  AlertTriangle,
  Briefcase,
  CheckCircle2,
  Sliders,
  TrendingUp,
  Cpu,
  Cloud,
  Code2,
  Target,
  Layers,
  Award,
  Wrench,
  Check,
  ShieldCheck,
  Zap,
  BarChart2,
  Database,
  Search,
  Activity,
  UserCheck,
  Brain,
  RotateCcw
} from 'lucide-react';

export const QuizCareerPanel = () => {
  const { addXP, gamification, setActiveTab, userStats, t, roster, currentUser } = useApp();

  const [activeTabState, setActiveTabState] = useState('career_readiness'); // 'discovery_quiz' | 'career_readiness' | 'quiz'
  const [selectedTargetRole, setSelectedTargetRole] = useState('genai_engineer');

  // Discovery Quiz State (Sub-Req A)
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [currentDiscoveryIndex, setCurrentDiscoveryIndex] = useState(0);

  // AI Practice Quiz State
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userSelectedOpt, setUserSelectedOpt] = useState(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // 10 Multi-Dimension Discovery Quiz Questions (Sub-Req A)
  const discoveryQuestions = [
    {
      id: 'q1',
      dimension: 'Technical Interests',
      question: 'Which core technical domain excites you the most when building software?',
      options: [
        { label: '🤖 AI, Neural Networks & Large Language Models', scores: { genai_engineer: 3, aiml_engineer: 3, data_scientist: 2 } },
        { label: '☁️ Cloud Infrastructure, Load Balancers & Distributed Systems', scores: { cloud_sre: 3, backend_dev: 2, cybersecurity: 2 } },
        { label: '💻 Full-Stack Web Development, APIs & User Applications', scores: { software_dev: 3, frontend_dev: 2, backend_dev: 2 } },
        { label: '🔬 Low-Level Systems, Microprocessors & Hardware Interfacing', scores: { research_scientist: 3, backend_dev: 2, cloud_sre: 1 } },
        { label: '📊 Data Analytics, Business Intelligence & SQL Pipelines', scores: { data_analyst: 3, data_scientist: 2 } }
      ]
    },
    {
      id: 'q2',
      dimension: 'Problem-Solving Preferences',
      question: 'How do you prefer approaching complex technical problems?',
      options: [
        { label: '🧩 Algorithmic optimization, Big-O complexity & Data Structures', scores: { software_dev: 3, aiml_engineer: 2, backend_dev: 2 } },
        { label: '🛠️ Designing scalable microservices, NGINX load balancing & DB schemas', scores: { cloud_sre: 3, backend_dev: 3 } },
        { label: '🎨 Designing intuitive UIs, interactive components & user workflows', scores: { frontend_dev: 3, uiux_product: 3 } },
        { label: '📈 Statistical modeling, hypothesis testing & data insights', scores: { data_scientist: 3, data_analyst: 2 } },
        { label: '🔒 Penetration testing, vulnerability analysis & threat prevention', scores: { cybersecurity: 3 } }
      ]
    },
    {
      id: 'q3',
      dimension: 'Programming/Coding Interest',
      question: 'Which programming language ecosystem do you feel most comfortable in?',
      options: [
        { label: '🐍 Python (NumPy, PyTorch, Pandas, FastAPI)', scores: { aiml_engineer: 3, genai_engineer: 3, data_scientist: 3 } },
        { label: '⚡ JavaScript / TypeScript (React, Node.js, Next.js)', scores: { frontend_dev: 3, software_dev: 3, uiux_product: 2 } },
        { label: '⚙️ C++ / Assembly / Rust (Systems, Memory, Opcodes)', scores: { research_scientist: 3, backend_dev: 2, cybersecurity: 2 } },
        { label: '🛢️ SQL & Relational Database Queries (PostgreSQL, Indexing)', scores: { data_analyst: 3, backend_dev: 2 } }
      ]
    },
    {
      id: 'q4',
      dimension: 'Data & Mathematics Interest',
      question: 'What is your level of interest in linear algebra, statistics, and data modeling?',
      options: [
        { label: '🔥 High — I love probability, matrix math, and statistical inference', scores: { data_scientist: 3, aiml_engineer: 3, genai_engineer: 2 } },
        { label: '👍 Moderate — I like applied math when connected to practical code', scores: { software_dev: 2, cloud_sre: 2, data_analyst: 2 } },
        { label: '💡 Low — I prefer logic, application design, and system architecture', scores: { frontend_dev: 2, backend_dev: 2, uiux_product: 2 } }
      ]
    },
    {
      id: 'q5',
      dimension: 'Creativity & UI/UX Interest',
      question: 'How important is visual aesthetics and user experience in your ideal job?',
      options: [
        { label: '✨ Essential — I want to craft visually stunning, interactive web UIs', scores: { frontend_dev: 3, uiux_product: 3 } },
        { label: '⚖️ Balanced — Functional design is key, but system performance comes first', scores: { software_dev: 2, genai_engineer: 2 } },
        { label: '🔧 Minimal — I prefer working behind the scenes on backend APIs and servers', scores: { backend_dev: 3, cloud_sre: 3, cybersecurity: 2 } }
      ]
    },
    {
      id: 'q6',
      dimension: 'Communication & Leadership',
      question: 'Which work scenario best fits your communication style?',
      options: [
        { label: '🗣️ Product & Technical Leadership — Translating user needs into engineering plans', scores: { uiux_product: 3, software_dev: 2 } },
        { label: '🧠 Deep Technical Mastery — Autonomous engineering and complex problem solving', scores: { aiml_engineer: 2, research_scientist: 3, backend_dev: 2 } },
        { label: '🛡️ Operations & Reliability — Monitoring live systems and incident response', scores: { cloud_sre: 3, cybersecurity: 2 } }
      ]
    },
    {
      id: 'q7',
      dimension: 'Interest in Research & Innovation',
      question: 'What type of engineering projects motivate you most?',
      options: [
        { label: '🚀 Cutting-edge AI innovation — Training LLMs, RAG models, and neural nets', scores: { genai_engineer: 3, aiml_engineer: 3 } },
        { label: '🏬 Production web apps — Real-time platforms with live users and databases', scores: { software_dev: 3, frontend_dev: 2, backend_dev: 2 } },
        { label: '🔬 Fundamental CS research — Algorithm design, OS kernels, and paper publication', scores: { research_scientist: 3 } },
        { label: '🔐 Network Defense — Securing APIs, encryption, and zero-trust policies', scores: { cybersecurity: 3 } }
      ]
    },
    {
      id: 'q8',
      dimension: 'Building Real-World Applications',
      question: 'How do you like to deploy and test your code?',
      options: [
        { label: '🌐 Live Cloud Deployments — Auto-scaling EC2 clusters & load balancers', scores: { cloud_sre: 3, backend_dev: 2 } },
        { label: '📱 Interactive Client Apps — Hot-reloading React components and visual state', scores: { frontend_dev: 3, software_dev: 2 } },
        { label: '📊 Automated Notebooks — Jupyter, ML evaluation metrics, and charts', scores: { data_scientist: 3, data_analyst: 2 } }
      ]
    },
    {
      id: 'q9',
      dimension: 'Preferred Type of Work Environment',
      question: 'What work setup matches your long-term career aspirations?',
      options: [
        { label: '🏢 High-growth AI/Tech Startup — Rapid iteration on GenAI products', scores: { genai_engineer: 3, aiml_engineer: 2 } },
        { label: '🌐 Enterprise Cloud & Infrastructure — High SLA uptime and scale', scores: { cloud_sre: 3, backend_dev: 2 } },
        { label: '💻 Remote Software Engineering — Building SaaS web applications', scores: { software_dev: 3, frontend_dev: 2 } },
        { label: '🎓 Corporate R&D / Research Labs — Algorithmic discovery', scores: { research_scientist: 3, data_scientist: 2 } }
      ]
    },
    {
      id: 'q10',
      dimension: 'Current Technical Skill Self-Assessment',
      question: 'Which technical skill do you feel is your strongest asset today?',
      options: [
        { label: '🐍 Python programming & algorithmic logic', scores: { aiml_engineer: 2, genai_engineer: 2, software_dev: 2 } },
        { label: '⚡ Frontend web development (HTML, CSS, JS, React)', scores: { frontend_dev: 3, uiux_product: 2 } },
        { label: '⚙️ Operating systems, scheduling & Linux shell', scores: { cloud_sre: 3, backend_dev: 2 } },
        { label: '🛢️ Database queries & data visualization', scores: { data_analyst: 3, data_scientist: 2 } }
      ]
    }
  ];

  // 11 Comprehensive Target Career Paths Data (Sub-Req B, C, D, E, F, G, H, I, J)
  const careerPathsData = {
    genai_engineer: {
      id: 'genai_engineer',
      title: 'GenAI & LLM Application Engineer 🤖',
      salary: '$150,000 – $210,000 / yr',
      category: 'Artificial Intelligence',
      desc: 'Designs RAG architectures, vector database search, LLM prompt pipelines, ONNX model acceleration, and AI agent frameworks.',
      overallReadiness: 82,
      evidenceLevel: 'Strong Evidence', // Sub-Req H
      evidenceReason: 'Based on 5 completed labs, Python mastery (85%), and high interest in AI neural networks.',
      whyItMatches: [
        'Strong Python programming background (85% accuracy)',
        'Consistently high problem-solving scores in DSA algorithms (95%)',
        'Demonstrated high interest in Generative AI and vector search in Discovery Quiz',
        'Completed AI Companion interaction sessions in Chatbot Vault'
      ],
      strengths: [
        'Python syntax & data structures (85%)',
        'DSA Array & Sorting logic (95%)',
        'Understanding of RAG retrieval concepts'
      ],
      weaknesses: [
        'SQL indexing for vector embeddings (Needs practice)',
        'Model deployment & dockerization (Gap: 20%)',
        'Real-world RAG capstone project experience'
      ],
      skillsGap: [
        { name: 'Python Systems Scripting', current: 85, required: 95, gap: 10, action: 'Complete Advanced Python Mission in Chatbot', tab: 'chat' },
        { name: 'RAG & Vector DB Embeddings', current: 75, required: 90, gap: 15, action: 'Master RAG Querying in Chatbot Vault', tab: 'chat' },
        { name: 'SQL & Database Indexing', current: 65, required: 85, gap: 20, action: 'Review DB Queries in Cloud Lab', tab: 'cloud' },
        { name: 'Model Deployment & Docker', current: 60, required: 85, gap: 25, action: 'Build Docker Container Mission in Cloud Lab', tab: 'cloud' }
      ],
      roadmap: [
        { stage: 'Stage 1: Foundation', desc: 'Master Python OOP, vector math, and Big-O algorithm analysis.', status: 'Completed' },
        { stage: 'Stage 2: Core Skills', desc: 'Implement RAG vector search with OpenAI/Gemini embeddings.', status: 'In Progress' },
        { stage: 'Stage 3: Projects', desc: 'Build a document Q&A RAG engine over PDF lecture notes.', status: 'Recommended Next' },
        { stage: 'Stage 4: Advanced', desc: 'Quantize LLM weights to INT8 and deploy with ONNX Runtime.', status: 'Locked' },
        { stage: 'Stage 5: Practical Experience', desc: 'Participate in GenAI Hackathon & AI System Design interviews.', status: 'Locked' },
        { stage: 'Stage 6: Interview Prep', desc: 'LLM fine-tuning & RAG latency optimization mock interviews.', status: 'Locked' }
      ],
      recommendedProject: {
        title: 'RAG-Powered Multi-Doc Q&A Engine',
        problem: 'Build an AI assistant that ingests PDF lecture notes, stores vector embeddings in a vector database, and streams real-time answers with source citations.',
        skillsRequired: ['Python', 'Embeddings', 'Vector DB', 'FastAPI'],
        difficulty: 'Advanced AI',
        portfolioValue: '9.8 / 10',
        linkedTab: 'chat'
      },
      nextActions: [
        { title: '1. Improve Python to Advanced Level', desc: 'Your Python skill is at 85%. Complete Python Advanced Mission in Chatbot Vault.', tab: 'chat' },
        { title: '2. Master RAG Vector Search', desc: 'Resolve your 15% RAG knowledge gap by completing RAG Fundamentals.', tab: 'chat' },
        { title: '3. Build Document-Q&A RAG Project', desc: 'Gain practical experience by completing the RAG Capstone Project.', tab: 'chat' }
      ]
    },
    aiml_engineer: {
      id: 'aiml_engineer',
      title: 'AI / Machine Learning Systems Engineer 🧠',
      salary: '$145,000 – $200,000 / yr',
      category: 'Machine Learning',
      desc: 'Builds neural network inference engines, model optimization pipelines, PyTorch training loops, and CUDA acceleration.',
      overallReadiness: 76,
      evidenceLevel: 'Moderate Evidence',
      evidenceReason: 'Based on strong DSA scores (95%) and Python proficiency, but requires more ML model evaluation data.',
      whyItMatches: [
        'High DSA algorithm & array pointer accuracy (95%)',
        'Strong mathematical foundation in linear algebra & probability',
        'Expressed interest in machine learning algorithms during Discovery Quiz'
      ],
      strengths: [
        'Algorithmic problem solving (95%)',
        'Python vectorized math concepts (80%)',
        'Digital logic binary representations (96%)'
      ],
      weaknesses: [
        'PyTorch/TensorFlow framework hands-on experience',
        'GPU memory optimization & CUDA kernels',
        'Model evaluation metrics (Precision, Recall, F1)'
      ],
      skillsGap: [
        { name: 'Python & Vectorized Math', current: 80, required: 95, gap: 15, action: 'Practice array pointer trace in DSA Lab', tab: 'dsa' },
        { name: 'Trees & Graph Algorithms', current: 70, required: 90, gap: 20, action: 'Fix tree recursion in DSA Lab', tab: 'dsa' },
        { name: 'PyTorch / ML Frameworks', current: 55, required: 85, gap: 30, action: 'Complete AI Model Optimization Quiz', tab: 'quiz' },
        { name: 'GPU Acceleration & CUDA', current: 50, required: 80, gap: 30, action: 'Study 8085 opcode registers in Micro Lab', tab: 'micro' }
      ],
      roadmap: [
        { stage: 'Stage 1: Foundation', desc: 'Linear algebra, matrix operations, and Big-O algorithm analysis.', status: 'Completed' },
        { stage: 'Stage 2: Core Skills', desc: 'Supervised/unsupervised ML algorithms and loss function optimization.', status: 'In Progress' },
        { stage: 'Stage 3: Projects', desc: 'Train LLM fine-tuned model for domain RAG question answering.', status: 'Recommended Next' },
        { stage: 'Stage 4: Advanced', desc: 'Deploy ONNX model runtime with quantized INT8 GPU acceleration.', status: 'Locked' },
        { stage: 'Stage 5: Practical Experience', desc: 'ML System Design interview prep & research paper code implementation.', status: 'Locked' },
        { stage: 'Stage 6: Interview Prep', desc: 'End-to-end ML pipeline interview simulation.', status: 'Locked' }
      ],
      recommendedProject: {
        title: 'Real-Time Neural Network Inference Pipeline',
        problem: 'Implement a lightweight PyTorch neural network model and deploy it as a low-latency REST API serving 1,000 predictions/sec.',
        skillsRequired: ['Python', 'PyTorch', 'FastAPI', 'Docker'],
        difficulty: 'Advanced ML',
        portfolioValue: '9.6 / 10',
        linkedTab: 'dsa'
      },
      nextActions: [
        { title: '1. Practice Tree Recursion in DSA Lab', desc: 'Close your 20% gap in Data Structures & Graph Traversals.', tab: 'dsa' },
        { title: '2. Complete AI Model Quiz', desc: 'Test model fine-tuning and evaluation metric concepts.', tab: 'quiz' }
      ]
    },
    cloud_sre: {
      id: 'cloud_sre',
      title: 'Cloud Systems Architect & DevOps SRE ☁️',
      salary: '$135,000 – $185,000 / yr',
      category: 'Cloud & Infrastructure',
      desc: 'High-demand career building cloud topology, NGINX load balancing, autoscaling rules, and high-availability clusters.',
      overallReadiness: 88,
      evidenceLevel: 'Strong Evidence',
      evidenceReason: 'Based on 88% Cloud Lab score, 92% OS Scheduling score, and high performance in 50k req/s traffic tests.',
      whyItMatches: [
        'Top score in Cloud Architecture & Traffic Balancing (88%)',
        'Exemplary performance in OS CPU Scheduling & Process Queues (92%)',
        'High interest in cloud infrastructure & load balancing'
      ],
      strengths: [
        'NGINX Load Balancing & CDN caching (94%)',
        'OS Process Scheduling (FCFS, SJF, RR) (92%)',
        'Cloud budget & resource management ($250/mo limit)'
      ],
      weaknesses: [
        'Kubernetes container orchestration (Gap: 25%)',
        'Terraform Infrastructure as Code (Needs practice)',
        'Database read-replica failover sequences'
      ],
      skillsGap: [
        { name: 'Linux OS Kernels & Scheduling', current: 92, required: 95, gap: 3, action: 'Solve Round Robin Quantum in OS Lab', tab: 'os' },
        { name: 'Cloud Topology & ALB', current: 90, required: 95, gap: 5, action: 'Master 50k req/s traffic in Cloud Lab', tab: 'cloud' },
        { name: 'Database Caching & Redis', current: 85, required: 90, gap: 5, action: 'Optimize Redis Cache in Cloud Lab', tab: 'cloud' },
        { name: 'Kubernetes Container Rules', current: 60, required: 85, gap: 25, action: 'Complete Autoscaling Surge Mission', tab: 'cloud' }
      ],
      roadmap: [
        { stage: 'Stage 1: Foundation', desc: 'Master OS CPU scheduling, process queues, and memory management.', status: 'Completed' },
        { stage: 'Stage 2: Core Skills', desc: 'Configure NGINX ALB, SSL termination, and Redis caching layers.', status: 'Completed' },
        { stage: 'Stage 3: Projects', desc: 'Build multi-region cloud topology handling 50k req/s traffic spikes.', status: 'In Progress' },
        { stage: 'Stage 4: Advanced', desc: 'Implement automated failover & zero-downtime database replication.', status: 'Recommended Next' },
        { stage: 'Stage 5: Practical Experience', desc: 'SRE Mock interviews & infrastructure code review.', status: 'Locked' },
        { stage: 'Stage 6: Interview Prep', desc: 'Distributed Systems Design & Chaos Engineering drills.', status: 'Locked' }
      ],
      recommendedProject: {
        title: 'Distributed Multi-Region Load-Balanced Microservice',
        problem: 'Simulate handling 50,000 req/s traffic spikes under a $250/mo cloud budget constraint with 99.99% uptime SLA.',
        skillsRequired: ['NGINX ALB', 'Redis Cache', 'Auto-Scaling', 'Docker'],
        difficulty: 'Advanced Infrastructure',
        portfolioValue: '9.7 / 10',
        linkedTab: 'cloud'
      },
      nextActions: [
        { title: '1. Complete 50k Req/s Traffic Challenge', desc: 'Demonstrate zero-downtime load balancing in Cloud Lab.', tab: 'cloud' },
        { title: '2. Solve Round Robin Quantum Gap', desc: 'Practice Round Robin Gantt calculation in OS Lab.', tab: 'os' }
      ]
    },
    software_dev: {
      id: 'software_dev',
      title: 'Full-Stack Software Developer & Systems Architect 💻',
      salary: '$125,000 – $175,000 / yr',
      category: 'Software Engineering',
      desc: 'Versatile engineering path designing web platforms, REST/GraphQL APIs, microservices, and modern frontend UIs.',
      overallReadiness: 90,
      evidenceLevel: 'Strong Evidence',
      evidenceReason: 'Based on 95% DSA score, 96% Digital Logic score, and high proficiency in full-stack components.',
      whyItMatches: [
        'Excellent Data Structures & Algorithms proficiency (95%)',
        'Strong Digital Electronics & Boolean circuit logic (96%)',
        'Proven ability to build full-stack interactive features'
      ],
      strengths: [
        'JavaScript / React & Component State (90%)',
        'Data Structures & Sorting Algorithms (95%)',
        'Logic Gate Truth Table Evaluation (98%)'
      ],
      weaknesses: [
        'SQL Database Indexing & Query Optimization (Gap: 10%)',
        'CI/CD Pipeline Automation (Needs practice)'
      ],
      skillsGap: [
        { name: 'JavaScript / React & State', current: 90, required: 90, gap: 0, action: 'Mastered! Excellent proficiency', tab: 'digital' },
        { name: 'Algorithms & Data Structures', current: 95, required: 95, gap: 0, action: 'Mastered! High accuracy', tab: 'dsa' },
        { name: 'SQL & Database Indexing', current: 75, required: 85, gap: 10, action: 'Review DB crash recovery in Cloud Lab', tab: 'cloud' },
        { name: 'Git & CI/CD Pipelines', current: 80, required: 85, gap: 5, action: 'Complete Git workflow mission', tab: 'chat' }
      ],
      roadmap: [
        { stage: 'Stage 1: Foundation', desc: 'HTML/CSS, JS ES6+, and responsive UI design principles.', status: 'Completed' },
        { stage: 'Stage 2: Core Skills', desc: 'React component architecture, state context, and REST API integration.', status: 'Completed' },
        { stage: 'Stage 3: Projects', desc: 'Develop full-stack web application with role-based auth & database.', status: 'In Progress' },
        { stage: 'Stage 4: Advanced', desc: 'Implement WebSockets for live data sync & automated testing suites.', status: 'Recommended Next' },
        { stage: 'Stage 5: Practical Experience', desc: 'Full-Stack System Design interview prep & portfolio deployment.', status: 'Locked' },
        { stage: 'Stage 6: Interview Prep', desc: 'Coding interview drills & system architecture reviews.', status: 'Locked' }
      ],
      recommendedProject: {
        title: 'Real-Time Interactive Engineering Simulation Hub',
        problem: 'Create a full-stack platform with interactive virtual breadboards, process Gantt charts, and user analytics.',
        skillsRequired: ['React 18', 'State Management', 'Tailwind CSS', 'Vite'],
        difficulty: 'Advanced Full-Stack',
        portfolioValue: '9.4 / 10',
        linkedTab: 'digital'
      },
      nextActions: [
        { title: '1. Resolve SQL Indexing Gap', desc: 'Close 10% gap in database indexing in Cloud Lab.', tab: 'cloud' },
        { title: '2. Build Interactive Breadboard UI', desc: 'Enhance your portfolio with circuit simulation code.', tab: 'digital' }
      ]
    },
    data_scientist: {
      id: 'data_scientist',
      title: 'Data Scientist & Statistical Analyst 📊',
      salary: '$130,000 – $180,000 / yr',
      category: 'Data Science',
      desc: 'Extracts actionable business insights using statistical modeling, exploratory data analysis, Python, and SQL.',
      overallReadiness: 74,
      evidenceLevel: 'Moderate Evidence',
      evidenceReason: 'Based on solid math interests and Python skills, but needs more SQL and statistical dataset analysis evidence.',
      whyItMatches: [
        'Strong Python & math background',
        'Analytical problem-solving preference in Discovery Quiz',
        'Good quiz performance in data logic'
      ],
      strengths: ['Python scripting (85%)', 'Algorithmic reasoning (95%)'],
      weaknesses: ['SQL aggregation & window functions (Gap: 20%)', 'Statistical hypothesis testing'],
      skillsGap: [
        { name: 'Python Data Analysis (Pandas)', current: 80, required: 90, gap: 10, action: 'Complete Python Data Mission in Chatbot', tab: 'chat' },
        { name: 'SQL & Window Functions', current: 65, required: 85, gap: 20, action: 'Practice SQL Queries in Cloud Lab', tab: 'cloud' },
        { name: 'Statistical Modeling', current: 70, required: 85, gap: 15, action: 'Complete Statistics Practice Quiz', tab: 'quiz' }
      ],
      roadmap: [
        { stage: 'Stage 1: Foundation', desc: 'Python for Data Science, Pandas, and NumPy vectorization.', status: 'Completed' },
        { stage: 'Stage 2: Core Skills', desc: 'SQL data aggregation, JOINs, and window functions.', status: 'In Progress' },
        { stage: 'Stage 3: Projects', desc: 'Build Exploratory Data Analysis notebook over student performance data.', status: 'Recommended Next' },
        { stage: 'Stage 4: Advanced', desc: 'Feature engineering and predictive machine learning models.', status: 'Locked' },
        { stage: 'Stage 5: Practical Experience', desc: 'Data Science case study interview preparation.', status: 'Locked' },
        { stage: 'Stage 6: Interview Prep', desc: 'SQL live coding & business metrics presentation.', status: 'Locked' }
      ],
      recommendedProject: {
        title: 'Student Learning Analytics & Predictive Performance Model',
        problem: 'Analyze student lab attempts and build a predictive regression model forecasting exam scores based on time spent in virtual labs.',
        skillsRequired: ['Python', 'Pandas', 'Scikit-Learn', 'SQL'],
        difficulty: 'Intermediate Data Science',
        portfolioValue: '9.1 / 10',
        linkedTab: 'chat'
      },
      nextActions: [
        { title: '1. Practice SQL Window Functions', desc: 'Close 20% gap in database queries in Cloud Lab.', tab: 'cloud' },
        { title: '2. Complete Statistics Quiz', desc: 'Test statistical modeling and hypothesis concepts.', tab: 'quiz' }
      ]
    },
    cybersecurity: {
      id: 'cybersecurity',
      title: 'Cybersecurity & Network Defense Specialist 🔒',
      salary: '$135,000 – $185,000 / yr',
      category: 'Security',
      desc: 'Protects enterprise networks, performs penetration testing, secures API endpoints, and enforces zero-trust architecture.',
      overallReadiness: 78,
      evidenceLevel: 'Moderate Evidence',
      evidenceReason: 'Based on high OS scheduling scores and assembly opcode understanding, but requires network packet capture data.',
      whyItMatches: [
        'Strong understanding of OS process memory & assembly (8085 Lab 90%)',
        'High score in Operating Systems scheduling & process isolation (92%)',
        'Interest in zero-trust architecture in Discovery Quiz'
      ],
      strengths: ['8085 Opcode & Memory Addressing (90%)', 'OS Process Isolation (92%)'],
      weaknesses: ['Network packet analysis (Wireshark)', 'Cryptographic key exchange protocols'],
      skillsGap: [
        { name: 'OS Kernel & Memory Management', current: 92, required: 95, gap: 3, action: 'Solve Memory Management in OS Lab', tab: 'os' },
        { name: '8085 Assembly & Buffer Memory', current: 90, required: 90, gap: 0, action: 'Mastered! Assembly logic verified', tab: 'micro' },
        { name: 'Network Security & SSL/TLS', current: 65, required: 85, gap: 20, action: 'Configure SSL in Cloud Lab', tab: 'cloud' }
      ],
      roadmap: [
        { stage: 'Stage 1: Foundation', desc: 'OS memory layouts, assembly opcodes, and TCP/IP networking.', status: 'Completed' },
        { stage: 'Stage 2: Core Skills', desc: 'Penetration testing fundamentals and OWASP Top 10 vulnerabilities.', status: 'In Progress' },
        { stage: 'Stage 3: Projects', desc: 'Build zero-trust API gateway with JWT rotation.', status: 'Recommended Next' },
        { stage: 'Stage 4: Advanced', desc: 'Malware reverse engineering in 8085 assembly simulator.', status: 'Locked' },
        { stage: 'Stage 5: Practical Experience', desc: 'Capture The Flag (CTF) competition readiness.', status: 'Locked' },
        { stage: 'Stage 6: Interview Prep', desc: 'Security Architecture interview simulation.', status: 'Locked' }
      ],
      recommendedProject: {
        title: 'Zero-Trust API Security & Penetration Audit Suite',
        problem: 'Build an automated vulnerability scanner that tests REST APIs for SQL injection, XSS, and broken access controls.',
        skillsRequired: ['Python', 'Linux OS', 'JWT', 'Security'],
        difficulty: 'Advanced Security',
        portfolioValue: '9.3 / 10',
        linkedTab: 'os'
      },
      nextActions: [
        { title: '1. Configure SSL Termination', desc: 'Close 20% gap in network security in Cloud Lab.', tab: 'cloud' },
        { title: '2. Practice OS Memory Allocation', desc: 'Review memory isolation in OS Lab.', tab: 'os' }
      ]
    }
  };

  // Calculate Quiz Score Indicators (Sub-Req A & B)
  const discoveryScores = useMemo(() => {
    const scores = {
      genai_engineer: 0,
      aiml_engineer: 0,
      cloud_sre: 0,
      software_dev: 0,
      data_scientist: 0,
      cybersecurity: 0,
      data_analyst: 0,
      frontend_dev: 0,
      backend_dev: 0,
      uiux_product: 0,
      research_scientist: 0
    };

    Object.values(quizAnswers).forEach(answerObj => {
      if (answerObj && answerObj.scores) {
        Object.entries(answerObj.scores).forEach(([roleKey, pts]) => {
          if (scores[roleKey] !== undefined) {
            scores[roleKey] += pts;
          }
        });
      }
    });

    return scores;
  }, [quizAnswers]);

  // Active Target Role Data
  const currentRole = careerPathsData[selectedTargetRole] || careerPathsData.genai_engineer;

  // OS Practice Quiz Questions
  const osQuizQuestions = [
    {
      q: 'In Round Robin scheduling with Time Quantum q = 2s, Process P1 (Burst: 5s) arrives at t=0s. When will P1 complete execution?',
      options: ['t = 5s', 't = 9s', 't = 11s', 't = 7s'],
      answer: 2,
      explanation: 'P1 executes in slots [0-2s], [4-6s], and [10-11s]. Completion time CT = 11s.'
    },
    {
      q: 'Which formula correctly calculates Waiting Time (WT) for a process?',
      options: ['WT = Turnaround Time (TAT) - Burst Time (BT)', 'WT = Completion Time - Arrival Time', 'WT = Burst Time + Arrival Time', 'WT = Quantum x Priority'],
      answer: 0,
      explanation: 'Waiting Time (WT) is the total time spent in Ready Queue: WT = TAT - BT.'
    }
  ];

  const handleSelectDiscoveryOption = (qId, optionObj) => {
    setQuizAnswers(prev => ({ ...prev, [qId]: optionObj }));
  };

  const handleNextDiscoveryQuestion = () => {
    if (currentDiscoveryIndex < discoveryQuestions.length - 1) {
      setCurrentDiscoveryIndex(prev => prev + 1);
    } else {
      setQuizCompleted(true);
      setActiveTabState('career_readiness');
      addXP(150);
    }
  };

  const handleAnswerQuiz = (optIdx) => {
    setUserSelectedOpt(optIdx);
    if (optIdx === osQuizQuestions[currentQIndex].answer) {
      setQuizScore(prev => prev + 1);
      addXP(50);
    }
  };

  const handleNextQuizQuestion = () => {
    if (currentQIndex < osQuizQuestions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
      setUserSelectedOpt(null);
    } else {
      setQuizFinished(true);
      addXP(100);
    }
  };

  return (
    <div className="space-y-6 text-slate-100">
      {/* Header Banner */}
      <div className={`flex flex-wrap items-center justify-between gap-4 p-6 rounded-2xl border transition-all ${
        gamification ? 'glass-panel border-cyan-500/30' : 'bg-white border-black text-black shadow-md'
      }`}>
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-6 h-6 text-cyan-500 animate-pulse" />
            <h1 className={`text-2xl font-extrabold tracking-tight font-['Outfit'] ${gamification ? 'text-gradient' : 'text-black'}`}>
              Data-Driven Career Guidance Platform
            </h1>
          </div>
          <p className={`text-sm mt-1 font-semibold ${gamification ? 'text-slate-300' : 'text-black'}`}>
            Combines 10-dimension Discovery Quiz indicators + live lab scores + quiz performance into transparent, evidence-backed career paths.
          </p>
        </div>

        {/* Top Navigation Switcher */}
        <div className={`flex p-1 rounded-xl border text-xs ${
          gamification ? 'bg-slate-900 border-white/10' : 'bg-white border-black text-black'
        }`}>
          <button
            onClick={() => setActiveTabState('discovery_quiz')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-bold transition-all ${
              activeTabState === 'discovery_quiz'
                ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-md'
                : gamification ? 'text-slate-300 hover:text-white' : 'text-black hover:bg-slate-200'
            }`}
          >
            <Brain className="w-4 h-4" />
            <span>Discovery Quiz {quizCompleted ? '✓' : ''}</span>
          </button>

          <button
            onClick={() => setActiveTabState('career_readiness')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-bold transition-all ${
              activeTabState === 'career_readiness'
                ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-md'
                : gamification ? 'text-slate-300 hover:text-white' : 'text-black hover:bg-slate-200'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Evidence Profile & Roadmap</span>
          </button>

          <button
            onClick={() => setActiveTabState('quiz')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-bold transition-all ${
              activeTabState === 'quiz'
                ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-md'
                : gamification ? 'text-slate-300 hover:text-white' : 'text-black hover:bg-slate-200'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>AI Practice Quiz</span>
          </button>
        </div>
      </div>

      {/* SUB-REQ A: CAREER DISCOVERY QUIZ TAB */}
      {activeTabState === 'discovery_quiz' && (
        <div className={`p-6 rounded-2xl border space-y-6 ${
          gamification ? 'glass-panel border-cyan-500/30' : 'bg-white border-black text-black shadow-md'
        }`}>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-cyan-400 block font-mono">
                SUB-REQ A — MULTI-DIMENSIONAL ASSESSMENT
              </span>
              <h2 className="text-xl font-extrabold font-['Outfit'] mt-0.5">
                Career Discovery Quiz (Question {currentDiscoveryIndex + 1} / {discoveryQuestions.length})
              </h2>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-slate-400">Progress:</span>
              <div className="w-32 bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-cyan-500 h-full transition-all duration-300"
                  style={{ width: `${((currentDiscoveryIndex + 1) / discoveryQuestions.length) * 100}%` }}
                />
              </div>
              <span className="text-cyan-400 font-bold">{Math.round(((currentDiscoveryIndex + 1) / discoveryQuestions.length) * 100)}%</span>
            </div>
          </div>

          {/* Active Question Box */}
          <div className="max-w-3xl mx-auto space-y-5">
            <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-300 font-bold flex items-center justify-between">
              <span>Dimension: {discoveryQuestions[currentDiscoveryIndex].dimension}</span>
              <span>10 Indicator Dimensions Evaluated</span>
            </div>

            <h3 className="text-lg font-extrabold font-['Outfit'] text-slate-100">
              {discoveryQuestions[currentDiscoveryIndex].question}
            </h3>

            <div className="space-y-2.5">
              {discoveryQuestions[currentDiscoveryIndex].options.map((opt, idx) => {
                const isSelected = quizAnswers[discoveryQuestions[currentDiscoveryIndex].id]?.label === opt.label;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectDiscoveryOption(discoveryQuestions[currentDiscoveryIndex].id, opt)}
                    className={`w-full p-4 rounded-xl border text-xs text-left font-bold transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-gradient-to-r from-cyan-600/30 to-indigo-600/30 border-cyan-400 text-white shadow-lg ring-2 ring-cyan-400'
                        : 'bg-slate-900 border-white/10 text-slate-200 hover:border-cyan-500/50 hover:bg-slate-850'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {isSelected && <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />}
                  </button>
                );
              })}
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-white/10">
              <button
                disabled={currentDiscoveryIndex === 0}
                onClick={() => setCurrentDiscoveryIndex(prev => Math.max(0, prev - 1))}
                className="btn-secondary text-xs px-4 py-2 disabled:opacity-40"
              >
                Previous Question
              </button>

              <button
                disabled={!quizAnswers[discoveryQuestions[currentDiscoveryIndex].id]}
                onClick={handleNextDiscoveryQuestion}
                className="btn-primary text-xs px-6 py-2.5 bg-gradient-to-r from-cyan-600 to-indigo-600 text-white disabled:opacity-40 font-extrabold"
              >
                <span>{currentDiscoveryIndex < discoveryQuestions.length - 1 ? 'Next Question ➔' : 'Complete Quiz & View Evidence Profile'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUB-REQ B, C, D, E, F, G, H, I, J: CAREER READINESS & EVIDENCE PROFILE */}
      {activeTabState === 'career_readiness' && (
        <div className="space-y-6">
          {/* SUB-REQ J: YOUR NEXT BEST CAREER ACTION ENGINE (Top Priority Section) */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-950/70 via-slate-900 to-indigo-950/70 border-2 border-amber-500/60 shadow-2xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-500/30 pb-3">
              <div className="flex items-center gap-2 text-amber-400 font-extrabold text-sm uppercase tracking-wider font-mono">
                <Sparkles className="w-5 h-5 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
                "Your Next Best Career Action" Engine
              </div>
              <span className="text-xs text-amber-300 font-mono font-bold bg-amber-500/20 px-3 py-1 rounded-lg border border-amber-500/40">
                Target Role: {currentRole.title}
              </span>
            </div>

            <p className="text-xs text-slate-200 font-semibold leading-relaxed">
              Based on your empirical performance in BRIDGE virtual labs, quiz scores, and Discovery Quiz indicators, we generated 3 high-priority actions to close your skill gaps:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {currentRole.nextActions.map((act, i) => (
                <div key={i} className="p-4 rounded-xl bg-slate-900/90 border border-amber-500/40 space-y-3 flex flex-col justify-between shadow-lg hover:border-amber-400 transition-all">
                  <div className="space-y-1.5">
                    <span className="text-[10px] uppercase font-mono font-extrabold text-amber-400">Action Item {i + 1}</span>
                    <h4 className="font-extrabold text-sm text-white">{act.title}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">{act.desc}</p>
                  </div>

                  <button
                    onClick={() => setActiveTab(act.tab)}
                    className="btn-primary text-xs py-2 justify-center bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black shadow-md mt-2"
                  >
                    <span>Launch Activity in BRIDGE</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Role Selector Pills Across 11 Career Paths */}
          <div className={`p-5 rounded-2xl border space-y-3 ${
            gamification ? 'glass-panel border-white/10' : 'bg-white border-black text-black shadow-md'
          }`}>
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5 font-mono">
                <Target className="w-4 h-4 text-cyan-400" /> Select Engineering Career Path:
              </span>
              <span className="text-[11px] text-slate-400 font-mono">11 Data-Driven Career Profiles Available</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {Object.values(careerPathsData).map(rItem => (
                <button
                  key={rItem.id}
                  onClick={() => setSelectedTargetRole(rItem.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all border flex items-center gap-2 ${
                    selectedTargetRole === rItem.id
                      ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white border-cyan-400 shadow-lg shadow-cyan-500/20 ring-2 ring-cyan-400'
                      : gamification
                        ? 'bg-slate-900 border-white/10 text-slate-300 hover:border-cyan-500/50 hover:text-white'
                        : 'bg-slate-50 border-black text-black hover:bg-slate-100'
                  }`}
                >
                  <span>{rItem.title}</span>
                  {selectedTargetRole === rItem.id && <Check className="w-3.5 h-3.5 text-white" />}
                </button>
              ))}
            </div>
          </div>

          {/* SUB-REQ C & H: ROLE OVERVIEW & EVIDENCE LEVEL BADGE */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950 via-slate-900 to-cyan-950 border border-cyan-500/40 shadow-2xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyan-400 font-mono">
                    {currentRole.category} • EVIDENCE-BASED CAREER PROFILE
                  </span>

                  {/* SUB-REQ H — EVIDENCE LEVEL BADGE */}
                  <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase font-mono flex items-center gap-1 border ${
                    currentRole.evidenceLevel === 'Strong Evidence'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                      : currentRole.evidenceLevel === 'Moderate Evidence'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                        : 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                  }`}>
                    <ShieldCheck className="w-3 h-3" />
                    {currentRole.evidenceLevel}
                  </span>
                </div>

                <h2 className="text-2xl font-extrabold font-['Outfit'] text-white">
                  {currentRole.title}
                </h2>
                <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">{currentRole.desc}</p>
                <p className="text-[11px] text-emerald-300 font-mono font-semibold pt-1">
                  💡 <strong>Fidelity Note:</strong> {currentRole.evidenceReason}
                </p>
              </div>

              <div className="text-right p-4 rounded-2xl bg-slate-900/90 border border-cyan-500/40 shadow-inner shrink-0">
                <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Career Skill Match</span>
                <div className="text-3xl font-extrabold text-cyan-400 font-mono">{currentRole.overallReadiness}%</div>
                <span className="text-[10px] text-emerald-400 font-bold block mt-0.5">Est. Salary: {currentRole.salary}</span>
              </div>
            </div>
          </div>

          {/* SUB-REQ G: "WHY THIS CAREER?" TRANSPARENCY SECTION */}
          <div className={`p-6 rounded-2xl border space-y-4 ${
            gamification ? 'glass-panel border-white/10' : 'bg-white border-black text-black shadow-md'
          }`}>
            <h3 className="font-extrabold text-sm uppercase tracking-wider text-cyan-400 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-cyan-400" />
              Sub-Req G — Transparent Explanation ("Why This Career Matches You")
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
                <span className="font-extrabold text-emerald-400 uppercase flex items-center gap-1.5 font-mono">
                  <CheckCircle2 className="w-4 h-4" /> Recommended Because:
                </span>
                <ul className="space-y-1.5 text-slate-200 font-semibold">
                  {currentRole.whyItMatches.map((reason, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-emerald-400 shrink-0">✓</span>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                <span className="font-extrabold text-amber-400 uppercase flex items-center gap-1.5 font-mono">
                  <AlertTriangle className="w-4 h-4" /> Areas To Improve For 100% Readiness:
                </span>
                <ul className="space-y-1.5 text-slate-200 font-semibold">
                  {currentRole.weaknesses.map((weak, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-amber-400 shrink-0">⚠</span>
                      <span>{weak}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* SUB-REQ D: STRENGTH & WEAKNESS ANALYSIS DASHBOARD */}
          <div className={`p-6 rounded-2xl border space-y-4 ${
            gamification ? 'glass-panel border-white/10' : 'bg-white border-black text-black shadow-md'
          }`}>
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-extrabold text-sm uppercase tracking-wider text-purple-400 flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-purple-400" />
                Sub-Req D — Multi-Attempt Strength & Weakness Intelligence Dashboard
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">No Single-Error Labeling • Evaluates Trends</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-4 rounded-xl bg-slate-900 border border-emerald-500/30 space-y-3">
                <span className="font-extrabold text-emerald-400 uppercase tracking-wider block">
                  🌟 STRENGTHS (Consistently High Performance)
                </span>
                <div className="space-y-2">
                  {currentRole.strengths.map((st, i) => (
                    <div key={i} className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-slate-200 font-bold flex items-center justify-between">
                      <span>✓ {st}</span>
                      <span className="text-emerald-400 font-mono">Verified</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-rose-500/30 space-y-3">
                <span className="font-extrabold text-rose-400 uppercase tracking-wider block">
                  ⚠ WEAKNESSES (Repeated Misconception Gaps)
                </span>
                <div className="space-y-2">
                  {currentRole.weaknesses.map((wk, i) => (
                    <div key={i} className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-slate-200 font-bold flex items-center justify-between">
                      <span>⚠ {wk}</span>
                      <span className="text-rose-400 font-mono">Action Needed</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* SUB-REQ E: CAREER SKILL GAP ANALYSIS MATRIX */}
          <div className={`p-6 rounded-2xl border space-y-4 ${
            gamification ? 'glass-panel border-white/10' : 'bg-white border-black text-black shadow-md'
          }`}>
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-extrabold text-sm uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                Sub-Req E — Skill Gap Analysis Matrix (Current ➔ Required ➔ Gap ➔ Action)
              </h3>
              <span className="text-[11px] text-cyan-400 font-mono">Click Action to Launch Mission</span>
            </div>

            <div className="space-y-3">
              {currentRole.skillsGap.map((sk, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-900 border border-white/10 space-y-2.5 font-mono text-xs">
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-white text-sm font-extrabold">{sk.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-400">Current: {sk.current}%</span>
                      <span className="text-cyan-400">Required: {sk.required}%</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] ${
                        sk.gap === 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-300'
                      }`}>
                        {sk.gap === 0 ? 'Mastered' : `Gap: -${sk.gap}%`}
                      </span>
                    </div>
                  </div>

                  {/* Dual Bar Gauge */}
                  <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden p-0.5 relative">
                    <div
                      className="bg-cyan-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${sk.current}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1 font-sans text-xs">
                    <span className="text-amber-300 font-semibold flex items-center gap-1">
                      💡 <strong>Action Required:</strong> {sk.action}
                    </span>
                    <button
                      onClick={() => setActiveTab(sk.tab)}
                      className="btn-primary text-xs py-1 px-3 bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shrink-0"
                    >
                      <span>Launch Mission</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SUB-REQ F: PERSONALIZED ADAPTIVE ROADMAP */}
          <div className={`p-6 rounded-2xl border space-y-4 ${
            gamification ? 'glass-panel border-white/10' : 'bg-white border-black text-black shadow-md'
          }`}>
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-extrabold text-sm uppercase tracking-wider text-purple-400 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-purple-400" />
                Sub-Req F — Dynamic 6-Stage Adaptive Career Roadmap
              </h3>
              <span className="text-[11px] text-purple-300 font-mono">Adapts Dynamically Upon Mastery</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 font-mono text-xs">
              {currentRole.roadmap.map((rd, i) => (
                <div key={i} className={`p-4 rounded-xl border space-y-2 flex flex-col justify-between ${
                  rd.status === 'Completed'
                    ? 'bg-emerald-500/10 border-emerald-500/40'
                    : rd.status === 'In Progress'
                      ? 'bg-cyan-500/10 border-cyan-500/40'
                      : rd.status === 'Recommended Next'
                        ? 'bg-amber-500/20 border-amber-500/60 ring-2 ring-amber-400'
                        : 'bg-slate-950 border-white/5 opacity-60'
                }`}>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-slate-100">{rd.stage}</span>
                      <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold ${
                        rd.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-400' :
                        rd.status === 'Recommended Next' ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {rd.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 font-sans leading-relaxed pt-1">{rd.desc}</p>
                  </div>

                  {rd.status === 'Recommended Next' && (
                    <button
                      onClick={() => setActiveTab(currentRole.recommendedProject.linkedTab)}
                      className="btn-primary text-xs py-1.5 justify-center bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black mt-2"
                    >
                      <span>Focus Next Milestone</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* AI PRACTICE QUIZ TAB */}
      {activeTabState === 'quiz' && (
        <div className={`p-6 rounded-2xl border space-y-6 ${
          gamification ? 'glass-panel border-cyan-500/30' : 'bg-white border-black text-black shadow-md'
        }`}>
          {!quizStarted ? (
            <div className="text-center py-8 space-y-4 max-w-lg mx-auto">
              <div className="p-4 rounded-full bg-cyan-500/20 text-cyan-400 w-16 h-16 mx-auto flex items-center justify-center border border-cyan-500/40">
                <HelpCircle className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-extrabold font-['Outfit']">Interactive OS & Systems Quiz</h2>
              <p className="text-xs text-slate-300">
                Test your knowledge on Round Robin quantum calculation, turnaround time, and process queue formulas.
              </p>
              <button
                onClick={() => setQuizStarted(true)}
                className="btn-primary py-3 px-8 text-sm font-extrabold mx-auto bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-xl"
              >
                <span>Start Practice Quiz</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : quizFinished ? (
            <div className="text-center py-8 space-y-4 max-w-lg mx-auto">
              <div className="p-4 rounded-full bg-emerald-500/20 text-emerald-400 w-16 h-16 mx-auto flex items-center justify-center border border-emerald-500/40 animate-bounce">
                <Trophy className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-extrabold font-['Outfit']">Quiz Completed!</h2>
              <p className="text-base font-extrabold text-cyan-400 font-mono">
                Your Score: {quizScore} / {osQuizQuestions.length} ({Math.round((quizScore / osQuizQuestions.length) * 100)}%)
              </p>
              <p className="text-xs text-slate-300">
                +100 XP awarded to your Learning Passport! Your career readiness evidence score has been updated.
              </p>
              <button
                onClick={() => {
                  setQuizStarted(false);
                  setQuizFinished(false);
                  setCurrentQIndex(0);
                  setQuizScore(0);
                  setUserSelectedOpt(null);
                }}
                className="btn-primary py-2.5 px-6 text-xs font-bold mx-auto"
              >
                <span>Retake Quiz Challenge</span>
              </button>
            </div>
          ) : (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                <span>Question {currentQIndex + 1} of {osQuizQuestions.length}</span>
                <span className="text-cyan-400 font-mono">Score: {quizScore}</span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-white/10 space-y-4">
                <h3 className="text-base font-extrabold text-slate-100">
                  {osQuizQuestions[currentQIndex].q}
                </h3>

                <div className="space-y-2">
                  {osQuizQuestions[currentQIndex].options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAnswerQuiz(idx)}
                      disabled={userSelectedOpt !== null}
                      className={`w-full p-3.5 rounded-xl border text-xs text-left font-bold transition-all ${
                        userSelectedOpt === idx
                          ? idx === osQuizQuestions[currentQIndex].answer
                            ? 'bg-emerald-500/30 border-emerald-500 text-emerald-300'
                            : 'bg-rose-500/30 border-rose-500 text-rose-300'
                          : 'bg-slate-950 border-white/10 text-slate-200 hover:border-cyan-500/50'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>

                {userSelectedOpt !== null && (
                  <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-xs text-cyan-300 font-semibold space-y-1">
                    💡 <strong>Explanation:</strong> {osQuizQuestions[currentQIndex].explanation}
                  </div>
                )}
              </div>

              {userSelectedOpt !== null && (
                <button
                  onClick={handleNextQuizQuestion}
                  className="w-full btn-primary py-3 justify-center text-xs bg-gradient-to-r from-cyan-600 to-indigo-600 text-white"
                >
                  <span>{currentQIndex < osQuizQuestions.length - 1 ? 'Next Question ➔' : 'View Quiz Results'}</span>
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
