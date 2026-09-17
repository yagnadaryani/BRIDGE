import fs from "node:fs";
import path from "node:path";
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is missing");
}

const ai = new GoogleGenAI({ apiKey });

const curriculumDir = path.resolve("data/curriculum");

if (!fs.existsSync(curriculumDir)) {
  throw new Error(`Curriculum directory not found: ${curriculumDir}`);
}

const files = fs
  .readdirSync(curriculumDir)
  .filter((file) => file.endsWith(".md"));

if (files.length === 0) {
  throw new Error("No curriculum .md files found.");
}

console.log(`Found ${files.length} curriculum files.`);

/* =======================================================
   REUSE EXISTING STORE OR CREATE ONE
======================================================= */

let storeName = process.env.GEMINI_FILE_SEARCH_STORE_NAME;

if (!storeName) {
  console.log("Creating BRIDGE Curriculum Store...");

  const store = await ai.fileSearchStores.create({
    config: {
      displayName: "BRIDGE Curriculum Store",
      embeddingModel: "models/gemini-embedding-2",
    },
  });

  storeName = store.name;

  console.log(`Created store: ${storeName}`);

  const envPath = path.resolve(".env.local");

  let env = fs.existsSync(envPath)
    ? fs.readFileSync(envPath, "utf8")
    : "";

  if (env.includes("GEMINI_FILE_SEARCH_STORE_NAME=")) {
    env = env.replace(
      /^GEMINI_FILE_SEARCH_STORE_NAME=.*$/m,
      `GEMINI_FILE_SEARCH_STORE_NAME=${storeName}`
    );
  } else {
    env += `\nGEMINI_FILE_SEARCH_STORE_NAME=${storeName}\n`;
  }

  fs.writeFileSync(envPath, env);

  console.log("Saved File Search store name to .env.local");
} else {
  console.log(`Reusing existing store: ${storeName}`);
}

/* =======================================================
   CHECK WHICH FILES ARE ALREADY IN THE STORE
======================================================= */

const existingDocuments = [];

const documents = await ai.fileSearchStores.documents.list({
  parent: storeName,
});

for await (const document of documents) {
  existingDocuments.push(document);
}

const existingNames = new Set(
  existingDocuments.map((document) => document.displayName)
);

console.log(
  `Existing documents in store: ${existingDocuments.length}`
);

/* =======================================================
   UPLOAD + IMPORT CURRICULUM FILES
======================================================= */

for (const filename of files) {
  if (existingNames.has(filename)) {
    console.log(`\nSkipping already indexed: ${filename}`);
    continue;
  }

  const filePath = path.join(curriculumDir, filename);
  const content = fs.readFileSync(filePath, "utf8");

  const getField = (label) => {
    const match = content.match(
      new RegExp(`^${label}:\\s*(.+)$`, "mi")
    );

    return match ? match[1].trim() : "";
  };

  const metadata = [
    {
      key: "institution",
      stringValue: getField("Institution"),
    },
    {
      key: "branch",
      stringValue: getField("Branch"),
    },
    {
      key: "pattern",
      stringValue: getField("Pattern"),
    },
    {
      key: "year",
      stringValue: getField("Year"),
    },
    {
      key: "semester",
      stringValue: getField("Semester"),
    },
    {
      key: "subject",
      stringValue: getField("Subject"),
    },
    {
      key: "course_code",
      stringValue: getField("Course Code"),
    },
    {
      key: "source_url",
      stringValue: getField("Source"),
    },
  ].filter((item) => item.stringValue !== "");

  console.log(`\nUploading file: ${filename}`);

  /* ---------------------------------------------------
     1. Upload file through Gemini Files API
  --------------------------------------------------- */

  const uploadedFile = await ai.files.upload({
    file: filePath,
    config: {
      displayName: filename,
      mimeType: "text/markdown",
    },
  });

  console.log(`Uploaded: ${uploadedFile.name}`);

  /* ---------------------------------------------------
     2. Import uploaded file into File Search store
  --------------------------------------------------- */

  let operation = await ai.fileSearchStores.importFile({
    fileSearchStoreName: storeName,
    fileName: uploadedFile.name,
    config: {
      customMetadata: metadata,
    },
  });

  /* ---------------------------------------------------
     3. Wait for indexing
  --------------------------------------------------- */

  while (!operation.done) {
    process.stdout.write(".");

    await new Promise((resolve) => setTimeout(resolve, 3000));

    operation = await ai.operations.get({
      operation,
    });
  }

  console.log(`\nIndexed successfully: ${filename}`);
}

/* =======================================================
   COMPLETE
======================================================= */

console.log("\n=================================");
console.log("BRIDGE CURRICULUM RAG READY");
console.log("=================================");
console.log(`Store: ${storeName}`);
console.log(`Curriculum files: ${files.length}`);
console.log("=================================\n");