
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { uploadFile } from '@/lib/s3'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    // File type validation
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Unsupported file type. Use PDF or DOCX.' },
        { status: 400 }
      )
    }

    // Size validation (10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File too large. Maximum 10MB.' },
        { status: 400 }
      )
    }

    // Converter para Buffer e fazer upload
    const buffer = Buffer.from(await file.arrayBuffer())
    const cloudStoragePath = await uploadFile(buffer, file.name)

    // Determinar tipo do documento
    const fileType = file.type === 'application/pdf' ? 'PDF' : 'DOCX'

    // Save to database
    const document = await prisma.document.create({
      data: {
        userId: session.user.id,
        fileName: file.name,
        originalFileName: file.name,
        fileType: fileType as any,
        fileSize: file.size,
        cloudStoragePath,
      }
    })

    return NextResponse.json({ 
      message: 'Upload completed successfully',
      document
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
