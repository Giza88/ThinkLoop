import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { addHistoryEntry, listHistory } from '../services/history.js'

export async function historyRoutes(app: FastifyInstance) {
  app.get<{ Querystring: { limit?: string } }>('/history', async (request) => {
    const limit = request.query.limit ? Number(request.query.limit) : 50
    return listHistory(limit)
  })

  app.post('/history', async (request, reply) => {
    const body = z
      .object({
        title: z.string(),
        action: z.enum(['organized', 'exported', 'saved', 'approved', 'rejected']),
        entityId: z.string().nullable().optional(),
      })
      .parse(request.body)
    const entry = await addHistoryEntry(body.title, body.action, body.entityId)
    return reply.status(201).send(entry)
  })
}
