import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"
import { Providers } from "@/components/providers" // <--- Importamos o novo arquivo

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PerfectPair Careers",
  description: "Optimize your resume with AI",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Envolvemos tudo com o Providers para a autenticação funcionar */}
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}