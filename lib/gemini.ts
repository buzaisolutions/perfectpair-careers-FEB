import { GoogleGenerativeAI } from '@google/generative-ai'

// ==========================================
// 🛡️ POLYFILLS (Ambiente Falso de Navegador)
// ==========================================
// Necessário para evitar que o PDF.js derrube o servidor

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

// Configuração da Chave
const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GOOGLE_API_KEY
if (!apiKey) {
  throw new Error('MISSING API KEY: Configure GOOGLE_GENERATIVE_AI_API_KEY no .env')
}

const genAI = new GoogleGenerativeAI(apiKey)

// LISTA DE MODELOS PARA TENTAR (Em ordem de preferência)
// Se o primeiro falhar (404), ele tenta o próximo automaticamente.
const MODEL_PRIORITY = [
  'gemini-1.5-flash',      // 1ª Tentativa: O mais rápido e atual
  'gemini-1.5-pro',        // 2ª Tentativa: Mais robusto
  'gemini-pro'             // 3ª Tentativa: O clássico (quase impossível falhar)
]

export async function* generateContentStream(systemPrompt: string, userPrompt: string) {
  const finalPrompt = `${systemPrompt}\n\n---\n\nUSER INPUT:\n${userPrompt}`

  // Tenta os modelos na ordem da lista
  for (const modelName of MODEL_PRIORITY) {
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

      // Se chegou aqui, funcionou! Vamos transmitir os dados.
      for await (const chunk of result.stream) {
        const chunkText = chunk.text()
        if (chunkText) {
          yield chunkText
        }
      }
      
      // Se terminou com sucesso, para o loop e sai da função.
      return; 

    } catch (error: any) {
      // Se for erro de "Não Encontrado" (404), tenta o próximo modelo
      if (error.message.includes('404') || error.message.includes('not found')) {
        console.warn(`⚠️ Modelo ${modelName} não encontrado. Tentando próximo...`)
        continue; // Pula para a próxima iteração do loop
      }

      // Se for outro erro (ex: cota estourada, erro de rede), lança o erro real.
      console.error('Gemini Stream Error:', error)
      throw error
    }
  }

  // Se passou por todos os modelos e nenhum funcionou
  throw new Error('Todos os modelos de IA falharam. Verifique sua chave de API ou região.')
}

export async function extractPDFText(buffer: Buffer, filename?: string): Promise<string> {
  try {
    // LAZY LOAD: Carrega o PDF apenas na hora do uso para garantir que os Polyfills funcionem
    const pdf = require('pdf-parse');
    const data = await pdf(buffer)
    
    return data.text
      .replace(/\n\s*\n/g, '\n')
      .replace(/[^\x20-\x7E\n]/g, '') // Remove caracteres inválidos
      .trim()
  } catch (error) {
    console.error(`Error parsing PDF (${filename}):`, error)
    return "" 
  }
}