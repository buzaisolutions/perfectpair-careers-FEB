import { Header } from '@/components/header'
import OptimizeClient from './optimize-client.tsx'

export const dynamic = 'force-dynamic' // Garante que a página sempre carregue dados frescos

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