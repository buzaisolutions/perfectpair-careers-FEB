import { Header } from '@/components/header'
import { SiteFooter } from '@/components/site-footer'
import { ResumeRoastContent } from './_components/resume-roast-content'

export default function ResumeRoastPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <ResumeRoastContent />
      <SiteFooter />
    </div>
  )
}

