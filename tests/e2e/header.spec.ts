import { expect, test } from '@playwright/test'
import { navigateTo, waitForApp } from './helpers/app.js'

test.describe('header', () => {
  test.beforeEach(async ({ page }) => {
    await waitForApp(page)
  })

  test('opens search modal from search input', async ({ page }) => {
    await page.getByTestId('header-search').click()
    await expect(page.getByTestId('search-input')).toBeVisible()
  })

  test('toggles search modal with keyboard shortcut', async ({ page }) => {
    await page.keyboard.press('Control+K')
    await expect(page.getByTestId('search-input')).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page.getByTestId('search-input')).toBeHidden()
  })

  test('closes search modal with escape and close button', async ({ page }) => {
    await page.getByTestId('header-search').click()
    await expect(page.getByTestId('search-input')).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(page.getByTestId('search-input')).toBeHidden()

    await page.getByTestId('header-search').click()
    await page.getByLabel('Close search').click()
    await expect(page.getByTestId('search-input')).toBeHidden()
  })

  test('toggles theme', async ({ page }) => {
    const html = page.locator('html')
    const before = await html.evaluate((el) => el.classList.contains('dark'))

    await page.getByTestId('header-theme-toggle').click()
    const after = await html.evaluate((el) => el.classList.contains('dark'))
    expect(after).not.toBe(before)
  })

  test('notifications bell click does not crash the app', async ({ page }) => {
    await page.getByTestId('header-notifications').click()
    await expect(page.getByTestId('app-shell')).toBeVisible()
    await expect(page.getByTestId('toast-error')).toHaveCount(0)
  })

  test('user chip click does not crash the app', async ({ page }) => {
    await page.getByTestId('header-user').click()
    await expect(page.getByTestId('app-shell')).toBeVisible()
    await expect(page.getByTestId('toast-error')).toHaveCount(0)
  })

  test('search result navigates to brainstorm', async ({ page }) => {
    await page.getByTestId('header-search').click()
    await page.getByTestId('search-input').fill('onboarding')
    await page.getByTestId('search-result-idea').first().click()
    await expect(page.getByRole('heading', { name: /brainstorm board/i })).toBeVisible()
  })
})
