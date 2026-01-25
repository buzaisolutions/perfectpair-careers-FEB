import { Header } from "@/components/header"
import { SiteFooter } from "@/components/site-footer"
import { DisclaimerSection } from "@/components/disclaimer-section"

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container max-w-4xl py-12">
           <h1 className="text-3xl font-bold mb-8">Service Disclaimer</h1>
           {/* Reutilizando o componente bonito que já temos */}
           <DisclaimerSection />
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}