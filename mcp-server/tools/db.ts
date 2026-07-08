import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { and, eq } from 'drizzle-orm'
import { z } from 'zod'
import type { StructuredDocument, Thought } from '../../shared/types.js'
import { DEFAULT_USER_ID } from '../../server/src/config.js'
import { getDb } from '../../server/src/db/index.js'
import { ideas } from '../../server/src/db/schema.js'
import {
  createIdea,
  deleteIdea,
  getSettings,
  getWorkspace,
  listIdeas,
  patchSettings,
  saveWorkspace,
  searchAll,
  updateIdea,
} from '../../server/src/services/appData.js'
import { getDraft, listDrafts } from '../../server/src/services/drafts.js'
import { listHistory } from '../../server/src/services/history.js'
import { jsonResult } from '../utils.js'

export function registerDbTools(server: McpServer) {
  server.registerTool(
    'list_ideas',
    { description: 'List all brainstorm ideas for the default user' },
    async () => jsonResult(await listIdeas()),
  )

  server.registerTool(
    'get_idea',
    {
      description: 'Get a single idea by ID',
      inputSchema: { id: z.string() },
    },
    async ({ id }) => {
      const db = getDb()
      const [row] = await db
        .select()
        .from(ideas)
        .where(and(eq(ideas.id, id), eq(ideas.userId, DEFAULT_USER_ID)))
        .limit(1)
      if (!row) {
        return {
          content: [{ type: 'text', text: JSON.stringify({ error: 'Idea not found' }) }],
          isError: true,
        }
      }
      return jsonResult({
        id: row.id,
        title: row.title,
        description: row.description,
        tags: JSON.parse(row.tagsJson) as string[],
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
      })
    },
  )

  server.registerTool(
    'create_idea',
    {
      description: 'Create a new brainstorm idea',
      inputSchema: {
        title: z.string().min(1),
        description: z.string().min(1),
        tags: z.array(z.string()).optional(),
      },
    },
    async ({ title, description, tags }) =>
      jsonResult(await createIdea(title, description, tags ?? [])),
  )

  server.registerTool(
    'update_idea',
    {
      description: 'Update an existing idea',
      inputSchema: {
        id: z.string(),
        title: z.string().min(1).optional(),
        description: z.string().min(1).optional(),
        tags: z.array(z.string()).optional(),
      },
    },
    async ({ id, title, description, tags }) => {
      const idea = await updateIdea(id, { title, description, tags })
      if (!idea) {
        return {
          content: [{ type: 'text', text: JSON.stringify({ error: 'Idea not found' }) }],
          isError: true,
        }
      }
      return jsonResult(idea)
    },
  )

  server.registerTool(
    'delete_idea',
    {
      description: 'Delete an idea by ID',
      inputSchema: { id: z.string() },
    },
    async ({ id }) => {
      const ok = await deleteIdea(id)
      if (!ok) {
        return {
          content: [{ type: 'text', text: JSON.stringify({ error: 'Idea not found' }) }],
          isError: true,
        }
      }
      return jsonResult({ ok: true })
    },
  )

  server.registerTool(
    'list_drafts',
    { description: 'List all saved drafts' },
    async () => jsonResult(await listDrafts()),
  )

  server.registerTool(
    'get_draft',
    {
      description: 'Get a single draft by ID',
      inputSchema: { id: z.string() },
    },
    async ({ id }) => {
      const draft = await getDraft(id)
      if (!draft) {
        return {
          content: [{ type: 'text', text: JSON.stringify({ error: 'Draft not found' }) }],
          isError: true,
        }
      }
      return jsonResult(draft)
    },
  )

  server.registerTool(
    'get_workspace',
    { description: 'Get the current workspace session (thoughts + document)' },
    async () => jsonResult(await getWorkspace()),
  )

  server.registerTool(
    'update_workspace',
    {
      description: 'Replace workspace thoughts and document',
      inputSchema: {
        thoughts: z.array(
          z.object({
            id: z.string(),
            text: z.string(),
            createdAt: z.string(),
          }),
        ),
        document: z
          .object({
            title: z.string(),
            sections: z.array(
              z.object({
                title: z.string(),
                content: z.string(),
              }),
            ),
            generatedAt: z.string(),
            approvalStatus: z.enum(['pending', 'approved', 'rejected']).optional(),
          })
          .nullable(),
      },
    },
    async ({ thoughts, document }) =>
      jsonResult(
        await saveWorkspace(thoughts as Thought[], document as StructuredDocument | null),
      ),
  )

  server.registerTool(
    'list_history',
    {
      description: 'List recent history entries',
      inputSchema: { limit: z.number().int().min(1).max(50).optional() },
    },
    async ({ limit }) => jsonResult(await listHistory(limit ?? 50)),
  )

  server.registerTool(
    'get_settings',
    { description: 'Get user settings' },
    async () => jsonResult(await getSettings()),
  )

  server.registerTool(
    'update_settings',
    {
      description: 'Update user settings (partial patch)',
      inputSchema: {
        autoSaveDrafts: z.boolean().optional(),
        showPrompts: z.boolean().optional(),
        requireApproval: z.boolean().optional(),
        theme: z.enum(['light', 'dark', 'system']).optional(),
        sidebarCollapsed: z.boolean().optional(),
      },
    },
    async (patch) => jsonResult(await patchSettings(patch)),
  )

  server.registerTool(
    'search',
    {
      description: 'Search drafts, ideas, and history by query string',
      inputSchema: { query: z.string() },
    },
    async ({ query }) => jsonResult(await searchAll(query)),
  )
}
