'use client'

import { Header } from '@/components/header'
import { SiteFooter } from '@/components/site-footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto max-w-4xl px-4 py-12">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900">Terms of Service</h1>
          <p className="mt-2 text-lg text-gray-600">
            Legal terms governing your use of PerfectPair Careers
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Last updated: January 2, 2026
          </p>
        </div>

        <div className="space-y-6">
          {/* Acceptance */}
          <Card>
            <CardHeader>
              <CardTitle>1. Acceptance of Terms</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>
                By accessing or using PerfectPair Careers ("the Service"), you agree to be bound by these Terms of Service. 
                If you do not agree to these terms, you may not use the Service.
              </p>
              <p className="mt-3">
                These terms apply to all users, including free trial users and paying subscribers.
              </p>
            </CardContent>
          </Card>

          {/* Service Description */}
          <Card>
            <CardHeader>
              <CardTitle>2. Service Description</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>PerfectPair Careers provides:</p>
              <ul className="list-disc ml-6 space-y-2">
                <li>AI-powered resume and cover letter formatting optimization</li>
                <li>ATS compatibility analysis and scoring</li>
                <li>Keyword alignment with job descriptions</li>
                <li>Technical document restructuring</li>
              </ul>
              <p className="mt-4 font-semibold">
                The Service does NOT provide employment guarantees, career counseling, or professional advice.
              </p>
            </CardContent>
          </Card>

          {/* User Obligations */}
          <Card className="border-amber-200 bg-amber-50">
            <CardHeader>
              <CardTitle className="flex items-center text-amber-900">
                <AlertTriangle className="mr-2 h-5 w-5 text-amber-600" />
                3. User Obligations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-amber-900">
              <p className="font-semibold">You agree to:</p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Provide accurate and truthful information in your documents</li>
                <li>Review and verify all optimized content before use</li>
                <li>Use the Service only for legitimate job application purposes</li>
                <li>Maintain the confidentiality of your account credentials</li>
                <li>Comply with all applicable laws and regulations</li>
              </ul>
              <p className="mt-4 font-semibold">You agree NOT to:</p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Fabricate qualifications, skills, or experience</li>
                <li>Create fraudulent or misleading documents</li>
                <li>Use the Service for any illegal or unethical purpose</li>
                <li>Attempt to reverse engineer or misuse the Service</li>
                <li>Share your account with unauthorized users</li>
              </ul>
            </CardContent>
          </Card>

          {/* Payment Terms */}
          <Card>
            <CardHeader>
              <CardTitle>4. Payment and Refund Policy</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p className="font-semibold">Pricing:</p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Resume Optimization: €9.99 (one-time payment)</li>
                <li>Resume + Cover Letter: €14.99 (one-time payment)</li>
                <li>Monthly Plan: €29.99/month (recurring subscription)</li>
              </ul>
              <p className="mt-4 font-semibold">Refund Policy:</p>
              <p>
                Due to the immediate digital nature of the Service, refunds are evaluated on a case-by-case basis. 
                Refund requests must be submitted within 7 days of purchase with a clear explanation of technical 
                failures or service defects.
              </p>
              <p className="mt-3">
                <strong>No refunds will be issued for:</strong>
              </p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Unsuccessful job applications or lack of interview invitations</li>
                <li>Dissatisfaction with employment outcomes</li>
                <li>User error or failure to review optimized content</li>
                <li>Change of mind after service delivery</li>
              </ul>
            </CardContent>
          </Card>

          {/* Intellectual Property */}
          <Card>
            <CardHeader>
              <CardTitle>5. Intellectual Property</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>
                <strong>Your Content:</strong> You retain all rights to your original resume and cover letter content. 
                By using the Service, you grant us a limited license to process, optimize, and store your documents 
                for the purpose of providing the Service.
              </p>
              <p className="mt-3">
                <strong>Our Technology:</strong> The Service, including all software, algorithms, designs, and branding, 
                is owned by BuzAI Solutions and protected by intellectual property laws.
              </p>
              <p className="mt-3">
                <strong>Optimized Content:</strong> While you retain ownership of your content, we do not claim ownership 
                of AI-generated optimizations. You are free to use, modify, or discard optimized documents.
              </p>
            </CardContent>
          </Card>

          {/* Data Retention */}
          <Card>
            <CardHeader>
              <CardTitle>6. Data Retention and Deletion</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>
                We retain your documents and optimization history for the duration of your account. You may request 
                deletion of your data at any time by contacting support.
              </p>
              <p className="mt-3">
                Upon account deletion, all personal data will be permanently removed within 30 days, except where 
                retention is required by law.
              </p>
            </CardContent>
          </Card>

          {/* Disclaimers */}
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center text-red-900">
                <XCircle className="mr-2 h-5 w-5 text-red-600" />
                7. Disclaimers and Limitations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-red-900">
              <p className="font-semibold">The Service is provided "AS IS" without warranties of any kind.</p>
              <p>We disclaim all warranties, including:</p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Fitness for a particular purpose</li>
                <li>Accuracy or completeness of optimizations</li>
                <li>Uninterrupted or error-free operation</li>
                <li>Specific employment outcomes</li>
              </ul>
              <p className="mt-4 font-semibold">
                Our liability is limited to the amount you paid for the Service. We are not liable for indirect, 
                incidental, or consequential damages.
              </p>
            </CardContent>
          </Card>

          {/* Termination */}
          <Card>
            <CardHeader>
              <CardTitle>8. Termination</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>
                We reserve the right to suspend or terminate your account if you violate these Terms of Service, 
                engage in fraudulent activity, or misuse the Service.
              </p>
              <p className="mt-3">
                You may terminate your account at any time. Monthly subscriptions can be cancelled from your account 
                settings and will not renew after the current billing period.
              </p>
            </CardContent>
          </Card>

          {/* Governing Law */}
          <Card>
            <CardHeader>
              <CardTitle>9. Governing Law</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>
                These Terms of Service are governed by the laws of Portugal. Any disputes will be resolved in 
                Portuguese courts.
              </p>
            </CardContent>
          </Card>

          {/* Changes to Terms */}
          <Card>
            <CardHeader>
              <CardTitle>10. Changes to Terms</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>
                We may update these Terms of Service from time to time. Significant changes will be communicated via 
                email or in-app notification. Continued use of the Service after changes constitutes acceptance of 
                the updated terms.
              </p>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-blue-900">11. Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none text-blue-900">
              <p>
                If you have questions about these Terms of Service, please contact us:
              </p>
              <div className="mt-3 space-y-1">
                <p>
                  <strong>Email:</strong> contact@perfectpaircareers.com
                </p>
                <p>
                  <strong>Company:</strong> BuzAI Solutions
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <SiteFooter />
    </div>
  )
}
