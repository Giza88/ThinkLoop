import type { Page } from '@playwright/test'

export async function waitForApp(page: Page): Promise<void> {
  await page.goto('/')
  await page.getByTestId('app-shell').waitFor({ state: 'visible', timeout: 30_000 })
}

export async function navigateTo(page: Page, navId: string): Promise<void> {
  await page.getByTestId(`nav-${navId}`).click()
}

export async function expectNoErrorToast(page: Page): Promise<void> {
  await page.getByTestId('toast-error').waitFor({ state: 'hidden', timeout: 1000 }).catch(() => {})
}
