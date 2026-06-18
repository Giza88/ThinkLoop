import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { getSettings, patchSettings } from '../services/appData.js'

export async function settingsRoutes(app: FastifyInstance) {
  app.get('/settings', async () => getSettings())

  app.patch('/settings', async (request) => {
    const body = z
      .object({
        autoSaveDrafts: z.boolean().optional(),
        showPrompts: z.boolean().optional(),
        requireApproval: z.boolean().optional(),
        theme: z.enum(['light', 'dark', 'system']).optional(),
        sidebarCollapsed: z.boolean().optional(),
      })
      .parse(request.body)
    return patchSettings(body)
  })
}
