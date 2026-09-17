import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
const storeName = process.env.GEMINI_FILE_SEARCH_STORE_NAME;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is missing from .env.local");
}

if (!storeName) {
  throw new Error("GEMINI_FILE_SEARCH_STORE_NAME is missing from .env.local");
}

const ai = new GoogleGenAI({ apiKey });

const studentContext = {
  branch: "Computer Engineering",
  subject: "Operating systems",
  semester: "III",
};

const question =
  "Explain Round Robin scheduling for a Computer Engineering student. Include a simple example.";

const prompt = `
You are BRIDGE, an AI engineering teacher.

STUDENT CONTEXT
Branch: ${studentContext.branch}
Subject: ${studentContext.subject}
Semester: ${studentContext.semester}

STUDENT QUESTION
${question}

IMPORTANT CURRICULUM RULES

1. Retrieved curriculum documents define CURRICULUM SCOPE only.
2. They establish subjects, units, topics and course outcomes.
3. They are NOT textbook content.
4. Do not claim detailed theoretical explanations came from the syllabus.
5. Use your general engineering knowledge to teach the concept.
6. Use retrieved curriculum evidence to establish whether the topic belongs to this student's curriculum.
7. If the requested topic is outside the retrieved curriculum scope, clearly say so.
8. Do not invent course codes, units, topics or COs.

RESPONSE REQUIREMENTS

Give a clear, student-friendly engineering explanation.

Structure:

CURRICULUM ALIGNMENT
- State whether the topic is found in the student's curriculum.
- Mention the relevant unit/topic only when supported by retrieved evidence.

TEACH
- Definition
- Simple explanation
- How it works
- Simple numerical example
- Important exam points
- Advantages
- Limitations

SOURCE
- State the retrieved curriculum document name.
- Do not reproduce the curriculum document.
`;

console.log("=================================");
console.log("BRIDGE CURRICULUM → GEMINI TEACHER");
console.log("=================================");
console.log(`Branch  : ${studentContext.branch}`);
console.log(`Subject : ${studentContext.subject}`);
console.log(`Question: ${question}`);
console.log("=================================\n");

const response = await ai.interactions.create({
  model: "gemini-3.8-flash",
  input: prompt,
  tools: [
    {
      type: "file_search",
      file_search_store_names: [storeName],
      metadata_filter:
        `branch="${studentContext.branch}" AND subject="${studentContext.subject}"`,
    },
  ],
});

console.log("GEMINI RESPONSE\n");

for (const step of response.steps ?? []) {
  if (step.type !== "model_output") continue;

  for (const content of step.content ?? []) {
    if (content.type === "text") {
      console.log(content.text);
    }
  }
}

const citations = [];

for (const step of response.steps ?? []) {
  if (step.type !== "model_output") continue;

  for (const content of step.content ?? []) {
    if (content.type !== "text" || !content.annotations) continue;

    for (const annotation of content.annotations) {
      if (annotation.type !== "file_citation") continue;

      const citation = {
        fileName: annotation.file_name ?? null,
        source: annotation.source ?? null,
        pageNumber: annotation.page_number ?? null,
      };

      const key = JSON.stringify(citation);

      if (!citations.some((item) => JSON.stringify(item) === key)) {
        citations.push(citation);
      }
    }
  }
}

console.log("\n=================================");
console.log("CURRICULUM SOURCES");
console.log("=================================");

if (citations.length === 0) {
  console.log("No File Search citations were returned.");
} else {
  for (const [index, citation] of citations.entries()) {
    console.log(`\n${index + 1}. ${citation.fileName ?? "Unknown file"}`);

    if (citation.source) {
      console.log(`   Source: ${citation.source}`);
    }

    if (citation.pageNumber) {
      console.log(`   Page: ${citation.pageNumber}`);
    }
  }
}

console.log("\n=================================");
console.log("RAG TEST COMPLETE");
console.log("=================================");