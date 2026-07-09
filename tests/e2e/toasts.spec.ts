import { expect, test } from '@playwright/test'
import { navigateTo, resetAndReload } from './helpers/app.js'

test.describe('toasts', () => {
  test('dismisses toast notification', async ({ page }) => {
    await resetAndReload(page)
    await navigateTo(page, 'settings')

    const slackButton = page.getByTestId('integration-slack').first()
    await expect(slackButton).toContainText('Sign in to connect')

    await slackButton.click()
    await page.getByTestId('connect-continue').click()
    await expect(page.getByTestId('toast-success').last()).toBeVisible({ timeout: 10_000 })

    await page.getByTestId('toast-dismiss').last().click()
    await expect(page.getByTestId('toast-success')).toHaveCount(0)
  })
})
