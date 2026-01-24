import { Header } from '@/components/header'
import OptimizeClient from './optimize-client' // Import corrigido (sem .tsx)

export const dynamic = 'force-dynamic'

export default function OptimizePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <OptimizeClient />
      </div>
    </div>
  )
}