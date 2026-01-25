import { Header } from "@/components/header"
import { SiteFooter } from "@/components/site-footer"
import { DisclaimerSection } from "@/components/disclaimer-section"

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