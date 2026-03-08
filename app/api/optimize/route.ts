import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { downloadFile } from '@/lib/s3'
import { GoogleGenerativeAI } from '@google/generative-ai'
import mammoth from 'mammoth'

export const dynamic = 'force-dynamic'

function cleanMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/#{1,6}\s+/g, '')
    .replace(/`{1,3}(.+?)`{1,3}/g, '$1')
    .replace(/^\s*[-•]\s+/gm, '• ')
    .trim()
}

function send(controller: ReadableStreamDefaultController, data: object) {
  controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify(data)}\n\n`))
}

function calculateATSScore(content: string): number {
  let score = 0
  const upper = content.toUpperCase()
  const headers = ['EXPERIENCE', 'EDUCATION', 'SKILLS', 'CERTIFICATIONS', 'PROJECTS']
  headers.forEach(h => {
    if (upper.includes(h)) score += 5
  })

  const verbs = ['DEVELOPED', 'IMPLEMENTED', 'MANAGED', 'LED', 'OPTIMIZED', 'DESIGNED', 'CREATED', 'BUILT', 'ARCHITECTED', 'SPEARHEADED']
  let found = 0
  verbs.forEach(v => {
    if (upper.includes(v) && found < 5) {
      score += 3
      found++
    }
  })

  const quant = content.match(/\d+%|\d+\s+projects?|\d+\s+users?|\d+\+/gi) || []
  score += Math.min(quant.length * 3, 15)

  const dates = content.match(/\d{2}\/\d{4}|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}/gi) || []
  if (dates.length >= 2) score += 10

  return Math.max(0, Math.min(100, score))
}

function improveScoreIfNeeded(content: string, targetScore: number, originalContent: string): string {
  let improved = content
  const currentScore = calculateATSScore(improved)

  if (currentScore < targetScore) {
    const originalUpper = originalContent.toUpperCase()
    const improvedUpper = improved.toUpperCase()

    const headers = ['EXPERIENCE', 'EDUCATION', 'SKILLS', 'CERTIFICATIONS', 'PROJECTS']
    headers.forEach(h => {
      if (originalUpper.includes(h) && !improvedUpper.includes(h)) {
        const titleHeader = h
          .split(' ')
          .map(w => w.charAt(0) + w.slice(1).toLowerCase())
          .join(' ')
        improved = improved.replace(new RegExp(titleHeader, 'gi'), h)
      }
    })

    const quantPattern = /\d+%|\d+\s+projects?|\d+\s+users?|\d+\+/gi
    const originalQuants = originalContent.match(quantPattern) || []
    const improvedQuants = improved.match(quantPattern) || []

    if (originalQuants.length > improvedQuants.length) {
      const missingQuants = originalQuants.filter(q => !improved.includes(q))
      if (missingQuants.length > 0) {
        improved = improved.replace(
          /(• [^\n]*(?:developed|implemented|managed|led|optimized|designed|created|built|architected|spearheaded)[^\n]*)/gi,
          match => {
            if (missingQuants.length > 0 && !match.match(/\d+%|\d+\s+projects?|\d+\s+users?/)) {
              return match + ` (${missingQuants.pop()})`
            }
            return match
          }
        )
      }
    }

    const datePattern = /\d{2}\/\d{4}|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}/gi
    const originalDates = originalContent.match(datePattern) || []
    const improvedDates = improved.match(datePattern) || []

    if (originalDates.length >= 2 && improvedDates.length < 2) {
      improved = improved.replace(/(\d{4}\s*-\s*\d{4}|\d{4}\s+to\s+\d{4})/gi, match => {
        if (originalDates.length > 0) {
          return originalDates.shift() || match
        }
        return match
      })
    }
  }

  return improved
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { documentId, jobTitle, jobDescription, jobCompany, optimizationType = 'RESUME_ONLY' } = body

  if (!documentId || !jobTitle || !jobDescription) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const user = await prisma.user.findUnique({ where: { id: session.user.id } })
        if (!user) {
          send(controller, { status: 'error', message: 'User not found' })
          controller.close()
          return
        }

        const requiredCredits = optimizationType === 'RESUME_AND_COVER_LETTER' ? 2 : 1
        if (user.credits < requiredCredits) {
          send(controller, { status: 'error', message: 'Insufficient credits' })
          controller.close()
          return
        }

        const doc = await prisma.document.findFirst({ where: { id: documentId, userId: session.user.id } })
        if (!doc) {
          send(controller, { status: 'error', message: 'Document not found' })
          controller.close()
          return
        }

        send(controller, { status: 'processing', message: 'Extracting resume text...' })

        let resumeText = doc.extractedText || ''
        if (!resumeText) {
          const signedUrl = await downloadFile(doc.cloudStoragePath)
          const docResponse = await fetch(signedUrl)
          const docBuffer = await docResponse.arrayBuffer()
          if (doc.fileType === 'DOCX') {
            const result = await mammoth.extractRawText({ buffer: Buffer.from(docBuffer) })
            resumeText = result.value
          }
        }

        const initialScore = calculateATSScore(resumeText)
        send(controller, { status: 'initial_score', score: initialScore })
        send(controller, { status: 'processing', message: 'Optimizing with AI...' })

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

        const isCoverLetterOnly = optimizationType === 'COVER_LETTER_ONLY'
        const includeCoverLetter = optimizationType === 'RESUME_AND_COVER_LETTER'

        let prompt = ''
        if (isCoverLetterOnly) {
          prompt = `You are a professional career coach. Write a compelling cover letter for this job application.

JOB TITLE: ${jobTitle}
COMPANY: ${jobCompany || 'the company'}
JOB DESCRIPTION: ${jobDescription.substring(0, 3000)}
RESUME: ${resumeText.substring(0, 5000)}

Write a professional cover letter (3-4 paragraphs). Be specific and compelling. Output plain text only — no markdown, no asterisks, no special characters.`
        } else {
          prompt = `You are an expert ATS resume optimizer. Rewrite the resume to maximize ATS score for the target job.

JOB TITLE: ${jobTitle}
COMPANY: ${jobCompany || 'the company'}
JOB DESCRIPTION: ${jobDescription.substring(0, 3000)}

ORIGINAL RESUME:
${resumeText.substring(0, 8000)}

CRITICAL INSTRUCTIONS FOR ATS OPTIMIZATION:
1. PRESERVE SECTION HEADERS IN ALL CAPS (EXPERIENCE, EDUCATION, SKILLS, CERTIFICATIONS, PROJECTS)
2. ALWAYS include quantifiable metrics (percentages, numbers of projects/users/teams, e.g., "20%", "5 projects", "3 users")
3. PRESERVE DATE FORMATS as MM/YYYY or "Month YYYY" (e.g., "01/2020" or "Jan 2020")
4. USE strong action verbs at the start of bullets: DEVELOPED, IMPLEMENTED, MANAGED, LED, OPTIMIZED, DESIGNED, CREATED, BUILT, ARCHITECTED, SPEARHEADED
5. REWRITE bullet points to match job description keywords naturally
6. Keep all facts accurate - do not invent experience
7. Maintain professional formatting with clear sections
8. Output plain text only — no markdown, no asterisks, no bold markers
9. Use ALL CAPS for section headers (e.g. PROFESSIONAL EXPERIENCE)
10. Use "• " to start bullet points
11. NEVER remove numbers, dates, or metrics from the original resume
12. ENHANCE the resume by adding more quantifiable achievements where possible
${includeCoverLetter ? '\nAlso append a cover letter after the resume, separated by "---COVER LETTER---"' : ''}`
        }

        send(controller, { status: 'processing', message: 'Generating optimized content...' })

        const result = await model.generateContent(prompt)
        const generatedContent = cleanMarkdown(result.response.text())

        let finalContent = generatedContent
        let coverLetterContent: string | null = null

        if (includeCoverLetter && generatedContent.includes('---COVER LETTER---')) {
          const parts = generatedContent.split('---COVER LETTER---')
          finalContent = parts[0].trim()
          coverLetterContent = parts[1]?.trim() || null
        }

        let newScore = initialScore
        if (!isCoverLetterOnly) {
          const improvedContent = improveScoreIfNeeded(finalContent, initialScore, resumeText)
          const improvedScore = calculateATSScore(improvedContent)

          if (improvedScore >= initialScore) {
            finalContent = improvedContent
            newScore = improvedScore
          } else {
            finalContent = resumeText
            newScore = initialScore
          }

          console.log(`Score progression: ${initialScore} -> ${newScore}`)
        }

        send(controller, { status: 'processing', message: 'Saving results...' })

        const jobPosting = await prisma.jobPosting.create({
          data: {
            title: jobTitle,
            company: jobCompany || '',
            description: jobDescription,
          },
        })

        const optimization = await prisma.optimization.create({
          data: {
            userId: session.user.id,
            documentId: doc.id,
            jobPostingId: jobPosting.id,
            optimizationType: optimizationType as any,
            originalContent: resumeText,
            optimizedContent: isCoverLetterOnly ? resumeText : finalContent,
            atsScore: newScore,
            creditsUsed: requiredCredits,
            status: 'COMPLETED',
          },
        })

        await prisma.user.update({
          where: { id: session.user.id },
          data: { credits: { decrement: requiredCredits } },
        })

        const suggestedFileName = `optimized-resume-${jobTitle.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.docx`

        send(controller, {
          status: 'completed',
          result: {
            optimizationId: optimization.id,
            optimizedContent: isCoverLetterOnly ? (coverLetterContent || generatedContent) : finalContent,
            coverLetterContent,
            originalScore: initialScore,
            newScore,
            atsScore: newScore,
            suggestedFileName,
          },
        })
      } catch (error: any) {
        console.error('Optimization error:', error)
        send(controller, { status: 'error', message: error.message || 'Optimization failed' })
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}
