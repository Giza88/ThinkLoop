import { expect, test } from '@playwright/test'
import { navigateTo, waitForApp } from './helpers/app.js'

test.describe('toasts', () => {
  test('dismisses toast notification', async ({ page }) => {
    await waitForApp(page)
    await navigateTo(page, 'settings')

    const msButton = page.getByTestId('integration-slack').first()
    if ((await msButton.textContent())?.includes('Disconnect')) {
      await msButton.click()
      await page.getByTestId('toast-dismiss').click()
      await expect(page.getByTestId('toast-success')).toHaveCount(0)
    }

    await msButton.click()
    await page.getByTestId('connect-continue').click()
    await expect(page.getByTestId('toast-success')).toBeVisible({ timeout: 10_000 })

    await page.getByTestId('toast-dismiss').click()
    await expect(page.getByTestId('toast-success')).toHaveCount(0)
  })
})
