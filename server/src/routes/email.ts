import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { analyzeEmail, draftEmailReply } from '../services/emailAgent.js'

const emailSchema = z.object({
  id: z.string(),
  from: z.string(),
  fromEmail: z.string().email(),
  subject: z.string(),
  body: z.string(),
  receivedAt: z.string(),
  source: z.enum(['outlook', 'gmail']),
})

export async function emailRoutes(app: FastifyInstance) {
  app.post('/email/analyze', async (request, reply) => {
    const email = emailSchema.parse(request.body)
    try {
      return await analyzeEmail(email)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Email analysis failed'
      return reply.status(500).send({ error: message })
    }
  })

  app.post('/email/draft', async (request, reply) => {
    const body = z
      .object({
        email: emailSchema,
        answers: z.array(
          z.object({
            questionId: z.string(),
            question: z.string(),
            answer: z.string(),
          }),
        ),
      })
      .parse(request.body)

    try {
      return await draftEmailReply(body.email, body.answers)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Draft generation failed'
      return reply.status(500).send({ error: message })
    }
  })
}
