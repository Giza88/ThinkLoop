import { beforeAll, describe, expect, it } from 'vitest'
import sarahEmail from '../fixtures/sarah-email.json'
import { apiFetch, getBaseUrl, parseJsonResponse, requireHealthyApi } from '../helpers/api.js'
import type {
  DemoEmail,
  EmailAnalyzeResult,
  EmailDraft,
  EmailQuestionAnswer,
} from '../../shared/types.js'

describe(`email AI @ ${getBaseUrl()}`, () => {
  let organizer: 'openrouter' | 'rules'

  beforeAll(async () => {
    const health = await requireHealthyApi()
    organizer = health.organizer
  })

  it('analyzes inbound email and returns summary + 3 questions', async () => {
    const res = await apiFetch('/api/v1/email/analyze', {
      method: 'POST',
      body: JSON.stringify(sarahEmail),
    })
    const result = await parseJsonResponse<EmailAnalyzeResult>(res)
    expect(result.summary.length).toBeGreaterThan(10)
    expect(result.questions).toHaveLength(3)

    if (organizer === 'openrouter') {
      const summary = result.summary.toLowerCase()
      const isEmailSpecific =
        summary.includes('launch') ||
        summary.includes('beta') ||
        summary.includes('onboarding') ||
        summary.includes('timeline') ||
        summary.includes('q2')
      expect(isEmailSpecific, 'AI summary should reference email content').toBe(true)

      const genericQuestion = 'What is the main point you want to convey in your reply?'
      const allGeneric = result.questions.every((q) => q.question === genericQuestion)
      expect(allGeneric, 'Should not use rule-based generic questions when OpenRouter is on').toBe(
        false,
      )
    }
  })

  it('drafts a reply from user answers', async () => {
    const analyzeRes = await apiFetch('/api/v1/email/analyze', {
      method: 'POST',
      body: JSON.stringify(sarahEmail),
    })
    const analysis = await parseJsonResponse<EmailAnalyzeResult>(analyzeRes)

    const answers: EmailQuestionAnswer[] = analysis.questions.map((q, i) => ({
      questionId: q.id,
      question: q.question,
      answer: [
        'Beta is on track for April 15; onboarding redesign is 80% done.',
        'Friendly and direct — confirm timelines and offer a call.',
        'Do not promise exec-level budget changes.',
      ][i],
    }))

    const draftRes = await apiFetch('/api/v1/email/draft', {
      method: 'POST',
      body: JSON.stringify({ email: sarahEmail, answers }),
    })
    const draft = await parseJsonResponse<EmailDraft>(draftRes)
    expect(draft.subject.length).toBeGreaterThan(0)
    const subjectLower = draft.subject.toLowerCase()
    expect(
      subjectLower.includes('re:') || subjectLower.includes('q2') || subjectLower.includes('launch'),
      `Subject should relate to the email: ${draft.subject}`,
    ).toBe(true)
    expect(draft.body.length).toBeGreaterThan(50)
    expect(draft.approvalStatus).toBe('pending')

    if (organizer === 'openrouter') {
      const body = draft.body.toLowerCase()
      expect(
        body.includes('april') || body.includes('onboarding') || body.includes('beta'),
        'Draft should reflect user answers',
      ).toBe(true)
    }
  })
})
