import { describe, expect, it } from 'vitest'
import {
  displayNameFromEmail,
  firstNameFromDisplayName,
  toUserProfile,
} from '../../server/src/services/users.js'

describe('displayNameFromEmail', () => {
  it('derives a readable name from a dotted email local part', () => {
    expect(displayNameFromEmail('jane.smith@acmecorp.com')).toBe('Jane Smith')
  })

  it('derives a readable name from underscores and hyphens', () => {
    expect(displayNameFromEmail('stefan_gislason@company.io')).toBe('Stefan Gislason')
  })

  it('returns an empty string when the local part is missing or only separators', () => {
    expect(displayNameFromEmail('@example.com')).toBe('')
    expect(displayNameFromEmail('...@example.com')).toBe('')
    expect(displayNameFromEmail('+++@example.com')).toBe('')
  })
})

describe('firstNameFromDisplayName', () => {
  it('returns the first word', () => {
    expect(firstNameFromDisplayName('Jane Smith')).toBe('Jane')
  })
})

describe('toUserProfile', () => {
  it('normalizes empty display names to null', () => {
    expect(toUserProfile({ displayName: '', email: 'user@example.com' })).toEqual({
      displayName: null,
      email: 'user@example.com',
      firstName: null,
    })
  })

  it('normalizes whitespace-only display names to null', () => {
    expect(toUserProfile({ displayName: '   ', email: 'user@example.com' })).toEqual({
      displayName: null,
      email: 'user@example.com',
      firstName: null,
    })
  })
})
