import '../server/src/config.js'
import { listIdeas } from '../server/src/services/appData.js'

const BASE_URL = (process.env.THINKLOOP_API_URL ?? 'http://127.0.0.1:3001').replace(/\/$/, '')

async function main() {
  console.log('=== MCP verification: DB tools ===')
  const ideas = await listIdeas()
  console.log(`list_ideas: ${ideas.length} idea(s) found`)
  if (ideas.length === 0) {
    throw new Error('Expected at least one seeded idea')
  }
  console.log(`  first idea: "${ideas[0].title}"`)

  console.log('\n=== MCP verification: REST tools ===')
  const healthRes = await fetch(`${BASE_URL}/health`)
  if (!healthRes.ok) throw new Error(`health_check failed: ${healthRes.status}`)
  const health = (await healthRes.json()) as {
    ok: boolean
    db: string
    organizer: string
  }
  console.log(`health_check: ok=${health.ok}, db=${health.db}, organizer=${health.organizer}`)
  if (!health.ok || health.db !== 'connected') {
    throw new Error('Backend health check failed')
  }

  const organizeRes = await fetch(`${BASE_URL}/api/v1/workspace/organize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{}',
  })
  if (!organizeRes.ok) {
    const err = await organizeRes.text()
    throw new Error(`organize_workspace failed: ${organizeRes.status} ${err}`)
  }
  const session = (await organizeRes.json()) as { document: { title: string } | null }
  console.log(
    `organize_workspace: document title="${session.document?.title ?? '(none)'}"`,
  )

  console.log('\nAll MCP verification checks passed.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
