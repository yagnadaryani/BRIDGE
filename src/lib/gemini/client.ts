import { GoogleGenAI } from '@google/genai';
import { searchGroundedKnowledge } from './ragService';
import { LearnerModel } from '@/types/learnerModel';

const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export interface AIAssistantRequest {
  query: string;
  studentId: string;
  subjectId?: string;
  conceptId?: string;
  learnerModel?: LearnerModel | null;
  prerequisiteGaps?: string[];
  recentErrors?: string[];
}

export interface AIAssistantResponse {
  answer: string;
  groundingSources: { title: string; source: string }[];
  detectedPrerequisiteGap?: string;
  suggestedRepairExercise?: {
    question: string;
    explanation: string;
  };
}

export async function generateContextAwareAssistantResponse(
  req: AIAssistantRequest
): Promise<AIAssistantResponse> {
  const { query, subjectId, conceptId, learnerModel, prerequisiteGaps } = req;

  // 1. Fetch grounded RAG context
  const ragResult = searchGroundedKnowledge(query, subjectId, conceptId);

  // 2. Build system prompt aware of student context & prerequisite gaps
  const studentContextString = learnerModel
    ? `Student Name: ${learnerModel.studentName}
Overall Mastery: ${learnerModel.overallMastery}%
Active Prerequisite Gaps: ${prerequisiteGaps?.join(', ') || learnerModel.rootGaps.join(', ') || 'None'}
Recurring Errors: ${learnerModel.recurringErrors.map((e) => e.description).join('; ') || 'None'}`
    : 'Student Context: 3rd Year CSE Student';

  const systemInstruction = `You are BRIDGE AI Assistant, an expert engineering tutor for computer science & engineering students.
IMPORTANT AI ARCHITECTURE RULES:
1. Ground your answers strictly in the provided engineering syllabus content.
2. If the student asks about a concept (e.g. Binary Search) but has an active prerequisite gap (e.g., Array Indexing / Boundary Handling), DO NOT jump directly to an advanced solution. First explain the prerequisite invariant, provide a small repair exercise, and guide them step-by-step.
3. Be clear, concise, encouraging, and technically rigorous. Do not fabricate syllabus facts.

STUDENT CONTEXT:
${studentContextString}

GROUNDED ENGINEERING KNOWLEDGE:
${ragResult.groundedContextSnippet}`;

  // If Gemini API Key is available, call the official Gemini model
  if (ai && apiKey) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `${systemInstruction}\n\nStudent Question: ${query}`,
      });

      const text = response.text || 'Here is the explanation grounded in your course materials.';

      return {
        answer: text,
        groundingSources: ragResult.sources,
        detectedPrerequisiteGap: prerequisiteGaps?.[0] || learnerModel?.rootGaps[0],
      };
    } catch (err) {
      console.warn('Gemini API call failed, using grounded fallback:', err);
    }
  }

  // Grounded Deterministic Fallback if API key is not present or call fails
  const hasBoundaryGap = prerequisiteGaps?.includes('dsa-boundary-indexing') ||
    learnerModel?.rootGaps.includes('dsa-boundary-indexing') ||
    query.toLowerCase().includes('binary search');

  let fallbackAnswer = `### Grounded Learning Explanation\n\n${ragResult.matchedDocuments[0]?.content || 'Review the core array invariants.'}\n\n`;

  if (hasBoundaryGap) {
    fallbackAnswer += `\n> [!IMPORTANT]\n> **Prerequisite Gap Detected**: You currently have an active gap in **Array Boundary & Pointer Handling**. Before tackling Binary Search implementation, ensure your upper bound pointer is initialized to \`high = arr.length - 1\` (not \`arr.length\`).\n\nTry the repair exercise below to close this gap!`;
  }

  return {
    answer: fallbackAnswer,
    groundingSources: ragResult.sources,
    detectedPrerequisiteGap: hasBoundaryGap ? 'dsa-boundary-indexing' : undefined,
    suggestedRepairExercise: hasBoundaryGap ? {
      question: 'For array `[10, 20, 30, 40]`, what is index of 40 and what is `arr[4]`?',
      explanation: 'Indices are 0, 1, 2, 3. `arr[3]` is 40. `arr[4]` is undefined (Out of Bounds).'
    } : undefined
  };
}
