import { GoogleGenerativeAI } from '@google/generative-ai'

// ==========================================
// 🛡️ POLYFILLS (Ambiente Falso de Navegador)
// ==========================================
// Necessário para o PDF.js funcionar no servidor sem travar

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

// 2. Fake DOMMatrix
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
// @ts-ignore
global.Canvas = global.Canvas || global.HTMLCanvasElement;

// ==========================================

// Configuração da Chave da API
const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GOOGLE_API_KEY
if (!apiKey) {
  throw new Error('MISSING API KEY: Configure GOOGLE_GENERATIVE_AI_API_KEY no .env')
}

const genAI = new GoogleGenerativeAI(apiKey)

// ⚠️ MUDANÇA CRÍTICA: Não definimos 'const model' aqui fora mais.
// Definimos dentro da função para poder trocar se der erro.

export async function* generateContentStream(systemPrompt: string, userPrompt: string) {
  const finalPrompt = `${systemPrompt}\n\n---\n\nUSER INPUT:\n${userPrompt}`

  // TENTATIVA 1: O modelo mais rápido e atual (Nome exato, sem 'latest')
  try {
    console.log("🤖 Tentando conectar com: gemini-1.5-flash")
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash', // NOME FIXO E OFICIAL
      generationConfig: { temperature: 0.7, maxOutputTokens: 8192 }
    })
    
    const result = await model.generateContentStream(finalPrompt)
    for await (const chunk of result.stream) {
      const chunkText = chunk.text()
      if (chunkText) yield chunkText
    }
    return; // Sucesso! Sai da função.

  } catch (error: any) {
    console.warn("⚠️ Falha no gemini-1.5-flash. Tentando fallback para gemini-pro...", error.message)
    
    // TENTATIVA 2: O modelo clássico (Fallback de segurança)
    try {
      const modelFallback = genAI.getGenerativeModel({ 
        model: 'gemini-pro', 
        generationConfig: { temperature: 0.7, maxOutputTokens: 8192 }
      })
      
      const resultFallback = await modelFallback.generateContentStream(finalPrompt)
      for await (const chunk of resultFallback.stream) {
        const chunkText = chunk.text()
        if (chunkText) yield chunkText
      }
      return;

    } catch (finalError) {
      console.error("❌ Erro fatal: Todos os modelos falharam.", finalError)
      throw finalError
    }
  }
}

export async function extractPDFText(buffer: Buffer, filename?: string): Promise<string> {
  try {
    // LAZY LOAD: Carrega o PDF apenas na hora do uso
    const pdf = require('pdf-parse');
    const data = await pdf(buffer)
    
    return data.text
      .replace(/\n\s*\n/g, '\n')
      .replace(/[^\x20-\x7E\n]/g, '')
      .trim()
  } catch (error) {
    console.error(`Error parsing PDF (${filename}):`, error)
    return "" 
  }
}