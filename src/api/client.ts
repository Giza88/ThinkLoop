import type {
  DashboardStats,
  DemoEmail,
  Draft,
  EmailAnalyzeResult,
  EmailDraft,
  EmailQuestionAnswer,
  HistoryEntry,
  IdeaCard,
  SearchResult,
  StructuredDocument,
  Thought,
  UserSettings,
  WorkspaceSession,
} from '../../shared/types'

const API_BASE = '/api/v1'

export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  })

  if (!response.ok) {
    let message = response.statusText
    try {
      const body = (await response.json()) as { error?: string }
      if (body.error) message = body.error
    } catch {
      // ignore
    }
    throw new ApiError(response.status, message)
  }

  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}

export const api = {
  getSettings: () => request<UserSettings>('/settings'),
  patchSettings: (patch: Partial<UserSettings>) =>
    request<UserSettings>('/settings', { method: 'PATCH', body: JSON.stringify(patch) }),

  getDrafts: () => request<Draft[]>('/drafts'),
  deleteDraft: (id: string) =>
    request<{ ok: boolean }>(`/drafts/${id}`, { method: 'DELETE' }),

  getHistory: (limit = 50) => request<HistoryEntry[]>(`/history?limit=${limit}`),

  getIdeas: () => request<IdeaCard[]>('/ideas'),
  createIdea: (data: { title: string; description: string; tags: string[] }) =>
    request<IdeaCard>('/ideas', { method: 'POST', body: JSON.stringify(data) }),
  deleteIdea: (id: string) =>
    request<{ ok: boolean }>(`/ideas/${id}`, { method: 'DELETE' }),

  getIntegrations: () => request<{ connected: string[] }>('/integrations'),
  connectIntegration: (providerId: string) =>
    request<{ connected: string[] }>(`/integrations/${providerId}/connect`, {
      method: 'POST',
      body: '{}',
    }),
  disconnectIntegration: (providerId: string) =>
    request<{ connected: string[] }>(`/integrations/${providerId}`, {
      method: 'DELETE',
    }),

  getWorkspace: () => request<WorkspaceSession>('/workspace'),
  saveWorkspace: (thoughts: Thought[], document: StructuredDocument | null) =>
    request<WorkspaceSession>('/workspace', {
      method: 'PUT',
      body: JSON.stringify({ thoughts, document }),
    }),
  addThought: (text: string) =>
    request<WorkspaceSession>('/workspace/thoughts', {
      method: 'POST',
      body: JSON.stringify({ text }),
    }),
  organizeWorkspace: () =>
    request<WorkspaceSession>('/workspace/organize', { method: 'POST', body: '{}' }),
  approveWorkspace: () =>
    request<WorkspaceSession>('/workspace/approve', { method: 'POST', body: '{}' }),
  rejectWorkspace: () =>
    request<WorkspaceSession>('/workspace/reject', { method: 'POST', body: '{}' }),
  recordExport: () =>
    request<{ ok: boolean }>('/workspace/exported', { method: 'POST', body: '{}' }),

  search: (q: string) =>
    request<SearchResult[]>(`/search?q=${encodeURIComponent(q)}`),
  getStats: () => request<DashboardStats>('/stats'),

  analyzeEmail: (email: DemoEmail) =>
    request<EmailAnalyzeResult>('/email/analyze', {
      method: 'POST',
      body: JSON.stringify(email),
    }),
  draftEmailReply: (
    email: DemoEmail,
    payload: { answers: EmailQuestionAnswer[] },
  ) =>
    request<EmailDraft>('/email/draft', {
      method: 'POST',
      body: JSON.stringify({ email, answers: payload.answers }),
    }),

  migrateLocal: (data: {
    drafts: Draft[]
    history: HistoryEntry[]
    integrations: string[]
  }) =>
    request<{ ok: boolean }>('/migrate/local', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
}

export async function checkHealth(): Promise<boolean> {
  try {
    const res = await fetch('/health')
    return res.ok
  } catch {
    return false
  }
}
