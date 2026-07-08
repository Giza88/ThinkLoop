import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import sarahEmail from '../fixtures/sarah-email.json'
import type { DemoEmail } from '../../shared/types.js'

describe('analyzeEmail (rules fallback)', () => {
  beforeEach(() => {
    vi.stubEnv('OPENROUTER_API_KEY', '')
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.resetModules()
  })

  it('returns summary and exactly 3 questions without OpenRouter', async () => {
    const { analyzeEmail } = await import('../../server/src/services/emailAgent.js')
    const result = await analyzeEmail(sarahEmail as DemoEmail)

    expect(result.summary).toContain('Sarah Chen')
    expect(result.summary).toContain(sarahEmail.subject)
    expect(result.questions).toHaveLength(3)
    expect(result.questions.every((q) => q.id && q.question)).toBe(true)
  })
})
