# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: workspace.spec.ts >> workspace >> re-organizes after approval
- Location: tests\e2e\workspace.spec.ts:72:3

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5999/
Call log:
  - navigating to "http://localhost:5999/", waiting until "load"

```

# Test source

```ts
  1  | import type { Page } from '@playwright/test'
  2  | 
  3  | export async function waitForApp(page: Page): Promise<void> {
> 4  |   await page.goto('/')
     |              ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5999/
  5  |   await page.getByTestId('app-shell').waitFor({ state: 'visible', timeout: 30_000 })
  6  | }
  7  | 
  8  | export async function navigateTo(page: Page, navId: string): Promise<void> {
  9  |   await page.getByTestId(`nav-${navId}`).click()
  10 | }
  11 | 
  12 | export async function expectNoErrorToast(page: Page): Promise<void> {
  13 |   await page.getByTestId('toast-error').waitFor({ state: 'hidden', timeout: 1000 }).catch(() => {})
  14 | }
  15 | 
```