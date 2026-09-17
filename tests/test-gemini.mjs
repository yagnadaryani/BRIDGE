import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is missing");
}

const ai = new GoogleGenAI({
  apiKey,
});

const response = await ai.models.generateContent({
  model: "gemini-3.8-flash",
  contents: "Explain Round Robin CPU scheduling in 3 simple points.",
});

console.log(response.text);