import { GoogleGenerativeAI } from '@google/generative-ai'

// ==========================================
// 🛡️ POLYFILLS (Necessário para o PDF)
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
// ==========================================

// Validação da Chave
const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GOOGLE_API_KEY
if (!apiKey) throw new Error('MISSING API KEY: Configure GOOGLE_GENERATIVE_AI_API_KEY no .env')

const genAI = new GoogleGenerativeAI(apiKey)

/**
 * 🕵️ AUTO-DESCOBERTA AJUSTADA PARA GEMINI 2.0
 */
async function getBestAvailableModel(): Promise<any> {
  try {
    // 1. Obtém a lista real de modelos da sua conta
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    
    if (!response.ok) {
       console.warn("⚠️ Falha ao listar modelos. Usando fallback seguro.");
       return genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    }

    const data = await response.json();
    const models = data.models || [];
    
    // Limpa os nomes (remove 'models/')
    const availableNames = models.map((m: any) => m.name.replace('models/', ''));

    console.log("📜 Lista de modelos detectada:", availableNames);

    // 2. NOVA LISTA DE PRIORIDADE (Baseada no seu log)
    // Damos preferência aos modelos 2.0 Flash (Rápidos e Estáveis)
    const PRIORITY_ORDER = [
      'gemini-2.0-flash',          // Seu log mostrou este!
      'gemini-2.0-flash-exp',      // Alternativa
      'gemini-1.5-flash',          // Fallback clássico
      'gemini-1.5-flash-latest',
      'gemini-flash-latest'        // Genérico
    ];

    // 3. Seleção Exata
    for (const target of PRIORITY_ORDER) {
      // Verifica se o nome exato existe na lista do Google
      const exactMatch = availableNames.find((name: string) => name === target);
      
      if (exactMatch) {
        console.log(`✅ MATCH EXATO ENCONTRADO: ${exactMatch}`);
        return genAI.getGenerativeModel({ 
          model: exactMatch,
          generationConfig: { temperature: 0.7, maxOutputTokens: 8192 }
        });
      }
    }

    // 4. Se não achou exato, pega qualquer um que tenha "flash" (performance)
    const fallbackFlash = availableNames.find((n: string) => n.includes('flash') && !n.includes('image'));
    if (fallbackFlash) {
       console.log(`⚠️ Usando Fallback Flash: ${fallbackFlash}`);
       return genAI.getGenerativeModel({ model: fallbackFlash });
    }

    throw new Error('Nenhum modelo compatível encontrado.');

  } catch (error) {
    console.error("Erro na seleção de modelo:", error);
    // Última tentativa cega no modelo que vimos no seu log
    return genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash',
      generationConfig: { temperature: 0.7, maxOutputTokens: 8192 }
    });
  }
}

export async function* generateContentStream(systemPrompt: string, userPrompt: string) {
  const finalPrompt = `${systemPrompt}\n\n---\n\nUSER INPUT:\n${userPrompt}`

  try {
    // Pega o modelo inteligentemente
    const model = await getBestAvailableModel();
    
    const result = await model.generateContentStream(finalPrompt);

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      if (chunkText) yield chunkText;
    }
  } catch (error: any) {
    console.error('Gemini Stream Error:', error);
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