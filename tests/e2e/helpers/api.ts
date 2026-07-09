const API_BASE = 'http://localhost:3001'

export async function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  const url = `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`
  return fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  })
}

export async function resetWorkspace(): Promise<void> {
  await apiFetch('/api/v1/workspace', {
    method: 'PUT',
    body: JSON.stringify({ thoughts: [], document: null }),
  })
}

export async function fetchHealth(): Promise<{ ok: boolean; organizer?: string }> {
  const res = await apiFetch('/health')
  if (!res.ok) return { ok: false }
  return res.json() as Promise<{ ok: boolean; organizer?: string }>
}

export async function getDrafts(): Promise<{ id: string; title: string }[]> {
  const res = await apiFetch('/api/v1/drafts')
  return res.json() as Promise<{ id: string; title: string }[]>
}

export async function getSettings(): Promise<Record<string, unknown>> {
  const res = await apiFetch('/api/v1/settings')
  return res.json() as Promise<Record<string, unknown>>
}
