import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4">
        {/* LADO ESQUERDO: LOGO */}
        <Link href="/" className="flex items-center space-x-2">
          <Image 
            src="/logo.png" 
            alt="PerfectPair Careers" 
            width={180} 
            height={50}
            className="h-10 w-auto object-contain"
            priority
          />
        </Link>

        {/* CENTRO: VAZIO (Links removidos para limpar o visual) */}
        <div className="flex-1" />

        {/* LADO DIREITO: BOTÕES DE ACESSO */}
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