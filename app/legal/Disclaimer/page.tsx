import { Header } from "@/components/header"
import { SiteFooter } from "@/components/site-footer"
import { DisclaimerSection } from "@/components/disclaimer-section"

// O segredo está aqui: tem que ser "export default"
export default function DisclaimerPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">
        <DisclaimerSection />
      </main>
      <SiteFooter />
    </div>
  )
}