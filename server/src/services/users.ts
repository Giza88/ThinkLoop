import { eq } from 'drizzle-orm'
import { DEFAULT_USER_ID } from '../config.js'
import { getDb } from '../db/index.js'
import { users } from '../db/schema.js'

export async function getUserDisplayName(
  userId = DEFAULT_USER_ID,
): Promise<string | null> {
  const db = getDb()
  const [row] = await db
    .select({ displayName: users.displayName })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1)

  const name = row?.displayName?.trim()
  return name || null
}
