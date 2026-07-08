import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import {
  connectIntegration,
  disconnectIntegration,
  listIntegrations,
  setIntegrations,
} from '../services/appData.js'

export async function integrationRoutes(app: FastifyInstance) {
  app.get('/integrations', async () => ({ connected: await listIntegrations() }))

  app.put('/integrations', async (request) => {
    const body = z.object({ connected: z.array(z.string()) }).parse(request.body)
    return { connected: await setIntegrations(body.connected) }
  })

  app.post<{ Params: { providerId: string } }>(
    '/integrations/:providerId/connect',
    async (request) => {
      const body = z
        .object({
          email: z.string().email().optional(),
        })
        .parse(request.body ?? {})

      return connectIntegration(request.params.providerId, undefined, body)
    },
  )

  app.delete<{ Params: { providerId: string } }>(
    '/integrations/:providerId',
    async (request) => ({
      connected: await disconnectIntegration(request.params.providerId),
    }),
  )
}
