import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { bulkImportDrafts } from '../services/drafts.js'
import { bulkImportHistory } from '../services/history.js'
import { bulkImportIntegrations } from '../services/appData.js'
import type { Draft, HistoryEntry } from '../../../shared/types.js'

export async function migrateRoutes(app: FastifyInstance) {
  app.post('/migrate/local', async (request, reply) => {
    const body = z
      .object({
        drafts: z.array(z.any()).default([]),
        history: z.array(z.any()).default([]),
        integrations: z.array(z.string()).default([]),
      })
      .parse(request.body)

    if (body.drafts.length > 0) {
      await bulkImportDrafts(body.drafts as Draft[])
    }
    if (body.history.length > 0) {
      await bulkImportHistory(body.history as HistoryEntry[])
    }
    if (body.integrations.length > 0) {
      await bulkImportIntegrations(body.integrations)
    }

    return reply.status(201).send({ ok: true })
  })
}
