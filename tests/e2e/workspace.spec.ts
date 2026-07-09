import { expect, test } from '@playwright/test'
import { getDrafts } from './helpers/api.js'
import { navigateTo, resetAndReload } from './helpers/app.js'

test.describe('workspace', () => {
  test.beforeEach(async ({ page }) => {
    await resetAndReload(page)
    await navigateTo(page, 'workspace')
  })

  test('cycles writing prompts', async ({ page }) => {
    const prompt = page.locator('text=Prompt:').locator('..')
    const before = await prompt.textContent()
    await page.getByTestId('next-prompt').click()
    const after = await prompt.textContent()
    expect(after).not.toBe(before)
  })

  test('voice button does not crash', async ({ page }) => {
    await page.getByTestId('voice-btn').click()
    await expect(page.getByTestId('app-shell')).toBeVisible()
  })

  test('adds a thought via button and keyboard shortcut', async ({ page }) => {
    await page.getByTestId('thought-input').fill('E2E test thought one')
    await page.getByTestId('add-thought').click()
    await expect(page.getByText('E2E test thought one')).toBeVisible()

    await page.getByTestId('thought-input').fill('E2E test thought two')
    await page.keyboard.press('Control+Enter')
    await expect(page.getByText('E2E test thought two')).toBeVisible()
  })

  test('organizes thoughts into a pending document', async ({ page }) => {
    await page.getByTestId('thought-input').fill('Users drop off at onboarding step two')
    await page.getByTestId('add-thought').click()
    await page.getByTestId('thought-input').fill('Role-based walkthroughs could help activation')
    await page.getByTestId('add-thought').click()

    await page.getByTestId('organize-btn').click()
    await expect(page.getByText('Awaiting your approval')).toBeVisible({ timeout: 30_000 })
    await expect(page.getByTestId('approve-btn')).toBeVisible()
    await expect(page.getByTestId('reject-btn')).toBeVisible()
  })

  test('approves document and saves to drafts', async ({ page }) => {
    await page.getByTestId('thought-input').fill('Approval flow test thought')
    await page.getByTestId('add-thought').click()
    await page.getByTestId('organize-btn').click()
    await expect(page.getByTestId('approve-btn')).toBeVisible({ timeout: 30_000 })

    await page.getByTestId('approve-btn').click()
    await expect(page.getByText('Approved — ready to export or send')).toBeVisible()
    await expect(page.getByTestId('toast-success').last()).toBeVisible()

    const drafts = await getDrafts()
    expect(drafts.length).toBeGreaterThan(0)
  })

  test('rejects pending proposal', async ({ page }) => {
    await page.getByTestId('thought-input').fill('Reject flow test thought')
    await page.getByTestId('add-thought').click()
    await page.getByTestId('organize-btn').click()
    await expect(page.getByTestId('reject-btn')).toBeVisible({ timeout: 30_000 })

    await page.getByTestId('reject-btn').click()
    await expect(page.getByTestId('organize-btn')).toBeVisible()
    await expect(page.getByTestId('toast-info')).toBeVisible()
  })

  test('re-organizes after approval', async ({ page }) => {
    await page.getByTestId('thought-input').fill('Reorganize test thought')
    await page.getByTestId('add-thought').click()
    await page.getByTestId('organize-btn').click()
    await page.getByTestId('approve-btn').click({ timeout: 30_000 })
    await expect(page.getByTestId('reorganize-btn')).toBeVisible()
    await page.getByTestId('reorganize-btn').click()
    await expect(page.getByText('Awaiting your approval')).toBeVisible({ timeout: 30_000 })
  })

  test('copies approved document to clipboard', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])

    await page.getByTestId('thought-input').fill('Clipboard test thought')
    await page.getByTestId('add-thought').click()
    await page.getByTestId('organize-btn').click()
    await page.getByTestId('approve-btn').click({ timeout: 30_000 })
    await expect(page.getByTestId('copy-btn')).toBeVisible()

    await page.getByTestId('copy-btn').click()
    await expect(page.getByTestId('toast-success').last()).toBeVisible()

    const clipboard = await page.evaluate(() => navigator.clipboard.readText())
    expect(clipboard.length).toBeGreaterThan(10)
  })

  test('exports approved document', async ({ page }) => {
    await page.getByTestId('thought-input').fill('Export test thought')
    await page.getByTestId('add-thought').click()
    await page.getByTestId('organize-btn').click()
    await page.getByTestId('approve-btn').click({ timeout: 30_000 })

    const downloadPromise = page.waitForEvent('download')
    await page.getByTestId('export-btn').click()
    const download = await downloadPromise
    expect(download.suggestedFilename()).toMatch(/\.md$/)
    await expect(page.getByTestId('toast-success').last()).toBeVisible()
  })
})
