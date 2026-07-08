import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import { jsonResult } from '../utils.js'

const BASE_URL = (process.env.THINKLOOP_API_URL ?? 'http://127.0.0.1:3001').replace(/\/$/, '')

async function apiFetch(path: string, init?: RequestInit): Promise<unknown> {
  const url = `${BASE_URL}${path.startsWith('/') ? path : `/${path}`}`
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  })
  const text = await res.text()
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${text}`)
  }
  return text ? (JSON.parse(text) as unknown) : null
}

const emailSchema = z.object({
  id: z.string(),
  from: z.string(),
  fromEmail: z.string().email(),
  subject: z.string(),
  body: z.string(),
  receivedAt: z.string(),
  source: z.enum(['outlook', 'gmail']),
})

export function registerApiTools(server: McpServer) {
  server.registerTool(
    'health_check',
    {
      description: 'Check backend health (DB connection and OpenRouter key status)',
    },
    async () => jsonResult(await apiFetch('/health')),
  )

  server.registerTool(
    'organize_workspace',
    {
      description:
        'Organize workspace thoughts into a structured document using AI (requires backend running)',
    },
    async () => jsonResult(await apiFetch('/api/v1/workspace/organize', { method: 'POST', body: '{}' })),
  )

  server.registerTool(
    'approve_workspace',
    {
      description: 'Approve the current workspace document proposal',
    },
    async () => jsonResult(await apiFetch('/api/v1/workspace/approve', { method: 'POST', body: '{}' })),
  )

  server.registerTool(
    'reject_workspace',
    {
      description: 'Reject the current workspace document proposal',
    },
    async () => jsonResult(await apiFetch('/api/v1/workspace/reject', { method: 'POST', body: '{}' })),
  )

  server.registerTool(
    'analyze_email',
    {
      description: 'Analyze an inbound email and return summary + clarifying questions',
      inputSchema: {
        email: emailSchema,
      },
    },
    async ({ email }) =>
      jsonResult(
        await apiFetch('/api/v1/email/analyze', {
          method: 'POST',
          body: JSON.stringify(email),
        }),
      ),
  )

  server.registerTool(
    'draft_email',
    {
      description: 'Generate an email reply draft from user answers to clarifying questions',
      inputSchema: {
        email: emailSchema,
        answers: z.array(
          z.object({
            questionId: z.string(),
            question: z.string(),
            answer: z.string(),
          }),
        ),
      },
    },
    async ({ email, answers }) =>
      jsonResult(
        await apiFetch('/api/v1/email/draft', {
          method: 'POST',
          body: JSON.stringify({ email, answers }),
        }),
      ),
  )
}
