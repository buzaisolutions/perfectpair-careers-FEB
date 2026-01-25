export default function CookiesPage() {
  return (
    <div className="container max-w-4xl py-12">
      <h1 className="text-4xl font-bold mb-8">Cookie Policy</h1>
      <div className="prose prose-slate max-w-none text-muted-foreground">
        
        <p className="mb-6">Last Updated: January 2026</p>

        <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">1. What Are Cookies?</h2>
        <p>
          Cookies are small text files stored on your device when you visit our website. They help us ensure the website functions correctly.
        </p>

        <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">2. Types of Cookies We Use</h2>
        
        <h3 className="text-xl font-medium text-foreground mt-4 mb-2">Strictly Necessary Cookies</h3>
        <p>
          These are essential for the website to function (e.g., keeping you logged in). You cannot switch these off.
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li><strong>Session Cookies:</strong> Used by NextAuth.js to maintain your secure session.</li>
          <li><strong>Security Cookies:</strong> Used to prevent Cross-Site Request Forgery (CSRF).</li>
        </ul>

        <h3 className="text-xl font-medium text-foreground mt-4 mb-2">Analytics Cookies (Optional)</h3>
        <p>
          We may use Vercel Analytics to understand how visitors interact with the website. These collect data anonymously.
        </p>

        <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">3. Managing Cookies</h2>
        <p>
          You can set your browser to block cookies, but some parts of our site (like the Dashboard) may not work properly.
        </p>
      </div>
    </div>
  )
}