import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-16 md:pt-24 lg:pt-32 pb-12">
      {/* Fundo colorido/gradiente */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-200/30 via-background to-background dark:from-indigo-900/20" />
      
      <div className="container flex flex-col items-center text-center gap-8">
        <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium bg-secondary text-secondary-foreground shadow-sm">
          <Sparkles className="mr-2 h-4 w-4 text-indigo-500" />
          Powered by Gemini 1.5 Flash
        </div>
        
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl max-w-4xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
          Craft the Perfect Resume with AI Precision
        </h1>
        
        <p className="max-w-[700px] text-lg text-muted-foreground leading-relaxed">
          Stop guessing keywords. Our AI analyzes job descriptions and tailors your resume instantly to pass ATS filters and land more interviews.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-4">
          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button size="lg" className="w-full h-12 px-8 text-lg gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20">
              Optimize Now <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
          <Link href="#how-it-works" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full h-12 px-8 text-lg">
              How it works
            </Button>
          </Link>
        </div>
        
        {/* Imagem ou Mockup decorativo */}
        <div className="mt-12 w-full max-w-5xl rounded-xl border bg-background/50 p-2 shadow-2xl backdrop-blur-sm lg:mt-20">
           <div className="rounded-lg border bg-card p-4 md:p-8 grid md:grid-cols-2 gap-8 text-left">
              <div className="space-y-4">
                <div className="h-4 w-1/3 bg-muted rounded animate-pulse" />
                <div className="h-4 w-2/3 bg-muted rounded animate-pulse" />
                <div className="space-y-2 mt-8">
                   <div className="h-3 w-full bg-muted/50 rounded" />
                   <div className="h-3 w-full bg-muted/50 rounded" />
                   <div className="h-3 w-4/5 bg-muted/50 rounded" />
                </div>
              </div>
              <div className="flex items-center justify-center border-l border-dashed pl-8">
                 <div className="text-center space-y-2">
                    <div className="text-4xl font-bold text-green-500">98%</div>
                    <div className="text-sm text-muted-foreground">ATS Score</div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </section>
  )
}