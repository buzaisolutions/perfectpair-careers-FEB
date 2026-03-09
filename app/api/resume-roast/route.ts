import { NextRequest, NextResponse } from 'next/server'
import mammoth from 'mammoth'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { getSettingOrEnv } from '@/lib/runtime-settings'

export const dynamic = 'force-dynamic'

type RoastResult = {
  hireabilityScore: number
  headline: string
  roast: string[]
  quickWins: string[]
  missingKeywords: string[]
  rewrittenSummary: string
}

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)))
}

function extractJsonBlock(text: string): string {
  const cleaned = text.trim()
  if (cleaned.startsWith('{') && cleaned.endsWith('}')) return cleaned
  const fenced = cleaned.match(/```json\s*([\s\S]*?)```/i)
  if (fenced?.[1]) return fenced[1].trim()
  const start = cleaned.indexOf('{')
  const end = cleaned.lastIndexOf('}')
  if (start !== -1 && end !== -1 && end > start) {
    return cleaned.slice(start, end + 1)
  }
  return cleaned
}

function normalizeResult(data: any): RoastResult {
  return {
    hireabilityScore: clampScore(Number(data?.hireabilityScore ?? 0)),
    headline: String(data?.headline || 'Your resume needs stronger impact to stand out.'),
    roast: Array.isArray(data?.roast) ? data.roast.map(String).slice(0, 6) : [],
    quickWins: Array.isArray(data?.quickWins) ? data.quickWins.map(String).slice(0, 6) : [],
    missingKeywords: Array.isArray(data?.missingKeywords) ? data.missingKeywords.map(String).slice(0, 10) : [],
    rewrittenSummary: String(data?.rewrittenSummary || ''),
  }
}

async function extractTextFromFile(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer())

  if (file.type === 'application/pdf') {
    const pdfParse = require('pdf-parse')
    const pdfData = await pdfParse(buffer)
    return pdfData?.text || ''
  }

  if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    const result = await mammoth.extractRawText({ buffer })
    return result?.value || ''
  }

  if (file.type === 'text/plain') {
    return buffer.toString('utf-8')
  }

  throw new Error('Unsupported file type. Use PDF, DOCX or TXT.')
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const resumeTextInput = String(formData.get('resumeText') || '').trim()
    const targetRole = String(formData.get('targetRole') || '').trim()
    const allowFutureStorage = String(formData.get('allowFutureStorage') || 'false') === 'true'

    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
    ]

    if (file && !allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Unsupported file type. Use PDF, DOCX or TXT.' }, { status: 400 })
    }

    if (file && file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Maximum size is 5MB.' }, { status: 400 })
    }

    const fileText = file ? await extractTextFromFile(file) : ''
    const combinedText = (resumeTextInput || fileText).trim()

    if (!combinedText || combinedText.length < 200) {
      return NextResponse.json(
        { error: 'Resume content is too short. Add more details before roasting.' },
        { status: 400 }
      )
    }

    const geminiApiKey = await getSettingOrEnv(
      'GEMINI_API_KEY',
      process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GOOGLE_API_KEY
    )

    if (!geminiApiKey) {
      return NextResponse.json({ error: 'AI API key is not configured.' }, { status: 500 })
    }

    const modelName = (await getSettingOrEnv('AI_MODEL', 'gemini-2.5-flash')) || 'gemini-2.5-flash'
    const genAI = new GoogleGenerativeAI(geminiApiKey)
    const model = genAI.getGenerativeModel({ model: modelName })

    const prompt = `You are an expert recruiter and ATS coach. Roast this resume in a bold, witty, constructive tone.
Never insult protected attributes, health, nationality, religion, or appearance.
Be direct, practical, and actionable.

Return strict JSON only with this exact structure:
{
  "hireabilityScore": number from 0 to 100,
  "headline": "1 short sentence",
  "roast": ["3 to 6 sharp bullets explaining problems"],
  "quickWins": ["3 to 6 immediate fixes"],
  "missingKeywords": ["up to 10 keywords/phrases"],
  "rewrittenSummary": "a stronger 3-4 line professional summary"
}

Target role (optional): ${targetRole || 'Not provided'}

Resume:
${combinedText.slice(0, 12000)}`

    const result = await model.generateContent(prompt)
    const rawText = result.response.text()
    const jsonText = extractJsonBlock(rawText)

    let parsed: RoastResult
    try {
      parsed = normalizeResult(JSON.parse(jsonText))
    } catch {
      parsed = normalizeResult({
        hireabilityScore: 50,
        headline: 'We analyzed your resume, but the structured roast format failed.',
        roast: [rawText.slice(0, 300)],
        quickWins: ['Try again with a cleaner resume text or a PDF/DOCX file.'],
        missingKeywords: [],
        rewrittenSummary: '',
      })
    }

    return NextResponse.json({
      result: parsed,
      storage: {
        allowFutureStorageRequested: allowFutureStorage,
        serverStorageEnabled: false,
        message:
          'Server-side storage for roast history is disabled in this phase and will be enabled only with legal/compliance approval.',
      },
    })
  } catch (error: any) {
    console.error('Resume roast error:', error)
    return NextResponse.json(
      { error: error?.message || 'Could not roast resume right now.' },
      { status: 500 }
    )
  }
}

