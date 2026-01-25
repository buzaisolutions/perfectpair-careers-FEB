import { Header } from "@/components/header"
import { SiteFooter } from "@/components/site-footer"
import { DisclaimerSection } from "@/components/disclaimer-section"

// IMPORTANTE: Tem que ter "export default" para a página carregar
export default function DisclaimerPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      {/* Aqui carregamos o componente visual que você criou */}
      <main className="flex-1">
        <DisclaimerSection />
      </main>

      <SiteFooter />
    </div>
  )
}