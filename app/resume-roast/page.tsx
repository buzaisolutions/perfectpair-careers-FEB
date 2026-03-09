import { Suspense } from 'react'
import { Header } from '@/components/header'
import { SiteFooter } from '@/components/site-footer'
import { ResumeRoastContent } from './_components/resume-roast-content'

export default function ResumeRoastPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Suspense fallback={<main className="container mx-auto max-w-6xl px-4 py-10">Loading...</main>}>
        <ResumeRoastContent />
      </Suspense>
      <SiteFooter />
    </div>
  )
}
