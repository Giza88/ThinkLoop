import type { FastifyInstance } from 'fastify'
import { getDashboardStats } from '../services/history.js'
import { searchAll } from '../services/appData.js'

export async function searchRoutes(app: FastifyInstance) {
  app.get<{ Querystring: { q?: string } }>('/search', async (request) => {
    const q = request.query.q ?? ''
    return searchAll(q)
  })

  app.get('/stats', async () => getDashboardStats())
}
