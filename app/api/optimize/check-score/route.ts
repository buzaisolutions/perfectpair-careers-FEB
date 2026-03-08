import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { downloadFile } from '@/lib/s3'
import mammoth from 'mammoth'

export const dynamic = 'force-dynamic'

function calculateATSScore(content: string): number {
  let score = 0
  const upper = content.toUpperCase()
  const headers = ['EXPERIENCE', 'EDUCATION', 'SKILLS', 'CERTIFICATIONS', 'PROJECTS']
  headers.forEach(h => { if (upper.includes(h)) score += 5 })
  const verbs = ['DEVELOPED', 'IMPLEMENTED', 'MANAGED', 'LED', 'OPTIMIZED', 'DESIGNED', 'CREATED', 'BUILT', 'ARCHITECTED', 'SPEARHEADED']
  let found = 0
  verbs.forEach(v => { if (upper.includes(v) && found < 5) { score += 3; found++ } })
  const quant = content.match(/\d+%|\d+\s+projects?|\d+\s+users?|\d+\+/gi) || []
  score += Math.min(quant.length * 3, 15)
  const dates = content.match(/\d{2}\/\d{4}|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}/gi) || []
  if (dates.length >= 2) score += 10
  return Math.max(0, Math.min(100, score))
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { documentId } = await request.json()
    if (!documentId) return NextResponse.json({ error: 'Missing documentId' }, { status: 400 })
    const doc = await prisma.document.findFirst({ where: { id: documentId, userId: session.user.id } })
    if (!doc) return NextResponse.json({ error: 'Document not found' }, { status: 404 })
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
    const score = calculateATSScore(resumeText)
    return NextResponse.json({ score })
  } catch (error) {
    console.error('Check score error:', error)
    return NextResponse.json({ error: 'Failed to calculate score' }, { status: 500 })
  }
}
