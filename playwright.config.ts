import { defineConfig, devices } from '@playwright/test'
import path from 'node:path'

const testDbPath = path.join('server', 'data', 'test.db')
const apiPort = process.env.E2E_API_PORT ?? '3999'
const clientPort = process.env.E2E_CLIENT_PORT ?? '5999'
const openRouterApiKey = process.env.OPENROUTER_API_KEY?.trim() ?? ''

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : [['list']],
  globalSetup: './tests/playwright-global-setup.ts',
  use: {
    baseURL: `http://localhost:${clientPort}`,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    permissions: ['clipboard-read', 'clipboard-write'],
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: [
    {
      command: `npx cross-env PORT=${apiPort} DB_PATH=${testDbPath} npm run dev:server`,
      url: `http://localhost:${apiPort}/health`,
      reuseExistingServer: false,
      timeout: 120_000,
      env: {
        // Empty string forces rules-mode for default E2E; CI test-openrouter passes the secret here.
        OPENROUTER_API_KEY: openRouterApiKey,
      },
    },
    {
      command: `npx cross-env VITE_API_PORT=${apiPort} npm run dev:client -- --port ${clientPort}`,
      url: `http://localhost:${clientPort}`,
      reuseExistingServer: false,
      timeout: 120_000,
    },
  ],
})
