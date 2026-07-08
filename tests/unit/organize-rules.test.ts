import { describe, expect, it } from 'vitest'
import { organizeThoughtsWithRules } from '../../server/src/services/organize.js'
import type { Thought } from '../../shared/types.js'

function thought(text: string, index = 0): Thought {
  return {
    id: `t-${index}`,
    text,
    createdAt: new Date().toISOString(),
  }
}

describe('organizeThoughtsWithRules', () => {
  it('groups thoughts into problem, insights, questions, and next steps', () => {
    const doc = organizeThoughtsWithRules([
      thought('Our onboarding flow has a high drop-off rate'),
      thought('Users complete step 1 but abandon at payment'),
      thought('What if we add a progress indicator?'),
      thought('We should A/B test a shorter checkout next sprint'),
    ])

    expect(doc.title).toContain('onboarding')
    expect(doc.sections.length).toBeGreaterThanOrEqual(3)

    const titles = doc.sections.map((s) => s.title)
    expect(titles).toContain('Problem Statement')
    expect(titles).toContain('Open Questions')
    expect(titles).toContain('Next Steps')
  })

  it('falls back to Captured Thoughts when grouping is empty', () => {
    const doc = organizeThoughtsWithRules([])
    expect(doc.sections[0]?.title).toBe('Captured Thoughts')
  })

  it('sets generatedAt timestamp', () => {
    const doc = organizeThoughtsWithRules([thought('Single thought')])
    expect(doc.generatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/)
  })
})
