import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getAdminSession } from '@/lib/admin'

export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const items = await prisma.appSetting.findMany({ orderBy: { key: 'asc' } })
  return NextResponse.json({ settings: items })
}

export async function PUT(request: NextRequest) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { key, value } = await request.json()
  if (!key || typeof key !== 'string') {
    return NextResponse.json({ error: 'Invalid key' }, { status: 400 })
  }

  const setting = await prisma.appSetting.upsert({
    where: { key },
    update: { value: String(value ?? '') },
    create: { key, value: String(value ?? '') },
  })

  return NextResponse.json({ setting })
}
