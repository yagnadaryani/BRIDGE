# BRIDGE — Build • Reason • Intervene • Diagnose • Grow • Express

> *"Most platforms personalize the content. BRIDGE personalizes the learning process."*

BRIDGE is an end-to-end personalized engineering learning platform designed for computer science and engineering students. Rather than merely presenting static content or generic chatbot responses, BRIDGE monitors real student evidence (code submissions, lab simulations, assessment choices, confidence calibration), diagnoses root-cause prerequisite gaps, delivers targeted interventions, verifies retry attempts, and updates a multi-dimensional persistent learner model.

---

## 🌟 Key Capabilities & Features

- **Role-Based Authentication**: Distinct Student and Teacher portals with email/password auth, role protection, session persistence, and 1-click Demo Account access (`Aarav Sharma` & `Dr. Vikramaditya Rao`).
- **5 Subject Virtual Labs**:
  1. **DSA Code Studio**: Monaco Editor, live JS execution engine, array pointer visualizer, test runner, full Binary Search boundary error -> prerequisite repair -> retry verification loop.
  2. **Processor Studio**: 8086 Assembly virtual processor (Registers AX, BX, CX, DX, IP, SP, Zero/Carry flags, step instruction execution).
  3. **Digital Electronics Circuit Lab**: Interactive logic gate canvas (AND, OR, NOT, XOR, NAND, NOR, switch inputs, LED outputs, fault diagnosis challenge).
  4. **OS Simulator**: CPU process scheduling simulator (FCFS, SJF, Round Robin, Priority, interactive ready queue, live Gantt chart renderer, turnaround/waiting metrics).
  5. **Cloud Architecture Lab**: Visual topology builder (Users, Load Balancer, Web Cluster, Database, Redis Cache), live traffic surge & crash simulator.
- **Engineering Communication Lab**: Technical English voice recording, technical accuracy vs fluency evaluation, "Explain Like I'm the Examiner" mode.
- **Career Guidance Module**: Evidence-based engineering career mapping based on demonstrated lab performance and skill aptitudes.
- **Teacher Intelligence Dashboard**: Attention signals based on root gaps, before vs after score verification, growth replays, and doubt inbox.
- **Student-Teacher Doubt System**: Persistent doubt threading with code & lab context attachment.
- **Dual-Mode UI (Normal / Gamified)**: Global topbar toggle switching between Academic Normal Mode and Gamified Mode (XP, streaks, levels, badges) backed by the same learner model.
- **Mobile Demonstration Mode**: Embedded interactive phone frame toggle (`[ Desktop ] | [ Mobile ]`) for hackathon presentations.
- **Strict AI Scoping**: Gemini API used strictly for RAG grounding, explanations, and error interpretation — never as the source of truth for learner mastery metrics.

---

## 🚀 Quick Start & Development

### 1. Prerequisites
- Node.js v18+ or v20+
- npm v10+

### 2. Environment Configuration
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Add your Gemini API Key (Optional; app includes zero-config RAG fallback):
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Installation & Local Development
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing & Verification

Run critical engine unit tests:
```bash
npm test
```

Run TypeScript type check:
```bash
npm run typecheck
```

Build production application:
```bash
npm run build
```

---

## 🎬 Primary End-to-End Demo Journey

1. Open [http://localhost:3000](http://localhost:3000) -> Log in as **Demo Student (Aarav)**.
2. Navigate to **DSA -> Binary Search -> Code Studio**.
3. Click **Run & Submit Code** (executes buggy solution with boundary error `high = arr.length`).
4. System logs failure -> **Prerequisite Detective** classifies `PREREQUISITE_GAP` (Array Indexing & Boundary Handling).
5. Review the **Targeted Repair Intervention Card** -> Click **Apply Fix** (`high = arr.length - 1`).
6. Click **Run & Submit Code** again -> Tests pass -> System computes **Before Score 42% → After Score 88%**, verifies intervention closed, updates Learner Model, and awards +150 XP!
7. Click the topbar **Gamification Mode** toggle -> observe XP, Level 4 status, and unlocked badges.
8. Click **Mobile View** toggle -> preview full responsive phone frame UI.
9. Log out -> Log in as **Demo Teacher (Dr. Rao)** -> inspect Aarav's profile -> see exact root cause diagnosis, before/after score verification, and growth replay.
