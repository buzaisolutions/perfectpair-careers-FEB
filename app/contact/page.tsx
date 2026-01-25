import { Header } from "@/components/header"
import { SiteFooter } from "@/components/site-footer"

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container max-w-3xl py-12 flex-1">
        <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
        <p className="text-muted-foreground mb-4">
          We are here to help you with your career journey. If you have any questions, support requests, or feedback, please reach out.
        </p>
        <div className="bg-slate-50 p-6 rounded-lg border mt-8">
          <h2 className="font-semibold text-lg mb-2">Support Email</h2>
          <p className="text-indigo-600 font-medium">support@perfectpaircareers.com</p>
          <p className="text-sm text-slate-500 mt-2">We typically reply within 24 hours.</p>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}