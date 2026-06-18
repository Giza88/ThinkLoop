import { z } from 'zod'
import type { StructuredDocument, Thought } from '../../../shared/types.js'
import { isOpenRouterEnabled } from '../config.js'
import { completeJson } from './llm.js'

const documentSchema = z.object({
  title: z.string().min(1),
  sections: z
    .array(
      z.object({
        title: z.string().min(1),
        content: z.string().min(1),
      }),
    )
    .min(1),
})

const SYSTEM_PROMPT = `You are ThinkLoop's organizing agent. The user captures raw thoughts; you structure them into a clear document proposal.

Return ONLY valid JSON (no markdown fences) matching this shape:
{
  "title": "short document title",
  "sections": [
    { "title": "section heading", "content": "paragraph or bullet points using • prefix per line" }
  ]
}

Use 2–5 sections such as Problem Statement, Key Insights, Open Questions, Next Steps — only include sections with real content. Preserve the user's intent; do not invent facts.`

function buildUserPrompt(thoughts: Thought[]): string {
  const lines = thoughts.map((t, i) => `${i + 1}. ${t.text.trim()}`).join('\n')
  return `Organize these captured thoughts into a structured document:\n\n${lines}`
}

export function openRouterConfigured(): boolean {
  return isOpenRouterEnabled()
}

export async function organizeWithOpenRouter(thoughts: Thought[]): Promise<StructuredDocument> {
  const parsed = await completeJson(
    SYSTEM_PROMPT,
    buildUserPrompt(thoughts),
    documentSchema,
  )

  return {
    title: parsed.title,
    sections: parsed.sections,
    generatedAt: new Date().toISOString(),
  }
}
