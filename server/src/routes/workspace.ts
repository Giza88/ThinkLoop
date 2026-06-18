import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import {
  addThought,
  approveWorkspace,
  getWorkspace,
  organizeWorkspace,
  recordExport,
  rejectWorkspace,
  removeThought,
  saveWorkspace,
} from '../services/appData.js'
import type { StructuredDocument, Thought } from '../../../shared/types.js'

const thoughtSchema = z.object({
  id: z.string(),
  text: z.string(),
  createdAt: z.string(),
})

const documentSchema = z
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
  .nullable()

export async function workspaceRoutes(app: FastifyInstance) {
  app.get('/workspace', async () => getWorkspace())

  app.put('/workspace', async (request) => {
    const body = z
      .object({
        thoughts: z.array(thoughtSchema),
        document: documentSchema,
      })
      .parse(request.body)
    return saveWorkspace(
      body.thoughts as Thought[],
      body.document as StructuredDocument | null,
    )
  })

  app.post('/workspace/thoughts', async (request, reply) => {
    const body = z.object({ text: z.string().min(1) }).parse(request.body)
    const session = addThought(body.text)
    return reply.status(201).send(session)
  })

  app.delete<{ Params: { id: string } }>('/workspace/thoughts/:id', async (request) => {
    return removeThought(request.params.id)
  })

  app.post('/workspace/organize', async (_request, reply) => {
    try {
      const session = await organizeWorkspace()
      return reply.send(session)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Organize failed'
      return reply.status(400).send({ error: message })
    }
  })

  app.post('/workspace/approve', async (_request, reply) => {
    try {
      return approveWorkspace()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Approve failed'
      return reply.status(400).send({ error: message })
    }
  })

  app.post('/workspace/reject', async (_request, reply) => {
    try {
      return rejectWorkspace()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Reject failed'
      return reply.status(400).send({ error: message })
    }
  })

  app.post('/workspace/exported', async () => {
    recordExport()
    return { ok: true }
  })
}
