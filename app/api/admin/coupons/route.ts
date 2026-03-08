import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getAdminSession } from '@/lib/admin'

export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: 'desc' }, take: 100 })
  return NextResponse.json({ coupons })
}

export async function POST(request: NextRequest) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { code, credits, maxUses, expiresAt } = await request.json()
  if (!code || !credits || Number(credits) <= 0) {
    return NextResponse.json({ error: 'Invalid coupon data' }, { status: 400 })
  }

  const coupon = await prisma.coupon.create({
    data: {
      code: String(code).trim().toUpperCase(),
      credits: Number(credits),
      maxUses: maxUses ? Number(maxUses) : null,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      createdBy: session.user.email || null,
    },
  })

  return NextResponse.json({ coupon })
}
