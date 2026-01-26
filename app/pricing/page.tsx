import Link from "next/link"
import { Header } from "@/components/header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Check, ArrowLeft, ArrowRight, FileText, Mail, Infinity as InfinityIcon } from "lucide-react"

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      
      <main className="flex-1 container py-12 max-w-7xl">
        
        {/* Link de Voltar */}
        <div className="mb-8">
          <Link href="/dashboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>

        {/* Grid de Preços */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          
          {/* --- PLANO 1: Resume Optimization --- */}
          <Card className="flex flex-col border-slate-200 shadow-sm hover:shadow-md transition-shadow h-full">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto bg-purple-100 p-4 rounded-full mb-4 w-fit">
                <FileText className="h-8 w-8 text-purple-600" />
              </div>
              <h2 className="text-xl font-bold">Resume Optimization</h2>
              <p className="text-sm text-muted-foreground">Perfect for quick optimization</p>
            </CardHeader>
            <CardContent className="flex-1 text-center">
              <div className="text-4xl font-bold mb-8">€9.99</div>
              
              <ul className="space-y-4 text-sm text-left px-4">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 shrink-0" />
                  <span>ATS analysis of your resume</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 shrink-0" />
                  <span>AI-powered optimization</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 shrink-0" />
                  <span>Compatibility score</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 shrink-0" />
                  <span>Improvement suggestions</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 shrink-0" />
                  <span>PDF download</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 shrink-0" />
                  <span>Skills verification system</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter className="pt-4">
              <Button className="w-full group" variant="outline">
                Select Plan 
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </CardFooter>
          </Card>

          {/* --- PLANO 2: Resume + Cover Letter (Destaque) --- */}
          <Card className="flex flex-col border-2 border-purple-600 shadow-xl relative bg-white h-full scale-105 z-10">
            {/* Badge "Most Popular" */}
            <div className="absolute -top-4 left-0 right-0 flex justify-center">
              <span className="bg-purple-600 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wide">
                Most Popular
              </span>
            </div>

            <CardHeader className="text-center pb-2 pt-8">
              <div className="mx-auto bg-purple-100 p-4 rounded-full mb-4 w-fit">
                <Mail className="h-8 w-8 text-purple-600" />
              </div>
              <h2 className="text-xl font-bold">Resume + Cover Letter</h2>
              <p className="text-sm text-muted-foreground px-4">Complete technical optimization for both documents</p>
            </CardHeader>
            <CardContent className="flex-1 text-center">
              <div className="text-4xl font-bold mb-8">€14.99</div>
              
              <ul className="space-y-4 text-sm text-left px-4 font-medium text-slate-700">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 shrink-0" />
                  <span>Everything from previous plan</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 shrink-0" />
                  <span>Optimized cover letter</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 shrink-0" />
                  <span>Job alignment</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 shrink-0" />
                  <span>Advanced personalization</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 shrink-0" />
                  <span>Professional templates</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 shrink-0" />
                  <span>Detailed feedback</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter className="pt-4">
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white group">
                Select Plan
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </CardFooter>
          </Card>

          {/* --- PLANO 3: Monthly Plan --- */}
          <Card className="flex flex-col border-slate-200 shadow-sm hover:shadow-md transition-shadow h-full">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto bg-purple-100 p-4 rounded-full mb-4 w-fit">
                <InfinityIcon className="h-8 w-8 text-purple-600" />
              </div>
              <h2 className="text-xl font-bold">Monthly Plan</h2>
              <p className="text-sm text-muted-foreground">For active job seekers</p>
            </CardHeader>
            <CardContent className="flex-1 text-center">
              <div className="text-4xl font-bold mb-8">
                €29.99 <span className="text-base font-normal text-muted-foreground">/mês</span>
              </div>
              
              <ul className="space-y-4 text-sm text-left px-4">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 shrink-0" />
                  <span>Unlimited optimizations</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 shrink-0" />
                  <span>Everything from previous plans</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 shrink-0" />
                  <span>Priority support</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 shrink-0" />
                  <span>Complete history</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 shrink-0" />
                  <span>Multiple versions</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 shrink-0" />
                  <span>Automatic updates</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter className="pt-4">
              <Button className="w-full group" variant="outline">
                Select Plan
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </CardFooter>
          </Card>

        </div>

        {/* Aviso Legal do Rodapé */}
        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground">
            All plans include ethical AI formatting that works with your actual qualifications. This service optimizes document structure, not hiring outcomes.
          </p>
        </div>

      </main>
      
      <SiteFooter />
    </div>
  )
}