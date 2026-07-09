import fs from 'node:fs'
import path from 'node:path'
import { closeDb } from './index.js'
import { runMigrations } from './migrate.js'
import { seedDatabase } from './seed.js'

export function getTestDbPath(): string {
  return (
    process.env.TEST_DB_PATH ??
    process.env.DB_PATH ??
    path.join(process.cwd(), 'server', 'data', 'test.db')
  )
}

export async function resetTestDatabase(dbPath?: string): Promise<void> {
  const targetPath = dbPath ?? getTestDbPath()
  const dir = path.dirname(targetPath)

  closeDb()
  fs.mkdirSync(dir, { recursive: true })

  for (const suffix of ['', '-wal', '-shm', '-journal']) {
    const file = `${targetPath}${suffix}`
    if (fs.existsSync(file)) {
      fs.unlinkSync(file)
    }
  }

  await runMigrations()
  await seedDatabase()
}
