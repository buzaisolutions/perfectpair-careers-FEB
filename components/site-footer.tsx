import Link from "next/link"

export function SiteFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-white py-8 mt-auto">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex flex-col items-center gap-2 md:items-start">
          <p className="text-sm text-slate-500">
            &copy; {currentYear} <span className="font-semibold text-slate-900">BuzAI Solutions</span>. All rights reserved.
          </p>
          <p className="text-xs text-slate-400">
            Perfect Pair Careers is a product of BuzAI Solutions.
          </p>
        </div>
        
        {/* Links Legais (Obrigatórios na UE) */}
        <nav className="flex gap-6">
          <Link href="/legal/terms" className="text-sm font-medium text-slate-500 hover:text-slate-900 hover:underline underline-offset-4">
            Terms of Service
          </Link>
          <Link href="/legal/privacy" className="text-sm font-medium text-slate-500 hover:text-slate-900 hover:underline underline-offset-4">
            Privacy Policy
          </Link>
          <Link href="/legal/cookies" className="text-sm font-medium text-slate-500 hover:text-slate-900 hover:underline underline-offset-4">
            Cookie Policy
          </Link>
        </nav>
      </div>
    </footer>
  )
}