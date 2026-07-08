export const DEFAULT_BASE_URL = 'http://localhost:3001'

export function getBaseUrl(): string {
  return (process.env.TEST_BASE_URL ?? DEFAULT_BASE_URL).replace(/\/$/, '')
}

export async function apiFetch(
  path: string,
  init?: RequestInit,
): Promise<Response> {
  const url = `${getBaseUrl()}${path.startsWith('/') ? path : `/${path}`}`
  return fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  })
}

export type HealthResponse = {
  ok: boolean
  db: string
  database: 'turso' | 'local'
  organizer: 'openrouter' | 'rules'
}

export async function fetchHealth(): Promise<{ ok: boolean; data?: HealthResponse; error?: string }> {
  try {
    const res = await apiFetch('/health')
    if (!res.ok) {
      return { ok: false, error: `Health returned ${res.status}` }
    }
    const data = (await res.json()) as HealthResponse
    return { ok: data.ok === true, data }
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Health check failed',
    }
  }
}

export async function parseJsonResponse<T>(res: Response): Promise<T> {
  const text = await res.text()
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${text}`)
  }
  return JSON.parse(text) as T
}

export async function requireHealthyApi(): Promise<HealthResponse> {
  const health = await fetchHealth()
  if (!health.ok || !health.data) {
    throw new Error(
      health.error ??
        `API at ${getBaseUrl()} is not healthy. Start the server (npm run dev) or fix Vercel env (Turso + OpenRouter).`,
    )
  }
  return health.data
}
