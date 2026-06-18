import cors from '@fastify/cors'
import Fastify from 'fastify'
import { PORT } from './config.js'
import { runMigrations } from './db/migrate.js'
import { seedDatabase } from './db/seed.js'
import { draftRoutes } from './routes/drafts.js'
import { historyRoutes } from './routes/history.js'
import { ideaRoutes } from './routes/ideas.js'
import { integrationRoutes } from './routes/integrations.js'
import { migrateRoutes } from './routes/migrate.js'
import { searchRoutes } from './routes/search.js'
import { settingsRoutes } from './routes/settings.js'
import { workspaceRoutes } from './routes/workspace.js'

const app = Fastify({ logger: true })

await app.register(cors, { origin: true })

app.get('/health', async () => ({ ok: true, db: 'connected' }))

await app.register(
  async (api) => {
    await api.register(settingsRoutes)
    await api.register(draftRoutes)
    await api.register(historyRoutes)
    await api.register(ideaRoutes)
    await api.register(integrationRoutes)
    await api.register(workspaceRoutes)
    await api.register(searchRoutes)
    await api.register(migrateRoutes)
  },
  { prefix: '/api/v1' },
)

runMigrations()
seedDatabase()

try {
  await app.listen({ port: PORT, host: '0.0.0.0' })
  console.log(`ThinkLoop API running on http://localhost:${PORT}`)
} catch (err) {
  app.log.error(err)
  process.exit(1)
}
