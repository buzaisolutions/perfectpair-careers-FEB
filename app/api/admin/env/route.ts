import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin'
import { loadEnvFile, saveEnvFile } from '../_utils'

export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const env = await loadEnvFile('.env')
  const envLocal = await loadEnvFile('.env.local')
  return NextResponse.json({ env, envLocal })
}

export async function PUT(request: NextRequest) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { target, key, value } = await request.json()
  if (!target || !key) return NextResponse.json({ error: 'target and key are required' }, { status: 400 })

  const fileName = target === 'env.local' ? '.env.local' : '.env'
  const entries = await loadEnvFile(fileName)
  entries[String(key)] = String(value ?? '')

  try {
    await saveEnvFile(fileName, entries)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to write env file' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
