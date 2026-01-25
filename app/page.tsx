
import { Suspense } from 'react'
import { HeroSection } from '@/components/hero-section'
import { DisclaimerSection } from '@/components/disclaimer-section'
import { FeaturesSection } from '@/components/features-section'
import { PricingSection } from '@/components/pricing-section'
import { Header } from '@/components/header'
import { Footer } from '@/components/site-footer'

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Header />
      <Suspense fallback={<div>Loading...</div>}>
        <HeroSection />
        <DisclaimerSection />
        <FeaturesSection />
        <PricingSection />
      </Suspense>
      <Footer />
    </main>
  )
}
