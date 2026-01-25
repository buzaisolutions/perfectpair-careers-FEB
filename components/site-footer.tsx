import Link from 'next/link'
import Image from 'next/image'

export function SiteFooter() {
  const currentYear = 2026
  
  return (
    <footer className="border-t bg-white">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col space-y-6">
          {/* Main Footer Content */}
          <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
            {/* Logo */}
            <div className="hidden md:flex items-center space-x-2">
              <Image 
                src="/logo.png" 
                alt="PerfectPair Careers" 
                width={180} 
                height={45}
                className="h-[45px] w-auto"
              />
            </div>
            
            {/* Navigation Links */}
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6">
              <Link href="/" className="text-sm text-gray-600 hover:text-primary">
                Home
              </Link>
              
              {/* --- MUDANÇA AQUI: mailto: para abrir o app de e-mail --- */}
              <Link href="mailto:contact@perfectpaircareers.com" className="text-sm text-gray-600 hover:text-primary">
                Contact
              </Link>
              {/* ----------------------------------------------------- */}

              <Link href="/legal/disclaimer" className="text-sm text-gray-600 hover:text-primary">
                Disclaimer
              </Link>
              <Link href="/legal/terms" className="text-sm text-gray-600 hover:text-primary">
                Terms of Service
              </Link>
              <Link href="/legal/privacy" className="text-sm text-gray-600 hover:text-primary">
                Privacy Policy
              </Link>
            </div>
            
            {/* Copyright */}
            <p className="text-sm text-gray-600 text-center md:text-left">
              © {currentYear} BuzAI Solutions. All rights reserved.
            </p>
          </div>
          
          {/* Legal Disclaimer Text */}
          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center max-w-4xl mx-auto">
              PerfectPair Careers is a technical document optimization tool. We do not guarantee job interviews, offers, or employment outcomes. 
              Hiring decisions are made by employers based on your actual qualifications and numerous other factors beyond document formatting.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}