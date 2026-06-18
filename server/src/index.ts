import { PORT } from './config.js'
import { runMigrations } from './db/migrate.js'
import { seedDatabase } from './db/seed.js'
import { buildApp } from './app.js'

const app = await buildApp()

await runMigrations()
await seedDatabase()

try {
  await app.listen({ port: PORT, host: '0.0.0.0' })
  console.log(`ThinkLoop API running on http://localhost:${PORT}`)
} catch (err) {
  app.log.error(err)
  process.exit(1)
}
