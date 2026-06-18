import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import {
  connectIntegration,
  disconnectIntegration,
  listIntegrations,
  setIntegrations,
} from '../services/appData.js'

export async function integrationRoutes(app: FastifyInstance) {
  app.get('/integrations', async () => ({ connected: listIntegrations() }))

  app.put('/integrations', async (request) => {
    const body = z.object({ connected: z.array(z.string()) }).parse(request.body)
    return { connected: setIntegrations(body.connected) }
  })

  app.post<{ Params: { providerId: string } }>(
    '/integrations/:providerId/connect',
    async (request) => ({
      connected: connectIntegration(request.params.providerId),
    }),
  )

  app.delete<{ Params: { providerId: string } }>(
    '/integrations/:providerId',
    async (request) => ({
      connected: disconnectIntegration(request.params.providerId),
    }),
  )
}
