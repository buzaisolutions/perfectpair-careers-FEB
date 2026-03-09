'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/hooks/use-toast'
import { Flame, Sparkles, ArrowRight, MailCheck } from 'lucide-react'

type RoastResult = {
  hireabilityScore: number
  headline: string
  roast: string[]
  quickWins: string[]
  missingKeywords: string[]
  rewrittenSummary: string
}

type RoastApiResponse = {
  result: RoastResult
  storage?: {
    message?: string
  }
}

const STORAGE_KEY = 'perfectpair_resume_roast_last_result'

export function ResumeRoastContent() {
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [leadName, setLeadName] = useState('')
  const [leadEmail, setLeadEmail] = useState('')
  const [accessGranted, setAccessGranted] = useState(false)
  const [accessUser, setAccessUser] = useState<{ name?: string; email?: string } | null>(null)
  const [sendingLink, setSendingLink] = useState(false)
  const [verifyingLink, setVerifyingLink] = useState(false)
  const [resumeText, setResumeText] = useState('')
  const [targetRole, setTargetRole] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [allowFutureStorage, setAllowFutureStorage] = useState(false)
  const [saveLocally, setSaveLocally] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<RoastResult | null>(null)
  const [storageMessage, setStorageMessage] = useState('')

  useEffect(() => {
    async function boot() {
      const token = searchParams.get('token')
      const email = searchParams.get('email')
      const name = searchParams.get('name') || ''

      if (token && email) {
        setVerifyingLink(true)
        try {
          const res = await fetch('/api/resume-roast/verify-link', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, email, name }),
          })
          const data = await res.json()
          if (!res.ok) throw new Error(data?.error || 'Invalid verification link.')
          setAccessGranted(true)
          setAccessUser({ name, email })
          window.history.replaceState({}, '', '/resume-roast')
          toast({ title: 'Email verified', description: 'Resume Roast is now unlocked.' })
        } catch (err: any) {
          setError(err?.message || 'Could not verify email link.')
        } finally {
          setVerifyingLink(false)
        }
      } else {
        const accessRes = await fetch('/api/resume-roast/access')
        if (accessRes.ok) {
          const accessData = await accessRes.json()
          setAccessGranted(true)
          setAccessUser(accessData?.user || null)
        }
      }

      try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (!raw) return
        const parsed = JSON.parse(raw)
        if (parsed?.result) {
          setResult(parsed.result)
          setStorageMessage('Loaded your last roast from local browser storage.')
        }
      } catch {
        // ignore localStorage parsing errors
      }
    }
    void boot()
  }, [searchParams, toast])

  async function handleSendAccessLink() {
    setError('')
    setSendingLink(true)
    try {
      const response = await fetch('/api/resume-roast/request-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: leadName, email: leadEmail }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data?.error || 'Could not send access link.')
      toast({
        title: 'Verification email sent',
        description: 'Check your inbox and click the confirmation link to unlock Resume Roast.',
      })
    } catch (err: any) {
      setError(err?.message || 'Failed to send verification link.')
    } finally {
      setSendingLink(false)
    }
  }

  async function handleRoast() {
    setLoading(true)
    setError('')
    setStorageMessage('')

    try {
      const formData = new FormData()
      formData.append('resumeText', resumeText)
      formData.append('targetRole', targetRole)
      formData.append('allowFutureStorage', String(allowFutureStorage))
      if (file) formData.append('file', file)

      const response = await fetch('/api/resume-roast', {
        method: 'POST',
        body: formData,
      })

      const data = (await response.json()) as RoastApiResponse & { error?: string }
      if (!response.ok) throw new Error(data?.error || 'Could not analyze your resume right now.')

      setResult(data.result)
      setStorageMessage(data.storage?.message || '')

      if (saveLocally) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ result: data.result, createdAt: new Date().toISOString() }))
      }
    } catch (err: any) {
      setError(err?.message || 'Unexpected error')
      toast({
        variant: 'destructive',
        title: 'Roast failed',
        description: err?.message || 'Please try again with another file or text.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="container mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-orange-100">
          <Flame className="h-7 w-7 text-orange-600" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">AI Resume Roast</h1>
        <p className="mt-2 text-lg text-gray-600">
          Get a brutally honest, recruiter-style review in seconds.
        </p>
      </div>

      {!accessGranted && (
        <Card className="mx-auto mb-8 max-w-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MailCheck className="h-5 w-5 text-orange-600" />
              Confirm Email to Unlock Roast
            </CardTitle>
            <CardDescription>
              Enter your name and email. We will send a secure confirmation link before enabling Resume Roast.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="leadName">Full name</Label>
              <Input
                id="leadName"
                placeholder="Your full name"
                value={leadName}
                onChange={(e) => setLeadName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="leadEmail">Email</Label>
              <Input
                id="leadEmail"
                type="email"
                placeholder="you@email.com"
                value={leadEmail}
                onChange={(e) => setLeadEmail(e.target.value)}
              />
            </div>
            <Button
              onClick={handleSendAccessLink}
              disabled={sendingLink || !leadName.trim() || !leadEmail.trim()}
              className="w-full"
            >
              {sendingLink ? 'Sending Link...' : 'Send Confirmation Link'}
            </Button>
            {verifyingLink && (
              <Alert>
                <AlertDescription>Verifying your link...</AlertDescription>
              </Alert>
            )}
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {accessGranted && accessUser?.email && (
        <Alert className="mb-6">
          <AlertDescription>
            Verified access: {accessUser.name || 'User'} ({accessUser.email})
          </AlertDescription>
        </Alert>
      )}

      {!accessGranted ? null : (
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upload or Paste Your Resume</CardTitle>
            <CardDescription>PDF, DOCX or TXT up to 5MB, or paste plain text.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="targetRole">Target role (optional)</Label>
              <Input
                id="targetRole"
                placeholder="e.g. Senior Product Manager"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="resumeFile">Resume file (optional if text is provided)</Label>
              <Input
                id="resumeFile"
                type="file"
                accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="resumeText">Resume text</Label>
              <Textarea
                id="resumeText"
                rows={12}
                placeholder="Paste your resume content here if you prefer not to upload a file."
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
              />
            </div>

            <div className="rounded-md border bg-amber-50 p-3 text-sm text-amber-800">
              The roast is intentionally direct. You will get critical feedback plus quick actionable fixes.
            </div>

            <div className="space-y-2 rounded-md border p-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="futureStorage"
                  checked={allowFutureStorage}
                  onCheckedChange={(checked) => setAllowFutureStorage(checked === true)}
                />
                <Label htmlFor="futureStorage" className="text-sm">
                  I allow future server-side storage if legal/compliance approval is completed.
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="saveLocally"
                  checked={saveLocally}
                  onCheckedChange={(checked) => setSaveLocally(checked === true)}
                />
                <Label htmlFor="saveLocally" className="text-sm">
                  Save latest result in my browser for later.
                </Label>
              </div>
            </div>

            <Button onClick={handleRoast} disabled={loading} className="w-full bg-orange-600 hover:bg-orange-700">
              {loading ? 'Roasting...' : 'Roast My Resume'}
            </Button>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {storageMessage && (
              <Alert>
                <AlertDescription>{storageMessage}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-orange-600" />
              Roast Result
            </CardTitle>
            <CardDescription>Your output appears here after analysis.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!result && <p className="text-sm text-gray-500">No roast yet. Submit your resume to get started.</p>}

            {result && (
              <>
                <div className="flex items-center justify-between rounded-lg border bg-white p-4">
                  <div>
                    <p className="text-sm text-gray-500">Hireability Score</p>
                    <p className="text-3xl font-bold text-gray-900">{result.hireabilityScore}/100</p>
                  </div>
                  <Badge className="bg-orange-100 text-orange-700">{result.headline}</Badge>
                </div>

                <div>
                  <h3 className="mb-2 font-semibold text-gray-900">Roast</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    {result.roast.map((item, idx) => (
                      <li key={idx} className="rounded-md border bg-red-50 p-2">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="mb-2 font-semibold text-gray-900">Quick Wins</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    {result.quickWins.map((item, idx) => (
                      <li key={idx} className="rounded-md border bg-green-50 p-2">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {result.missingKeywords.length > 0 && (
                  <div>
                    <h3 className="mb-2 font-semibold text-gray-900">Likely Missing Keywords</h3>
                    <div className="flex flex-wrap gap-2">
                      {result.missingKeywords.map((k, idx) => (
                        <Badge key={idx} variant="outline">
                          {k}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {result.rewrittenSummary && (
                  <div>
                    <h3 className="mb-2 font-semibold text-gray-900">Suggested Summary Rewrite</h3>
                    <p className="whitespace-pre-line rounded-md border bg-gray-50 p-3 text-sm text-gray-700">
                      {result.rewrittenSummary}
                    </p>
                  </div>
                )}

                <div className="rounded-lg border bg-blue-50 p-4">
                  <p className="text-sm text-blue-900">
                    Want the full optimization and downloadable version?
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Link href="/auth/signin?callbackUrl=/optimize">
                      <Button size="sm">
                        Optimize Full Resume <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href="/pricing">
                      <Button size="sm" variant="outline">
                        View Plans
                      </Button>
                    </Link>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
      )}
    </main>
  )
}
