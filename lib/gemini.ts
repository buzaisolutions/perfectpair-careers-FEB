import { GoogleGenerativeAI } from '@google/generative-ai'

// ==========================================
// 🛡️ POLYFILLS (Para PDF funcionar)
// ==========================================
if (typeof (Promise as any).withResolvers === 'undefined') {
  (Promise as any).withResolvers = function () {
    let resolve, reject;
    const promise = new Promise((res, rej) => { resolve = res; reject = rej; });
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
global.HTMLCanvasElement = global.HTMLCanvasElement || class { getContext() { return null; } };
// @ts-ignore
global.Canvas = global.Canvas || global.HTMLCanvasElement;

// Configuração da Chave
const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GOOGLE_API_KEY
if (!apiKey) throw new Error('MISSING API KEY: Configure GOOGLE_GENERATIVE_AI_API_KEY no .env')

const genAI = new GoogleGenerativeAI(apiKey)

async function getBestAvailableModel(): Promise<any> {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    
    if (!response.ok) {
       console.warn("⚠️ Falha ao listar modelos. Usando fallback seguro.");
       return genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    }

    const data = await response.json();
    const models = data.models || [];
    const availableNames = models.map((m: any) => m.name.replace('models/', ''));

    console.log("📜 Lista de modelos detectada:", availableNames);

    // 🔄 MUDANÇA DE ESTRATÉGIA:
    // Priorizamos o 'latest' (1.5 estável) pois o 2.0 tem cota zero (limit: 0) na Europa.
    const PRIORITY_ORDER = [
      'gemini-flash-latest',       // 1.5 Flash Estável (Geralmente funciona com Pay-as-you-go)
      'gemini-1.5-flash',          // Nome específico
      'gemini-1.5-flash-002',      // Versão específica
      'gemini-1.5-pro',            // Pro estável
      'gemini-pro',                // Fallback legado
      'gemini-2.0-flash'           // Último recurso (pois estava bloqueado)
    ];

    for (const target of PRIORITY_ORDER) {
      const exactMatch = availableNames.find((name: string) => name === target);
      if (exactMatch) {
        console.log(`✅ MATCH EXATO ENCONTRADO: ${exactMatch}`);
        return genAI.getGenerativeModel({ 
          model: exactMatch,
          generationConfig: { temperature: 0.7, maxOutputTokens: 8192 }
        });
      }
    }

    // Fallback genérico
    const fallbackFlash = availableNames.find((n: string) => n.includes('flash') && !n.includes('2.0'));
    if (fallbackFlash) return genAI.getGenerativeModel({ model: fallbackFlash });

    throw new Error('Nenhum modelo compatível encontrado.');

  } catch (error) {
    console.error("Erro na seleção de modelo:", error);
    return genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }
}

export async function* generateContentStream(systemPrompt: string, userPrompt: string) {
  const finalPrompt = `${systemPrompt}\n\n---\n\nUSER INPUT:\n${userPrompt}`

  try {
    const model = await getBestAvailableModel();
    const result = await model.generateContentStream(finalPrompt);

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      if (chunkText) yield chunkText;
    }
  } catch (error: any) {
    console.error('Gemini Stream Error:', error);
    // Se der erro de cota (429), avisa no log
    if (error.message.includes('429') || error.message.includes('quota')) {
       console.error("🚨 ERRO DE COTA (EUROPA): O plano gratuito tem limite 0. Verifique se o projeto está como 'Pay-as-you-go' no AI Studio.");
    }
    throw error;
  }
}

export async function extractPDFText(buffer: Buffer, filename?: string): Promise<string> {
  try {
    const pdf = require('pdf-parse');
    const data = await pdf(buffer)
    return data.text.replace(/\n\s*\n/g, '\n').replace(/[^\x20-\x7E\n]/g, '').trim()
  } catch (error) {
    console.error(`Error parsing PDF (${filename}):`, error)
    return "" 
  }
}