import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { code } = await request.json()
  if (!code) return NextResponse.json({ error: 'Coupon code is required' }, { status: 400 })

  const upperCode = String(code).trim().toUpperCase()

  const coupon = await prisma.coupon.findUnique({ where: { code: upperCode } })
  if (!coupon || !coupon.isActive) return NextResponse.json({ error: 'Invalid coupon' }, { status: 404 })
  if (coupon.expiresAt && coupon.expiresAt < new Date()) return NextResponse.json({ error: 'Coupon expired' }, { status: 400 })
  if (coupon.maxUses && coupon.usesCount >= coupon.maxUses) return NextResponse.json({ error: 'Coupon usage limit reached' }, { status: 400 })

  const existingUse = await prisma.payment.findFirst({
    where: {
      userId: session.user.id,
      description: { contains: `Coupon redemption: ${upperCode}` },
    },
  })
  if (existingUse) return NextResponse.json({ error: 'Coupon already redeemed by this user' }, { status: 400 })

  const result = await prisma.$transaction(async (tx) => {
    await tx.coupon.update({
      where: { id: coupon.id },
      data: { usesCount: { increment: 1 } },
    })

    const updatedUser = await tx.user.update({
      where: { id: session.user.id },
      data: { credits: { increment: coupon.credits } },
    })

    await tx.payment.create({
      data: {
        userId: session.user.id,
        amount: 0,
        paymentType: 'CREDIT_PACK',
        status: 'COMPLETED',
        creditsGranted: coupon.credits,
        description: `Coupon redemption: ${upperCode}`,
      },
    })

    return updatedUser
  })

  return NextResponse.json({ success: true, credits: result.credits, granted: coupon.credits })
}
