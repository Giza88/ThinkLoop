import type { Page } from '@playwright/test'
import { expect } from '@playwright/test'
import { resetAppData } from './api.js'

export async function waitForApp(page: Page): Promise<void> {
  await page.goto('/')
  await page.getByTestId('app-shell').waitFor({ state: 'visible', timeout: 30_000 })
}

export async function resetAndReload(page: Page): Promise<void> {
  await resetAppData()
  await page.reload()
  await waitForApp(page)
}

export async function navigateTo(page: Page, navId: string): Promise<void> {
  await page.getByTestId(`nav-${navId}`).click()
}

export async function expectSuccessToast(page: Page, text?: string | RegExp): Promise<void> {
  const toast = text
    ? page.getByTestId('toast-success').filter({ hasText: text })
    : page.getByTestId('toast-success').last()
  await expect(toast).toBeVisible({ timeout: 10_000 })
}
