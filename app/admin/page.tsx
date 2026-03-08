import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { isAdminEmail } from '@/lib/admin'
import { AdminContent } from './_components/admin-content'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email || !isAdminEmail(session.user.email)) {
    redirect('/dashboard')
  }

  return <AdminContent />
}
