import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma' // Ou '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { profile: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      ...user.profile 
    })

  } catch (error) {
    console.error('Profile fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
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
      firstName,
      lastName,
      linkedinUrl,
      coverLetter,
      phoneNumber,
      address,
      city,
      country,
      professionalTitle,
      summary
    } = data

    // CORREÇÃO: Removemos a linha "name: ..." pois esse campo não existe no seu Schema Prisma.
    // Atualizamos apenas firstName e lastName.
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        firstName,
        lastName,
      }
    })

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

    return NextResponse.json({ success: true, profile })
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}