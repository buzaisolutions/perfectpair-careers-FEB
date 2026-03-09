import { NextRequest, NextResponse } from 'next/server'
import { createHash } from 'crypto'
import { prisma } from '@/lib/db'
import { signRoastAccessToken } from '@/lib/roast-access'

export const dynamic = 'force-dynamic'

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const email = normalizeEmail(String(body?.email || ''))
    const token = String(body?.token || '')
    const name = String(body?.name || '').trim() || 'User'

    if (!email || !token) {
      return NextResponse.json({ error: 'Missing token or email.' }, { status: 400 })
    }

    const identifier = `roast:${email}`
    const tokenHash = createHash('sha256').update(token).digest('hex')

    const record = await prisma.verificationToken.findFirst({
      where: {
        identifier,
        token: tokenHash,
      },
    })

    if (!record || record.expires < new Date()) {
      return NextResponse.json({ error: 'Invalid or expired verification link.' }, { status: 400 })
    }

    await prisma.verificationToken.deleteMany({
      where: { identifier },
    })

    const accessToken = signRoastAccessToken({
      scope: 'resume_roast',
      email,
      name,
    })

    const response = NextResponse.json({
      message: 'Email verified. Access granted.',
      accessGranted: true,
    })

    response.cookies.set('roast_access', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24,
    })

    return response
  } catch (error: any) {
    console.error('Roast verify-link error:', error)
    return NextResponse.json(
      { error: error?.message || 'Could not verify access link.' },
      { status: 500 }
    )
  }
}

