export default function TermsPage() {
  return (
    <div className="container max-w-4xl py-12">
      <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
      <div className="prose prose-slate max-w-none text-muted-foreground">
        
        <p className="mb-6">Last Updated: January 2026</p>

        <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">1. Introduction</h2>
        <p>
          Welcome to <strong>BuzAI Solutions</strong> ("we," "our," or "us"). By accessing or using our resume optimization services (the "Service"), 
          you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the Service.
        </p>

        <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">2. AI-Generated Content Disclaimer</h2>
        <p>
          Our Service utilizes Artificial Intelligence (AI) technologies (including Google Gemini) to generate resume suggestions. 
          <strong>You acknowledge that:</strong>
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>AI output may contain inaccuracies, hallucinations, or errors.</li>
          <li>We do not guarantee job interviews, employment offers, or specific career outcomes.</li>
          <li>You are solely responsible for reviewing, verifying, and editing the final content before submitting it to any employer.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">3. User Accounts & Credits</h2>
        <p>
          You are responsible for maintaining the confidentiality of your account. Credits purchased for resume optimizations 
          are non-refundable unless required by applicable EU consumer law.
        </p>

        <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">4. Intellectual Property</h2>
        <p>
          The generated content is yours to use for your personal career advancement. However, the underlying software, 
          brand, and methodology remain the exclusive property of BuzAI Solutions.
        </p>

        <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">5. Governing Law</h2>
        <p>
          These Terms shall be governed by and defined following the laws of <strong>The Netherlands</strong>. 
          BuzAI Solutions and yourself irrevocably consent that the courts of The Netherlands shall have exclusive jurisdiction to resolve any dispute which may arise in connection with these terms.
        </p>

        <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">6. Contact Us</h2>
        <p>
          If you have any questions about these Terms, please contact us at: support@buzaisolutions.com
        </p>
      </div>
    </div>
  )
}