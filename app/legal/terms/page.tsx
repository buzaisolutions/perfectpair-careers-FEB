import { Header } from "@/components/header"
import { SiteFooter } from "@/components/site-footer"

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container max-w-4xl py-12 flex-1 prose dark:prose-invert">
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
        <p>Last updated: January 2026</p>
        <p className="mt-4">By accessing and using Perfect Pair Careers, you agree to be bound by the following terms...</p>
        <h3 className="text-xl font-bold mt-6 mb-2">1. Usage</h3>
        <p>Our service provides AI-based resume optimization. You agree to use this service for lawful purposes only and truthful representation of your skills.</p>
        <h3 className="text-xl font-bold mt-6 mb-2">2. Subscriptions</h3>
        <p>Paid subscriptions are billed monthly. You may cancel at any time.</p>
        {/* Adicione mais texto conforme necessário */}
      </main>
      <SiteFooter />
    </div>
  )
}