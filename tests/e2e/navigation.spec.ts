import { expect, test } from '@playwright/test'
import { navigateTo, resetAndReload } from './helpers/app.js'

const NAV_ITEMS = [
  { id: 'dashboard', heading: /good morning/i },
  { id: 'workspace', heading: /thinkloop workspace/i },
  { id: 'email-reply', heading: /email reply/i },
  { id: 'brainstorm', heading: /brainstorm board/i },
  { id: 'drafts', heading: /^drafts$/i },
  { id: 'history', heading: /^history$/i },
  { id: 'summaries', heading: /^summaries$/i },
  { id: 'research', heading: /^research$/i },
  { id: 'team', heading: /^team$/i },
] as const

test.describe('navigation', () => {
  test.beforeEach(async ({ page }) => {
    await resetAndReload(page)
  })

  for (const item of NAV_ITEMS) {
    test(`navigates to ${item.id}`, async ({ page }) => {
      await navigateTo(page, item.id)
      await expect(page.getByRole('heading', { name: item.heading })).toBeVisible()
    })
  }

  test('navigates to settings via sidebar footer', async ({ page }) => {
    await page.getByTestId('nav-settings').click()
    await expect(page.getByRole('heading', { name: /^settings$/i })).toBeVisible()
  })

  test('placeholder sections show coming soon', async ({ page }) => {
    for (const id of ['summaries', 'research', 'team'] as const) {
      await navigateTo(page, id)
      await expect(page.getByTestId('section-placeholder')).toContainText('Coming soon')
    }
  })

  test('collapses and expands the sidebar', async ({ page }) => {
    const sidebar = page.locator('aside')
    const initialBox = await sidebar.boundingBox()
    expect(initialBox?.width ?? 0).toBeGreaterThan(150)

    await page.getByTestId('sidebar-toggle').click()
    const collapsedBox = await sidebar.boundingBox()
    expect(collapsedBox?.width ?? 0).toBeLessThan(100)

    await page.getByTestId('sidebar-toggle').click()
    const expandedBox = await sidebar.boundingBox()
    expect(expandedBox?.width ?? 0).toBeGreaterThan(150)

    await page.getByTestId('nav-workspace').click()
    await expect(page.getByRole('heading', { name: /thinkloop workspace/i })).toBeVisible()
  })
})
