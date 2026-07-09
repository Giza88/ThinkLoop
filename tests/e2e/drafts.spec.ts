import { expect, test } from '@playwright/test'
import { navigateTo, resetAndReload } from './helpers/app.js'

test.describe('drafts', () => {
  test.beforeEach(async ({ page }) => {
    await resetAndReload(page)
    await navigateTo(page, 'workspace')

    await page.getByTestId('thought-input').fill('Draft view test thought')
    await page.getByTestId('add-thought').click()
    await page.getByTestId('organize-btn').click()
    await page.getByTestId('approve-btn').click({ timeout: 30_000 })
    await expect(page.getByTestId('toast-success').last()).toBeVisible({ timeout: 10_000 })

    await navigateTo(page, 'drafts')
  })

  test('opens a draft in workspace', async ({ page }) => {
    const draftCard = page.locator('[data-testid^="draft-card-"]').first()
    await expect(draftCard).toBeVisible()
    await draftCard.getByRole('button').first().click()
    await expect(page.getByRole('heading', { name: /thinkloop workspace/i })).toBeVisible()
    await expect(page.getByText('Approved — ready to export or send')).toBeVisible()
  })

  test('deletes a draft', async ({ page }) => {
    const draftCard = page.locator('[data-testid^="draft-card-"]').first()
    const draftId = (await draftCard.getAttribute('data-testid'))!.replace('draft-card-', '')

    await page.getByTestId(`delete-draft-${draftId}`).click({ force: true })
    await expect(page.getByTestId('toast-success')).toBeVisible()
    await expect(page.getByTestId(`draft-card-${draftId}`)).toHaveCount(0)
  })
})
