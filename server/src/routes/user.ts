import type { FastifyInstance } from 'fastify'
import { getUserProfile } from '../services/users.js'

export async function userRoutes(app: FastifyInstance) {
  app.get('/user', async () => getUserProfile())
}
