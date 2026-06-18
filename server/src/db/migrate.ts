import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getSqlite } from './index.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export function runMigrations() {
  const sqlite = getSqlite()
  const migrationPath = path.join(__dirname, '..', '..', 'drizzle', '0000_initial.sql')
  const sql = fs.readFileSync(migrationPath, 'utf8')

  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      applied_at TEXT NOT NULL
    );
  `)

  const applied = sqlite
    .prepare('SELECT name FROM _migrations WHERE name = ?')
    .get('0000_initial') as { name: string } | undefined

  if (!applied) {
    sqlite.exec(sql)
    sqlite
      .prepare('INSERT INTO _migrations (name, applied_at) VALUES (?, ?)')
      .run('0000_initial', new Date().toISOString())
  }
}
