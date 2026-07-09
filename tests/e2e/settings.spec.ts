import { expect, test } from '@playwright/test'
import { getSettings } from './helpers/api.js'
import { navigateTo, resetAndReload, waitForApp } from './helpers/app.js'

test.describe('settings', () => {
  test.beforeEach(async ({ page }) => {
    await resetAndReload(page)
    await navigateTo(page, 'settings')
  })

  test('toggles require approval setting', async ({ page }) => {
    const checkbox = page.getByTestId('setting-require-approval')
    const before = await checkbox.isChecked()
    await checkbox.click()
    await page.waitForTimeout(500)
    const settings = await getSettings()
    expect(settings.requireApproval).toBe(!before)
  })

  test('toggles auto-save drafts setting', async ({ page }) => {
    const checkbox = page.getByTestId('setting-auto-save')
    const before = await checkbox.isChecked()
    await checkbox.click()
    await page.waitForTimeout(500)
    const settings = await getSettings()
    expect(settings.autoSaveDrafts).toBe(!before)
  })

  test('toggles show writing prompts setting', async ({ page }) => {
    const checkbox = page.getByTestId('setting-show-prompts')
    const before = await checkbox.isChecked()
    await checkbox.click()
    await page.waitForTimeout(500)
    const settings = await getSettings()
    expect(settings.showPrompts).toBe(!before)
  })

  test('changes theme', async ({ page }) => {
    await page.getByTestId('theme-light').click()
    await page.waitForTimeout(300)
    let settings = await getSettings()
    expect(settings.theme).toBe('light')

    await page.getByTestId('theme-dark').click()
    await page.waitForTimeout(300)
    settings = await getSettings()
    expect(settings.theme).toBe('dark')

    await page.getByTestId('theme-system').click()
    await page.waitForTimeout(300)
    settings = await getSettings()
    expect(settings.theme).toBe('system')
  })

  test('connect modal backdrop, close, and continue flow', async ({ page }) => {
    const githubButton = page.getByTestId('integration-github').first()
    await expect(githubButton).toContainText('Sign in to connect')

    await githubButton.click()
    await expect(page.getByTestId('connect-modal')).toBeVisible()

    await page.getByTestId('connect-modal-backdrop').click({ position: { x: 5, y: 5 } })
    await expect(page.getByTestId('connect-modal')).toBeHidden()

    await githubButton.click()
    await page.getByLabel('Close modal').click()
    await expect(page.getByTestId('connect-modal')).toBeHidden()

    await githubButton.click()
    await page.getByTestId('connect-continue').click()
    await expect(page.getByTestId('toast-success').last()).toBeVisible({ timeout: 10_000 })
  })

  test('microsoft connect requires email', async ({ page }) => {
    const msButton = page.getByTestId('integration-microsoft').first()
    await expect(msButton).toContainText('Sign in to connect')

    await msButton.click()
    await expect(page.getByTestId('connect-email')).toBeVisible()
    await page.getByTestId('connect-email').fill('tester@example.com')
    await page.getByTestId('connect-continue').click()
    await expect(page.getByTestId('toast-success').last()).toBeVisible({ timeout: 10_000 })
  })
})
