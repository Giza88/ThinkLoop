const API_BASE = `http://localhost:${process.env.E2E_API_PORT ?? '3999'}`

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

export async function resetIntegrations(): Promise<void> {
  const res = await apiFetch('/api/v1/integrations')
  const data = (await res.json()) as { connected: string[] }
  for (const providerId of data.connected) {
    await apiFetch(`/api/v1/integrations/${providerId}`, { method: 'DELETE' })
  }
}

export async function resetSettings(): Promise<void> {
  await apiFetch('/api/v1/settings', {
    method: 'PATCH',
    body: JSON.stringify({
      sidebarCollapsed: false,
      theme: 'dark',
      autoSaveDrafts: true,
      showPrompts: true,
      requireApproval: true,
    }),
  })
}

export async function resetAppData(): Promise<void> {
  await Promise.all([resetWorkspace(), resetIntegrations(), resetSettings()])
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
