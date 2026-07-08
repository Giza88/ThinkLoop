import { describe, expect, it } from 'vitest'
import { displayNameFromEmail, firstNameFromDisplayName } from '../../server/src/services/users.js'

describe('displayNameFromEmail', () => {
  it('derives a readable name from a dotted email local part', () => {
    expect(displayNameFromEmail('jane.smith@acmecorp.com')).toBe('Jane Smith')
  })

  it('derives a readable name from underscores and hyphens', () => {
    expect(displayNameFromEmail('stefan_gislason@company.io')).toBe('Stefan Gislason')
  })
})

describe('firstNameFromDisplayName', () => {
  it('returns the first word', () => {
    expect(firstNameFromDisplayName('Jane Smith')).toBe('Jane')
  })
})
