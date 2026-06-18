import type { StructuredDocument, Thought } from '../types'

function extractTitle(thoughts: Thought[]): string {
  const first = thoughts[0]?.text.trim()
  if (!first) return 'Untitled Document'

  const sentence = first.split(/[.!?]/)[0]?.trim() ?? first
  if (sentence.length <= 60) return sentence

  return `${sentence.slice(0, 57)}...`
}

function groupThoughts(thoughts: Thought[]): { title: string; content: string }[] {
  const groups: { title: string; items: string[] }[] = [
    { title: 'Problem Statement', items: [] },
    { title: 'Key Insights', items: [] },
    { title: 'Open Questions', items: [] },
    { title: 'Next Steps', items: [] },
  ]

  thoughts.forEach((thought, index) => {
    const text = thought.text.trim()
    const lower = text.toLowerCase()

    if (
      lower.includes('?') ||
      lower.startsWith('how') ||
      lower.startsWith('what') ||
      lower.startsWith('why')
    ) {
      groups[2].items.push(text)
    } else if (
      lower.includes('should') ||
      lower.includes('need to') ||
      lower.includes('next') ||
      lower.includes('action')
    ) {
      groups[3].items.push(text)
    } else if (index === 0 || lower.includes('problem') || lower.includes('issue')) {
      groups[0].items.push(text)
    } else {
      groups[1].items.push(text)
    }
  })

  return groups
    .filter((group) => group.items.length > 0)
    .map((group) => ({
      title: group.title,
      content: group.items.map((item) => `• ${item}`).join('\n'),
    }))
}

export function organizeThoughts(thoughts: Thought[]): StructuredDocument {
  const sections = groupThoughts(thoughts)

  if (sections.length === 0) {
    sections.push({
      title: 'Captured Thoughts',
      content: thoughts.map((t) => `• ${t.text}`).join('\n'),
    })
  }

  return {
    title: extractTitle(thoughts),
    sections,
    generatedAt: new Date(),
  }
}
