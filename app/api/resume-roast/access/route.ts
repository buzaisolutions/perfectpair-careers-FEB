import { NextRequest, NextResponse } from 'next/server'
import { verifyRoastAccessToken } from '@/lib/roast-access'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const cookie = request.cookies.get('roast_access')?.value
  const payload = verifyRoastAccessToken(cookie)

  if (!payload) {
    return NextResponse.json({ accessGranted: false }, { status: 401 })
  }

  return NextResponse.json({
    accessGranted: true,
    user: {
      email: payload.email,
      name: payload.name,
    },
  })
}

