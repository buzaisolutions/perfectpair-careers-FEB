
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { downloadFile } from '@/lib/s3'

export const dynamic = 'force-dynamic'

interface RouteContext {
  params: { id: string }
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = context.params

    // Fetch the document
    const document = await prisma.document.findFirst({
      where: {
        id: id,
        userId: session.user.id
      }
    })

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    // Gerar URL assinada
    const signedUrl = await downloadFile(document.cloudStoragePath)

    // Redirecionar para a URL do S3
    return NextResponse.redirect(signedUrl)
  } catch (error) {
    console.error('Download document error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
