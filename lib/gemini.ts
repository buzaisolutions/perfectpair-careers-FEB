import { GoogleGenerativeAI } from '@google/generative-ai'

// Inicializa o cliente do Google com a chave de API
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!)

// CORREÇÃO: Usando a versão exata e numerada para evitar erro 404
const model = genAI.getGenerativeModel({ 
  model: 'gemini-1.5-flash-001', 
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
    // 1. APLICAÇÃO DE POLYFILLS
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

    const globalAny = global as any;

    if (!globalAny.DOMMatrix) { globalAny.DOMMatrix = class DOMMatrix {} }
    if (!globalAny.Path2D) { globalAny.Path2D = class Path2D {} }
    if (!globalAny.ImageData) { globalAny.ImageData = class ImageData {} }

    // 2. IMPORTAÇÃO DINÂMICA SEGURA
    const pdfModule = await import('pdf-parse') as any;
    const pdfParse = pdfModule.default || pdfModule;

    const data = await pdfParse(buffer)
    
    const cleanText = data.text.replace(/\n\s*\n/g, '\n').trim()

    return cleanText
  } catch (error) {
    console.error(`Error parsing PDF (${filename}):`, error)
    throw new Error('Failed to extract text from PDF.')
  }
}