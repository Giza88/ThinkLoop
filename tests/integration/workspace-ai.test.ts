import { beforeAll, describe, expect, it } from 'vitest'
import { apiFetch, getBaseUrl, parseJsonResponse, requireHealthyApi } from '../helpers/api.js'
import type { WorkspaceSession } from '../../shared/types.js'

describe(`workspace AI @ ${getBaseUrl()}`, () => {
  let organizer: 'openrouter' | 'rules'

  beforeAll(async () => {
    const health = await requireHealthyApi()
    organizer = health.organizer
  })

  it('adds thoughts and organizes into a structured document', async () => {
    const thoughts = [
      'Our onboarding flow loses users at step 2',
      'Role-based walkthroughs could improve activation',
      'What metric proves onboarding success?',
    ]

    for (const text of thoughts) {
      const addRes = await apiFetch('/api/v1/workspace/thoughts', {
        method: 'POST',
        body: JSON.stringify({ text }),
      })
      await parseJsonResponse(addRes)
    }

    const organizeRes = await apiFetch('/api/v1/workspace/organize', {
      method: 'POST',
      body: '{}',
    })
    const session = await parseJsonResponse<WorkspaceSession>(organizeRes)
    expect(session.document).not.toBeNull()
    expect(session.document!.title.length).toBeGreaterThan(0)
    expect(session.document!.sections.length).toBeGreaterThanOrEqual(2)
    expect(session.document!.approvalStatus).toBe('pending')

    if (organizer === 'openrouter') {
      const sectionTitles = session.document!.sections.map((s) => s.title.toLowerCase())
      const hasStructuredSections = sectionTitles.some(
        (t) =>
          t.includes('problem') ||
          t.includes('insight') ||
          t.includes('question') ||
          t.includes('next'),
      )
      expect(hasStructuredSections).toBe(true)
    }
  })

  it('approves organized document and saves to drafts', async () => {
    const approveRes = await apiFetch('/api/v1/workspace/approve', {
      method: 'POST',
      body: '{}',
    })
    const session = await parseJsonResponse<WorkspaceSession>(approveRes)
    expect(session.document?.approvalStatus).toBe('approved')

    const draftsRes = await apiFetch('/api/v1/drafts')
    const drafts = await parseJsonResponse<{ title: string }[]>(draftsRes)
    expect(drafts.length).toBeGreaterThan(0)
  })
})
