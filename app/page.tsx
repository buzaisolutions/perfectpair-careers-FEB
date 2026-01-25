import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle2, FileText, Sparkles } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center space-y-10 py-24 px-6 text-center bg-gradient-to-b from-background to-muted/20">
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80">
            Now with Gemini 1.5 Flash 🚀
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Optimize your resume with <span className="text-primary">Artificial Intelligence</span>
          </h1>
          <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
            Pass through ATS filters and land more interviews. BuzAI Solutions analyzes job descriptions and tailors your resume instantly.
          </p>
        </div>
        <div className="flex gap-4">
          <Link href="/dashboard">
            <Button size="lg" className="h-12 px-8 text-lg">
              Optimize Resume <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="/legal/terms">
            <Button variant="outline" size="lg" className="h-12 px-8 text-lg">
              Learn More
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container py-24 space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Why Choose BuzAI?</h2>
          <p className="text-gray-500 dark:text-gray-400">Everything you need to boost your career.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center space-y-4 p-6 border rounded-xl bg-card">
            <div className="p-3 bg-primary/10 rounded-full">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold">AI Precision</h3>
            <p className="text-muted-foreground">Uses Google's advanced Gemini AI to match keywords accurately.</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-4 p-6 border rounded-xl bg-card">
            <div className="p-3 bg-primary/10 rounded-full">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold">ATS Friendly</h3>
            <p className="text-muted-foreground">Guaranteed formatting that recruitment robots can read.</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-4 p-6 border rounded-xl bg-card">
            <div className="p-3 bg-primary/10 rounded-full">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold">PDF Analysis</h3>
            <p className="text-muted-foreground">Upload your current PDF and get instant feedback.</p>
          </div>
        </div>
      </section>
    </div>
  )
}