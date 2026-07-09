import { spawn, type ChildProcess } from 'node:child_process'
import { fetchHealth } from './helpers/api.js'
import { configureTestDatabaseEnv, resetTestDatabase } from './helpers/reset-db.js'

let serverProcess: ChildProcess | null = null

async function waitForHealthyApi(timeoutMs = 30_000): Promise<void> {
  const started = Date.now()
  while (Date.now() - started < timeoutMs) {
    const health = await fetchHealth()
    if (health.ok) return
    await new Promise((resolve) => setTimeout(resolve, 500))
  }
  throw new Error('API did not become healthy in time')
}

export async function setup(): Promise<void> {
  configureTestDatabaseEnv()
  await resetTestDatabase()

  serverProcess = spawn('npx', ['tsx', 'server/src/index.ts'], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      DB_PATH: process.env.DB_PATH,
      DATABASE_URL: process.env.DATABASE_URL,
      OPENROUTER_API_KEY: '',
      PORT: '3001',
    },
    stdio: 'pipe',
    shell: true,
  })

  serverProcess.stderr?.on('data', (chunk: Buffer) => {
    const text = chunk.toString()
    if (text.includes('Error') || text.includes('error')) {
      console.error(`[test-server] ${text}`)
    }
  })

  await waitForHealthyApi()
}

export async function teardown(): Promise<void> {
  if (!serverProcess) return

  const proc = serverProcess
  serverProcess = null

  await new Promise<void>((resolve) => {
    if (proc.killed) {
      resolve()
      return
    }
    proc.once('exit', () => resolve())
    proc.kill()
    setTimeout(() => {
      if (!proc.killed) {
        proc.kill('SIGKILL')
      }
      resolve()
    }, 5000)
  })
}
