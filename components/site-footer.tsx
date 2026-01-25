import Link from "next/link"

export function SiteFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-background py-6 md:py-0 mt-auto">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; {currentYear} <span className="font-semibold text-foreground">BuzAI Solutions</span>. All rights reserved.
          </p>
        </div>
        
        {/* Legal Links (EU Compliance) */}
        <nav className="flex gap-4 sm:gap-6">
          <Link href="/legal/terms" className="text-sm font-medium hover:underline underline-offset-4 text-muted-foreground hover:text-foreground">
            Terms of Service
          </Link>
          <Link href="/legal/privacy" className="text-sm font-medium hover:underline underline-offset-4 text-muted-foreground hover:text-foreground">
            Privacy Policy
          </Link>
          <Link href="/legal/cookies" className="text-sm font-medium hover:underline underline-offset-4 text-muted-foreground hover:text-foreground">
            Cookie Policy
          </Link>
        </nav>
      </div>
    </footer>
  )
}