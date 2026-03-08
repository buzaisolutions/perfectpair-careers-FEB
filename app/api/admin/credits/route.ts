import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getAdminSession } from '@/lib/admin'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { email, credits } = await request.json()
  if (!email || !credits || Number(credits) <= 0) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: { credits: { increment: Number(credits) } },
  })

  await prisma.payment.create({
    data: {
      userId: user.id,
      amount: 0,
      paymentType: 'CREDIT_PACK',
      status: 'COMPLETED',
      creditsGranted: Number(credits),
      description: `Admin credit grant: +${Number(credits)} credits`,
    },
  })

  return NextResponse.json({ success: true, credits: updated.credits })
}
