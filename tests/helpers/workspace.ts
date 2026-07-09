import { apiFetch, parseJsonResponse } from './api.js'

export async function resetWorkspaceState(): Promise<void> {
  await apiFetch('/api/v1/workspace', {
    method: 'PUT',
    body: JSON.stringify({ thoughts: [], document: null }),
  })
}

export async function clearDrafts(): Promise<void> {
  const res = await apiFetch('/api/v1/drafts')
  const drafts = await parseJsonResponse<{ id: string }[]>(res)
  for (const draft of drafts) {
    await apiFetch(`/api/v1/drafts/${draft.id}`, { method: 'DELETE' })
  }
}
