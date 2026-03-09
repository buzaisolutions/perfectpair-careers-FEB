import jwt from 'jsonwebtoken'

export type RoastAccessPayload = {
  scope: 'resume_roast'
  email: string
  name: string
}

function getRoastSecret(): string {
  const secret = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET
  if (!secret) {
    throw new Error('Missing NEXTAUTH_SECRET for roast access token signing.')
  }
  return secret
}

export function signRoastAccessToken(payload: RoastAccessPayload): string {
  return jwt.sign(payload, getRoastSecret(), { expiresIn: '24h' })
}

export function verifyRoastAccessToken(token?: string): RoastAccessPayload | null {
  if (!token) return null
  try {
    const decoded = jwt.verify(token, getRoastSecret()) as RoastAccessPayload
    if (decoded?.scope !== 'resume_roast' || !decoded?.email) return null
    return decoded
  } catch {
    return null
  }
}

