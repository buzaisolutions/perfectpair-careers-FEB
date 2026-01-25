import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

// IMPORTANTE: Sem "default" aqui, para funcionar com { Header } nas outras páginas
export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
           {/* Garanta que o logo existe em public/logo.png, senão use texto */}
           <span className="font-bold sm:inline-block">PerfectPair Careers</span>
        </Link>
        <nav className="flex flex-1 items-center space-x-6 text-sm font-medium">
          <Link href="/optimize" className="transition-colors hover:text-foreground/80 text-foreground/60">
            Optimize
          </Link>
          <Link href="/dashboard" className="transition-colors hover:text-foreground/80 text-foreground/60">
            Dashboard
          </Link>
        </nav>
        <div className="flex items-center space-x-4">
          <Link href="/auth/signin">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
          </Link>
          <Link href="/auth/register">
            <Button size="sm">Create Account</Button>
          </Link>
        </div>
      </div>
    </header>
  )
}