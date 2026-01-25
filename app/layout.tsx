import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { SessionProvider } from '@/components/providers'
import { Toaster } from 'sonner' // <--- CORREÇÃO: Usando sonner para combinar com o pagamento

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PerfectPair Careers - AI-Powered Resume Optimizer',
  description: 'Optimize your resume and cover letter with AI for the European market. Increase your chances of passing ATS systems.',
  keywords: ['resume', 'cover letter', 'AI', 'ATS', 'Europe', 'optimization', 'careers'],
  authors: [{ name: 'PerfectPair Careers' }],
  robots: 'index, follow',
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            {/* O Toaster do sonner precisa estar aqui para os avisos de pagamento aparecerem */}
            <Toaster position="top-center" richColors />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}