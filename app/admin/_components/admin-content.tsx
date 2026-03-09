'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { ArrowLeft } from 'lucide-react'

type Setting = { id: string; key: string; value: string }
type Coupon = { id: string; code: string; credits: number; isActive: boolean; maxUses?: number | null; usesCount: number; expiresAt?: string | null }
type UserLite = { id: string; email: string; firstName?: string | null; lastName?: string | null; credits: number }

const DEFAULT_KEYS = [
  'AI_MODEL',
  'OPTIMIZE_RESUME_PROMPT_EXTRA',
  'OPTIMIZE_COVER_PROMPT_EXTRA',
  'GEMINI_API_KEY',
  'GOOGLE_GENERATIVE_AI_API_KEY',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
  'STRIPE_PRICE_RESUME',
  'STRIPE_PRICE_RESUME_COVER',
  'STRIPE_PRICE_MONTHLY',
  'AWS_ACCESS_KEY_ID',
  'AWS_SECRET_ACCESS_KEY',
  'AWS_REGION',
  'AWS_S3_BUCKET_NAME',
  'DATABASE_URL',
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL',
]

export function AdminContent() {
  const { toast } = useToast()
  const [settings, setSettings] = useState<Setting[]>([])
  const [selectedKey, setSelectedKey] = useState(DEFAULT_KEYS[0])
  const [selectedValue, setSelectedValue] = useState('')
  const [customKey, setCustomKey] = useState('')

  const [env, setEnv] = useState<Record<string, string>>({})
  const [envLocal, setEnvLocal] = useState<Record<string, string>>({})
  const [envTarget, setEnvTarget] = useState<'env' | 'env.local'>('env')
  const [envKey, setEnvKey] = useState('')
  const [envValue, setEnvValue] = useState('')

  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [couponCode, setCouponCode] = useState('')
  const [couponCredits, setCouponCredits] = useState(1)
  const [couponMaxUses, setCouponMaxUses] = useState<number | ''>('')
  const [couponExpiresAt, setCouponExpiresAt] = useState('')

  const [users, setUsers] = useState<UserLite[]>([])
  const [userQuery, setUserQuery] = useState('')
  const [creditEmail, setCreditEmail] = useState('')
  const [creditAmount, setCreditAmount] = useState(1)

  const settingsMap = useMemo(() => {
    const map = new Map<string, string>()
    settings.forEach((s) => map.set(s.key, s.value))
    return map
  }, [settings])

  useEffect(() => {
    void Promise.all([loadSettings(), loadEnvFiles(), loadCoupons(), loadUsers()])
  }, [])

  useEffect(() => {
    setSelectedValue(settingsMap.get(selectedKey) || '')
  }, [selectedKey, settingsMap])

  async function loadSettings() {
    const res = await fetch('/api/admin/settings')
    if (!res.ok) return
    const data = await res.json()
    setSettings(data.settings || [])
  }

  async function loadEnvFiles() {
    const res = await fetch('/api/admin/env')
    if (!res.ok) return
    const data = await res.json()
    setEnv(data.env || {})
    setEnvLocal(data.envLocal || {})
  }

  async function loadCoupons() {
    const res = await fetch('/api/admin/coupons')
    if (!res.ok) return
    const data = await res.json()
    setCoupons(data.coupons || [])
  }

  async function loadUsers(q = '') {
    const res = await fetch(`/api/admin/users?q=${encodeURIComponent(q)}`)
    if (!res.ok) return
    const data = await res.json()
    setUsers(data.users || [])
  }

  async function saveSetting(key: string, value: string) {
    const res = await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value }),
    })
    if (!res.ok) {
      toast({ variant: 'destructive', title: 'Failed to save setting' })
      return
    }
    toast({ title: `Setting ${key} saved` })
    await loadSettings()
  }

  async function saveEnvKey() {
    if (!envKey) return
    const res = await fetch('/api/admin/env', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ target: envTarget, key: envKey, value: envValue }),
    })

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      toast({ variant: 'destructive', title: 'Failed to update env file', description: data.error })
      return
    }

    toast({ title: `${envKey} updated in ${envTarget}` })
    await loadEnvFiles()
  }

  async function createCoupon() {
    if (!couponCode || couponCredits <= 0) return
    const res = await fetch('/api/admin/coupons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: couponCode,
        credits: couponCredits,
        maxUses: couponMaxUses === '' ? null : Number(couponMaxUses),
        expiresAt: couponExpiresAt || null,
      }),
    })
    if (!res.ok) {
      toast({ variant: 'destructive', title: 'Failed to create coupon' })
      return
    }
    toast({ title: 'Coupon created' })
    setCouponCode('')
    setCouponCredits(1)
    setCouponMaxUses('')
    setCouponExpiresAt('')
    await loadCoupons()
  }

  async function addCredits() {
    const res = await fetch('/api/admin/credits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: creditEmail, credits: creditAmount }),
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      toast({ variant: 'destructive', title: 'Failed to add credits', description: data.error })
      return
    }
    toast({ title: `Added ${creditAmount} credits to ${creditEmail}` })
    await loadUsers(userQuery)
  }

  const envEntries = envTarget === 'env' ? env : envLocal

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto max-w-7xl px-4 py-8 space-y-8">
        <div>
          <Link href="/dashboard" className="mb-3 inline-flex items-center text-sm text-gray-500 hover:text-gray-900">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold">Admin Management Panel</h1>
          <p className="text-gray-600 mt-1">Restricted to rcarlos75@me.com</p>
        </div>

        <Card>
          <CardHeader><CardTitle>AI + Runtime Settings</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input placeholder="Existing key (e.g. AI_MODEL)" value={selectedKey} onChange={(e) => setSelectedKey(e.target.value)} />
              <Input placeholder="Custom key" value={customKey} onChange={(e) => setCustomKey(e.target.value)} />
              <Button onClick={() => customKey && setSelectedKey(customKey)}>Use Custom Key</Button>
            </div>
            <Textarea rows={4} value={selectedValue} onChange={(e) => setSelectedValue(e.target.value)} />
            <Button onClick={() => saveSetting(selectedKey, selectedValue)}>Save Setting</Button>
            <div className="flex flex-wrap gap-2">
              {DEFAULT_KEYS.map((k) => (
                <Badge key={k} variant="outline" className="cursor-pointer" onClick={() => setSelectedKey(k)}>{k}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>.env / .env.local Editor</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-amber-700">On Vercel production, filesystem changes can be ephemeral. Keep Vercel env vars as source of truth.</p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <select className="border rounded-md px-3 py-2" value={envTarget} onChange={(e) => setEnvTarget(e.target.value as any)}>
                <option value="env">.env</option>
                <option value="env.local">.env.local</option>
              </select>
              <Input placeholder="KEY" value={envKey} onChange={(e) => setEnvKey(e.target.value)} />
              <Input placeholder="VALUE" value={envValue} onChange={(e) => setEnvValue(e.target.value)} />
              <Button onClick={saveEnvKey}>Update File</Button>
            </div>
            <div className="max-h-52 overflow-auto border rounded-md p-3 bg-white text-sm">
              {Object.entries(envEntries).map(([k, v]) => (
                <div key={k} className="py-1 border-b last:border-b-0 cursor-pointer" onClick={() => { setEnvKey(k); setEnvValue(v) }}>
                  <span className="font-medium">{k}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Coupon Generator (Credit Coupons)</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <Input placeholder="COUPONCODE" value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())} />
              <Input type="number" min={1} value={couponCredits} onChange={(e) => setCouponCredits(Number(e.target.value))} />
              <Input type="number" min={1} placeholder="Max uses (optional)" value={couponMaxUses} onChange={(e) => setCouponMaxUses(e.target.value === '' ? '' : Number(e.target.value))} />
              <Input type="datetime-local" value={couponExpiresAt} onChange={(e) => setCouponExpiresAt(e.target.value)} />
            </div>
            <Button onClick={createCoupon}>Create Coupon</Button>
            <div className="space-y-2">
              {coupons.map(c => (
                <div key={c.id} className="border rounded p-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium">{c.code} (+{c.credits} credits)</p>
                    <p className="text-sm text-gray-500">Uses: {c.usesCount}/{c.maxUses ?? '∞'} {c.expiresAt ? `• Expires ${new Date(c.expiresAt).toLocaleString()}` : ''}</p>
                  </div>
                  <Badge>{c.isActive ? 'Active' : 'Inactive'}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>User Credit Management</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input placeholder="Search user by email/name" value={userQuery} onChange={(e) => setUserQuery(e.target.value)} />
              <Button onClick={() => loadUsers(userQuery)}>Search</Button>
              <div />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input placeholder="user@email.com" value={creditEmail} onChange={(e) => setCreditEmail(e.target.value)} />
              <Input type="number" min={1} value={creditAmount} onChange={(e) => setCreditAmount(Number(e.target.value))} />
              <Button onClick={addCredits}>Add Credits</Button>
            </div>
            <div className="space-y-2">
              {users.map(u => (
                <div key={u.id} className="border rounded p-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium">{u.firstName || ''} {u.lastName || ''}</p>
                    <p className="text-sm text-gray-500">{u.email}</p>
                  </div>
                  <Badge>{u.credits} credits</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
