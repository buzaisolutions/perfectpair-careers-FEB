'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Loader2, CheckCircle, AlertCircle, ArrowRight, Upload, FileText, X } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function OptimizePage() {
  const router = useRouter()
  const { toast } = useToast()
  
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [step, setStep] = useState(1) // 1 = Form, 2 = Processing, 3 = Result
  
  // Estado do Formulário
  const [formData, setFormData] = useState({
    jobTitle: '',
    jobCompany: '',
    jobDescription: '',
    documentId: '', 
  })
  
  // Estado visual do arquivo
  const [fileName, setFileName] = useState<string | null>(null)
  
  // Estado do Resultado
  const [result, setResult] = useState<any>(null)

  // Lógica de Upload de Arquivo
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validações
    if (!['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)) {
      toast({ title: 'Invalid format', description: 'Please upload PDF or DOCX files only.', variant: "destructive" })
      return
    }
    if (file.size > 10 * 1024 * 1024) { 
      toast({ title: 'File too large', description: 'File must be at most 10MB.', variant: "destructive" })
      return
    }

    setUploading(true)

    try {
      const uploadData = new FormData()
      uploadData.append('file', file)

      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: uploadData,
      })

      if (!response.ok) throw new Error("Upload failed")
      
      const data = await response.json()
      
      // Salva o ID do documento para enviar na otimização
      setFormData(prev => ({ ...prev, documentId: data.document.id }))
      setFileName(file.name)
      toast({ title: "Resume uploaded!", description: "Ready to optimize." })

    } catch (error) {
      console.error(error)
      toast({ title: "Upload error", description: "Could not upload file.", variant: "destructive" })
    } finally {
      setUploading(false)
    }
  }

  const removeFile = () => {
    setFormData(prev => ({ ...prev, documentId: '' }))
    setFileName(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validações
    if (!formData.documentId) {
        toast({ title: "Missing Resume", description: "Please upload your resume first.", variant: "destructive" })
        return
    }
    if (!formData.jobTitle || !formData.jobDescription) {
        toast({ title: "Missing fields", description: "Please fill in Job Title and Description", variant: "destructive" })
        return
    }

    setLoading(true)
    setStep(2) // Tela de Loading

    try {
      const response = await fetch('/api/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobTitle: formData.jobTitle,
          jobCompany: formData.jobCompany,
          jobDescription: formData.jobDescription,
          documentId: formData.documentId, // Envia o ID do arquivo que subimos
          optimizationType: "RESUME_ONLY",
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        if (response.status === 402) {
            throw new Error("Insufficient credits. Please buy more credits.")
        }
        throw new Error(errorData.error || "Optimization failed")
      }

      // Leitura do Stream
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let resultData = null

      if (!reader) throw new Error("No reader available")

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        
        const chunk = decoder.decode(value)
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
                } catch (e) { console.log("Skip chunk") }
            }
        }
      }

      if (resultData) {
        setResult(resultData)
        setStep(3)
        toast({ title: "Success!", description: "Optimization complete." })
      } else {
        throw new Error("No result data received")
      }

    } catch (error: any) {
      console.error(error)
      toast({ title: "Error", description: error.message, variant: "destructive" })
      setStep(1)
    } finally {
      setLoading(false)
    }
  }

  // --- TELA DE RESULTADO ---
  if (step === 3 && result) {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Header />
            <main className="flex-1 container py-12 max-w-4xl mx-auto w-full px-4">
                <div className="mb-8 flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-green-700 flex items-center gap-2">
                        <CheckCircle className="h-8 w-8" /> Optimization Complete
                    </h1>
                    <Button onClick={() => { setStep(1); setResult(null); }}>Optimize Another</Button>
                </div>

                <div className="grid gap-6">
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

                    <Card>
                        <CardHeader>
                            <CardTitle>Optimized Content</CardTitle>
                            <CardDescription>Copy this content to your resume document.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="bg-slate-950 text-slate-50 p-4 rounded-md font-mono text-sm whitespace-pre-wrap h-[400px] overflow-y-auto">
                                {result.optimizedContent}
                            </div>
                            <Button className="mt-4 w-full" onClick={() => {
                                navigator.clipboard.writeText(result.optimizedContent)
                                toast({ title: "Copied!" })
                            }}>
                                Copy to Clipboard
                            </Button>
                        </CardContent>
                    </Card>

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
        <div className="min-h-screen flex flex-col">
            <Header />
            <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 px-4 text-center">
                <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
                <h2 className="text-2xl font-bold text-slate-900">Optimizing your resume...</h2>
                <p className="text-slate-500 mt-2">Analyzing keywords and restructuring content.</p>
                <p className="text-xs text-slate-400 mt-4">Do not close this window.</p>
            </div>
        </div>
    )
  }

  // --- TELA DE FORMULÁRIO (PADRÃO) ---
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      
      {/* Centralização corrigida com mx-auto e flex */}
      <main className="flex-1 container py-12 max-w-3xl mx-auto w-full px-4 flex flex-col items-center">
        
        <div className="w-full text-left mb-8">
            <h1 className="text-3xl font-bold mb-2">New Optimization</h1>
            <p className="text-muted-foreground">Upload your resume and the job description to get started.</p>
        </div>
        
        <Card className="w-full shadow-md">
            <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* ÁREA DE UPLOAD (NOVA) */}
                    <div className="space-y-2">
                        <Label>1. Upload Resume (PDF or DOCX)</Label>
                        {!fileName ? (
                             <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-slate-50 transition-colors relative">
                                <input
                                    type="file"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    accept=".pdf,.docx"
                                    onChange={handleFileUpload}
                                    disabled={uploading}
                                />
                                {uploading ? (
                                    <div className="flex flex-col items-center">
                                        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                                        <p className="text-sm font-medium">Uploading...</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center">
                                        <Upload className="h-10 w-10 text-gray-400 mb-2" />
                                        <p className="text-sm font-medium text-gray-900">Click to upload or drag file</p>
                                        <p className="text-xs text-gray-500 mt-1">Up to 10MB</p>
                                    </div>
                                )}
                             </div>
                        ) : (
                            <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <div className="bg-green-100 p-2 rounded">
                                        <FileText className="h-5 w-5 text-green-700" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-green-900">Resume Uploaded</p>
                                        <p className="text-xs text-green-700">{fileName}</p>
                                    </div>
                                </div>
                                <Button type="button" variant="ghost" size="sm" onClick={removeFile}>
                                    <X className="h-4 w-4 text-gray-500" />
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                         <Label>2. Target Job Details</Label>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Input 
                                    placeholder="Job Title (e.g. Senior PM)" 
                                    value={formData.jobTitle}
                                    onChange={e => setFormData({...formData, jobTitle: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <Input 
                                    placeholder="Company (e.g. Amazon)" 
                                    value={formData.jobCompany}
                                    onChange={e => setFormData({...formData, jobCompany: e.target.value})}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Job Description</Label>
                        <Textarea 
                            placeholder="Paste the full job description here..." 
                            className="h-40"
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

                    <Button type="submit" className="w-full" size="lg" disabled={loading || uploading || !formData.documentId}>
                        {loading ? "Processing..." : "Optimize Resume"} <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </form>
            </CardContent>
        </Card>
      </main>
    </div>
  )
}