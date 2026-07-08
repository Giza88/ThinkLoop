import cors from '@fastify/cors'
import fastifyStatic from '@fastify/static'
import Fastify, { type FastifyInstance } from 'fastify'
import fs from 'node:fs'
import path from 'node:path'
import { getOrganizerMode, isRemoteDatabase } from './config.js'
import { draftRoutes } from './routes/drafts.js'
import { emailRoutes } from './routes/email.js'
import { historyRoutes } from './routes/history.js'
import { ideaRoutes } from './routes/ideas.js'
import { integrationRoutes } from './routes/integrations.js'
import { migrateRoutes } from './routes/migrate.js'
import { searchRoutes } from './routes/search.js'
import { settingsRoutes } from './routes/settings.js'
import { userRoutes } from './routes/user.js'
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
      await api.register(userRoutes)
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

  const distPath = path.join(process.cwd(), 'dist')
  if (fs.existsSync(path.join(distPath, 'index.html'))) {
    await app.register(fastifyStatic, {
      root: distPath,
      wildcard: false,
    })

    app.setNotFoundHandler((request, reply) => {
      const pathname = request.url.split('?')[0]
      if (pathname.startsWith('/api/') || pathname === '/health') {
        return reply.status(404).send({ error: 'Not found' })
      }
      return reply.sendFile('index.html')
    })
  }

  return app
}
