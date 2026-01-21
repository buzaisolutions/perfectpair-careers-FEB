'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Header } from '@/components/header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
  FileText, 
  Sparkles, 
  Download, 
  CreditCard,
  AlertCircle,
  CheckCircle,
  Info,
  Loader2,
  BarChart3,
  SearchCheck
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { motion } from 'framer-motion'

interface Document {
  id: string
  originalFileName: string
  fileType: string
}

interface MatchResult {
  score: number
  analysis: string
  missingKeywords: string[]
}

interface OptimizationResult {
  id: string
  status: string
  optimizedContent: string
  suggestedFileName?: string // Novo campo vindo do Backend
  feedback?: string
  atsScore?: number
  keywordMatches: string[]
  improvementSuggestions: string[]
  skillsToVerify?: string[]
}

export function OptimizeContent() {
  const { data: session } = useSession()
  const { toast } = useToast()
  
  const [documents, setDocuments] = useState<Document[]>([])
  const [userCredits, setUserCredits] = useState(0)
  const [loading, setLoading] = useState(true)
  
  // States for Process
  const [isCheckingMatch, setIsCheckingMatch] = useState(false)
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null)
  
  const [optimizing, setOptimizing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null)
  
  const [formData, setFormData] = useState({
    selectedDocument: '',
    jobTitle: '',
    jobCompany: '',
    jobLocation: '',
    jobUrl: '',
    jobDescription: '',
    optimizationType: 'RESUME_ONLY' as 'RESUME_ONLY' | 'COVER_LETTER_ONLY' | 'RESUME_AND_COVER_LETTER',
    customCoverLetter: ''
  })

  useEffect(() => {
    fetchInitialData()
  }, [])

  const fetchInitialData = async () => {
    try {
      const [documentsRes, creditsRes] = await Promise.all([
        fetch('/api/documents'),
        fetch('/api/dashboard/stats')
      ])

      if (documentsRes.ok) {
        const documentsData = await documentsRes.json()
        setDocuments(documentsData?.documents || [])
      }

      if (creditsRes.ok) {
        const creditsData = await creditsRes.json()
        setUserCredits(creditsData?.credits || 0)
      }
    } catch (error) {
      console.error('Error fetching initial data:', error)
    } finally {
      setLoading(false)
    }
  }

  // --- NEW: MATCH SCORE FUNCTION ---
  const handleCheckMatch = async () => {
    // Basic validation
    if (!formData.selectedDocument && formData.optimizationType !== 'COVER_LETTER_ONLY') {
      toast({ variant: 'destructive', title: 'Document required', description: 'Select a resume to compare.' })
      return
    }
    if (!formData.jobDescription) {
      toast({ variant: 'destructive', title: 'Job Description required', description: 'Paste the job description first.' })
      return
    }

    setIsCheckingMatch(true)
    setMatchResult(null)

    try {
      // Nota: O backend precisa aceitar 'documentId' e extrair o texto lá, 
      // ou você precisa ter o texto aqui. Assumindo que atualizamos o backend para aceitar ID.
      const response = await fetch('/api/calculate-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentId: formData.selectedDocument, // Send ID instead of raw text
          jobDescription: formData.jobDescription
        })
      })

      if (!response.ok) throw new Error('Failed to calculate match')
      
      const data = await response.json()
      setMatchResult(data)
      
      toast({
        title: 'Analysis Complete',
        description: `Initial Match Score: ${data.score}%`,
      })

    } catch (error) {
      console.error('Match check error:', error)
      toast({ variant: 'destructive', title: 'Error', description: 'Could not calculate match score.' })
    } finally {
      setIsCheckingMatch(false)
    }
  }

  const handleOptimize = async () => {
    const requiredCredits = formData.optimizationType === 'RESUME_AND_COVER_LETTER' ? 2 : 1
    
    if (userCredits < requiredCredits) {
      toast({ variant: 'destructive', title: 'Insufficient credits', description: `You need ${requiredCredits} credits.` })
      return
    }

    setOptimizing(true)
    setProgress(0)
    setOptimizationResult(null)

    try {
      const response = await fetch('/api/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentId: formData.selectedDocument || null,
          jobTitle: formData.jobTitle,
          jobCompany: formData.jobCompany,
          jobLocation: formData.jobLocation,
          jobUrl: formData.jobUrl,
          jobDescription: formData.jobDescription,
          optimizationType: formData.optimizationType,
          customCoverLetter: formData.customCoverLetter
          // removed targetLanguage (Backend forces English)
        }),
      })

      if (!response.ok) throw new Error('Optimization error')

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let partialRead = ''

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          partialRead += decoder.decode(value, { stream: true })
          let lines = partialRead.split('\n')
          partialRead = lines.pop() || ''

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6)
              if (data === '[DONE]') {
                setProgress(100)
                return
              }

              try {
                const parsed = JSON.parse(data)
                if (parsed?.status === 'processing') {
                  setProgress(prev => Math.min(prev + 5, 90))
                } else if (parsed?.status === 'completed') {
                  setOptimizationResult(parsed?.result)
                  setProgress(100)
                  setUserCredits(prev => prev - requiredCredits)
                  toast({ title: 'Success!', description: 'Optimization completed.' })
                  return
                } else if (parsed?.status === 'error') {
                  throw new Error(parsed?.message || 'Optimization error')
                }
              } catch (parseError) { }
            }
          }
        }
      }
    } catch (error: any) {
      console.error('Optimization error:', error)
      toast({ variant: 'destructive', title: 'Error', description: error.message })
    } finally {
      setOptimizing(false)
    }
  }

  // --- UPDATED DOWNLOAD LOGIC ---
  const handleDownload = () => {
    if (!optimizationResult?.optimizedContent) return

    // Use the smart filename from backend or fallback
    const fileName = optimizationResult.suggestedFileName || `Optimized_Resume_${Date.now()}`
    
    // Create a Blob
    const element = document.createElement("a");
    const file = new Blob([optimizationResult.optimizedContent], {type: 'text/plain;charset=utf-8'});
    element.href = URL.createObjectURL(file);
    element.download = `${fileName}.docx`; // Saving as .docx (text content) for easy opening
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto max-w-4xl px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-96 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="mb-8">
<h1 className="text-3xl font-bold text-gray-900">AI-Powered Optimization V2</h1>            <p className="mt-2 text-lg text-gray-600">
              Optimize your resume for international standards (English Only)
            </p>
            <div className="mt-4 flex items-center space-x-4">
              <Badge variant="outline" className="bg-blue-50">
                <CreditCard className="mr-1 h-3 w-3" />
                {userCredits} credits available
              </Badge>
            </div>
          </div>

          {/* Progress Bar */}
          {optimizing && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Optimizing...</span>
                      <span className="text-sm text-gray-500">{progress}%</span>
                    </div>
                    <Progress value={progress} />
                    <div className="flex items-center text-sm text-gray-600">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {progress < 90 ? 'Analyzing & Rewriting...' : 'Finalizing...'}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Form */}
          <div className="grid gap-8 lg:grid-cols-1">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Sparkles className="mr-2 h-5 w-5" />
                    Configure Job Details
                  </CardTitle>
                  <CardDescription>
                    We'll optimize specifically for this position
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  {/* Document Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="document">Select Document</Label>
                    <Select 
                      value={formData.selectedDocument} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, selectedDocument: value }))}
                      disabled={formData.optimizationType === 'COVER_LETTER_ONLY'}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a document..." />
                      </SelectTrigger>
                      <SelectContent>
                        {documents?.map((doc) => (
                          <SelectItem key={doc.id} value={doc.id}>
                            {doc.originalFileName} ({doc.fileType})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Job Information */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Job Title *</Label>
                        <Input
                          placeholder="e.g. Senior Frontend Developer"
                          value={formData.jobTitle}
                          onChange={(e) => setFormData(prev => ({ ...prev, jobTitle: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Company</Label>
                        <Input
                          placeholder="e.g. TechCorp"
                          value={formData.jobCompany}
                          onChange={(e) => setFormData(prev => ({ ...prev, jobCompany: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Job Description *</Label>
                      <Textarea
                        placeholder="Paste the full job description here..."
                        rows={8}
                        value={formData.jobDescription}
                        onChange={(e) => setFormData(prev => ({ ...prev, jobDescription: e.target.value }))}
                      />
                    </div>
                  </div>

                  {/* Optimization Options */}
                  <div className="space-y-3">
                    <Label>Type</Label>
                    <RadioGroup
                      value={formData.optimizationType}
                      onValueChange={(value: any) => setFormData(prev => ({ ...prev, optimizationType: value }))}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="RESUME_ONLY" id="r-only" />
                        <Label htmlFor="r-only" className="font-normal">Resume Only (1 credit)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="COVER_LETTER_ONLY" id="c-only" />
                        <Label htmlFor="c-only" className="font-normal">Cover Letter Only (1 credit)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="RESUME_AND_COVER_LETTER" id="both" />
                        <Label htmlFor="both" className="font-normal">Resume + Cover Letter (2 credits)</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* === MATCH SCORE SECTION (New) === */}
                  <div className="pt-4 border-t space-y-4">
                    {matchResult && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-4">
                        <div className={`p-4 rounded-lg border ${matchResult.score >= 70 ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="font-bold text-lg text-gray-800">Compatibility Score</h3>
                            <span className={`text-2xl font-bold ${matchResult.score >= 70 ? 'text-green-600' : 'text-amber-600'}`}>
                              {matchResult.score}%
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 mb-3">{matchResult.analysis}</p>
                          
                          {matchResult.missingKeywords.length > 0 && (
                            <div>
                              <span className="text-xs font-semibold uppercase text-gray-500">Missing Critical Keywords:</span>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {matchResult.missingKeywords.map(kw => (
                                  <Badge key={kw} variant="outline" className="bg-white text-red-600 border-red-200">
                                    {kw}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}

                    <div className="flex gap-4">
                      {/* Check Match Button */}
                      {!matchResult ? (
                         <Button 
                           onClick={handleCheckMatch}
                           disabled={isCheckingMatch || !formData.jobDescription || !formData.selectedDocument}
                           variant="secondary"
                           className="w-full border-2 border-gray-200 hover:border-gray-300"
                           size="lg"
                         >
                           {isCheckingMatch ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <SearchCheck className="mr-2 h-4 w-4" />}
                           Check Match % First
                         </Button>
                      ) : (
                        <Button 
                          onClick={handleCheckMatch}
                          variant="ghost"
                          className="w-1/3 text-gray-500"
                          size="lg"
                        >
                          Re-check Match
                        </Button>
                      )}

                      {/* Optimize Button (Disabled if no match checked) */}
                      <Button 
                        onClick={handleOptimize}
                        disabled={optimizing || !matchResult} // Forces user to check match first
                        className={`w-full ${!matchResult ? 'opacity-50 cursor-not-allowed' : ''}`}
                        size="lg"
                      >
                        {optimizing ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Optimizing...
                          </>
                        ) : (
                          <>
                            <Sparkles className="mr-2 h-5 w-5" />
                            Optimize Now
                          </>
                        )}
                      </Button>
                    </div>
                    {!matchResult && (
                      <p className="text-center text-xs text-gray-400">
                        * You must verify compatibility before optimizing to save credits.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Results Section */}
            {optimizationResult && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-6">
                
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    <strong>Optimization Successful!</strong> Content is ready in English.
                  </AlertDescription>
                </Alert>

                {/* Score & Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-lg"><BarChart3 className="mr-2 h-5 w-5"/> ATS Score</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-3xl font-bold text-green-600">{optimizationResult.atsScore}%</span>
                        <Badge variant="outline" className="bg-green-50 text-green-700">Excellent</Badge>
                      </div>
                      <Progress value={optimizationResult.atsScore} className="h-2" />
                    </CardContent>
                   </Card>

                   <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-lg"><Info className="mr-2 h-5 w-5"/> Strategy Used</CardTitle>
                    </CardHeader>
                    <CardContent>
                       <p className="text-sm text-gray-600">{optimizationResult.feedback}</p>
                    </CardContent>
                   </Card>
                </div>

                {/* Content Viewer */}
                <Card className="border-2 border-blue-100">
                  <CardHeader className="bg-blue-50/50">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FileText className="mr-2 h-5 w-5 text-blue-600" />
                        <span>Optimized Content</span>
                      </div>
                      <Button onClick={handleDownload} size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Download {optimizationResult.suggestedFileName ? '.docx' : 'File'}
                      </Button>
                    </CardTitle>
                    <CardDescription>
                      File Name: <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">{optimizationResult.suggestedFileName}.docx</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="bg-white p-6 max-h-[500px] overflow-y-auto border-t">
                      <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono leading-relaxed">
                        {optimizationResult.optimizedContent}
                      </pre>
                    </div>
                  </CardContent>
                </Card>

                {/* Skills Verification Warning */}
                {optimizationResult.skillsToVerify && optimizationResult.skillsToVerify.length > 0 && (
                   <Card className="border-amber-200 bg-amber-50">
                    <CardHeader>
                      <CardTitle className="flex items-center text-amber-800 text-base">
                        <AlertCircle className="mr-2 h-5 w-5" />
                        Verification Required (Anti-Hallucination)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-amber-800 mb-2">The job requires these skills, but we didn't find them in your original document. We did NOT add them to keep your resume honest:</p>
                      <div className="flex flex-wrap gap-2">
                        {optimizationResult.skillsToVerify.map((skill, idx) => (
                          <Badge key={idx} className="bg-white text-amber-700 hover:bg-white border-amber-200">{skill}</Badge>
                        ))}
                      </div>
                    </CardContent>
                   </Card>
                )}

              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}