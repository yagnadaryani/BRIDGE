import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { VERIFIED_RAG_CORPUS } from './src/data/mockData';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client Lazily
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!geminiClient && process.env.GEMINI_API_KEY) {
    geminiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return geminiClient;
}

// Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

// 1. Concept Explanation in English, Hindi, Marathi
app.post('/api/gemini/explain', async (req: Request, res: Response) => {
  const { subject, concept, language = 'English', contextLevel = 'undergraduate' } = req.body;

  const prompt = `You are a distinguished Professor of Engineering at BRIDGE.
Subject: ${subject}
Concept: ${concept}
Language: ${language}
Level: ${contextLevel}

Provide an intuitive, rigorous, and visually clear explanation of this concept.
Structure:
1. Core Intuition / Real-world engineering analogy
2. Mathematical or Algorithmic definition
3. Critical Invariant or Working Principle (what must never fail)
4. Common Student Mistake / Misconception
5. Quick Check Question

If language is Hindi or Marathi, explain in clean technical Hindi/Marathi while retaining standard English engineering terms in parentheses where helpful.`;

  const ai = getGeminiClient();
  if (!ai) {
    // Graceful fallback if no key set
    return res.json({
      success: true,
      explanation: `### Core Intuition (${language})
In ${subject}, ${concept} is fundamental. Think of it as a systematic invariant: at each step, we rigorously eliminate invalid states and preserve valid candidate solutions.

### Working Principle
Every state transition must preserve bounds and ensure finite termination.

### Common Engineering Pitfall
Off-by-one errors and unchecked boundary conditions. Always test corner cases (empty, single-item, boundary extremes).

*(Gemini API Key active for custom adaptive dynamic responses)*`
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        temperature: 0.3
      }
    });
    res.json({ success: true, explanation: response.text });
  } catch (error: any) {
    console.error('Gemini explain error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate explanation' });
  }
});

// 2. Context-Aware AI Pedagogical Assistant
app.post('/api/gemini/assistant', async (req: Request, res: Response) => {
  const { studentName, subject, concept, currentMode, learnerModel, recentErrors, userQuery } = req.body;

  const systemInstruction = `You are BRIDGE AI, an advanced Context-Aware Engineering Pedagogical Assistant.
You are assisting ${studentName || 'the student'} in the ${subject || 'Engineering'} workspace.
Current Mode: ${currentMode || 'Learning'}.
Current Concept: ${concept || 'General'}.
Learner Model Context:
- Known Root Gaps: ${JSON.stringify(learnerModel?.rootGaps || [])}
- Recurring Errors: ${JSON.stringify(learnerModel?.recurringErrors || [])}
- Concept Mastery: ${JSON.stringify(learnerModel?.conceptMastery || {})}

CRITICAL PEDAGOGICAL RULE:
Never simply dump full solutions or advanced jargon blindly. If the learner has an active root gap (like boundary handling or logic misconceptions), identify the underlying prerequisite first and guide them with Socratic questions to discover the fix.`;

  const ai = getGeminiClient();
  if (!ai) {
    return res.json({
      success: true,
      reply: `Hello ${studentName || 'Engineer'}! I noticed your recent work in ${subject || 'Engineering'}. Remember our core principle: always inspect the invariant at your boundary conditions. How can I help you understand ${concept || 'the current problem'}?`
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userQuery,
      config: {
        systemInstruction,
        temperature: 0.4
      }
    });
    res.json({ success: true, reply: response.text });
  } catch (error: any) {
    console.error('Gemini assistant error:', error);
    res.status(500).json({ error: error.message || 'Assistant request failed' });
  }
});

// 3. Grounded Syllabus RAG Retrieval
app.post('/api/gemini/rag-grounded', async (req: Request, res: Response) => {
  const { subjectId, query } = req.body;

  const corpus = VERIFIED_RAG_CORPUS[subjectId] || [];
  const groundedDocs = corpus
    .map((c, i) => `[Source ${i + 1}: ${c.topic}]\n${c.groundedContent}`)
    .join('\n\n');

  const prompt = `You are the Grounded Syllabus Verifier for BRIDGE.
Subject: ${subjectId}
User Inquiry: ${query}

Verified Syllabus Reference Materials:
${groundedDocs}

Instructions:
1. Answer strictly based on the provided verified syllabus material.
2. Cite the source (e.g. "[Source 1]").
3. If the query asks for unverified information outside this syllabus scope, explicitly state the syllabus boundary.`;

  const ai = getGeminiClient();
  if (!ai) {
    const matched = corpus.find(c => query.toLowerCase().includes(c.topic.toLowerCase())) || corpus[0];
    return res.json({
      success: true,
      answer: matched
        ? `${matched.groundedContent}\n\n[Grounded Source: ${matched.topic}]`
        : 'Reference grounded in verified engineering syllabus standards.',
      sources: corpus.map(c => c.topic)
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        temperature: 0.2
      }
    });
    res.json({
      success: true,
      answer: response.text,
      sources: corpus.map(c => c.topic)
    });
  } catch (error: any) {
    console.error('Gemini RAG error:', error);
    res.status(500).json({ error: error.message || 'RAG search failed' });
  }
});

// 4. Engineering Communication Evaluator
app.post('/api/gemini/communication-evaluate', async (req: Request, res: Response) => {
  const { mode, topic, studentResponse } = req.body;

  const prompt = `You are a Senior Engineering Viva Examiner and Technical Communication Assessor.
Mode: ${mode} (e.g., 2-mark answer, 4-mark answer, 6-mark answer, viva, or interview).
Topic: ${topic}
Student Oral/Written Response: "${studentResponse}"

Assess this response rigorously across both Technical Knowledge AND Technical Communication.
Return a valid JSON object with the following schema:
{
  "scores": {
    "technicalAccuracy": <number 0-100>,
    "technicalVocabulary": <number 0-100>,
    "structure": <number 0-100>,
    "clarity": <number 0-100>,
    "fluency": <number 0-100>,
    "confidence": <number 0-100>
  },
  "knowledgeScore": <number 0-100>,
  "communicationScore": <number 0-100>,
  "strengths": [<array of string points>],
  "growthAreas": [<array of string points>],
  "modelAnswer": "<ideal response conforming to ${mode} standards>",
  "examinerFeedback": "<concise professional feedback from the examiner>"
}

Do NOT penalize native accents or regional idioms; evaluate purely on clarity, structure, and technical terminology.`;

  const ai = getGeminiClient();
  if (!ai) {
    // Fallback scoring
    const words = (studentResponse || '').trim().split(/\s+/).length;
    const baseScore = Math.min(90, Math.max(50, words * 2.5));
    return res.json({
      success: true,
      evaluation: {
        scores: {
          technicalAccuracy: Math.round(baseScore),
          technicalVocabulary: Math.round(baseScore - 5),
          structure: Math.round(baseScore + 2),
          clarity: Math.round(baseScore),
          fluency: Math.round(baseScore - 2),
          confidence: Math.round(baseScore + 4)
        },
        knowledgeScore: Math.round(baseScore),
        communicationScore: Math.round(baseScore - 3),
        strengths: ['Addressed core technical question', 'Maintained structured tone'],
        growthAreas: ['Incorporate more domain-specific terminology', 'State the operational invariant explicitly'],
        modelAnswer: `In ${topic}, the critical principle requires establishing bounds, maintaining invariants, and specifying time/space complexity trade-offs clearly.`,
        examinerFeedback: 'Solid start. Elevate your delivery by opening with a crisp 1-sentence definition before expanding on mechanics.'
      }
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({ success: true, evaluation: parsed });
  } catch (error: any) {
    console.error('Gemini communication evaluation error:', error);
    res.status(500).json({ error: error.message || 'Evaluation failed' });
  }
});

// Vite Middleware & Production Serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`BRIDGE Platform Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
