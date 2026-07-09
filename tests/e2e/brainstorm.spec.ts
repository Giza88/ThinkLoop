import { expect, test } from '@playwright/test'
import { navigateTo, waitForApp } from './helpers/app.js'

test.describe('brainstorm', () => {
  test.beforeEach(async ({ page }) => {
    await waitForApp(page)
    await navigateTo(page, 'brainstorm')
  })

  test('toggles add idea form', async ({ page }) => {
    await page.getByTestId('add-idea-toggle').click()
    await expect(page.getByPlaceholder('Idea title')).toBeVisible()

    await page.getByTestId('add-idea-toggle').click()
    await expect(page.getByPlaceholder('Idea title')).toBeHidden()
  })

  test('toggles tag selection', async ({ page }) => {
    await page.getByTestId('add-idea-toggle').click()

    const tag = page.getByTestId('tag-Product')
    await tag.click()
    await expect(tag).toHaveClass(/bg-tl-purple-100/)

    await tag.click()
    await expect(tag).not.toHaveClass(/bg-tl-purple-100/)
  })

  test('saves a new idea', async ({ page }) => {
    const title = `E2E Idea ${Date.now()}`
    await page.getByTestId('add-idea-toggle').click()
    await page.getByPlaceholder('Idea title').fill(title)
    await page.getByPlaceholder('Describe the idea...').fill('End-to-end brainstorm test idea.')
    await page.getByTestId('tag-UX').click()
    await page.getByTestId('save-idea').click()

    await expect(page.getByText(title)).toBeVisible()
    await expect(page.getByTestId('toast-success')).toBeVisible()
  })
})
