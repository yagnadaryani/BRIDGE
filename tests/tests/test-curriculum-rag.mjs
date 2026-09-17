import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is missing");
}

const storeName = process.env.GEMINI_FILE_SEARCH_STORE_NAME;

if (!storeName) {
  throw new Error("GEMINI_FILE_SEARCH_STORE_NAME is missing");
}

const ai = new GoogleGenAI({ apiKey });

const tests = [
  {
    name: "TEST 1 — Computer Engineering Operating Systems",
    branch: "Computer Engineering",
    subject: "Operating systems",
    question:
      "What topics are explicitly included in Operating Systems for Computer Engineering? List the relevant units and topics. Use only the retrieved curriculum evidence for deciding what is in scope.",
  },

  {
    name: "TEST 2 — AI & Data Science Operating Systems",
    branch: "Artificial Intelligence & Data Science",
    subject: "Operating systems",
    question:
      "What topics are explicitly included in Operating Systems for Artificial Intelligence & Data Science? List the relevant units and topics. Use only the retrieved curriculum evidence for deciding what is in scope.",
  },

  {
    name: "TEST 3 — Information Technology Digital Electronics",
    branch: "Information Technology",
    subject: "Digital Electronics and Logic Design",
    question:
      "What topics are explicitly included in Digital Electronics and Logic Design for Information Technology? List the relevant units and topics. Use only the retrieved curriculum evidence for deciding what is in scope.",
  },
];

function printAnnotations(step) {
  if (!step.content) {
    return;
  }

  for (const block of step.content) {
    if (block.type !== "text") {
      continue;
    }

    if (!block.annotations || block.annotations.length === 0) {
      continue;
    }

    console.log("\nSOURCES:");

    for (const annotation of block.annotations) {
      if (annotation.type === "file_citation") {
        console.log(
          `- ${annotation.fileName ?? "Unknown file"}`
        );

        if (annotation.source) {
          console.log(`  Source: ${annotation.source}`);
        }

        if (annotation.mediaId) {
          console.log(`  Media ID: ${annotation.mediaId}`);
        }
      }
    }
  }
}

for (const test of tests) {
  console.log("\n");
  console.log("============================================================");
  console.log(test.name);
  console.log("============================================================");

  console.log(`Branch:  ${test.branch}`);
  console.log(`Subject: ${test.subject}`);
  console.log(`Question: ${test.question}\n`);

  const metadataFilter =
    `branch="${test.branch}" AND subject="${test.subject}"`;

  console.log(`Metadata filter: ${metadataFilter}\n`);

  const response = await ai.interactions.create({
    model: "gemini-3.8-flash",

    input: `
You are the curriculum-grounding component of BRIDGE,
an engineering learning intelligence platform.

The curriculum File Search store defines CURRICULUM SCOPE.

The curriculum documents tell you:
- what subject is being taught
- which units exist
- which topics are explicitly included
- course outcomes and related curriculum boundaries

They are NOT the textbook.

For this test:

Branch:
${test.branch}

Subject:
${test.subject}

Question:
${test.question}

Rules:

1. Use the retrieved curriculum evidence to determine curriculum scope.
2. Do NOT mix another branch's curriculum.
3. Do NOT invent syllabus topics.
4. If the retrieved curriculum does not explicitly establish something,
   say that it is not established by the curriculum evidence.
5. You may explain the meaning of retrieved topics using general
   engineering knowledge, but clearly distinguish explanation from
   curriculum evidence.
6. Keep the answer concise and structured.
`,

    tools: [
      {
        type: "file_search",
        file_search_store_names: [storeName],
        metadata_filter: metadataFilter,
      },
    ],
  });

  let foundModelOutput = false;
  let fullText = "";

  for (const step of response.steps ?? []) {
    if (step.type !== "model_output") {
      continue;
    }

    foundModelOutput = true;

    for (const block of step.content ?? []) {
      if (block.type === "text") {
        fullText += block.text ?? "";
      }
    }

    printAnnotations(step);
  }

  console.log("\nANSWER:");
  console.log("--------------------------------------------");

  if (fullText.trim()) {
    console.log(fullText.trim());
  } else {
    console.log("No text output returned.");
  }

  console.log("--------------------------------------------");

  if (foundModelOutput) {
    console.log("✓ Model output received");
  } else {
    console.log("⚠ No model_output step found");
  }
}

console.log("\n============================================================");
console.log("BRIDGE CURRICULUM RAG TEST COMPLETE");
console.log("============================================================");
console.log(`Store: ${storeName}`);
console.log("Tests executed: 3");
console.log("============================================================\n");