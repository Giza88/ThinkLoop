import type { IncomingMessage, ServerResponse } from 'node:http'
import { assertDatabaseConfigured } from '../server/src/config.js'
import { buildApp } from '../server/src/app.js'
import { runMigrations } from '../server/src/db/migrate.js'
import { seedDatabase } from '../server/src/db/seed.js'
import type { FastifyInstance } from 'fastify'

let app: FastifyInstance | null = null
let initPromise: Promise<void> | null = null

async function ensureApp() {
  if (!initPromise) {
    initPromise = (async () => {
      assertDatabaseConfigured()
      app = await buildApp()
      await runMigrations()
      await seedDatabase()
      await app.ready()
    })()
  }
  await initPromise
  return app!
}

function formatInitError(err: unknown): string {
  const message = err instanceof Error ? err.message : 'Server initialization failed'

  if (
    message.includes('Unable to open connection to local database') ||
    message.includes('ConnectionFailed')
  ) {
    return 'Database not configured for Vercel. Set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN in the Vercel project (Production and Preview), then redeploy.'
  }

  return message
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  try {
    const fastify = await ensureApp()
    fastify.server.emit('request', req, res)
  } catch (err) {
    const message = formatInitError(err)
    if (!res.headersSent) {
      res.statusCode = 503
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ error: message }))
    }
  }
}

export const config = {
  api: {
    bodyParser: false,
    maxDuration: 60,
  },
}
