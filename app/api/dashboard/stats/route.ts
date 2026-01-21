
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch user data
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        subscription: true,
        optimizations: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: {
            jobPosting: {
              select: {
                title: true,
                company: true
              }
            }
          }
        },
        _count: {
          select: {
            optimizations: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const stats = {
      credits: user.credits || 0,
      totalOptimizations: user._count.optimizations || 0,
      recentOptimizations: user.optimizations || [],
      hasActiveSubscription: user.subscription?.status === 'ACTIVE' || false
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
