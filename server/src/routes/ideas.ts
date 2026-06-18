import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import {
  createIdea,
  deleteIdea,
  listIdeas,
  updateIdea,
} from '../services/appData.js'

export async function ideaRoutes(app: FastifyInstance) {
  app.get('/ideas', async () => listIdeas())

  app.post('/ideas', async (request, reply) => {
    const body = z
      .object({
        title: z.string().min(1),
        description: z.string().min(1),
        tags: z.array(z.string()).default([]),
      })
      .parse(request.body)
    const idea = await createIdea(body.title, body.description, body.tags)
    return reply.status(201).send(idea)
  })

  app.patch<{ Params: { id: string } }>('/ideas/:id', async (request, reply) => {
    const body = z
      .object({
        title: z.string().min(1).optional(),
        description: z.string().min(1).optional(),
        tags: z.array(z.string()).optional(),
      })
      .parse(request.body)
    const idea = await updateIdea(request.params.id, body)
    if (!idea) return reply.status(404).send({ error: 'Idea not found' })
    return idea
  })

  app.delete<{ Params: { id: string } }>('/ideas/:id', async (request, reply) => {
    const ok = await deleteIdea(request.params.id)
    if (!ok) return reply.status(404).send({ error: 'Idea not found' })
    return { ok: true }
  })
}
