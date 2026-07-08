import { describe, expect, it } from 'vitest'
import { fetchHealth, getBaseUrl } from '../helpers/api.js'

describe(`health @ ${getBaseUrl()}`, () => {
  it('GET /health returns ok and organizer mode', async () => {
    const health = await fetchHealth()

    if (!health.ok) {
      console.warn(`[health] API unavailable at ${getBaseUrl()}: ${health.error}`)
    }

    expect(health.ok, health.error ?? 'API should be healthy').toBe(true)
    expect(health.data?.db).toBe('connected')
    expect(['turso', 'local']).toContain(health.data?.database)
    expect(['openrouter', 'rules']).toContain(health.data?.organizer)
  })
})
