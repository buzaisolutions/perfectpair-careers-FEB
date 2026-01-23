import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth' // Certifique-se que este arquivo existe, ou ajuste o import
import { prisma } from '@/lib/prisma' // Ajustado para usar o arquivo que criamos

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const profile = await prisma.userProfile.findUnique({
      where: { userId: session.user.id }
    })

    return NextResponse.json({ profile })
  } catch (error) {
    console.error('Profile fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    const {
      linkedinUrl,
      coverLetter,
      phoneNumber,
      address,
      city,
      country,
      professionalTitle,
      summary
    } = data

    const profile = await prisma.userProfile.upsert({
      where: { userId: session.user.id },
      update: {
        linkedinUrl,
        coverLetter,
        phoneNumber,
        address,
        city,
        country,
        professionalTitle,
        summary,
        updatedAt: new Date()
      },
      create: {
        userId: session.user.id,
        linkedinUrl,
        coverLetter,
        phoneNumber,
        address,
        city,
        country,
        professionalTitle,
        summary
      }
    })

    return NextResponse.json({ profile })
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}