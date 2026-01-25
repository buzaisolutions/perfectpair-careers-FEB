export default function PrivacyPage() {
  return (
    <div className="container max-w-4xl py-12">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
      <div className="prose prose-slate max-w-none text-muted-foreground">
        
        <p className="mb-6">Effective Date: January 2026</p>

        <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">1. General Information</h2>
        <p>
          <strong>BuzAI Solutions</strong> (located in The Netherlands) is committed to protecting your personal data in compliance with the 
          <strong>General Data Protection Regulation (GDPR)</strong>.
        </p>

        <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">2. Data We Collect</h2>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li><strong>Personal Identification:</strong> Name, email address (via Google/Login).</li>
          <li><strong>Professional Data:</strong> Resumes (PDF/DOCX), job descriptions, and cover letters you upload.</li>
          <li><strong>Usage Data:</strong> IP address, browser type, and interaction logs.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">3. How We Use Your Data</h2>
        <p>We use your data solely to:</p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Provide and maintain the Service.</li>
          <li>Process your resume using AI algorithms (via our sub-processor, Google Cloud/Gemini).</li>
          <li>Manage your account and subscription.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">4. Third-Party Sub-processors</h2>
        <p>
          To provide AI optimization, we transmit anonymized text data to <strong>Google LLC (Vertex AI/Gemini)</strong>. 
          Google does not use your data to train their models in our enterprise configuration.
        </p>

        <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">5. Your GDPR Rights</h2>
        <p>Under the GDPR, you have the right to:</p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li><strong>Access:</strong> Request copies of your personal data.</li>
          <li><strong>Rectification:</strong> Correct inaccurate information.</li>
          <li><strong>Erasure ("Right to be Forgotten"):</strong> Request that we delete your data from our servers.</li>
          <li><strong>Data Portability:</strong> Request transfer of your data.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">6. Data Retention</h2>
        <p>
          We retain your documents only as long as necessary to provide the service. You may delete your documents 
          at any time via your dashboard.
        </p>
      </div>
    </div>
  )
}