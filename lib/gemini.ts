import { GoogleGenerativeAI } from '@google/generative-ai'

// ==========================================
// 🛡️ POLYFILLS CRÍTICOS (Fake Browser Environment)
// ==========================================
// Isso impede o erro "DOMMatrix is not defined" e "Canvas" no servidor.

// 1. Fake Promise.withResolvers (para compatibilidade)
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

// 2. Fake DOMMatrix (O vilão do seu log)
// Criamos uma classe vazia apenas para o PDF.js não travar
class MockDOMMatrix {
  public a = 1; public b = 0; public c = 0; public d = 1; public e = 0; public f = 0;
  constructor() {}
  toString() { return "matrix(1, 0, 0, 1, 0, 0)"; }
}
// @ts-ignore
global.DOMMatrix = global.DOMMatrix || MockDOMMatrix;

// 3. Fake Canvas
// @ts-ignore
global.HTMLCanvasElement = global.HTMLCanvasElement || class {
  getContext() { return null; }
};

// ==========================================

// ⚠️ IMPORTANTE: O require DEVE vir DEPOIS dos polyfills acima
const pdf = require('pdf-parse');

// Validação da Chave
const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY
if (!apiKey) {
  // Fallback para tentar ler a outra variável se a primeira falhar
  const fallbackKey = process.env.GOOGLE_API_KEY
  if (!fallbackKey) {
     throw new Error('MISSING API KEY: Configure GOOGLE_GENERATIVE_AI_API_KEY no .env')
  }
}

// Inicialização do Gemini
const genAI = new GoogleGenerativeAI(apiKey || process.env.GOOGLE_API_KEY!)

const model = genAI.getGenerativeModel({ 
  model: 'gemini-1.5-flash-latest', // Versão estável
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
    // A mágica acontece aqui: o pdf-parse vai usar nosso MockDOMMatrix
    const data = await pdf(buffer)
    
    // Limpeza de texto
    return data.text
      .replace(/\n\s*\n/g, '\n') // Remove linhas vazias duplas
      .replace(/[^\x20-\x7E\n]/g, '') // Remove caracteres estranhos/invisíveis
      .trim()
  } catch (error) {
    console.error(`Error parsing PDF (${filename}):`, error)
    // Retorna vazio em vez de explodir o app
    return "" 
  }
}