import cors from '@fastify/cors'
import Fastify, { type FastifyInstance } from 'fastify'
import { getOrganizerMode, isRemoteDatabase } from './config.js'
import { draftRoutes } from './routes/drafts.js'
import { emailRoutes } from './routes/email.js'
import { historyRoutes } from './routes/history.js'
import { ideaRoutes } from './routes/ideas.js'
import { integrationRoutes } from './routes/integrations.js'
import { migrateRoutes } from './routes/migrate.js'
import { searchRoutes } from './routes/search.js'
import { settingsRoutes } from './routes/settings.js'
import { workspaceRoutes } from './routes/workspace.js'

export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: process.env.VERCEL !== '1',
  })

  await app.register(cors, { origin: true })

  app.get('/health', async () => ({
    ok: true,
    db: 'connected',
    database: isRemoteDatabase() ? 'turso' : 'local',
    organizer: getOrganizerMode(),
  }))

  await app.register(
    async (api) => {
      await api.register(settingsRoutes)
      await api.register(draftRoutes)
      await api.register(historyRoutes)
      await api.register(ideaRoutes)
      await api.register(integrationRoutes)
      await api.register(workspaceRoutes)
      await api.register(emailRoutes)
      await api.register(searchRoutes)
      await api.register(migrateRoutes)
    },
    { prefix: '/api/v1' },
  )

  return app
}
