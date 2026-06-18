import { randomUUID } from 'node:crypto'
import { z } from 'zod'
import type {
  EmailAnalyzeResult,
  EmailDraft,
  EmailInput,
  EmailQuestionAnswer,
} from '../../../shared/types.js'
import { isOpenRouterEnabled } from '../config.js'
import { completeJson } from './llm.js'

const analyzeSchema = z.object({
  summary: z.string().min(1),
  questions: z
    .array(
      z.object({
        question: z.string().min(1),
        hint: z.string().optional(),
      }),
    )
    .min(3)
    .max(3),
})

const draftSchema = z.object({
  subject: z.string().min(1),
  body: z.string().min(1),
})

const ANALYZE_SYSTEM = `You are ThinkLoop's email assistant. The user connected Outlook; you read an inbound email and help them craft a reply.

Read the email carefully. Return ONLY valid JSON (no markdown fences):
{
  "summary": "1-2 sentence summary of what the sender wants and any urgency",
  "questions": [
    { "question": "clarifying question you need answered before drafting", "hint": "optional short example answer" }
  ]
}

Ask exactly 3 specific questions about facts only the user knows: key content for the reply, decisions or commitments to make, and anything to avoid. Do not ask about tone or writing style separately — that will be inferred from how the user phrases their answers. Do not ask who to CC. Do not ask questions you can infer from the email.`

const DRAFT_SYSTEM = `You are ThinkLoop's email assistant. Draft a reply email based on the original message and the user's answers to clarifying questions.

Return ONLY valid JSON (no markdown fences):
{
  "subject": "Re: ... subject line",
  "body": "full email body with greeting and sign-off. Use plain text paragraphs separated by \\n\\n. Sign off as the user (use a generic closing like Best regards if name unknown)."
}

Critical rules:
- Mirror the user's requested tone and style exactly (formal, casual, friendly, direct, apologetic, etc.) using their answers as the source of truth.
- Weave in their specific facts, dates, numbers, and decisions verbatim where appropriate — do not contradict or soften their intent.
- Match how they speak in their answers: short and punchy vs. warm and detailed.
- Be concise and actionable. Do not invent commitments the user did not authorize in their answers.`

function formatEmail(email: EmailInput): string {
  return `From: ${email.from} <${email.fromEmail}>
Subject: ${email.subject}
Received: ${email.receivedAt}

${email.body}`
}

function analyzeWithRules(email: EmailInput): EmailAnalyzeResult {
  return {
    summary: `${email.from} is asking about "${email.subject}". Review their message and decide how you want to respond before the agent drafts a reply.`,
    questions: [
      {
        id: randomUUID(),
        question: 'What is the main point you want to convey in your reply?',
        hint: 'e.g. confirm the timeline, decline politely, ask for more info',
      },
      {
        id: randomUUID(),
        question: 'What tone should this reply use?',
        hint: 'e.g. friendly and casual, formal, apologetic',
      },
      {
        id: randomUUID(),
        question: 'Anything you explicitly do NOT want to promise or mention?',
        hint: 'e.g. do not commit to a discount, do not mention the other vendor',
      },
    ],
  }
}

function draftWithRules(
  email: EmailInput,
  answers: EmailQuestionAnswer[],
): EmailDraft {
  const answerBlock = answers
    .filter((a) => a.answer.trim())
    .map((a) => `- ${a.answer.trim()}`)
    .join('\n')

  return {
    subject: email.subject.startsWith('Re:') ? email.subject : `Re: ${email.subject}`,
    body: `Hi ${email.from.split(' ')[0]},

Thank you for your email regarding "${email.subject}".

${answerBlock ? `Based on our current plans:\n${answerBlock}\n\n` : ''}Please let me know if you need anything else.

Best regards`,
    generatedAt: new Date().toISOString(),
    approvalStatus: 'pending',
  }
}

export async function analyzeEmail(email: EmailInput): Promise<EmailAnalyzeResult> {
  if (isOpenRouterEnabled()) {
    try {
      const parsed = await completeJson(
        ANALYZE_SYSTEM,
        `Analyze this email and generate clarifying questions:\n\n${formatEmail(email)}`,
        analyzeSchema,
      )
      return {
        summary: parsed.summary,
        questions: parsed.questions.map((q) => ({
          id: randomUUID(),
          question: q.question,
          hint: q.hint,
        })),
      }
    } catch (err) {
      console.error('[email] OpenRouter analyze failed, using fallback:', err)
    }
  }

  return analyzeWithRules(email)
}

export async function draftEmailReply(
  email: EmailInput,
  answers: EmailQuestionAnswer[],
): Promise<EmailDraft> {
  if (isOpenRouterEnabled()) {
    try {
      const answerText = answers
        .map((a) => `Q: ${a.question}\nA: ${a.answer}`)
        .join('\n\n')

      const parsed = await completeJson(
        DRAFT_SYSTEM,
        `Original email:\n${formatEmail(email)}\n\nUser's answers:\n${answerText}`,
        draftSchema,
      )

      return {
        subject: parsed.subject,
        body: parsed.body,
        generatedAt: new Date().toISOString(),
        approvalStatus: 'pending',
      }
    } catch (err) {
      console.error('[email] OpenRouter draft failed, using fallback:', err)
    }
  }

  return draftWithRules(email, answers)
}
