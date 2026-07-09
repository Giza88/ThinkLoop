import { expect, test } from '@playwright/test'
import { fetchHealth } from './helpers/api.js'
import { waitForApp } from './helpers/app.js'

test.describe('smoke', () => {
  test('loads the app shell', async ({ page }) => {
    await waitForApp(page)
    await expect(page.getByTestId('nav-dashboard')).toBeVisible()
    await expect(page.getByRole('heading', { name: /good morning/i })).toBeVisible()
  })

  test('health endpoint returns ok', async () => {
    const health = await fetchHealth()
    expect(health.ok).toBe(true)
  })
})
