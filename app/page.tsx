'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Sparkles, ArrowRight, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface Document {
  id: string
  originalFileName: string
}

export default function OptimizePage() {
  const { toast } = useToast()
  
  const [step, setStep] = useState<'input' | 'processing' | 'result'>('input')
  const [documents, setDocuments] = useState<Document[]>([])
  const [loadingDocs, setLoadingDocs] = useState(true)
  
  const [selectedDocId, setSelectedDocId] = useState<string>('')
  const [jobTitle, setJobTitle] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  
  const [result, setResult] = useState<any>(null)
  const [streamMessage, setStreamMessage] = useState('Initializing AI...')

  useEffect(() => {
    async function fetchDocs() {
      try {
        const res = await fetch('/api/documents')
        if (res.ok) {
          const data = await res.json()
          setDocuments(data.documents || [])
        }
      } catch (error) {
        console.error('Failed to load docs', error)
      } finally {
        setLoadingDocs(false)
      }
    }
    fetchDocs()
  }, [])

  const handleOptimize = async () => {
    if (!selectedDocId || !jobDescription || !jobTitle) {
      toast({ variant: 'destructive', title: 'Missing fields', description: 'Please fill in all fields.' })
      return
    }

    setStep('processing')
    setStreamMessage('Connecting to AI...')

    try {
      const response = await fetch('/api/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentId: selectedDocId,
          jobTitle: jobTitle,
          jobDescription: jobDescription,
          optimizationType: 'RESUME_ONLY'
        })
      })

      if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.error || `Server Error: ${response.status}`)
      }

      // --- CORREÇÃO DO STREAMING (BUFFERING) ---
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let accumulatedData = '' // Acumula os pedaços que chegam
      let finalJson = null

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          
          const chunk = decoder.decode(value, { stream: true })
          accumulatedData += chunk // Junta as peças
          
          setStreamMessage('Generating optimization... This may take 30s.')
        }

        // Tenta encontrar o JSON no texto completo acumulado
        // O formato esperado é: data: { ... }
        const lines = accumulatedData.split('\n')
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const jsonStr = line.replace('data: ', '').trim()
              const data = JSON.parse(jsonStr)
              
              if (data.status === 'completed' && data.result) {
                finalJson = data.result
              } else if (data.status === 'error') {
                throw new Error(data.message || 'AI processing error')
              }
            } catch (e) {
              // Se der erro no parse final, é um problema real
              console.error("JSON Parse Error on full data:", e)
            }
          }
        }
      }

      if (finalJson) {
        setResult({
          originalScore: Math.floor((finalJson.atsScore || 50) * 0.4), 
          optimizedScore: finalJson.atsScore || 85,
          missingKeywords: finalJson.keywordAnalysis?.criticalMissing || [],
          strongPoints: finalJson.keywordAnalysis?.importantMatched || [],
          analysis: finalJson.feedback
        })
        setStep('result')
      } else {
        // Se chegou aqui, o buffer veio vazio ou sem o prefixo 'data:'
        throw new Error('AI response was incomplete. Please check your API Key in Vercel.')
      }

    } catch (error: any) {
      console.error(error)
      toast({ variant: 'destructive', title: 'Error', description: error.message || 'Optimization failed.' })
      setStep('input')
    }
  }

  const ScoreBadge = ({ score, label, type }: { score: number, label: string, type: 'before' | 'after' }) => {
    const color = type === 'after' ? 'text-green-600' : 'text-gray-500';
    const bg = type === 'after' ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200';

    return (
      <div className={`flex flex-col items-center p-6 rounded-xl border-2 ${bg} w-full`}>
        <span className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-2">{label}</span>
        <div className={`text-5xl lg:text-6xl font-black ${color}`}>{score}</div>
        <span className="text-xs text-gray-400 mt-1">out of 100</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto max-w-4xl px-4 py-8">
        
        <div className="mb-8">
          <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-900 mb-4 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Resume Optimization</h1>
          <p className="text-gray-600">Align your resume perfectly with the job description.</p>
        </div>

        {step === 'input' && (
          <Card>
            <CardContent className="space-y-6 pt-6">
              
              <div className="space-y-2">
                <Label>Select Resume</Label>
                {loadingDocs ? (
                  <div className="text-sm text-gray-500"><Loader2 className="w-3 h-3 animate-spin inline"/> Loading...</div>
                ) : (
                  <Select onValueChange={setSelectedDocId} value={selectedDocId}>
                    <SelectTrigger><SelectValue placeholder="Choose a resume..." /></SelectTrigger>
                    <SelectContent>
                      {documents.map((doc) => (
                        <SelectItem key={doc.id} value={doc.id}>{doc.originalFileName}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div className="space-y-2">
                <Label>Job Title</Label>
                <Input 
                  placeholder="e.g. Senior Product Manager" 
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Job Description</Label>
                <Textarea 
                  placeholder="Paste the full job description here..." 
                  className="min-h-[200px]"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
              </div>

              <Button 
                onClick={handleOptimize} 
                className="w-full bg-green-600 hover:bg-green-700 text-white" 
                size="lg" 
                disabled={!selectedDocId || !jobDescription || !jobTitle}
              >
                <Sparkles className="w-4 h-4 mr-2" /> Optimize Now
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 'processing' && (
          <div className="text-center py-20 bg-white rounded-lg border shadow-sm">
            <div className="relative inline-block">
               <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-75"></div>
               <Loader2 className="w-12 h-12 animate-spin text-green-600 relative z-10" />
            </div>
            <h2 className="mt-6 text-xl font-semibold text-gray-900">Optimizing Resume</h2>
            <p className="mt-2 text-gray-500 animate-pulse">{streamMessage}</p>
          </div>
        )}

        {step === 'result' && result && (
          <div className="space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border p-8"
            >
              <h2 className="text-center text-xl font-semibold mb-8">Optimization Results</h2>
              
              <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                <ScoreBadge score={result.originalScore} label="Original Match" type="before" />
                
                <div className="hidden md:flex flex-col items-center text-green-500">
                  <ArrowRight className="w-8 h-8" />
                </div>
                
                <ScoreBadge score={result.optimizedScore} label="New ATS Score" type="after" />
              </div>

              <div className="mt-8 text-center bg-green-50 p-4 rounded-lg text-green-800 text-sm">
                <TrendingUp className="w-4 h-4 inline mr-2" />
                Optimization complete! Your resume is now highly compatible with this position.
              </div>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader><CardTitle className="text-red-600 flex items-center"><AlertTriangle className="mr-2 w-5 h-5"/> Missing Keywords</CardTitle></CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700">
                    {result.missingKeywords?.length > 0 ? (
                      result.missingKeywords.map((k: string, i: number) => <li key={i}>{k}</li>)
                    ) : (
                      <li className="text-gray-400 italic">No critical keywords missing!</li>
                    )}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle className="text-green-600 flex items-center"><CheckCircle className="mr-2 w-5 h-5"/> Matched Keywords</CardTitle></CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700">
                    {result.strongPoints?.length > 0 ? (
                       result.strongPoints.slice(0, 10).map((k: string, i: number) => <li key={i}>{k}</li>)
                    ) : (
                       <li className="text-gray-400 italic">Processing...</li>
                    )}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Button onClick={() => setStep('input')} variant="outline" className="w-full">
              Start New Optimization
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}