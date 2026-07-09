import { expect, test } from '@playwright/test'
import { navigateTo, waitForApp } from './helpers/app.js'

test.describe('email reply', () => {
  test.beforeEach(async ({ page }) => {
    await waitForApp(page)
    await navigateTo(page, 'email-reply')
  })

  test('selects an email from the inbox', async ({ page }) => {
    await page.getByTestId('email-card-email-2').click()
    await expect(page.getByText('Contract renewal — pricing discussion').first()).toBeVisible()
  })

  test('analyzes email and shows questions', async ({ page }) => {
    await page.getByTestId('analyze-btn').click()
    await expect(page.getByText('Agent questions — answer before drafting')).toBeVisible({
      timeout: 30_000,
    })
    await expect(page.locator('textarea').first()).toBeVisible()
  })

  test('drafts reply after answering questions', async ({ page }) => {
    await page.getByTestId('analyze-btn').click()
    await expect(page.locator('textarea').first()).toBeVisible({ timeout: 30_000 })

    const textareas = page.locator('textarea')
    const count = await textareas.count()
    for (let i = 0; i < count; i += 1) {
      await textareas.nth(i).fill(`E2E answer ${i + 1} with enough detail for drafting.`)
    }

    await page.getByTestId('draft-btn').click()
    await expect(page.getByText('Agent draft — you approve before sending')).toBeVisible({
      timeout: 30_000,
    })
  })

  test('approves and rejects draft', async ({ page }) => {
    await page.getByTestId('analyze-btn').click()
    await expect(page.locator('textarea').first()).toBeVisible({ timeout: 30_000 })

    const textareas = page.locator('textarea')
    const count = await textareas.count()
    for (let i = 0; i < count; i += 1) {
      await textareas.nth(i).fill(`Approval test answer ${i + 1}.`)
    }

    await page.getByTestId('draft-btn').click()
    await expect(page.getByTestId('approve-draft')).toBeVisible({ timeout: 30_000 })

    await page.getByTestId('reject-draft').click()
    await expect(page.getByTestId('toast-info')).toBeVisible()
    await expect(page.getByTestId('draft-btn')).toBeVisible()

    await page.getByTestId('draft-btn').click()
    await expect(page.getByTestId('approve-draft')).toBeVisible({ timeout: 30_000 })
    await page.getByTestId('approve-draft').click()
    await expect(page.getByText('Approved — ready to send via Outlook').first()).toBeVisible()
  })

  test('copies draft to clipboard', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])

    await page.getByTestId('analyze-btn').click()
    await expect(page.locator('textarea').first()).toBeVisible({ timeout: 30_000 })

    const textareas = page.locator('textarea')
    const count = await textareas.count()
    for (let i = 0; i < count; i += 1) {
      await textareas.nth(i).fill(`Copy test answer ${i + 1}.`)
    }

    await page.getByTestId('draft-btn').click()
    await page.getByTestId('approve-draft').click({ timeout: 30_000 })
    await page.getByTestId('copy-draft').click()
    await expect(page.getByTestId('toast-success')).toBeVisible()

    const clipboard = await page.evaluate(() => navigator.clipboard.readText())
    expect(clipboard).toContain('Subject:')
  })

  test('sends via outlook mock', async ({ page }) => {
    await page.getByTestId('analyze-btn').click()
    await expect(page.locator('textarea').first()).toBeVisible({ timeout: 30_000 })

    const textareas = page.locator('textarea')
    const count = await textareas.count()
    for (let i = 0; i < count; i += 1) {
      await textareas.nth(i).fill(`Send test answer ${i + 1}.`)
    }

    await page.getByTestId('draft-btn').click()
    await page.getByTestId('approve-draft').click({ timeout: 30_000 })
    await page.getByTestId('send-outlook').click()
    await expect(page.getByTestId('toast-success')).toBeVisible()
  })

  test('resets flow to inbox', async ({ page }) => {
    await page.getByTestId('analyze-btn').click()
    await expect(page.getByTestId('reset-flow').first()).toBeVisible({ timeout: 30_000 })
    await page.getByTestId('reset-flow').first().click()
    await expect(page.getByTestId('analyze-btn')).toBeVisible()
  })
})
