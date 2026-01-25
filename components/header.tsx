import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 font-bold text-xl">
          <span className="text-indigo-600">BuzAI</span> Careers
        </Link>
        
        <nav className="hidden md:flex gap-6 text-sm font-medium">
          <Link href="#features" className="hover:text-primary transition-colors">Features</Link>
          <Link href="#pricing" className="hover:text-primary transition-colors">Pricing</Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/dashboard">
             {/* Este botão leva direto para a ferramenta */}
            <Button variant="default" size="sm" className="bg-indigo-600 hover:bg-indigo-700">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}