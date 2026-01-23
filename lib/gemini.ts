import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || "";

const genAI = new GoogleGenerativeAI(apiKey);

export const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// Função para stream (necessária para o build)
export async function generateContentStream(prompt: string) {
  const result = await model.generateContentStream(prompt);
  return result.stream;
}

// Função placeholder para PDF (necessária para o build)
export async function extractPDFText(file: File | Blob): Promise<string> {
  return ""; 
}