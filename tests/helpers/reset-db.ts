import path from 'node:path'

export const TEST_DB_PATH = path.join(process.cwd(), 'server', 'data', 'test.db')

export function configureTestDatabaseEnv(): void {
  process.env.DB_PATH = TEST_DB_PATH
  process.env.DATABASE_URL = `file:${TEST_DB_PATH.replace(/\\/g, '/')}`
  delete process.env.TURSO_DATABASE_URL
  delete process.env.TURSO_AUTH_TOKEN
}

export async function resetTestDatabase(): Promise<void> {
  configureTestDatabaseEnv()
  const { resetTestDatabase: reset } = await import('../../server/src/db/reset.js')
  await reset(TEST_DB_PATH)
}
