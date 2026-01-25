import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, CheckCircle, XCircle, Shield } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

export function DisclaimerSection() {
  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto max-w-6xl px-4">
        <Card className="border-blue-200 shadow-lg">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Important Information About This Service
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert className="border-blue-200 bg-blue-50">
              <AlertCircle className="h-5 w-5 text-blue-600" />
              <AlertDescription className="text-blue-900 font-medium">
                PerfectPair Careers is a technical document optimization tool that restructures resumes and cover letters to improve ATS (Applicant Tracking System) readability.
              </AlertDescription>
            </Alert>

            <div className="grid gap-6 md:grid-cols-2">
              {/* What We Do */}
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center text-green-900">
                    <CheckCircle className="mr-2 h-5 w-5 text-green-600" />
                    What We Do
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-green-900">
                    <li className="flex items-start">
                      <span className="mr-2 text-green-600">•</span>
                      <span>Reformat your documents using ATS-compatible structure</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-green-600">•</span>
                      <span>Align existing qualifications with job keywords</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-green-600">•</span>
                      <span>Apply industry-standard formatting (section headers, action verbs, date formats)</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* What We DON'T Do */}
              <Card className="border-red-200 bg-red-50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center text-red-900">
                    <XCircle className="mr-2 h-5 w-5 text-red-600" />
                    What We DON'T Do
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-red-900">
                    <li className="flex items-start">
                      <span className="mr-2 text-red-600">•</span>
                      <span>Guarantee job interviews or offers</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-red-600">•</span>
                      <span>Invent skills or qualifications you don't have</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-red-600">•</span>
                      <span>Replace the need for relevant experience and qualifications</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-red-600">•</span>
                      <span>Ensure approval by human recruiters</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Your Responsibility */}
            <Card className="border-amber-200 bg-amber-50">
              <CardHeader>
                <CardTitle className="text-lg text-amber-900">
                  Your Responsibility
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-amber-900">
                <p className="flex items-start">
                  <span className="mr-2 text-amber-600 font-bold">→</span>
                  <span>Ensure all information in your documents is accurate and truthful</span>
                </p>
                <p className="flex items-start">
                  <span className="mr-2 text-amber-600 font-bold">→</span>
                  <span>Verify that optimized content correctly represents your experience</span>
                </p>
                <p className="flex items-start">
                  <span className="mr-2 text-amber-600 font-bold">→</span>
                  <span>Understand that hiring decisions depend on multiple factors beyond document formatting (experience, cultural fit, competition, company needs, etc.)</span>
                </p>
              </CardContent>
            </Card>

            {/* Bottom Note */}
            <div className="pt-4 border-t border-gray-200">
              <p className="text-center text-sm text-gray-700">
                <strong className="text-gray-900">Remember:</strong> This tool increases technical compatibility with ATS systems. 
                Final hiring decisions are made by employers based on your actual qualifications and their specific requirements.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
