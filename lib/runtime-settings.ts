import { prisma } from '@/lib/db'

export async function getSetting(key: string): Promise<string | null> {
  try {
    const item = await prisma.appSetting.findUnique({ where: { key } })
    return item?.value || null
  } catch {
    return null
  }
}

export async function getSettingOrEnv(key: string, envFallback?: string | null): Promise<string | null> {
  const dbValue = await getSetting(key)
  if (dbValue && dbValue.trim().length > 0) return dbValue
  if (envFallback && envFallback.trim().length > 0) return envFallback
  return null
}
