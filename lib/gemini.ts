import { GoogleGenerativeAI } from '@google/generative-ai'

// ==========================================
// 🛡️ POLYFILLS (Fake Browser Environment)
// ==========================================

// 1. Fake Promise.withResolvers
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

// 2. Fake DOMMatrix (Evita o ReferenceError)
class MockDOMMatrix {
  public a = 1; public b = 0; public c = 0; public d = 1; public e = 0; public f = 0;
  constructor() {}
  toString() { return "matrix(1, 0, 0, 1, 0, 0)"; }
}
// @ts-ignore
global.DOMMatrix = global.DOMMatrix || MockDOMMatrix;

// 3. Fake Canvas (Evita o Warning @napi-rs/canvas)
// @ts-ignore
global.HTMLCanvasElement = global.HTMLCanvasElement || class {
  getContext() { return null; }
};
// @ts-ignore
global.Canvas = global.Canvas || global.HTMLCanvasElement; // Segurança extra

// ==========================================

// Configuração da Chave da API
const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY
if (!apiKey) {
  const fallbackKey = process.env.GOOGLE_API_KEY
  if (!fallbackKey) {
     throw new Error('MISSING API KEY: Configure GOOGLE_GENERATIVE_AI_API_KEY no .env')
  }
}

// Inicializa o Gemini
const genAI = new GoogleGenerativeAI(apiKey || process.env.GOOGLE_API_KEY!)

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
    // ⚠️ LAZY LOAD (A MÁGICA ACONTECE AQUI)
    // Só importamos o pdf-parse AGORA, garantindo que os Polyfills acima JÁ rodaram.
    const pdf = require('pdf-parse');

    const data = await pdf(buffer)
    
    // Limpeza de texto
    return data.text
      .replace(/\n\s*\n/g, '\n')
      .replace(/[^\x20-\x7E\n]/g, '')
      .trim()
  } catch (error) {
    console.error(`Error parsing PDF (${filename}):`, error)
    return "" 
  }
}