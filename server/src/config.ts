import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'

function loadDotEnv() {
  const envPath = path.join(process.cwd(), '.env')
  if (!existsSync(envPath)) return

  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue

    const eq = trimmed.indexOf('=')
    if (eq === -1) continue

    const key = trimmed.slice(0, eq).trim()
    let value = trimmed.slice(eq + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }

    if (!(key in process.env)) process.env[key] = value
  }
}

loadDotEnv()

export const PORT = Number(process.env.PORT ?? 3001)
export const DB_PATH =
  process.env.DB_PATH ?? path.join(process.cwd(), 'server', 'data', 'thinkloop.db')
export const DEFAULT_USER_ID = 'default'

const isTurso = Boolean(process.env.TURSO_DATABASE_URL)

export const DATABASE_URL =
  process.env.TURSO_DATABASE_URL ??
  process.env.DATABASE_URL ??
  `file:${DB_PATH.replace(/\\/g, '/')}`

export const DATABASE_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN ?? ''

export function isRemoteDatabase(): boolean {
  return isTurso || DATABASE_URL.startsWith('libsql://') || DATABASE_URL.startsWith('https://')
}

export function assertDatabaseConfigured(): void {
  if (process.env.VERCEL === '1' && !isRemoteDatabase()) {
    throw new Error(
      'Database not configured for Vercel. Set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN in the Vercel project environment (Production and Preview), then redeploy.',
    )
  }
}

export const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY ?? ''
export const OPENROUTER_MODEL =
  process.env.OPENROUTER_MODEL ?? 'openai/gpt-4o-mini'
export const OPENROUTER_BASE_URL =
  process.env.OPENROUTER_BASE_URL ?? 'https://openrouter.ai/api/v1'

export function isOpenRouterEnabled(): boolean {
  return OPENROUTER_API_KEY.length > 0
}

export function getOrganizerMode(): 'openrouter' | 'rules' {
  return isOpenRouterEnabled() ? 'openrouter' : 'rules'
}
