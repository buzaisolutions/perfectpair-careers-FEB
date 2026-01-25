import { GoogleGenerativeAI } from '@google/generative-ai'

// ==========================================
// 🛡️ POLYFILLS (Ambiente Falso de Navegador)
// ==========================================
// Mantidos pois resolveram o problema do PDF/DOMMatrix

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

class MockDOMMatrix {
  public a = 1; public b = 0; public c = 0; public d = 1; public e = 0; public f = 0;
  constructor() {}
  toString() { return "matrix(1, 0, 0, 1, 0, 0)"; }
}
// @ts-ignore
global.DOMMatrix = global.DOMMatrix || MockDOMMatrix;

// @ts-ignore
global.HTMLCanvasElement = global.HTMLCanvasElement || class {
  getContext() { return null; }
};
// @ts-ignore
global.Canvas = global.Canvas || global.HTMLCanvasElement;

// ==========================================

// Configuração da Chave
const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GOOGLE_API_KEY
if (!apiKey) {
  throw new Error('MISSING API KEY: Configure GOOGLE_GENERATIVE_AI_API_KEY no .env')
}

const genAI = new GoogleGenerativeAI(apiKey)

// 📋 A LISTA DE FORÇA BRUTA
// O código tentará estes nomes EXATOS na ordem, até um funcionar.
// Esses são os nomes técnicos que a API v1beta aceita.
const MODELS_TO_TRY = [
  'gemini-1.5-flash-002', // Versão mais nova do Flash
  'gemini-1.5-flash-001', // Versão estável do Flash
  'gemini-1.5-pro-002',   // Versão mais nova do Pro
  'gemini-1.5-pro-001',   // Versão estável do Pro
  'gemini-1.0-pro',       // Versão legada (muito compatível)
  'gemini-pro'            // Última tentativa (alias)
];

export async function* generateContentStream(systemPrompt: string, userPrompt: string) {
  const finalPrompt = `${systemPrompt}\n\n---\n\nUSER INPUT:\n${userPrompt}`
  let lastError = null;

  // Loop de Tentativa e Erro
  for (const modelName of MODELS_TO_TRY) {
    try {
      console.log(`🤖 Tentando conectar com modelo: ${modelName}...`)
      
      const model = genAI.getGenerativeModel({ 
        model: modelName,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 8192,
        }
      })

      const result = await model.generateContentStream(finalPrompt)

      // Se a linha acima não deu erro, começamos o stream
      for await (const chunk of result.stream) {
        const chunkText = chunk.text()
        if (chunkText) {
          yield chunkText
        }
      }
      
      console.log(`✅ Sucesso! Conectado no modelo: ${modelName}`)
      return; // SUCESSO! Encerra a função.

    } catch (error: any) {
      // Se for erro 404 (Modelo não existe/não permitido), tenta o próximo
      if (error.message.includes('404') || error.message.includes('not found') || error.message.includes('not supported')) {
        console.warn(`⚠️ Modelo ${modelName} falhou (404/Não Suportado). Tentando próximo...`)
        lastError = error;
        continue; 
      }

      // Se for outro erro (ex: chave inválida), explode logo
      console.error('❌ Erro Fatal no Gemini:', error)
      throw error
    }
  }

  // Se o loop acabar e ninguém funcionou
  console.error('💀 Todos os modelos falharam.')
  throw lastError || new Error('Falha ao conectar com todos os modelos Gemini disponíveis.')
}

export async function extractPDFText(buffer: Buffer, filename?: string): Promise<string> {
  try {
    // Lazy load para garantir polyfills
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