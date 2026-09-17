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

console.log(`Checking store: ${storeName}\n`);

const documents = [];

for await (const document of ai.fileSearchStores.documents.list({
  parent: storeName,
})) {
  documents.push(document);
}

console.log(`Found ${documents.length} documents:\n`);

for (const document of documents) {
  console.log(`- ${document.displayName}`);
}

const readmeDocuments = documents.filter(
  (document) => document.displayName === "README.md"
);

if (readmeDocuments.length === 0) {
  console.log("\nREADME.md is not indexed. Nothing to remove.");
  process.exit(0);
}

for (const document of readmeDocuments) {
  console.log(`\nDeleting: ${document.displayName}`);

  await ai.fileSearchStores.documents.delete({
    name: document.name,
    config: {
      force: true,
    },
  });

  console.log("Deleted successfully.");
}

console.log("\n=================================");
console.log("CURRICULUM STORE CLEAN");
console.log("=================================");