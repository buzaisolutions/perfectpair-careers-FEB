import { GoogleGenerativeAI } from '@google/generative-ai'

// Configuração segura da API Key
const apiKey = process.env.GOOGLE_API_KEY
const genAI = new GoogleGenerativeAI(apiKey || '')

// Usando o modelo FLASH padrão (mais rápido e estável)
const model = genAI.getGenerativeModel({ 
  model: 'gemini-1.5-flash',
  generationConfig: {
    responseMimeType: "application/json", // Garante JSON sempre
    temperature: 0.7,
  }
})

export async function generateAnalysis(systemPrompt: string, userPrompt: string) {
  if (!apiKey) {
    throw new Error('GOOGLE_API_KEY is missing in Vercel Settings.')
  }

  try {
    const finalPrompt = `${systemPrompt}\n\n---\n\nANALYZE THIS:\n${userPrompt}`
    
    // Chamada simples (sem stream)
    const result = await model.generateContent(finalPrompt)
    const responseText = result.response.text()

    return JSON.parse(responseText)
  } catch (error: any) {
    console.error('Gemini API Error:', error)
    // Repassa o erro original para o frontend saber o que houve
    throw new Error(error.message || 'Failed to communicate with AI')
  }
}

// --- MANTENDO A EXTRAÇÃO DE PDF SEGURA ---
export async function extractPDFText(buffer: Buffer): Promise<string> {
  try {
    // Polyfills para evitar crash no servidor
    if (typeof (Promise as any).withResolvers === 'undefined') {
      (Promise as any).withResolvers = function () {
        let resolve, reject;
        const promise = new Promise((res, rej) => { resolve = res; reject = rej; });
        return { promise, resolve, reject };
      };
    }
    const globalAny = global as any;
    if (!globalAny.DOMMatrix) globalAny.DOMMatrix = class DOMMatrix {}
    if (!globalAny.Path2D) globalAny.Path2D = class Path2D {}
    if (!globalAny.ImageData) globalAny.ImageData = class ImageData {}

    const pdfModule = await import('pdf-parse') as any;
    const pdfParse = pdfModule.default || pdfModule;

    const data = await pdfParse(buffer)
    return data.text.replace(/\n\s*\n/g, '\n').trim()
  } catch (error) {
    console.error('PDF Parse Error:', error)
    return "" // Retorna vazio se falhar, para não travar tudo
  }
}