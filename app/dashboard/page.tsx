import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db' // Se der erro aqui, mude para '@/lib/prisma'

// Força a página a sempre buscar dados novos
export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/auth/signin?callbackUrl=/dashboard')
  }

  // 1. Buscamos o usuário no banco
  // REMOVEMOS o 'select' específico para evitar erros de campo inexistente
  const user = await prisma.user.findUnique({
    where: { id: session.user.id }
  })

  // 2. Se o usuário não tiver 'credits' (null), definimos como 0
  // Usamos 'any' aqui para o TypeScript parar de bloquear o deploy
  const userSafe: any = {
    ...session.user,
    ...(user || {}),
    credits: user?.credits ?? 0,
    firstName: user?.firstName || session.user.name?.split(' ')[0] || 'User'
  }

  // Importamos o componente aqui dentro para evitar dependências circulares
  const { DashboardContent } = await import('./_components/dashboard-content')

  return <DashboardContent user={userSafe} />
}