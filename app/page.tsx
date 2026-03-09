import { Suspense } from 'react'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { HeroSection } from '@/components/hero-section'
import { DisclaimerSection } from '@/components/disclaimer-section'
// Se você ainda não restaurou o Features e Pricing, comente as duas linhas abaixo para não dar erro
import { FeaturesSection } from '@/components/features-section'
import { PricingSection } from '@/components/pricing-section'
import { Header } from '@/components/header'
import { SiteFooter } from '@/components/site-footer' // <--- CORRIGIDO: Nome exato

export default function HomePage() {
  const host = headers().get('host')?.toLowerCase() || ''
  if (host.startsWith('roast.perfectpaircareers.com')) {
    redirect('/resume-roast')
  }

  return (
    <main className="min-h-screen">
      <Header />
      <Suspense fallback={<div>Loading...</div>}>
        <HeroSection />
        <DisclaimerSection />
        {/* Se der erro de "Module not found", comente estas duas linhas: */}
        <FeaturesSection />
        <PricingSection />
      </Suspense>
      <SiteFooter /> {/* <--- CORRIGIDO: Nome exato */}
    </main>
  )
}
