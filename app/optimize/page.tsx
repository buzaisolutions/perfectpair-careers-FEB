'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, CheckCircle, AlertCircle, FileText, ArrowRight } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function OptimizePage() {
  const router = useRouter()
  const { toast } = useToast()
  
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1) // 1 = Form, 2 = Processing, 3 = Result
  
  // Estado do Formulário
  const [formData, setFormData] = useState({
    jobTitle: '',
    jobCompany: '',
    jobDescription: '',
    documentId: '', // ID do documento selecionado
  })
  
  // Estado do Resultado
  const [result, setResult] = useState<any>(null)

  // Função Simulada para buscar documentos (implemente a real se precisar)
  // Por enquanto, vou assumir que você tem um Select ou o usuário fez upload antes
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.jobTitle || !formData.jobDescription) {
        toast({ title: "Missing fields", description: "Please fill in Job Title and Description", variant: "destructive" })
        return
    }

    setLoading(true)
    setStep(2) // Mostra tela de carregamento

    try {
      // 1. Envia para a API
      const response = await fetch('/api/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobTitle: formData.jobTitle,
          jobCompany: formData.jobCompany,
          jobDescription: formData.jobDescription,
          optimizationType: "RESUME_ONLY", // ou pegue do form
          // documentId: "..." // Se tiver upload de arquivo, passe o ID aqui
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        if (response.status === 402) {
            throw new Error("Insufficient credits. Please top up.")
        }
        throw new Error(errorData.error || "Optimization failed")
      }

      // 2. Leitura do Stream (A PARTE IMPORTANTE)
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let resultData = null

      if (!reader) throw new Error("No reader available")

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        
        const chunk = decoder.decode(value)
        // O backend manda "data: {...}\n\n". Vamos limpar isso.
        const lines = chunk.split('\n')
        
        for (const line of lines) {
            if (line.startsWith('data: ')) {
                try {
                    const jsonStr = line.replace('data: ', '').trim()
                    if (jsonStr) {
                        const parsed = JSON.parse(jsonStr)
                        if (parsed.status === 'completed') {
                            resultData = parsed.result
                        } else if (parsed.status === 'error') {
                            throw new Error(parsed.message || "AI Error")
                        }
                    }
                } catch (e) {
                    console.log("Chunk parsing skip", e)
                }
            }
        }
      }

      if (resultData) {
        setResult(resultData)
        setStep(3) // Vai para a tela de resultado
        toast({ title: "Success!", description: "Optimization complete." })
      } else {
        throw new Error("No result data received")
      }

    } catch (error: any) {
      console.error(error)
      toast({ 
        title: "Error", 
        description: error.message, 
        variant: "destructive" 
      })
      setStep(1) // Volta pro formulário
    } finally {
      setLoading(false)
    }
  }

  // --- TELA DE RESULTADO ---
  if (step === 3 && result) {
    return (
        <div className="min-h-screen bg-slate-50">
            <Header />
            <main className="container py-12 max-w-4xl">
                <div className="mb-8 flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-green-700 flex items-center gap-2">
                        <CheckCircle className="h-8 w-8" /> Optimization Complete
                    </h1>
                    <Button onClick={() => { setStep(1); setResult(null); }}>Optimize Another</Button>
                </div>

                <div className="grid gap-6">
                    {/* Scores */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card>
                            <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">ATS Score</CardTitle></CardHeader>
                            <CardContent><div className="text-3xl font-bold">{result.atsScore}%</div></CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Keywords Matched</CardTitle></CardHeader>
                            <CardContent><div className="text-3xl font-bold">{result.keywordMatches?.length || 0}</div></CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Suggested File Name</CardTitle></CardHeader>
                            <CardContent><div className="text-xs font-mono break-all">{result.suggestedFileName}</div></CardContent>
                        </Card>
                    </div>

                    {/* Conteúdo Otimizado */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Optimized Content</CardTitle>
                            <CardDescription>Copy this content to your resume document.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="bg-slate-950 text-slate-50 p-4 rounded-md font-mono text-sm whitespace-pre-wrap h-[400px] overflow-y-auto">
                                {result.optimizedContent}
                            </div>
                            <Button className="mt-4 w-full" onClick={() => navigator.clipboard.writeText(result.optimizedContent)}>
                                Copy to Clipboard
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Feedback */}
                    <Card>
                        <CardHeader><CardTitle>AI Analysis</CardTitle></CardHeader>
                        <CardContent>
                            <p className="text-slate-700">{result.feedback}</p>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
  }

  // --- TELA DE CARREGAMENTO ---
  if (step === 2) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
            <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
            <h2 className="text-2xl font-bold text-slate-900">Optimizing your resume...</h2>
            <p className="text-slate-500 mt-2">This may take up to 30 seconds.</p>
        </div>
    )
  }

  // --- TELA DE FORMULÁRIO (PADRÃO) ---
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="container py-12 max-w-3xl">
        <h1 className="text-3xl font-bold mb-2">New Optimization</h1>
        <p className="text-muted-foreground mb-8">Paste the job description to tailor your resume.</p>
        
        <Card>
            <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Job Title</Label>
                            <Input 
                                placeholder="e.g. Senior Product Manager" 
                                value={formData.jobTitle}
                                onChange={e => setFormData({...formData, jobTitle: e.target.value})}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Company</Label>
                            <Input 
                                placeholder="e.g. Google" 
                                value={formData.jobCompany}
                                onChange={e => setFormData({...formData, jobCompany: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Job Description</Label>
                        <Textarea 
                            placeholder="Paste the full job description here..." 
                            className="h-48"
                            value={formData.jobDescription}
                            onChange={e => setFormData({...formData, jobDescription: e.target.value})}
                        />
                    </div>

                    <div className="bg-blue-50 p-4 rounded-md flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                            <h4 className="font-medium text-blue-900">Optimization Cost</h4>
                            <p className="text-sm text-blue-700">This action will use <strong>1 Credit</strong> from your balance.</p>
                        </div>
                    </div>

                    <Button type="submit" className="w-full" size="lg" disabled={loading}>
                        {loading ? "Processing..." : "Optimize Resume"} <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </form>
            </CardContent>
        </Card>
      </main>
    </div>
  )
}