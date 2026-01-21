
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { BillingContent } from './_components/billing-content'

export const dynamic = 'force-dynamic'

export default async function BillingPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin?callbackUrl=/billing')
  }

  return <BillingContent />
}
