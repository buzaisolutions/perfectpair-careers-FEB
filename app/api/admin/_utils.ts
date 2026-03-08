import { promises as fs } from 'fs'
import path from 'path'

export function parseEnv(content: string): Record<string, string> {
  const output: Record<string, string> = {}
  for (const raw of content.split('\n')) {
    const line = raw.trim()
    if (!line || line.startsWith('#')) continue
    const idx = line.indexOf('=')
    if (idx <= 0) continue
    const key = line.slice(0, idx).trim()
    const value = line.slice(idx + 1).trim().replace(/^"|"$/g, '')
    output[key] = value
  }
  return output
}

export function serializeEnv(entries: Record<string, string>): string {
  return Object.keys(entries)
    .sort()
    .map((key) => `${key}="${entries[key] ?? ''}"`)
    .join('\n') + '\n'
}

export async function loadEnvFile(fileName: '.env' | '.env.local') {
  const filePath = path.join(process.cwd(), fileName)
  try {
    const content = await fs.readFile(filePath, 'utf8')
    return parseEnv(content)
  } catch {
    return {} as Record<string, string>
  }
}

export async function saveEnvFile(fileName: '.env' | '.env.local', entries: Record<string, string>) {
  const filePath = path.join(process.cwd(), fileName)
  const content = serializeEnv(entries)
  await fs.writeFile(filePath, content, 'utf8')
}
