import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma' // Ajuste se seu prisma estiver em @/lib/db
import { downloadFile } from '@/lib/s3'
import mammoth from 'mammoth'
import { generateAnalysis, extractPDFText } from '@/lib/gemini'

export const maxDuration = 60; // Tenta aumentar o tempo limite da Vercel
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // 1. Verificação de Usuário
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { documentId, jobTitle, jobDescription } = body

    if (!documentId || !jobTitle || !jobDescription) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // 2. Busca o Arquivo
    const document = await prisma.document.findUnique({
      where: { id: documentId }
    })

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    // 3. Extrai o Texto (DOCX ou PDF)
    let resumeText = ''
    try {
      const signedUrl = await downloadFile(document.cloudStoragePath)
      const docResponse = await fetch(signedUrl)
      const docBuffer = Buffer.from(await docResponse.arrayBuffer())

      if (document.fileType === 'DOCX') {
        const result = await mammoth.extractRawText({ buffer: docBuffer })
        resumeText = result.value
      } else if (document.fileType === 'PDF') {
        resumeText = await extractPDFText(docBuffer)
      }
    } catch (e) {
      console.error("File processing error:", e)
      return NextResponse.json({ error: 'Failed to read document file' }, { status: 500 })
    }

    if (!resumeText || resumeText.length < 50) {
      return NextResponse.json({ error: 'Resume text is empty or unreadable' }, { status: 400 })
    }

    // 4. Prepara o Prompt
    const systemPrompt = `
      You are an expert ATS (Applicant Tracking System) Auditor.
      Analyze the RESUME against the JOB DESCRIPTION.
      
      Return a JSON object with this exact structure:
      {
        "atsScore": 0,
        "feedback": "string",
        "keywordAnalysis": {
          "criticalMissing": ["kw1", "kw2"],
          "importantMatched": ["kw3", "kw4"]
        }
      }
    `
    const userPrompt = `
      JOB TITLE: ${jobTitle}
      JOB DESCRIPTION: ${jobDescription}
      
      RESUME CONTENT:
      ${resumeText.substring(0, 10000)} // Limita tamanho para evitar erro de token
    `

    // 5. Chama a IA (Modo Simples)
    const aiResult = await generateAnalysis(systemPrompt, userPrompt)

    // 6. Salva e Responde
    return NextResponse.json({ 
      status: 'completed',
      result: aiResult
    })

  } catch (error: any) {
    console.error('Server Error:', error)
    // Devolve o erro real para o Frontend mostrar
    return NextResponse.json({ 
      error: error.message || 'Internal Server Error' 
    }, { status: 500 })
  }
}