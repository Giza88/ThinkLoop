import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import {
  deleteDraft,
  getDraft,
  listDrafts,
  updateDraft,
  upsertDraftFromDocument,
} from '../services/drafts.js'

const documentSchema = z.object({
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

export async function draftRoutes(app: FastifyInstance) {
  app.get('/drafts', async () => listDrafts())

  app.get<{ Params: { id: string } }>('/drafts/:id', async (request, reply) => {
    const draft = getDraft(request.params.id)
    if (!draft) return reply.status(404).send({ error: 'Draft not found' })
    return draft
  })

  app.post('/drafts', async (request, reply) => {
    const body = z.object({ document: documentSchema }).parse(request.body)
    const draft = upsertDraftFromDocument(body.document)
    return reply.status(201).send(draft)
  })

  app.patch<{ Params: { id: string } }>('/drafts/:id', async (request, reply) => {
    const body = z.object({ document: documentSchema }).parse(request.body)
    const draft = updateDraft(request.params.id, body.document)
    if (!draft) return reply.status(404).send({ error: 'Draft not found' })
    return draft
  })

  app.delete<{ Params: { id: string } }>('/drafts/:id', async (request, reply) => {
    const ok = deleteDraft(request.params.id)
    if (!ok) return reply.status(404).send({ error: 'Draft not found' })
    return { ok: true }
  })
}
