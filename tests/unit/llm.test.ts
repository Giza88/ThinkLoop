import { describe, expect, it } from 'vitest'
import { extractJson } from '../../server/src/services/llm.js'

describe('extractJson', () => {
  it('extracts JSON from markdown fences', () => {
    const input = 'Here is the result:\n```json\n{"title":"Test","sections":[]}\n```'
    expect(extractJson(input)).toBe('{"title":"Test","sections":[]}')
  })

  it('extracts JSON object from mixed text', () => {
    const input = 'Sure! {"summary":"hello","questions":[]} is the answer.'
    expect(extractJson(input)).toBe('{"summary":"hello","questions":[]}')
  })

  it('extracts object when both array and object are present', () => {
    const input = '[{"a":1}] and also {"b":2}'
    expect(extractJson(input)).toBe('{"a":1}] and also {"b":2}')
  })

  it('returns trimmed plain text when no JSON found', () => {
    expect(extractJson('  no json here  ')).toBe('no json here')
  })
})
