import { GoogleGenerativeAI } from '@google/generative-ai'
const pdf = require('pdf-parse');

// CORREÇÃO: Usando o nome exato da variável do seu .env
const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY

if (!apiKey) {
  throw new Error('MISSING API KEY: Verifique se GOOGLE_GENERATIVE_AI_API_KEY está no arquivo .env')
}

const genAI = new GoogleGenerativeAI(apiKey)

// Configuração do Modelo
// Usamos 'gemini-1.5-flash-latest' para garantir que pegamos a versão válida mais recente
const model = genAI.getGenerativeModel({ 
  model: 'gemini-1.5-flash-latest',
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
    
    const cleanText = data.text
      .replace(/\n\s*\n/g, '\n')
      .trim()

    return cleanText
  } catch (error) {
    console.error(`Error parsing PDF (${filename}):`, error)
    throw new Error('Failed to extract text from PDF')
  }
}