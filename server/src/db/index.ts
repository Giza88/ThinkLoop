import { createClient, type Client } from '@libsql/client'
import { drizzle, type LibSQLDatabase } from 'drizzle-orm/libsql'
import { DATABASE_AUTH_TOKEN, DATABASE_URL } from '../config.js'
import * as schema from './schema.js'

let client: Client | null = null
let db: LibSQLDatabase<typeof schema> | null = null

export function getClient() {
  if (!client) {
    client = createClient({
      url: DATABASE_URL,
      authToken: DATABASE_AUTH_TOKEN || undefined,
    })
  }
  return client
}

export function getDb() {
  if (!db) {
    db = drizzle(getClient(), { schema })
  }
  return db
}
