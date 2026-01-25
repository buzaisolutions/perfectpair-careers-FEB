import Image from "next/image"
import { Sparkles, FileText, Globe } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative pt-20 pb-24 bg-gradient-to-b from-purple-50/50 to-white overflow-hidden">
      {/* ADICIONADO: mx-auto e px-4 para centralizar o container na tela */}
      <div className="container mx-auto px-4 flex flex-col items-center text-center space-y-10">
        
        {/* Badge Superior */}
        <div className="inline-flex items-center rounded-full border border-purple-100 bg-white px-4 py-1.5 text-sm font-medium text-slate-600 shadow-sm">
          <Sparkles className="mr-2 h-4 w-4 text-purple-600" />
          AI-powered document formatting for ATS compatibility
        </div>
        
        {/* Título Principal */}
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl text-slate-900 max-w-5xl mx-auto leading-[1.1]">
          Optimize your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">resume</span> <br className="hidden md:block" />
          with AI
        </h1>
        
        {/* Subtítulo */}
        <p className="max-w-2xl mx-auto text-lg text-slate-500 md:text-xl leading-relaxed">
          Improve your resume's technical compatibility with ATS systems using ethical AI that works with your real qualifications.
        </p>
        
        {/* Imagem Centralizada */}
        <div className="mt-8 relative w-full max-w-4xl mx-auto rounded-2xl shadow-2xl border border-slate-200 bg-white p-2 md:p-4">
           <Image 
             src="/score-match.png" 
             alt="ATS Score Comparison: Before vs After" 
             width={1000} 
             height={500} 
             className="rounded-xl w-full h-auto object-cover"
             priority
           />
        </div>

        {/* Três Ícones de Features */}
        <div className="grid md:grid-cols-3 gap-8 pt-12 max-w-5xl mx-auto w-full">
            <div className="flex flex-col items-center text-center space-y-3">
                <div className="h-14 w-14 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-2">
                    <FileText className="h-7 w-7" />
                </div>
                <h3 className="font-bold text-lg text-slate-900">ATS Compliant</h3>
                <p className="text-sm text-slate-500 leading-relaxed max-w-[250px]">
                  Optimization for applicant tracking systems based on industry standards.
                </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-3">
                <div className="h-14 w-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-2">
                    <Sparkles className="h-7 w-7" />
                </div>
                <h3 className="font-bold text-lg text-slate-900">Advanced AI</h3>
                <p className="text-sm text-slate-500 leading-relaxed max-w-[250px]">
                  Intelligent job analysis and personalized optimization suggestions.
                </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-3">
                <div className="h-14 w-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-2">
                    <Globe className="h-7 w-7" />
                </div>
                <h3 className="font-bold text-lg text-slate-900">Ethical AI</h3>
                <p className="text-sm text-slate-500 leading-relaxed max-w-[250px]">
                  Based on your actual qualifications and experience, never fabricating data.
                </p>
            </div>
        </div>
      </div>
    </section>
  )
}