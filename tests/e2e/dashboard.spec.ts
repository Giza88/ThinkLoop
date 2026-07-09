import { expect, test } from '@playwright/test'
import { navigateTo, waitForApp } from './helpers/app.js'

const INTEGRATION_PROVIDER_IDS = ['microsoft', 'google', 'slack', 'github', 'linear', 'notion']

test.describe('dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await waitForApp(page)
    await navigateTo(page, 'dashboard')
  })

  test('start a new session navigates to workspace', async ({ page }) => {
    await page.getByTestId('card-new-session').click()
    await expect(page.getByRole('heading', { name: /thinkloop workspace/i })).toBeVisible()
  })

  test('connect more tools navigates to settings', async ({ page }) => {
    await page.getByTestId('card-connect-tools').click()
    await expect(page.getByRole('heading', { name: /^settings$/i })).toBeVisible()
  })

  test('brainstorm ideas navigates to brainstorm', async ({ page }) => {
    await page.getByTestId('card-brainstorm').click()
    await expect(page.getByRole('heading', { name: /brainstorm board/i })).toBeVisible()
  })

  test('add idea button in stats panel does not crash', async ({ page }) => {
    await page.getByTestId('add-idea-btn').click()
    await expect(page.getByTestId('app-shell')).toBeVisible()
    await expect(page.getByTestId('toast-error')).toHaveCount(0)
  })

  for (const providerId of INTEGRATION_PROVIDER_IDS) {
    test(`integration connect opens modal for ${providerId}`, async ({ page }) => {
      const button = page.getByTestId(`integration-${providerId}`).first()
      const label = await button.textContent()

      if (label?.includes('Disconnect')) {
        await button.click()
        await expect(page.getByTestId('toast-success')).toBeVisible()
        await page.getByTestId(`integration-${providerId}`).first().click()
      }

      await expect(page.getByTestId('connect-modal')).toBeVisible()
      await page.getByLabel('Close modal').click()
      await expect(page.getByTestId('connect-modal')).toBeHidden()
    })
  }

  test('integration disconnect removes connected state', async ({ page }) => {
    const slackButton = page.getByTestId('integration-slack').first()

    if ((await slackButton.textContent())?.includes('Disconnect')) {
      await slackButton.click()
      await expect(page.getByTestId('toast-success')).toBeVisible()
    }

    await slackButton.click()
    await page.getByTestId('connect-continue').click()
    await expect(page.getByTestId('toast-success')).toBeVisible({ timeout: 10_000 })

    const connectedButton = page.getByTestId('integration-slack').first()
    await expect(connectedButton).toContainText('Disconnect')

    await connectedButton.click()
    await expect(page.getByTestId('toast-success')).toBeVisible()
    await expect(connectedButton).toContainText('Sign in to connect')
  })
})
