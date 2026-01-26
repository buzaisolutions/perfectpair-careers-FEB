import { Suspense } from 'react'
import { SignUpForm } from './_components/signup-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative">
      
      {/* 1. Botão Voltar para Home (Posicionado no canto superior esquerdo) */}
      <Link 
        href="/" 
        className="absolute left-4 top-4 md:left-8 md:top-8 flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Link>

      <div className="max-w-md w-full space-y-8">
        <div className="text-center flex justify-center">
          {/* 2. Logo substituindo o texto antigo */}
          <Link href="/" className="mb-6">
            <Image 
              src="/logo.png" 
              alt="PerfectPair Careers" 
              width={220} 
              height={80}
              className="h-16 w-auto object-contain"
              priority
            />
          </Link>
        </div>
        
        <Card className="shadow-lg border-slate-200">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Create your account</CardTitle>
            <CardDescription className="text-center">
              Fill in the information below to create your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Loading...</div>}>
              {/* O formulário (e o upload de currículo) vive aqui dentro */}
              <SignUpForm />
            </Suspense>
            
            <div className="mt-6 text-center">
              <span className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link href="/auth/signin" className="font-medium text-primary hover:underline">
                  Sign in
                </Link>
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}