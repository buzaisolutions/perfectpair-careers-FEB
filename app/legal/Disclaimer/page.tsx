'use client'

import { Header } from '@/components/header'
import { SiteFooter } from '@/components/site-footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, AlertTriangle, Info, FileWarning, Scale } from 'lucide-react'

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto max-w-4xl px-4 py-12">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <Shield className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900">Service Disclaimer</h1>
          <p className="mt-2 text-lg text-gray-600">
            Important information about using PerfectPair Careers
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Last updated: January 2, 2026
          </p>
        </div>

        <div className="space-y-6">
          {/* Nature of Service */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Info className="mr-2 h-5 w-5 text-blue-600" />
                Nature of the Service
              </CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>
                PerfectPair Careers is an AI-powered document formatting tool designed to improve the technical readability 
                of resumes and cover letters for Applicant Tracking Systems (ATS). Our service restructures, reformats, and 
                optimizes your existing qualifications to better align with standard ATS parsing requirements.
              </p>
            </CardContent>
          </Card>

          {/* No Employment Guarantees */}
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center text-red-900">
                <AlertTriangle className="mr-2 h-5 w-5 text-red-600" />
                No Employment Guarantees
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-red-900">
              <p className="font-semibold">We explicitly DO NOT guarantee:</p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Job interviews or interview invitations</li>
                <li>Job offers or employment</li>
                <li>That your application will pass any specific ATS system</li>
                <li>That your application will be reviewed by human recruiters</li>
                <li>Any specific outcome from your job applications</li>
              </ul>
              <p className="mt-4 font-semibold">
                Hiring decisions are made by employers based on numerous factors beyond document formatting, including:
              </p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Your actual qualifications and experience</li>
                <li>Competition from other candidates</li>
                <li>Company-specific requirements and culture fit</li>
                <li>Budget constraints and headcount availability</li>
                <li>Internal referrals and networking</li>
                <li>Timing and market conditions</li>
              </ul>
            </CardContent>
          </Card>

          {/* User Responsibility */}
          <Card className="border-amber-200 bg-amber-50">
            <CardHeader>
              <CardTitle className="flex items-center text-amber-900">
                <FileWarning className="mr-2 h-5 w-5 text-amber-600" />
                User Responsibility
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-amber-900">
              <p className="font-semibold">By using this service, you acknowledge and accept that:</p>
              <ul className="list-disc ml-6 space-y-2">
                <li>
                  <strong>Accuracy:</strong> You are solely responsible for the accuracy and truthfulness of all content 
                  in your documents. We do not verify qualifications.
                </li>
                <li>
                  <strong>Verification:</strong> You must verify that optimized versions correctly represent your 
                  experience and qualifications before submitting them.
                </li>
                <li>
                  <strong>No Fabrication:</strong> You must not add skills or experiences you do not possess, even if 
                  identified as "missing requirements."
                </li>
                <li>
                  <strong>Legal Consequences:</strong> Misrepresentation on job applications can have serious legal and 
                  professional consequences, including job loss, legal action, and career damage.
                </li>
                <li>
                  <strong>Final Decision:</strong> You make the final decision to use, modify, or reject our optimizations.
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Technical Limitations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Info className="mr-2 h-5 w-5 text-gray-600" />
                Technical Limitations
              </CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p className="font-semibold mb-3">Our AI system has limitations:</p>
              <ul className="list-disc ml-6 space-y-2">
                <li>
                  <strong>Pattern Analysis:</strong> Our AI analyzes patterns but cannot guarantee perfection or 
                  understand nuanced context like human recruiters.
                </li>
                <li>
                  <strong>ATS Variability:</strong> Different companies use different ATS systems with varying parsing 
                  algorithms and requirements. We optimize for general best practices, not specific systems.
                </li>
                <li>
                  <strong>Industry Differences:</strong> Optimization reflects general best practices and may not capture 
                  industry-specific or company-specific nuances.
                </li>
                <li>
                  <strong>Language Limitations:</strong> AI-generated content may occasionally contain grammatical errors, 
                  awkward phrasing, or cultural inappropriateness.
                </li>
                <li>
                  <strong>No Real-Time Updates:</strong> ATS standards evolve. Our optimization reflects best practices 
                  at the time of service, which may become outdated.
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* No Professional Advice */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Info className="mr-2 h-5 w-5 text-gray-600" />
                No Professional Advice
              </CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>This service does not constitute:</p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Career counseling or professional career advice</li>
                <li>Guidance on career decisions, job selection, or employment strategies</li>
                <li>Legal, financial, or professional consulting services</li>
                <li>Endorsement of any particular career path or employer</li>
              </ul>
              <p className="mt-4">
                For personalized career guidance, consult qualified career professionals, career coaches, or employment counselors.
              </p>
            </CardContent>
          </Card>

          {/* Limitation of Liability */}
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Scale className="mr-2 h-5 w-5 text-gray-600" />
                Limitation of Liability
              </CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p className="font-semibold mb-3">PerfectPair Careers and its operators are NOT liable for:</p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Application rejections or lack of interview invitations</li>
                <li>Lost employment opportunities or career setbacks</li>
                <li>Employment outcomes or lack thereof</li>
                <li>Damages resulting from use or inability to use the service</li>
                <li>Errors, inaccuracies, or omissions in optimized content</li>
                <li>Actions taken based on our service or recommendations</li>
              </ul>
              <p className="mt-4 font-semibold">
                Our maximum liability is limited to the amount you paid for the specific service that gave rise to the claim.
              </p>
            </CardContent>
          </Card>

          {/* Fair Use */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5 text-blue-600" />
                Fair Use Policy
              </CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>This tool is intended for legitimate job applications only. You agree NOT to:</p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Create fraudulent or misleading documents</li>
                <li>Add qualifications, skills, or experiences you do not possess</li>
                <li>Misrepresent your education, employment history, or achievements</li>
                <li>Use the service for any illegal, unethical, or deceptive purpose</li>
              </ul>
              <p className="mt-4 font-semibold">
                We reserve the right to terminate service access for misuse, fraudulent activity, or violation of these terms.
              </p>
            </CardContent>
          </Card>

          {/* Acceptance */}
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <p className="text-blue-900 font-semibold">
                By using PerfectPair Careers, you acknowledge that you have read, understood, and agreed to this disclaimer 
                and accept full responsibility for how you use our service and the content it generates.
              </p>
              <p className="text-blue-900 mt-4">
                If you have questions about this disclaimer, please contact us at contact@perfectpaircareers.com.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <SiteFooter />
    </div>
  )
}
