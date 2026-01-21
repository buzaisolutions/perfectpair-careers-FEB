
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { credits } = await request.json()

    if (!credits || credits <= 0) {
      return NextResponse.json({ error: 'Invalid number of credits' }, { status: 400 })
    }

    // Update user credits
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        credits: {
          increment: credits
        }
      }
    })

    // Criar registro de pagamento de teste
    await prisma.payment.create({
      data: {
        userId: session.user.id,
        amount: credits * 999, // €9.99 per credit in cents
        paymentType: credits === 1 ? 'ONE_TIME_RESUME' : 'ONE_TIME_RESUME_COVER',
        creditsGranted: credits,
        status: 'COMPLETED',
        description: `Test credits: ${credits} credit(s)`
      }
    })

    return NextResponse.json({
      message: 'Credits added successfully',
      newCredits: updatedUser.credits
    })
  } catch (error) {
    console.error('Add test credits error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
