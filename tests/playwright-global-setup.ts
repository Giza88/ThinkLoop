import { resetTestDatabase } from './helpers/reset-db.js'

export default async function globalSetup(): Promise<void> {
  await resetTestDatabase()
}
