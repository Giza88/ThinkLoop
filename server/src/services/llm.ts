import { z } from 'zod'
import {
  OPENROUTER_API_KEY,
  OPENROUTER_BASE_URL,
  OPENROUTER_MODEL,
  isOpenRouterEnabled,
} from '../config.js'

export function extractJson(text: string): string {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i)
  if (fenced) return fenced[1].trim()

  const start = text.indexOf('{')
  const end = text.lastIndexOf('}')
  if (start !== -1 && end > start) return text.slice(start, end + 1)

  const arrStart = text.indexOf('[')
  const arrEnd = text.lastIndexOf(']')
  if (arrStart !== -1 && arrEnd > arrStart && (start === -1 || arrStart < start)) {
    return text.slice(arrStart, arrEnd + 1)
  }

  return text.trim()
}

export async function completeJson<T>(
  system: string,
  user: string,
  schema: z.ZodType<T>,
): Promise<T> {
  if (!isOpenRouterEnabled()) {
    throw new Error('OpenRouter is not configured')
  }

  const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'http://localhost:5173',
      'X-Title': 'ThinkLoop',
    },
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      temperature: 0.4,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
    }),
  })

  if (!response.ok) {
    let detail = response.statusText
    try {
      const err = (await response.json()) as { error?: { message?: string } }
      if (err.error?.message) detail = err.error.message
    } catch {
      // ignore
    }
    throw new Error(`OpenRouter error (${response.status}): ${detail}`)
  }

  const data = (await response.json()) as {
    choices?: { message?: { content?: string } }[]
  }

  const content = data.choices?.[0]?.message?.content
  if (!content) throw new Error('OpenRouter returned an empty response')

  return schema.parse(JSON.parse(extractJson(content)))
}
