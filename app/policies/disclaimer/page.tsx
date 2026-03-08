import { Header } from "@/components/header"
import { SiteFooter } from "@/components/site-footer"
import { DisclaimerSection } from "@/components/disclaimer-section"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto max-w-6xl px-4 pt-6">
          <Link href="/dashboard" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>
        <DisclaimerSection />
      </main>
      <SiteFooter />
    </div>
  )
}
