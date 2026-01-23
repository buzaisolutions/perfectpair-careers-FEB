import { GoogleGenerativeAI } from '@google/generative-ai'
import pdf from 'pdf-parse'

// Inicializa o cliente do Google com a chave de API
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!)

// Modelo recomendado: Gemini 1.5 Flash (Rápido, barato e janela de contexto grande)
const model = genAI.getGenerativeModel({ 
  model: 'gemini-1.5-flash',
  generationConfig: {
    temperature: 0.7,
    maxOutputTokens: 8192,
  }
})

/**
 * Gera conteúdo via stream para manter a conexão ativa
 */
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

/**
 * Extrai texto limpo de um Buffer de PDF
 */
export async function extractPDFText(buffer: Buffer, filename?: string): Promise<string> {
  try {
    const data = await pdf(buffer)
    
    // Limpeza básica de texto extraído de PDF
    const cleanText = data.text
      .replace(/\n\s*\n/g, '\n') // Remove linhas em branco excessivas
      .trim()

    return cleanText
  } catch (error) {
    console.error(`Error parsing PDF (${filename}):`, error)
    throw new Error('Failed to extract text from PDF')
  }
}