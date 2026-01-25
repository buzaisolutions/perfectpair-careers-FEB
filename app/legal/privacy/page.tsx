'use client'

import { Header } from '@/components/header'
import { SiteFooter } from '@/components/site-footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Lock, Eye, Database, Shield, UserX, Globe } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto max-w-4xl px-4 py-12">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <Lock className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900">Privacy Policy</h1>
          <p className="mt-2 text-lg text-gray-600">
            How we protect your personal data
          </p>
          <p className="mt-2 text-sm text-gray-500">
            GDPR Compliant | Last updated: January 2, 2026
          </p>
        </div>

        <div className="space-y-6">
          {/* Introduction */}
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <p className="text-blue-900">
                <strong>BuzAI Solutions</strong> ("we," "us," or "our") operates PerfectPair Careers. We are committed 
                to protecting your personal data and respecting your privacy in accordance with the General Data Protection 
                Regulation (GDPR) and applicable data protection laws.
              </p>
            </CardContent>
          </Card>

          {/* Data Controller */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5 text-gray-600" />
                1. Data Controller
              </CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <div className="space-y-2">
                <p>
                  <strong>Data Controller:</strong> BuzAI Solutions
                </p>
                <p>
                  <strong>Contact Email:</strong> contact@perfectpaircareers.com
                </p>
                <p>
                  We are the data controller responsible for your personal data collected through the Service.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Data We Collect */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="mr-2 h-5 w-5 text-gray-600" />
                2. Data We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p className="font-semibold mb-3">We collect the following types of personal data:</p>
              
              <div className="space-y-4">
                <div>
                  <p className="font-semibold">Account Information:</p>
                  <ul className="list-disc ml-6">
                    <li>Full name</li>
                    <li>Email address</li>
                    <li>Password (encrypted)</li>
                    <li>Account creation date</li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold">Document Content:</p>
                  <ul className="list-disc ml-6">
                    <li>Resume/CV content (education, work experience, skills)</li>
                    <li>Cover letter content</li>
                    <li>Job descriptions you submit for optimization</li>
                    <li>Optimization history and results</li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold">Payment Information:</p>
                  <ul className="list-disc ml-6">
                    <li>Transaction history</li>
                    <li>Payment method (processed by Stripe/PayPal - we do not store full card details)</li>
                    <li>Billing address (if provided)</li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold">Technical Data:</p>
                  <ul className="list-disc ml-6">
                    <li>IP address</li>
                    <li>Browser type and version</li>
                    <li>Device information</li>
                    <li>Usage data (pages visited, features used)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Legal Basis */}
          <Card>
            <CardHeader>
              <CardTitle>3. Legal Basis for Processing</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>We process your personal data based on:</p>
              <ul className="list-disc ml-6 space-y-2">
                <li>
                  <strong>Contract Performance:</strong> To provide the Service you purchased or subscribed to
                </li>
                <li>
                  <strong>Legitimate Interest:</strong> To improve the Service, prevent fraud, and ensure security
                </li>
                <li>
                  <strong>Legal Obligation:</strong> To comply with tax, accounting, and legal requirements
                </li>
                <li>
                  <strong>Consent:</strong> Where required by law, such as for marketing communications (you may withdraw consent at any time)
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* How We Use Data */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="mr-2 h-5 w-5 text-gray-600" />
                4. How We Use Your Data
              </CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>We use your personal data to:</p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Provide and deliver the optimization services you requested</li>
                <li>Process payments and maintain transaction records</li>
                <li>Send service-related communications (account updates, optimization results)</li>
                <li>Improve our AI algorithms and service quality</li>
                <li>Detect and prevent fraud, abuse, or security issues</li>
                <li>Comply with legal obligations (tax reporting, anti-money laundering)</li>
                <li>Respond to your support requests</li>
              </ul>
              <p className="mt-4 font-semibold">
                We do NOT sell your personal data to third parties.
              </p>
            </CardContent>
          </Card>

          {/* Data Sharing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="mr-2 h-5 w-5 text-gray-600" />
                5. Data Sharing and Third Parties
              </CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p className="font-semibold mb-3">We share your data only with:</p>
              
              <div className="space-y-3">
                <div>
                  <p className="font-semibold">Payment Processors:</p>
                  <ul className="list-disc ml-6">
                    <li>Stripe (for credit/debit card payments)</li>
                    <li>PayPal (for PayPal payments)</li>
                  </ul>
                  <p className="text-sm text-gray-600 mt-1">
                    These providers have their own privacy policies and are responsible for the security of payment data.
                  </p>
                </div>

                <div>
                  <p className="font-semibold">AI Service Providers:</p>
                  <ul className="list-disc ml-6">
                    <li>Abacus.AI (for AI-powered optimization processing)</li>
                  </ul>
                  <p className="text-sm text-gray-600 mt-1">
                    Your document content is processed to generate optimizations. We use secure API connections.
                  </p>
                </div>

                <div>
                  <p className="font-semibold">Cloud Hosting:</p>
                  <ul className="list-disc ml-6">
                    <li>AWS (for secure data storage and hosting)</li>
                  </ul>
                  <p className="text-sm text-gray-600 mt-1">
                    Data is stored in EU data centers where possible to comply with GDPR.
                  </p>
                </div>

                <div>
                  <p className="font-semibold">Legal Requirements:</p>
                  <p className="text-sm text-gray-600">
                    We may disclose data if required by law, court order, or government authority.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Retention */}
          <Card>
            <CardHeader>
              <CardTitle>6. Data Retention</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>We retain your personal data for:</p>
              <ul className="list-disc ml-6 space-y-2">
                <li>
                  <strong>Active Accounts:</strong> Duration of your account + 30 days after deletion request
                </li>
                <li>
                  <strong>Transaction Records:</strong> 7 years (for tax and accounting compliance)
                </li>
                <li>
                  <strong>Document Content:</strong> Until account deletion (you can delete documents anytime)
                </li>
                <li>
                  <strong>Technical Logs:</strong> 90 days (for security and debugging)
                </li>
              </ul>
              <p className="mt-4">
                After retention periods, data is permanently deleted from our systems.
              </p>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center text-green-900">
                <UserX className="mr-2 h-5 w-5 text-green-600" />
                7. Your GDPR Rights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-green-900">
              <p className="font-semibold">Under GDPR, you have the right to:</p>
              <ul className="list-disc ml-6 space-y-2">
                <li>
                  <strong>Access:</strong> Request a copy of all personal data we hold about you
                </li>
                <li>
                  <strong>Rectification:</strong> Correct inaccurate or incomplete data
                </li>
                <li>
                  <strong>Erasure ("Right to be Forgotten"):</strong> Request deletion of your personal data
                </li>
                <li>
                  <strong>Restriction:</strong> Limit how we process your data
                </li>
                <li>
                  <strong>Portability:</strong> Receive your data in a machine-readable format
                </li>
                <li>
                  <strong>Object:</strong> Object to processing based on legitimate interest
                </li>
                <li>
                  <strong>Withdraw Consent:</strong> Withdraw consent for marketing or other optional processing
                </li>
                <li>
                  <strong>Lodge a Complaint:</strong> File a complaint with your local data protection authority
                </li>
              </ul>
              <p className="mt-4 font-semibold">
                To exercise any of these rights, contact us at: contact@perfectpaircareers.com
              </p>
              <p className="text-sm">
                We will respond within 30 days.
              </p>
            </CardContent>
          </Card>

          {/* Data Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5 text-gray-600" />
                8. Data Security
              </CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>We implement industry-standard security measures:</p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Encryption in transit (HTTPS/TLS)</li>
                <li>Encryption at rest for sensitive data</li>
                <li>Password hashing with bcrypt</li>
                <li>Regular security audits and updates</li>
                <li>Access controls and authentication</li>
                <li>Secure cloud infrastructure (AWS)</li>
              </ul>
              <p className="mt-4">
                However, no system is 100% secure. We cannot guarantee absolute security but take all reasonable precautions.
              </p>
            </CardContent>
          </Card>

          {/* Cookies */}
          <Card>
            <CardHeader>
              <CardTitle>9. Cookies and Tracking</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>We use essential cookies to:</p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Maintain your login session</li>
                <li>Remember your preferences</li>
                <li>Ensure security</li>
              </ul>
              <p className="mt-4">
                We do not use third-party advertising or tracking cookies. You can disable cookies in your browser settings, 
                but this may affect functionality.
              </p>
            </CardContent>
          </Card>

          {/* International Transfers */}
          <Card>
            <CardHeader>
              <CardTitle>10. International Data Transfers</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>
                Your data may be processed outside the European Economic Area (EEA) by our service providers (e.g., Abacus.AI). 
                We ensure adequate protection through:
              </p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Standard Contractual Clauses (SCCs)</li>
                <li>Service providers with GDPR-compliant practices</li>
                <li>Encryption during transfer</li>
              </ul>
            </CardContent>
          </Card>

          {/* Children's Privacy */}
          <Card>
            <CardHeader>
              <CardTitle>11. Children's Privacy</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>
                Our Service is not intended for individuals under 16 years of age. We do not knowingly collect data from children. 
                If you believe we have inadvertently collected data from a child, please contact us immediately.
              </p>
            </CardContent>
          </Card>

          {/* Changes to Policy */}
          <Card>
            <CardHeader>
              <CardTitle>12. Changes to This Privacy Policy</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>
                We may update this Privacy Policy from time to time. Significant changes will be communicated via email or 
                in-app notification. The "Last updated" date at the top indicates when changes were made.
              </p>
              <p className="mt-3">
                Continued use of the Service after changes constitutes acceptance of the updated policy.
              </p>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-blue-900">13. Contact Us</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none text-blue-900">
              <p>
                If you have questions about this Privacy Policy or how we handle your data, please contact us:
              </p>
              <div className="mt-3 space-y-1">
                <p>
                  <strong>Email:</strong> contact@perfectpaircareers.com
                </p>
                <p>
                  <strong>Data Controller:</strong> BuzAI Solutions
                </p>
              </div>
              <p className="mt-3 text-sm">
                <strong>EU Data Protection Authority:</strong> You may also file a complaint with your local data protection 
                authority if you believe we have violated your privacy rights.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <SiteFooter />
    </div>
  )
}
