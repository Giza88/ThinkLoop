import { buildApp } from '../server/src/app.js'
import { runMigrations } from '../server/src/db/migrate.js'
import { seedDatabase } from '../server/src/db/seed.js'

async function main() {
  const app = await buildApp()
  await runMigrations()
  await seedDatabase()
  await app.ready()

  const res = await app.inject({ method: 'GET', url: '/health' })
  console.log(res.statusCode, res.body)

  await app.close()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
