import { NextRequest, NextResponse } from 'next/server'
import { randomBytes, createHash } from 'crypto'
import { prisma } from '@/lib/db'
import { getSettingOrEnv } from '@/lib/runtime-settings'

export const dynamic = 'force-dynamic'

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

async function sendVerificationEmail(to: string, name: string, verificationUrl: string) {
  const resendApiKey = await getSettingOrEnv('RESEND_API_KEY', process.env.RESEND_API_KEY || '')
  const fromEmail =
    (await getSettingOrEnv('ROAST_FROM_EMAIL', process.env.ROAST_FROM_EMAIL || '')) ||
    'Perfect Pair Careers <no-reply@perfectpaircareers.com>'

  if (!resendApiKey) {
    throw new Error('RESEND_API_KEY is not configured.')
  }

  const html = `
  <div style="font-family:Arial,sans-serif;line-height:1.5;color:#111">
    <h2>Confirm your access to AI Resume Roast</h2>
    <p>Hello ${name},</p>
    <p>Click the button below to confirm your email and start using AI Resume Roast.</p>
    <p style="margin:24px 0;">
      <a href="${verificationUrl}" style="background:#ea580c;color:#fff;padding:12px 18px;border-radius:8px;text-decoration:none;font-weight:600;">
        Confirm & Open Roast
      </a>
    </p>
    <p>This link expires in 20 minutes.</p>
    <p>If you did not request this, you can ignore this email.</p>
  </div>`

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [to],
      subject: 'Confirm your AI Resume Roast access',
      html,
    }),
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(`Failed to send email: ${message}`)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const name = String(body?.name || '').trim()
    const email = normalizeEmail(String(body?.email || ''))

    if (!name || name.length < 2) {
      return NextResponse.json({ error: 'Please enter your full name.' }, { status: 400 })
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Please enter a valid email.' }, { status: 400 })
    }

    const rawToken = randomBytes(32).toString('hex')
    const tokenHash = createHash('sha256').update(rawToken).digest('hex')
    const identifier = `roast:${email}`
    const expires = new Date(Date.now() + 20 * 60 * 1000)

    await prisma.verificationToken.deleteMany({ where: { identifier } })
    await prisma.verificationToken.create({
      data: {
        identifier,
        token: tokenHash,
        expires,
      },
    })

    const appUrl =
      process.env.NEXTAUTH_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      'https://www.perfectpaircareers.com'
    const url = new URL('/resume-roast', appUrl)
    url.searchParams.set('email', email)
    url.searchParams.set('name', name)
    url.searchParams.set('token', rawToken)

    await sendVerificationEmail(email, name, url.toString())

    return NextResponse.json({
      message: 'Verification link sent. Please check your inbox.',
    })
  } catch (error: any) {
    console.error('Roast request-link error:', error)
    return NextResponse.json(
      { error: error?.message || 'Could not send verification link.' },
      { status: 500 }
    )
  }
}

