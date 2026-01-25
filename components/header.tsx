import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-3">
          {/* ⚠️ CERTIFIQUE-SE QUE O ARQUIVO 'logo.png' ESTÁ NA PASTA 'public/' DO PROJETO.
             Se for .svg ou outro nome, altere abaixo.
          */}
          <div className="relative h-8 w-8 overflow-hidden rounded-md">
             {/* Se não tiver a logo ainda, comente a linha abaixo e use o ícone padrão */}
             <Image src="/logo.png" alt="Perfect Pair Careers Logo" fill className="object-cover" />
          </div>
          <span className="font-bold text-xl hidden sm:inline-block">
            Perfect Pair <span className="text-indigo-600">Careers</span>
          </span>
        </Link>
        
        <nav className="hidden md:flex gap-6 text-sm font-medium">
          {/* Estes links agora vão funcionar porque adicionamos os IDs nas seções */}
          <Link href="#features" className="hover:text-primary transition-colors">Features</Link>
          <Link href="#pricing" className="hover:text-primary transition-colors">Pricing</Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="default" size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}