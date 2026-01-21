
import Link from 'next/link'
import Image from 'next/image'

export function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="border-t bg-white">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
          {/* Logo - Hidden on mobile, visible on desktop */}
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
          <div className="flex items-center space-x-6">
            <Link href="/" className="text-sm text-gray-600 hover:text-primary">
              Home
            </Link>
            <Link href="mailto:contact@perfectpair.careers" className="text-sm text-gray-600 hover:text-primary">
              Contact
            </Link>
          </div>
          
          {/* Copyright - Visible on all devices */}
          <p className="text-sm text-gray-600 text-center md:text-left">
            © {currentYear} PerfectPair Careers. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
