import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma' // ou '@/lib/db' verifique qual você usa
import { DashboardContent } from './_components/dashboard-content'

export const dynamic = 'force-dynamic' // Garante que a página nunca faça cache velho

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/auth/signin?callbackUrl=/dashboard')
  }

  // A MÁGICA: Buscamos os dados frescos direto do banco
  const user = await prisma.user.findUnique({
    where: { id: session.user.id }
  })

  // Se o usuário não existir no banco (impossível se logado), usamos a sessão como fallback
  return <DashboardContent user={user || session.user} />
}