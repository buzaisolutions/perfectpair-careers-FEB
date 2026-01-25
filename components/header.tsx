import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="container flex h-20 items-center justify-between">
        {/* Logo e Nome */}
        <Link href="/" className="flex items-center gap-2">
          {/* Garanta que o arquivo 'logo.png' ou 'logo.svg' esteja na pasta 'public' */}
          <div className="relative h-8 w-8">
             <Image src="/logo.png" alt="Perfect Pair Careers" width={32} height={32} className="object-contain" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-bold text-xl text-slate-900 tracking-tight">PerfectPair</span>
            <span className="text-sm font-medium text-slate-500">Careers</span>
          </div>
        </Link>
        
        {/* Botões do Lado Direito (Igual ao Original) */}
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
            Sign In
          </Link>
          <Link href="/dashboard">
            <Button className="bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg px-5 h-10 shadow-sm transition-all">
              Create Account
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}