import { Suspense } from 'react'
import { Header } from '@/components/header'
import { HeroSection } from '@/components/hero-section'
import { FeaturesSection } from '@/components/features-section'
import { PricingSection } from '@/components/pricing-section'
import { SiteFooter } from '@/components/site-footer' // Usando o novo rodapé legal

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <Suspense fallback={<div className="p-10 text-center">Loading BuzAI...</div>}>
        <HeroSection />
        <FeaturesSection />
        <PricingSection />
      </Suspense>
      <SiteFooter />
    </main>
  )
}