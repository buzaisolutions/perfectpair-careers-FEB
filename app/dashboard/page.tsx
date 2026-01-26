import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma' // Se seu arquivo for lib/db, ajuste aqui

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/auth/signin?callbackUrl=/dashboard')
  }

  // CORREÇÃO: Removemos "name: true" porque não existe na tabela User.
  // Buscamos apenas o que existe para evitar o erro de TypeScript.
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      email: true,
      image: true,
      firstName: true,
      lastName: true,
      credits: true, // Vital para os créditos aparecerem
      // name: true <--- REMOVIDO POIS CAUSAVA O ERRO DE BUILD
    }
  })

  // Passamos o user do banco ou o da sessão como fallback
  return <DashboardContent user={user || session.user} />
}

// Importação do componente cliente
import { DashboardContent } from './_components/dashboard-content'