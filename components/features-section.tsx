
'use client'

import { CheckCircle, FileText, Zap, Globe, BarChart, Download } from 'lucide-react'
import { motion } from 'framer-motion'

const features = [
  {
    icon: CheckCircle,
    title: 'ATS Compliance',
    description: 'Optimizes formatting and structure to improve compatibility with applicant tracking systems.',
    color: 'text-green-600',
    bgColor: 'bg-green-100'
  },
  {
    icon: Zap,
    title: 'Instant Optimization',
    description: 'Fast technical optimization process with detailed feedback on structural improvements.',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100'
  },
  {
    icon: Globe,
    title: 'European Market Focus',
    description: 'Document formatting tailored for European recruitment standards and common ATS systems used in the region.',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100'
  },
  {
    icon: BarChart,
    title: 'Technical ATS Score',
    description: 'Receive an objective ATS compatibility score based on formatting elements and specific improvement suggestions.',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100'
  },
  {
    icon: FileText,
    title: 'Cover Letter Formatting',
    description: 'Create technically optimized cover letters aligned with job posting requirements.',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100'
  },
  {
    icon: Download,
    title: 'PDF Download',
    description: 'Download your optimized documents in professional PDF format ready to send.',
    color: 'text-red-600',
    bgColor: 'bg-red-100'
  }
]

export function FeaturesSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Why choose PerfectPair Careers?
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Our platform offers everything you need to stand out in the European market.
          </p>
        </div>
        
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features?.map?.((feature, index) => {
            const IconComponent = feature?.icon
            return (
              <motion.div
                key={index}
                className="relative rounded-2xl border border-gray-200 p-8 shadow-sm hover:shadow-md transition-shadow duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${feature?.bgColor} mb-4`}>
                  <IconComponent className={`h-6 w-6 ${feature?.color}`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature?.title}
                </h3>
                <p className="text-gray-600">
                  {feature?.description}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
