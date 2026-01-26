import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db' // Verifique se usa 'lib/db' ou 'lib/prisma'
import { downloadFile } from '@/lib/s3'
import mammoth from 'mammoth'
import { generateContentStream, extractPDFText } from '@/lib/gemini'

export const dynamic = 'force-dynamic'

// ============================================
// HELPER: CALCULATE ATS SCORE
// ============================================
function calculateObjectiveATSScore(optimizedContent: string, keywordMatches: string[]): number {
  let score = 0
  const contentUpper = optimizedContent.toUpperCase()
  
  const standardHeaders = ['PROFESSIONAL EXPERIENCE', 'EDUCATION', 'TECHNICAL SKILLS', 'CERTIFICATIONS', 'PROJECTS']
  standardHeaders.forEach(header => { if (contentUpper.includes(header)) score += 5 })
  
  const actionVerbs = ['DEVELOPED', 'IMPLEMENTED', 'MANAGED', 'LED', 'OPTIMIZED', 'DESIGNED', 'CREATED', 'BUILT', 'ARCHITECTED', 'ENGINEERED', 'SPEARHEADED']
  let verbsFound = 0
  actionVerbs.forEach(verb => { if (contentUpper.includes(verb) && verbsFound < 5) { score += 3; verbsFound++ } })
  
  score += Math.min(keywordMatches.length * 5, 25)
  
  const quantPatterns = /\d+%|\d+\s+projects?|\d+\s+users?|\d+\s+years?|\d+\s+months?|\d+\+/gi
  const quantMatches = optimizedContent.match(quantPatterns) || []
  score += Math.min(quantMatches.length * 3, 15)
  
  const datePatterns = /\d{2}\/\d{4}|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}/gi
  const dateMatches = optimizedContent.match(datePatterns) || []
  if (dateMatches.length >= 2) score += 10
  
  const subjectiveWords = /PASSIONATE|EXCELLENT|MOTIVATED|DEDICATED|EXCITED|AMAZING|OUTSTANDING|EXCEPTIONAL/gi
  const subjectiveMatches = optimizedContent.match(subjectiveWords) || []
  score -= Math.min(subjectiveMatches.length * 2, 10)
  
  return Math.max(0, Math.min(100, score))
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const {
      documentId,
      jobTitle,
      jobCompany,
      jobLocation,
      jobUrl,
      jobDescription,
      optimizationType,
      customCoverLetter
    } = await request.json()

    if (!jobTitle || !jobDescription) return NextResponse.json({ error: 'Job title and description required' }, { status: 400 })
    
    const sanitizedJobTitle = jobTitle.trim()
    const sanitizedJobDesc = jobDescription.trim().replace(/\s+/g, ' ')
    
    if (sanitizedJobTitle.length === 0) return NextResponse.json({ error: 'Job title empty' }, { status: 400 })
    if (sanitizedJobDesc.length < 50) return NextResponse.json({ error: 'Job description too short' }, { status: 400 })

    // Validação de Créditos no Banco (ESSENCIAL PARA FUNCIONAR)
    const requiredCredits = optimizationType === 'RESUME_AND_COVER_LETTER' ? 2 : 1
    
    // Busca dados ATUAIS para garantir que créditos comprados sejam vistos
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { subscription: true, profile: true }
    })

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const hasUnlimitedAccess = user.subscription?.status === 'ACTIVE'
    if (!hasUnlimitedAccess && user.credits < requiredCredits) {
      return NextResponse.json({ error: `Insufficient credits. Need ${requiredCredits}.` }, { status: 402 })
    }

    let documentText = ''
    if (documentId && optimizationType !== 'COVER_LETTER_ONLY') {
      const document = await prisma.document.findFirst({ where: { id: documentId, userId: session.user.id } })
      if (!document) return NextResponse.json({ error: 'Document not found' }, { status: 404 })

      try {
        const signedUrl = await downloadFile(document.cloudStoragePath)
        const docResponse = await fetch(signedUrl)
        const docBuffer = await docResponse.arrayBuffer()

        if (document.fileType === 'DOCX') {
          const result = await mammoth.extractRawText({ buffer: Buffer.from(docBuffer) })
          documentText = result.value
        } else if (document.fileType === 'PDF') {
          documentText = await extractPDFText(Buffer.from(docBuffer), document.originalFileName)
        }
      } catch (error) {
        console.error('Error processing document:', error)
        return NextResponse.json({ error: 'Error processing document file' }, { status: 500 })
      }
    }

    const jobPosting = await prisma.jobPosting.create({
      data: {
        title: sanitizedJobTitle,
        company: jobCompany || '',
        location: jobLocation || '',
        description: sanitizedJobDesc,
        jobUrl
      }
    })

    const optimization = await prisma.optimization.create({
      data: {
        userId: session.user.id,
        documentId: documentId || null,
        jobPostingId: jobPosting.id,
        optimizationType,
        targetLanguage: 'ENGLISH',
        originalContent: documentText,
        optimizedContent: '',
        status: 'PROCESSING'
      }
    })

    // Proteção contra nomes nulos
    const safeFirstName = user.firstName || ''
    const safeLastName = user.lastName || ''
    const currentDate = new Date().toISOString().split('T')[0]
    const candidateName = `${safeFirstName} ${safeLastName}`.replace(/[^a-zA-Z ]/g, "").trim().replace(/\s+/g, "_")
    const cleanJobTitle = sanitizedJobTitle.replace(/[^a-zA-Z0-9 ]/g, "").trim().replace(/\s+/g, "_").substring(0, 30)

    const systemPromptCommon = `
    You are a Forensic ATS Auditor and Career Strategist.
    
    *** 🛡️ INTEGRITY PROTOCOL (HIGHEST PRIORITY) ***
    1. NO FABRICATION: You are strictly FORBIDDEN from adding skills, tools, software, or experiences that are not explicitly present in the Candidate's original resume.
    2. EVIDENCE-BASED OPTIMIZATION ONLY: You may only rephrase *existing* content to match the Job Description keywords.
    3. MISSING KEYWORDS HANDLING: If a critical keyword is missing from the resume, DO NOT force it into the text. Instead, add it to the 'keywordAnalysis.criticalMissing' list in the JSON response.
    
    *** LANGUAGE & OUTPUT ***
    - ALL OUTPUT MUST BE IN ENGLISH.
    - Translate any source text to Professional English.

    *** FILENAME GENERATION ***
    - Generate a 'suggestedFileName' string: "${candidateName}_${cleanJobTitle}_${currentDate}"
    `

    let systemPrompt = ''
    let userPrompt = ''

    if (optimizationType === 'RESUME_ONLY') {
      systemPrompt = `${systemPromptCommon}
      TASK: Optimize Resume strictly following the Integrity Protocol.
      RESPONSE FORMAT (JSON ONLY):
      {
        "optimizedContent": "English resume text...",
        "suggestedFileName": "Name_Job_Date",
        "feedback": "Analysis...",
        "atsScore": 0,
        "keywordMatches": ["matched_kw1"],
        "keywordAnalysis": { "criticalMatched": [], "criticalMissing": [], "importantMatched": [], "contextualAdded": [] },
        "improvementSuggestions": ["suggestion1"],
        "skillsToVerify": ["missing_skill1"]
      }`
      userPrompt = `JOB: ${sanitizedJobTitle}\nDESC: ${sanitizedJobDesc}\nRESUME: ${documentText}`

    } else if (optimizationType === 'COVER_LETTER_ONLY') {
       const baseInfo = customCoverLetter || user.profile?.coverLetter || ''
       systemPrompt = `${systemPromptCommon}
       TASK: Write Cover Letter based ONLY on real experience.
       RESPONSE FORMAT (JSON ONLY):
       {
         "optimizedContent": "English cover letter...",
         "suggestedFileName": "Name_Job_CL_Date",
         "feedback": "Analysis...",
         "atsScore": 0,
         "keywordMatches": [],
         "keywordAnalysis": {},
         "improvementSuggestions": [],
         "skillsToVerify": []
       }`
       userPrompt = `JOB: ${sanitizedJobTitle}\nDESC: ${sanitizedJobDesc}\nPROFILE: ${candidateName}\nINFO: ${baseInfo}`

    } else {
      const baseInfo = customCoverLetter || user.profile?.coverLetter || ''
      systemPrompt = `${systemPromptCommon}
      TASK: Resume + Cover Letter (Strict Integrity).
      RESPONSE FORMAT (JSON ONLY):
      {
        "optimizedContent": "=== OPTIMIZED RESUME ===\\n...\\n=== COVER LETTER ===\\n...",
        "suggestedFileName": "Name_Job_Full_Date",
        "feedback": "Analysis...",
        "atsScore": 0,
        "keywordMatches": [],
        "keywordAnalysis": {},
        "improvementSuggestions": [],
        "skillsToVerify": []
      }`
      userPrompt = `JOB: ${sanitizedJobTitle}\nDESC: ${sanitizedJobDesc}\nRESUME: ${documentText}\nINFO: ${baseInfo}`
    }

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder()
        let buffer = ''

        try {
          for await (const chunk of generateContentStream(systemPrompt, userPrompt)) {
            buffer += chunk
          }

          try {
            let cleanJson = buffer.replace(/```json/g, '').replace(/```/g, '').trim()
            const firstBrace = cleanJson.indexOf('{')
            const lastBrace = cleanJson.lastIndexOf('}')

            if (firstBrace !== -1 && lastBrace !== -1) {
              cleanJson = cleanJson.substring(firstBrace, lastBrace + 1)
            } else {
              throw new Error('No JSON found in AI response')
            }

            const finalResult = JSON.parse(cleanJson)
            
            if (!finalResult.optimizedContent) throw new Error('Empty optimizedContent')

            const sanitizeArray = (arr: any) => Array.isArray(arr) ? arr : []
            finalResult.keywordMatches = sanitizeArray(finalResult.keywordMatches)
            finalResult.improvementSuggestions = sanitizeArray(finalResult.improvementSuggestions)
            finalResult.skillsToVerify = sanitizeArray(finalResult.skillsToVerify)
            
            if (!finalResult.keywordAnalysis) {
               finalResult.keywordAnalysis = { criticalMatched: [], criticalMissing: [], importantMatched: [], contextualAdded: [] }
            }

            if (!finalResult.suggestedFileName) {
               finalResult.suggestedFileName = `${candidateName}_${cleanJobTitle}_${currentDate}`
            }

            finalResult.atsScore = calculateObjectiveATSScore(finalResult.optimizedContent, finalResult.keywordMatches)
            
            const updatedOptimization = await prisma.optimization.update({
              where: { id: optimization.id },
              data: {
                optimizedContent: finalResult.optimizedContent.trim(),
                feedback: finalResult.feedback || '',
                atsScore: finalResult.atsScore,
                status: 'COMPLETED'
              }
            })

            if (!hasUnlimitedAccess) {
              await prisma.user.update({
                where: { id: session.user.id },
                data: { credits: { decrement: requiredCredits } }
              })
            }

            const finalData = JSON.stringify({
              status: 'completed',
              result: {
                id: updatedOptimization.id,
                status: 'COMPLETED',
                suggestedFileName: finalResult.suggestedFileName,
                ...finalResult 
              }
            })
            controller.enqueue(encoder.encode(`data: ${finalData}\n\n`))

          } catch (parseError: any) {
            console.error('❌ JSON Parse Error:', parseError)
            
            await prisma.optimization.update({
              where: { id: optimization.id },
              data: { status: 'FAILED', feedback: `Error processing AI response: ${parseError.message}` }
            })
            
            const errorData = JSON.stringify({
              status: 'error',
              message: 'Optimization failed.',
              details: parseError.message
            })
            controller.enqueue(encoder.encode(`data: ${errorData}\n\n`))
          }
        } catch (error) {
          console.error('Stream error:', error)
          await prisma.optimization.update({ where: { id: optimization.id }, data: { status: 'FAILED' } })
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ status: 'error' })}\n\n`))
        } finally {
          controller.close()
        }
      },
    })

    return new Response(stream, { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-cache' } })

  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}