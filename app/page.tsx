import { Suspense } from 'react'
import { Header } from '@/components/header'
import { HeroSection } from '@/components/hero-section'
import { SiteFooter } from '@/components/site-footer'

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Header />
      <Suspense fallback={<div>Loading...</div>}>
        <HeroSection />
        {/* Removi FeaturesSection pois já está incluído no Hero (estilo original) */}
        {/* Removi PricingSection para evitar mostrar preços errados por enquanto */}
      </Suspense>
      <SiteFooter />
    </main>
  )
}