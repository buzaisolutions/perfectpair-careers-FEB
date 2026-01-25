import { GoogleGenerativeAI } from '@google/generative-ai'

// ==========================================
// 🛡️ POLYFILLS (Necessário para o PDF funcionar)
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
 * 🕵️ AUTO-DESCOBERTA DE MODELOS (Especial para Europa/NL)
 * Em vez de adivinhar, perguntamos à API o que está disponível.
 */
async function getBestAvailableModel(): Promise<any> {
  try {
    // 1. Tenta listar modelos via REST (bypassing SDK quirks)
    // Usamos a v1beta pois é onde a maioria dos modelos reside, mas se falhar, o erro será capturado.
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    
    if (!response.ok) {
       console.warn("⚠️ Falha ao listar modelos automáticos. Usando fallback padrão.");
       // Se falhar a listagem, retorna o Flash padrão
       return genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    }

    const data = await response.json();
    const models = data.models || [];
    
    // Filtra apenas modelos que geram conteúdo
    const availableNames = models
      .map((m: any) => m.name.replace('models/', ''))
      .filter((name: string) => name.includes('gemini'));

    console.log("🇪🇺 Modelos disponíveis para sua chave:", availableNames);

    // Lógica de Prioridade: Tenta achar o melhor na lista retornada
    const priorityList = [
      'gemini-1.5-flash', 
      'gemini-1.5-flash-001',
      'gemini-1.5-pro',
      'gemini-pro',
      'gemini-1.0-pro'
    ];

    for (const priority of priorityList) {
      if (availableNames.some((n: string) => n.includes(priority))) {
        console.log(`✅ Selecionado automaticamente: ${priority}`);
        return genAI.getGenerativeModel({ 
          model: priority,
          generationConfig: { temperature: 0.7, maxOutputTokens: 8192 }
        });
      }
    }

    // Se não achou nenhum da prioridade, pega o primeiro que tiver 'flash'
    const fallbackFlash = availableNames.find((n: string) => n.includes('flash'));
    if (fallbackFlash) return genAI.getGenerativeModel({ model: fallbackFlash });

    // Último recurso: pega qualquer um que comece com gemini
    const anyGemini = availableNames.find((n: string) => n.startsWith('gemini'));
    if (anyGemini) return genAI.getGenerativeModel({ model: anyGemini });

    throw new Error('Nenhum modelo Gemini compatível encontrado na sua conta.');

  } catch (error) {
    console.error("Erro na auto-descoberta:", error);
    // Fallback final "hardcoded" se tudo der errado
    return genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: { temperature: 0.7, maxOutputTokens: 8192 }
    });
  }
}

export async function* generateContentStream(systemPrompt: string, userPrompt: string) {
  const finalPrompt = `${systemPrompt}\n\n---\n\nUSER INPUT:\n${userPrompt}`

  try {
    // Obtém o modelo dinamicamente
    const model = await getBestAvailableModel();
    
    const result = await model.generateContentStream(finalPrompt);

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      if (chunkText) yield chunkText;
    }
  } catch (error: any) {
    console.error('Gemini Stream Error:', error);
    
    // Dica específica para erro de região/permissão
    if (error.message.includes('404') || error.message.includes('not found')) {
       console.error("🚨 ERRO CRÍTICO DE CONTA: Sua chave de API não tem acesso a NENHUM modelo.");
       console.error("👉 Solução: Crie uma chave nova em https://aistudio.google.com/ (Não use Google Cloud Console)");
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