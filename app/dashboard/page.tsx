import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma' // ou '@/lib/db'
import { DashboardContent } from './_components/dashboard-content'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/auth/signin?callbackUrl=/dashboard')
  }

  // Busca dados ATUALIZADOS do banco (com créditos e firstName)
  const user = await prisma.user.findUnique({
    where: { id: session.user.id }
  })

  // Se não achar no banco (raro), usa o da sessão
  return <DashboardContent user={user || session.user} />
}