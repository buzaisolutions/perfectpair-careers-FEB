
'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  FileText, 
  Upload, 
  CreditCard, 
  BarChart3, 
  ArrowRight, 
  Sparkles,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { Header } from '@/components/header'
import { motion } from 'framer-motion'

interface DashboardStats {
  credits: number
  totalOptimizations: number
  recentOptimizations: any[]
  hasActiveSubscription: boolean
}

export function DashboardContent() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<DashboardStats>({
    credits: 0,
    totalOptimizations: 0,
    recentOptimizations: [],
    hasActiveSubscription: false
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/dashboard/stats')
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800'
      case 'PROCESSING':
        return 'bg-yellow-100 text-yellow-800'
      case 'FAILED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4" />
      case 'PROCESSING':
        return <Clock className="h-4 w-4" />
      case 'FAILED':
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto max-w-7xl px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Hello, {session?.user?.firstName || 'User'}! 👋
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Welcome to your PerfectPair Careers dashboard
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Credits</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.credits || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats?.hasActiveSubscription ? 'Unlimited' : 'Available'}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Optimizations</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalOptimizations || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    Total completed
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Status</CardTitle>
                  <Sparkles className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">Active</div>
                  <p className="text-xs text-muted-foreground">
                    Verified account
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Subscription</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats?.hasActiveSubscription ? 'Premium' : 'Basic'}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Current plan
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8"
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Upload className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-lg">Start Optimization</CardTitle>
                </div>
                <CardDescription>
                  Upload your resume and optimize for a specific job
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/optimize">
                    Optimize Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-green-600" />
                  <CardTitle className="text-lg">My Profile</CardTitle>
                </div>
                <CardDescription>
                  Complete your professional profile and manage your documents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" asChild className="w-full">
                  <Link href="/profile">
                    View Profile
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5 text-purple-600" />
                  <CardTitle className="text-lg">Credits & Plans</CardTitle>
                </div>
                <CardDescription>
                  Manage your credits or subscribe to a monthly plan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" asChild className="w-full">
                  <Link href="/billing">
                    Manage
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Optimizations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  Recent Optimizations
                </CardTitle>
                <CardDescription>
                  Your latest optimizations and their status
                </CardDescription>
              </CardHeader>
              <CardContent>
                {stats?.recentOptimizations && stats.recentOptimizations.length > 0 ? (
                  <div className="space-y-4">
                    {stats.recentOptimizations.map((optimization: any, index: number) => (
                      <div key={optimization?.id || index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center space-x-4">
                          <div className="p-2 rounded-full bg-blue-100">
                            <FileText className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">
                              {optimization?.jobPosting?.title || 'Job Not Specified'}
                            </p>
                            <p className="text-sm text-gray-600">
                              {optimization?.jobPosting?.company || 'Company not specified'} • {
                                optimization?.createdAt ? 
                                new Date(optimization.createdAt).toLocaleDateString('en-US') : 
                                'Date not available'
                              }
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={`${getStatusColor(optimization?.status || 'PENDING')} flex items-center space-x-1`}>
                            {getStatusIcon(optimization?.status || 'PENDING')}
                            <span>
                              {optimization?.status === 'COMPLETED' ? 'Completed' :
                               optimization?.status === 'PROCESSING' ? 'Processing' :
                               optimization?.status === 'FAILED' ? 'Failed' : 'Pending'}
                            </span>
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">
                      No optimizations yet
                    </h3>
                    <p className="mt-2 text-gray-600">
                      Start by creating your first resume optimization!
                    </p>
                    <Button asChild className="mt-4">
                      <Link href="/optimize">
                        Create first optimization
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
