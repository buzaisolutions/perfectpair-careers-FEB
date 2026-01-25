import { GoogleGenerativeAI } from '@google/generative-ai'

// ==========================================
// 🛠️ POLYFILLS (Modo Silencioso / TypeScript Quieto)
// ==========================================

// 1. Corrige Promise.withResolvers
// O '(Promise as any)' força o TS a aceitar a função nova sem reclamar
if (typeof (Promise as any).withResolvers === 'undefined') {
  (Promise as any).withResolvers = function () {
    let resolve, reject;
    const promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return { promise, resolve, reject };
  };
}

// 2. Corrige DOMMatrix (Usando classe Mock)
class MockDOMMatrix {
  public a = 1;
  public b = 0;
  public c = 0;
  public d = 1;
  public e = 0;
  public f = 0;
  constructor() {}
  toString() { return "matrix(1, 0, 0, 1, 0, 0)"; }
}
// @ts-ignore
global.DOMMatrix = global.DOMMatrix || MockDOMMatrix;

// 3. Corrige Canvas
// @ts-ignore
global.HTMLCanvasElement = global.HTMLCanvasElement || class {
    getContext() { return null; }
};

// ==========================================

// Importação clássica (Require) para evitar erro de tipo no pdf-parse
const pdf = require('pdf-parse');

const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY
if (!apiKey) {
  throw new Error('MISSING API KEY: Verifique se GOOGLE_GENERATIVE_AI_API_KEY está no arquivo .env')
}

const genAI = new GoogleGenerativeAI(apiKey)

const model = genAI.getGenerativeModel({ 
  model: 'gemini-1.5-flash-latest',
  generationConfig: {
    temperature: 0.7,
    maxOutputTokens: 8192,
  }
})

export async function* generateContentStream(systemPrompt: string, userPrompt: string) {
  try {
    const finalPrompt = `${systemPrompt}\n\n---\n\nUSER INPUT:\n${userPrompt}`
    const result = await model.generateContentStream(finalPrompt)

    for await (const chunk of result.stream) {
      const chunkText = chunk.text()
      if (chunkText) {
        yield chunkText
      }
    }
  } catch (error) {
    console.error('Gemini Stream Error:', error)
    throw error
  }
}

export async function extractPDFText(buffer: Buffer, filename?: string): Promise<string> {
  try {
    const data = await pdf(buffer)
    return data.text.replace(/\n\s*\n/g, '\n').trim()
  } catch (error) {
    console.error(`Error parsing PDF (${filename}):`, error)
    return "" 
  }
}