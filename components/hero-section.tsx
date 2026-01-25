import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, FileText, Sparkles, Globe } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative pt-20 pb-32 bg-gradient-to-b from-purple-50/50 to-white">
      <div className="container flex flex-col items-center text-center space-y-10">
        
        {/* Badge Superior */}
        <div className="inline-flex items-center rounded-full border border-purple-100 bg-white px-4 py-1.5 text-sm font-medium text-slate-600 shadow-sm mb-4">
          <Sparkles className="mr-2 h-4 w-4 text-purple-600" />
          AI-powered document formatting for ATS compatibility
        </div>
        
        {/* Título Principal (Estilo Idêntico ao Original) */}
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl text-slate-900 max-w-5xl mx-auto leading-[1.1]">
          Optimize your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">resume</span> <br className="hidden md:block" />
          with AI
        </h1>
        
        {/* Subtítulo */}
        <p className="max-w-2xl mx-auto text-lg text-slate-500 md:text-xl leading-relaxed">
          Improve your resume's technical compatibility with ATS systems using ethical AI that works with your real qualifications.
        </p>
        
        {/* Botões de Ação */}
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center pt-4">
          <Link href="/dashboard">
            <Button size="lg" className="h-14 px-8 text-base bg-slate-900 hover:bg-slate-800 text-white rounded-lg gap-2 shadow-xl shadow-purple-900/5">
              Get Started Free <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" size="lg" className="h-14 px-8 text-base border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-lg bg-white shadow-sm">
              I already have an account
            </Button>
          </Link>
        </div>

        {/* Três Ícones de Features (Abaixo dos botões, como no original) */}
        <div className="grid md:grid-cols-3 gap-12 pt-20 max-w-5xl mx-auto w-full">
            {/* Feature 1 */}
            <div className="flex flex-col items-center space-y-3">
                <div className="h-12 w-12 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600">
                    <FileText className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-lg text-slate-900">ATS Compliant</h3>
                <p className="text-sm text-slate-500 max-w-xs">Optimization for applicant tracking systems.</p>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col items-center space-y-3">
                <div className="h-12 w-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
                    <Sparkles className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-lg text-slate-900">Advanced AI</h3>
                <p className="text-sm text-slate-500 max-w-xs">Intelligent job analysis and personalized optimization.</p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-center space-y-3">
                <div className="h-12 w-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600">
                    <Globe className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-lg text-slate-900">Ethical AI</h3>
                <p className="text-sm text-slate-500 max-w-xs">Based on your actual qualifications and experience.</p>
            </div>
        </div>

      </div>
    </section>
  )
}