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

console.log(`\nBRIDGE Curriculum Store`);
console.log(`Store: ${storeName}\n`);

const documents = [];

for await (const document of ai.fileSearchStores.documents.list({
  parent: storeName,
})) {
  documents.push(document);
}

console.log(`Documents indexed: ${documents.length}\n`);

for (const document of documents) {
  console.log(`--------------------------------`);
  console.log(`Name: ${document.displayName}`);
  console.log(`State: ${document.state}`);
  console.log(`MIME: ${document.mimeType}`);

  if (document.customMetadata?.length) {
    console.log("Metadata:");

    for (const item of document.customMetadata) {
      console.log(
        `  ${item.key}: ${
          item.stringValue ??
          item.numericValue ??
          JSON.stringify(item.stringListValue)
        }`
      );
    }
  }
}

console.log(`\n=================================`);
console.log(`EXPECTED DOCUMENT COUNT: 8`);
console.log(`ACTUAL DOCUMENT COUNT:   ${documents.length}`);
console.log(`=================================\n`);

if (documents.length !== 8) {
  throw new Error(
    `Expected exactly 8 curriculum documents, found ${documents.length}.`
  );
}

const hasReadme = documents.some(
  (document) => document.displayName === "README.md"
);

if (hasReadme) {
  throw new Error("README.md is still indexed.");
}

const inactiveDocuments = documents.filter(
  (document) => document.state !== "STATE_ACTIVE"
);

if (inactiveDocuments.length > 0) {
  throw new Error(
    `${inactiveDocuments.length} document(s) are not ACTIVE yet.`
  );
}

console.log("✓ Exactly 8 curriculum documents");
console.log("✓ README.md excluded");
console.log("✓ All documents ACTIVE");
console.log("✓ Curriculum store is ready for retrieval tests");