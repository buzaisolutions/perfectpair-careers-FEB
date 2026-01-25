
'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, FileText, Sparkles, Globe } from 'lucide-react'
import { motion } from 'framer-motion'

export function HeroSection() {
  const { data: session } = useSession()

  return (
    <section className="relative py-20 lg:py-32 bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-6 inline-flex items-center rounded-full border bg-white/80 px-4 py-2 text-sm shadow-sm">
              <Sparkles className="mr-2 h-4 w-4 text-purple-600" />
              AI-powered document formatting for ATS compatibility
            </div>
            
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
              Optimize your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">resume</span> with AI
            </h1>
            
            <p className="mb-8 text-xl text-gray-600 sm:text-2xl max-w-3xl mx-auto">
              Improve your resume's technical compatibility with ATS systems using ethical AI that works with your real qualifications.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {session ? (
                <Button size="lg" className="group" asChild>
                  <Link href="/dashboard">
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              ) : (
                <>
                  <Button size="lg" className="group" asChild>
                    <Link href="/auth/signup">
                      Get Started Free
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/auth/signin">
                      I already have an account
                    </Link>
                  </Button>
                </>
              )}
            </div>
            
            <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
              <motion.div 
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="mb-3 rounded-full bg-purple-100 p-3">
                  <FileText className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900">ATS Compliant</h3>
                <p className="text-sm text-gray-600 text-center">
                  Optimization for applicant tracking systems
                </p>
              </motion.div>
              
              <motion.div 
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <div className="mb-3 rounded-full bg-blue-100 p-3">
                  <Sparkles className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Advanced AI</h3>
                <p className="text-sm text-gray-600 text-center">
                  Intelligent job analysis and personalized optimization
                </p>
              </motion.div>
              
              <motion.div 
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <div className="mb-3 rounded-full bg-indigo-100 p-3">
                  <Globe className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Ethical AI</h3>
                <p className="text-sm text-gray-600 text-center">
                  Based on your actual qualifications and experience
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
