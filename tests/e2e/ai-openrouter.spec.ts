import { expect, test } from '@playwright/test'
import { fetchHealth, resetWorkspace } from './helpers/api.js'
import { navigateTo, waitForApp } from './helpers/app.js'

const hasOpenRouter = Boolean(process.env.OPENROUTER_API_KEY?.trim())

test.describe('ai openrouter', () => {
  test.skip(!hasOpenRouter, 'OPENROUTER_API_KEY is not set')

  test.beforeEach(async () => {
    const health = await fetchHealth()
    test.skip(health.organizer !== 'openrouter', 'Server is not using OpenRouter organizer')
    await resetWorkspace()
  })

  test('organizes workspace with structured sections', async ({ page }) => {
    await waitForApp(page)
    await navigateTo(page, 'workspace')

    await page.getByTestId('thought-input').fill('Our onboarding flow loses users at step 2')
    await page.getByTestId('add-thought').click()
    await page.getByTestId('thought-input').fill('Role-based walkthroughs could improve activation')
    await page.getByTestId('add-thought').click()
    await page.getByTestId('thought-input').fill('What metric proves onboarding success?')
    await page.getByTestId('add-thought').click()

    await page.getByTestId('organize-btn').click()
    await expect(page.getByText('Awaiting your approval')).toBeVisible({ timeout: 60_000 })

    const sectionTitles = await page.locator('h4').allTextContents()
    const joined = sectionTitles.join(' ').toLowerCase()
    const hasStructuredSections =
      joined.includes('problem') ||
      joined.includes('insight') ||
      joined.includes('question') ||
      joined.includes('next')
    expect(hasStructuredSections).toBe(true)
  })

  test('email analyze returns email-specific content', async ({ page }) => {
    await waitForApp(page)
    await navigateTo(page, 'email-reply')
    await page.getByTestId('analyze-btn').click()

    await expect(page.getByText('Email summary')).toBeVisible({ timeout: 60_000 })
    const summary = await page.locator('text=Email summary').locator('..').locator('p').nth(1).textContent()
    const lower = (summary ?? '').toLowerCase()
    const isEmailSpecific =
      lower.includes('launch') ||
      lower.includes('beta') ||
      lower.includes('onboarding') ||
      lower.includes('timeline') ||
      lower.includes('q2')
    expect(isEmailSpecific).toBe(true)
  })
})
