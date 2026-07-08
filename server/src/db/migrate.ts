import fs from 'node:fs'
import path from 'node:path'
import { getClient } from './index.js'

function splitSqlStatements(sql: string): string[] {
  return sql
    .split(';')
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && !s.startsWith('--'))
}

export async function runMigrations() {
  const client = getClient()
  await client.execute(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      applied_at TEXT NOT NULL
    )
  `)

  const applied = await client.execute({
    sql: 'SELECT name FROM _migrations WHERE name = ?',
    args: ['0000_initial'],
  })

  if (applied.rows.length > 0) return

  const migrationPath = path.join(process.cwd(), 'server', 'drizzle', '0000_initial.sql')
  const sql = fs.readFileSync(migrationPath, 'utf8')

  for (const statement of splitSqlStatements(sql)) {
    await client.execute(statement)
  }

  await client.execute({
    sql: 'INSERT INTO _migrations (name, applied_at) VALUES (?, ?)',
    args: ['0000_initial', new Date().toISOString()],
  })
}
