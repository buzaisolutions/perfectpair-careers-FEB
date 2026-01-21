
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { deleteFile } from '@/lib/s3'

export const dynamic = 'force-dynamic'

interface RouteContext {
  params: { id: string }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
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

    // Deletar do S3
    try {
      await deleteFile(document.cloudStoragePath)
    } catch (s3Error) {
      console.error('S3 delete error:', s3Error)
      // Continue even if cannot delete from S3
    }

    // Deletar do banco
    await prisma.document.delete({
      where: { id: id }
    })

    return NextResponse.json({ message: 'Document deleted successfully' })
  } catch (error) {
    console.error('Delete document error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
