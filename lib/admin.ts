import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const DEFAULT_ADMIN_EMAILS = ['rcarlos75@me.com', 'rcarlos75@icloud.com']

export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false
  const normalizedEmail = email.toLowerCase().trim()
  const envEmails = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((item) => item.toLowerCase().trim())
    .filter(Boolean)
  const adminEmails = envEmails.length > 0 ? envEmails : DEFAULT_ADMIN_EMAILS
  return adminEmails.includes(normalizedEmail)
}

export async function getAdminSession() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email || !isAdminEmail(session.user.email)) return null
  return session
}
