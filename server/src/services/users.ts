import { eq } from 'drizzle-orm'
import type { UserProfile } from '../../../shared/types.js'
import { DEFAULT_USER_ID } from '../config.js'
import { getDb } from '../db/index.js'
import { users } from '../db/schema.js'

export const EMAIL_INTEGRATION_PROVIDERS = new Set(['microsoft', 'google'])

export function displayNameFromEmail(email: string): string {
  const local = email.split('@')[0] ?? ''
  return local
    .replace(/[._+-]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ')
}

export function firstNameFromDisplayName(displayName: string): string {
  const trimmed = displayName.trim()
  if (!trimmed) return ''
  return trimmed.split(/\s+/)[0] ?? trimmed
}

function toUserProfile(row: {
  displayName: string
  email: string | null
}): UserProfile {
  const displayName = row.displayName.trim()
  return {
    displayName: displayName || null,
    email: row.email?.trim() || null,
    firstName: displayName ? firstNameFromDisplayName(displayName) : null,
  }
}

export async function getUserProfile(userId = DEFAULT_USER_ID): Promise<UserProfile> {
  const db = getDb()
  const [row] = await db
    .select({ displayName: users.displayName, email: users.email })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1)

  if (!row) {
    return { displayName: null, email: null, firstName: null }
  }

  return toUserProfile(row)
}

export async function getUserDisplayName(
  userId = DEFAULT_USER_ID,
): Promise<string | null> {
  const profile = await getUserProfile(userId)
  return profile.displayName
}

export async function updateUserFromEmailAccount(
  email: string,
  userId = DEFAULT_USER_ID,
): Promise<UserProfile> {
  const normalizedEmail = email.trim().toLowerCase()
  const displayName = displayNameFromEmail(normalizedEmail)

  const db = getDb()
  await db
    .update(users)
    .set({ email: normalizedEmail, displayName })
    .where(eq(users.id, userId))

  return {
    displayName,
    email: normalizedEmail,
    firstName: firstNameFromDisplayName(displayName),
  }
}
