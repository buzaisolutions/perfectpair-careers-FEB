import { Header } from "@/components/header"
import { SiteFooter } from "@/components/site-footer"
import { DisclaimerSection } from "@/components/disclaimer-section"

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      {/* Aqui a main não tem padding nem container, para deixar o componente controlar o design */}
      <main className="flex-1">
        <DisclaimerSection />
      </main>

      <SiteFooter />
    </div>
  )
}