'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Header } from '@/components/header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Sparkles, CreditCard, CheckCircle, AlertTriangle,
  Loader2, Download, ArrowRight, TrendingUp, BarChart3
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { motion, AnimatePresence } from 'framer-motion'
import { Document, Packer, Paragraph, TextRun, AlignmentType, BorderStyle } from 'docx'
import { saveAs } from 'file-saver'

interface Document2 { id: string; originalFileName: string; fileType: string }
interface OptimizationResult {
  id: string; status: string; optimizedContent: string; feedback?: string
  atsScore?: number; keywordMatches: string[]; improvementSuggestions: string[]
  skillsToVerify?: string[]; suggestedFileName?: string; newScore?: number; originalScore?: number
}

export function OptimizeContent() {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [documents, setDocuments] = useState<Document2[]>([])
  const [userCredits, setUserCredits] = useState(0)
  const [loading, setLoading] = useState(true)
  const [optimizing, setOptimizing] = useState(false)
  const [checkingScore, setCheckingScore] = useState(false)
  const [progress, setProgress] = useState(0)
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null)
  const [initialScore, setInitialScore] = useState<number | null>(null)
  const [showHighScoreWarning, setShowHighScoreWarning] = useState(false)
  const [requestingCoverLetter, setRequestingCoverLetter] = useState(false)
  const [coverLetterResult, setCoverLetterResult] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    selectedDocument: '', jobTitle: '', jobCompany: '', jobLocation: '',
    jobUrl: '', jobDescription: '',
    optimizationType: 'RESUME_ONLY' as 'RESUME_ONLY' | 'COVER_LETTER_ONLY' | 'RESUME_AND_COVER_LETTER',
    targetLanguage: 'ENGLISH' as 'PORTUGUESE' | 'ENGLISH' | 'DUTCH',
    customCoverLetter: ''
  })

  useEffect(() => { fetchInitialData() }, [])

  const fetchInitialData = async () => {
    try {
      const [docRes, credRes] = await Promise.all([fetch('/api/documents'), fetch('/api/dashboard/stats')])
      if (docRes.ok) { const d = await docRes.json(); setDocuments(d?.documents || []) }
      if (credRes.ok) { const d = await credRes.json(); setUserCredits(d?.credits || 0) }
    } catch (e) { console.error(e) } finally { setLoading(false) }
  }

  const generateAndDownloadDOCX = async (content: string, filename?: string) => {
    const lines = content.split('\n')
    const paragraphs: Paragraph[] = []

    for (const line of lines) {
      const t = line.trim()
      if (!t) {
        paragraphs.push(new Paragraph({ text: '' }))
        continue
      }
      // Detect section headers: all caps, short, no punctuation
      const isHeader = t === t.toUpperCase() && t.length > 2 && t.length < 60 && /^[A-Z0-9\s\/&-]+$/.test(t)
      if (isHeader) {
        paragraphs.push(new Paragraph({
          children: [new TextRun({ text: t, bold: true, size: 24 })],
          alignment: AlignmentType.LEFT,
          spacing: { before: 240, after: 80 },
          border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: '333333' } },
        }))
      } else if (t.startsWith('•') || t.startsWith('-') || t.startsWith('*')) {
        paragraphs.push(new Paragraph({
          children: [new TextRun({ text: t.replace(/^[•\-*]\s*/, ''), size: 20 })],
          alignment: AlignmentType.JUSTIFIED,
          bullet: { level: 0 },
          spacing: { after: 40 },
        }))
      } else {
        paragraphs.push(new Paragraph({
          children: [new TextRun({ text: t, size: 20 })],
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 60 },
        }))
      }
    }

    const doc = new Document({
      sections: [{ properties: {}, children: paragraphs }]
    })

    const blob = await Packer.toBlob(doc)
    const safeName = (filename || `document_${Date.now()}`).replace(/\.(pdf|txt)$/i, '') + '.docx'
    saveAs(blob, safeName)
  }

  const scoreColor = (s: number) => s >= 75 ? 'text-green-600' : s >= 40 ? 'text-amber-500' : 'text-red-500'
  const scoreBg = (s: number) => s >= 75 ? 'bg-green-50 border-green-200' : s >= 40 ? 'bg-amber-50 border-amber-200' : 'bg-red-50 border-red-200'
  const scoreLabel = (s: number) => s >= 75 ? 'Good match' : s >= 40 ? 'Moderate match' : 'Low match'

  const validateForm = () => {
    if (!formData.selectedDocument) { toast({ variant: 'destructive', title: 'Document required', description: 'Please select a document.' }); return false }
    if (!formData.jobTitle || !formData.jobDescription) { toast({ variant: 'destructive', title: 'Missing fields', description: 'Job title and description are required.' }); return false }
    return true
  }

  const handleCheckScore = async () => {
    if (!validateForm()) return
    setCheckingScore(true); setInitialScore(null); setShowHighScoreWarning(false)
    try {
      const res = await fetch('/api/optimize/check-score', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId: formData.selectedDocument, jobDescription: formData.jobDescription }),
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      const score = data.score ?? 0
      setInitialScore(score)
      if (score >= 75) setShowHighScoreWarning(true)
    } catch {
      toast({ variant: 'destructive', title: 'Error', description: 'Could not calculate score. Try optimizing directly.' })
    } finally { setCheckingScore(false) }
  }

  const handleOptimize = async (skipWarning = false) => {
    if (!validateForm()) return
    if (initialScore !== null && initialScore >= 75 && !skipWarning) { setShowHighScoreWarning(true); return }
    const requiredCredits = formData.optimizationType === 'RESUME_AND_COVER_LETTER' ? 2 : 1
    if (userCredits < requiredCredits) { toast({ variant: 'destructive', title: 'Insufficient credits' }); return }
    setOptimizing(true); setProgress(0); setOptimizationResult(null); setCoverLetterResult(null); setShowHighScoreWarning(false)
    try {
      const res = await fetch('/api/optimize', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, documentId: formData.selectedDocument || null }),
      })
      if (!res.ok) throw new Error('Optimization failed')
      const reader = res.body?.getReader(); const decoder = new TextDecoder(); let partial = ''
      if (reader) {
        while (true) {
          const { done, value } = await reader.read(); if (done) break
          partial += decoder.decode(value, { stream: true })
          const lines = partial.split('\n'); partial = lines.pop() || ''
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const p = JSON.parse(line.slice(6))
                if (p?.status === 'initial_score' && initialScore === null) setInitialScore(p.score)
                else if (p?.status === 'processing') setProgress(prev => Math.min(prev + 10, 95))
                else if (p?.status === 'completed') {
                  const result = { ...p.result, atsScore: p.result.atsScore ?? p.result.newScore }
                  setOptimizationResult(result); setProgress(100)
                  setUserCredits(prev => prev - requiredCredits)
                  toast({ title: 'Optimization complete!', description: 'Review your resume below and download when ready.' })
                  return
                }
              } catch {}
            }
          }
        }
      }
    } catch (e: any) { toast({ variant: 'destructive', title: 'Error', description: e.message }) }
    finally { setOptimizing(false) }
  }

  const handleRequestCoverLetter = async () => {
    if (userCredits < 1) { toast({ variant: 'destructive', title: 'Insufficient credits' }); return }
    setRequestingCoverLetter(true)
    try {
      const res = await fetch('/api/optimize', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, documentId: formData.selectedDocument || null, optimizationType: 'COVER_LETTER_ONLY' }),
      })
      if (!res.ok) throw new Error()
      const reader = res.body?.getReader(); const decoder = new TextDecoder(); let partial = ''
      if (reader) {
        while (true) {
          const { done, value } = await reader.read(); if (done) break
          partial += decoder.decode(value, { stream: true })
          const lines = partial.split('\n'); partial = lines.pop() || ''
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const p = JSON.parse(line.slice(6))
                if (p?.status === 'completed') {
                  setCoverLetterResult(p.result.optimizedContent)
                  setUserCredits(prev => prev - 1)
                  toast({ title: 'Cover letter generated!', description: 'Review it below and download when ready.' })
                }
              } catch {}
            }
          }
        }
      }
    } catch { toast({ variant: 'destructive', title: 'Error generating cover letter' }) }
    finally { setRequestingCoverLetter(false) }
  }

  if (loading) return <div className="min-h-screen bg-gray-50"><Header /><div className="container mx-auto max-w-4xl p-8 animate-pulse bg-gray-200 h-96 rounded-lg mt-8" /></div>

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-8">
            <h1 className="text-3xl font-bold">AI-Powered Resume Optimization</h1>
            <div className="mt-4">
              <Badge variant="outline" className="bg-blue-50"><CreditCard className="mr-1 h-3 w-3" /> {userCredits} credits available</Badge>
            </div>
          </div>

          {optimizing && (
            <Card className="mb-6"><CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex justify-between text-sm"><span className="font-medium">Optimizing your resume...</span><span>{progress}%</span></div>
                <Progress value={progress} />
              </div>
            </CardContent></Card>
          )}

          <AnimatePresence>
            {(initialScore !== null || optimizationResult) && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <Card className="mb-6">
                  <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><TrendingUp className="h-5 w-5" /> Match Score</CardTitle></CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-6">
                      {initialScore !== null && (
                        <div className={`flex-1 rounded-xl border-2 p-5 text-center ${scoreBg(initialScore)}`}>
                          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Before</p>
                          <p className={`text-5xl font-bold ${scoreColor(initialScore)}`}>{initialScore}%</p>
                          <p className={`text-sm mt-2 font-medium ${scoreColor(initialScore)}`}>{scoreLabel(initialScore)}</p>
                          <p className="text-xs text-gray-400 mt-1">Original resume</p>
                        </div>
                      )}
                      {initialScore !== null && optimizationResult && <ArrowRight className="h-8 w-8 text-gray-300 flex-shrink-0" />}
                      {optimizationResult?.atsScore !== undefined && (
                        <div className={`flex-1 rounded-xl border-2 p-5 text-center ${scoreBg(optimizationResult.atsScore)}`}>
                          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">After</p>
                          <p className={`text-5xl font-bold ${scoreColor(optimizationResult.atsScore)}`}>{optimizationResult.atsScore}%</p>
                          <p className={`text-sm mt-2 font-medium ${scoreColor(optimizationResult.atsScore)}`}>{scoreLabel(optimizationResult.atsScore)}</p>
                          <p className="text-xs text-gray-400 mt-1">Optimized resume</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showHighScoreWarning && !optimizationResult && (
              <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                <Alert className="mb-6 border-green-300 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription>
                    <p className="font-semibold text-green-800 mb-1">Your resume already has a good match score ({initialScore}%)!</p>
                    <p className="text-green-700 text-sm mb-3">Your resume is well-aligned with this job posting. Optimization may not produce significant improvements. Do you still want to proceed?</p>
                    <div className="flex gap-3">
                      <Button size="sm" onClick={() => handleOptimize(true)} className="bg-green-700 hover:bg-green-800">
                        <Sparkles className="mr-2 h-3 w-3" /> Yes, optimize anyway
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setShowHighScoreWarning(false)}>No, keep my resume</Button>
                    </div>
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid gap-8">
            {!optimizationResult && (
              <Card>
                <CardHeader><CardTitle>Configure Optimization</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Document to Optimize</Label>
                    <Select value={formData.selectedDocument} onValueChange={(v) => setFormData({...formData, selectedDocument: v})}>
                      <SelectTrigger><SelectValue placeholder="Select document..." /></SelectTrigger>
                      <SelectContent>
                        {documents.length === 0 && <SelectItem value="none" disabled>No documents uploaded yet</SelectItem>}
                        {documents.map(doc => <SelectItem key={doc.id} value={doc.id}>{doc.originalFileName}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Job Title *</Label><Input placeholder="e.g. Frontend Developer" value={formData.jobTitle} onChange={(e) => setFormData({...formData, jobTitle: e.target.value})} /></div>
                    <div className="space-y-2"><Label>Company</Label><Input placeholder="e.g. Google" value={formData.jobCompany} onChange={(e) => setFormData({...formData, jobCompany: e.target.value})} /></div>
                  </div>
                  <div className="space-y-2">
                    <Label>Job Description *</Label>
                    <Textarea rows={6} placeholder="Paste the full job description here..." value={formData.jobDescription} onChange={(e) => setFormData({...formData, jobDescription: e.target.value})} />
                  </div>
                  <div className="space-y-4">
                    <Label>Optimization Type</Label>
                    <RadioGroup value={formData.optimizationType} onValueChange={(v: any) => setFormData({...formData, optimizationType: v})}>
                      <div className="flex items-center space-x-2"><RadioGroupItem value="RESUME_ONLY" id="r1"/><Label htmlFor="r1">Resume only (1 credit)</Label></div>
                      <div className="flex items-center space-x-2"><RadioGroupItem value="RESUME_AND_COVER_LETTER" id="r2"/><Label htmlFor="r2">Resume + Cover Letter (2 credits)</Label></div>
                    </RadioGroup>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={handleCheckScore} disabled={checkingScore || optimizing} className="flex-1">
                      {checkingScore ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <BarChart3 className="mr-2 h-4 w-4" />}
                      {checkingScore ? 'Calculating...' : 'Check Score First'}
                    </Button>
                    <Button onClick={() => handleOptimize(false)} disabled={optimizing || checkingScore} className="flex-1">
                      {optimizing ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Sparkles className="mr-2 h-4 w-4" />}
                      {optimizing ? 'Processing with AI...' : 'Optimize Now'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {optimizationResult && (
              <div className="space-y-6">
                <Alert className="border-amber-300 bg-amber-50">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-amber-800">
                    <strong>Important:</strong> Please review your optimized resume carefully before sending it to a recruiter. AI optimization may introduce inaccuracies — always verify that all information is correct and truly represents your experience.
                  </AlertDescription>
                </Alert>
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">Optimization complete! Review your resume below and download when you are ready.</AlertDescription>
                </Alert>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      Optimized Resume
                      <Button size="sm" variant="outline" onClick={() => generateAndDownloadDOCX(optimizationResult.optimizedContent, optimizationResult.suggestedFileName)}>
                        <Download className="mr-2 h-4 w-4" /> Download DOCX
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-line text-justify text-sm text-gray-700 p-4 bg-gray-50 rounded-lg border max-h-96 overflow-y-auto">{optimizationResult.optimizedContent}</p>
                  </CardContent>
                </Card>

                {!coverLetterResult && formData.optimizationType === 'RESUME_ONLY' && (
                  <Card className="border-blue-200 bg-blue-50">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="font-semibold text-blue-900">Want a tailored cover letter?</p>
                          <p className="text-sm text-blue-700 mt-1">
                            Generate a cover letter for <strong>{formData.jobTitle}</strong>{formData.jobCompany ? <> at <strong>{formData.jobCompany}</strong></> : ''}.
                            {' '}{userCredits >= 1 ? `Costs 1 credit (you have ${userCredits}).` : 'You need at least 1 credit.'}
                          </p>
                        </div>
                        <Button onClick={handleRequestCoverLetter} disabled={requestingCoverLetter || userCredits < 1} className="shrink-0">
                          {requestingCoverLetter ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Sparkles className="mr-2 h-4 w-4" />}
                          {requestingCoverLetter ? 'Generating...' : 'Generate Cover Letter'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {coverLetterResult && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex justify-between items-center">
                        Cover Letter
                        <Button size="sm" variant="outline" onClick={() => generateAndDownloadDOCX(coverLetterResult, `cover_letter_${formData.jobTitle.replace(/\s+/g, '_')}.docx`)}>
                          <Download className="mr-2 h-4 w-4" /> Download DOCX
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Alert className="border-amber-300 bg-amber-50 mb-4">
                        <AlertTriangle className="h-4 w-4 text-amber-600" />
                        <AlertDescription className="text-amber-800">Please review and personalise this cover letter before sending it.</AlertDescription>
                      </Alert>
                      <p className="whitespace-pre-line text-justify text-sm text-gray-700 p-4 bg-gray-50 rounded-lg border max-h-96 overflow-y-auto">{coverLetterResult}</p>
                    </CardContent>
                  </Card>
                )}

                <Button variant="outline" className="w-full" onClick={() => { setOptimizationResult(null); setInitialScore(null); setCoverLetterResult(null); setShowHighScoreWarning(false) }}>
                  Optimize Another Resume
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
