# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: drafts.spec.ts >> drafts >> deletes a draft
- Location: tests\e2e\drafts.spec.ts:28:3

# Error details

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  getByTestId('draft-card-97b1f632-32a5-46ad-9e71-69b1484d7204')
Expected: 0
Received: 1
Timeout:  5000ms

Call log:
  - Expect "toHaveCount" with timeout 5000ms
  - waiting for getByTestId('draft-card-97b1f632-32a5-46ad-9e71-69b1484d7204')
    14 × locator resolved to 1 element
       - unexpected value "1"

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - generic [ref=e3]:
    - complementary [ref=e4]:
      - generic [ref=e6]:
        - img "ThinkLoop" [ref=e7]
        - paragraph [ref=e8]: AI Work Assistant
      - navigation [ref=e9]:
        - generic [ref=e10]:
          - paragraph [ref=e11]: Work
          - list [ref=e12]:
            - listitem [ref=e13]:
              - button "Dashboard" [ref=e14]:
                - img [ref=e15]
                - generic [ref=e20]: Dashboard
            - listitem [ref=e21]:
              - button "AI Workspace" [ref=e22]:
                - img [ref=e23]
                - generic [ref=e26]: AI Workspace
            - listitem [ref=e27]:
              - button "Email Reply" [ref=e28]:
                - img [ref=e29]
                - generic [ref=e32]: Email Reply
            - listitem [ref=e33]:
              - button "Brainstorm" [ref=e34]:
                - img [ref=e35]
                - generic [ref=e37]: Brainstorm
        - generic [ref=e38]:
          - paragraph [ref=e39]: Library
          - list [ref=e40]:
            - listitem [ref=e41]:
              - button "Drafts 4" [ref=e42]:
                - img [ref=e43]
                - generic [ref=e46]: Drafts
                - generic [ref=e47]: "4"
            - listitem [ref=e48]:
              - button "History" [ref=e49]:
                - img [ref=e50]
                - generic [ref=e54]: History
        - generic [ref=e55]:
          - paragraph [ref=e56]: More
          - list [ref=e57]:
            - listitem [ref=e58]:
              - button "Summaries" [ref=e59]:
                - img [ref=e60]
                - generic [ref=e68]: Summaries
            - listitem [ref=e69]:
              - button "Research" [ref=e70]:
                - img [ref=e71]
                - generic [ref=e74]: Research
            - listitem [ref=e75]:
              - button "Team" [ref=e76]:
                - img [ref=e77]
                - generic [ref=e82]: Team
      - generic [ref=e83]:
        - button "Settings" [ref=e84]:
          - img [ref=e85]
          - generic [ref=e88]: Settings
        - button "Collapse sidebar" [ref=e89]:
          - img [ref=e90]
    - generic [ref=e92]:
      - banner [ref=e93]:
        - generic [ref=e94]:
          - img [ref=e95]
          - searchbox "Search ideas, drafts, summaries…" [ref=e98]
          - generic [ref=e99]: ⌘K
        - generic [ref=e100]:
          - generic [ref=e101]: You approve · Agent proposes
          - button "Switch to light mode" [ref=e103]:
            - img [ref=e104]
          - button "Notifications" [ref=e110]:
            - img [ref=e111]
          - button "AM Alex Morgan" [ref=e115]:
            - generic [ref=e116]: AM
            - generic [ref=e117]: Alex Morgan
            - img [ref=e118]
      - main [ref=e120]:
        - generic [ref=e121]:
          - generic [ref=e122]:
            - heading "Drafts" [level=1] [ref=e123]
            - paragraph [ref=e124]: Structured documents saved from your workspace sessions.
          - generic [ref=e125]:
            - article [ref=e126]:
              - generic [ref=e127]:
                - button "Draft view test thought Draft view test thought Updated 7/9/2026, 12:15:48 PM" [ref=e128]:
                  - heading "Draft view test thought" [level=3] [ref=e129]
                  - paragraph [ref=e130]: Draft view test thought
                  - paragraph [ref=e131]: Updated 7/9/2026, 12:15:48 PM
                - button "Delete Draft view test thought" [active] [ref=e132]:
                  - img [ref=e133]
            - article [ref=e136]:
              - generic [ref=e137]:
                - button "Improving Onboarding Flow Our onboarding flow loses users at step 2 Updated 7/9/2026, 12:11:13 PM" [ref=e138]:
                  - heading "Improving Onboarding Flow" [level=3] [ref=e139]
                  - paragraph [ref=e140]: Our onboarding flow loses users at step 2
                  - paragraph [ref=e141]: Updated 7/9/2026, 12:11:13 PM
                - button "Delete Improving Onboarding Flow" [ref=e142]:
                  - img [ref=e143]
            - article [ref=e146]:
              - generic [ref=e147]:
                - button "Improving User Onboarding Our onboarding flow loses users at step 2 Updated 7/9/2026, 12:09:33 PM" [ref=e148]:
                  - heading "Improving User Onboarding" [level=3] [ref=e149]
                  - paragraph [ref=e150]: Our onboarding flow loses users at step 2
                  - paragraph [ref=e151]: Updated 7/9/2026, 12:09:33 PM
                - button "Delete Improving User Onboarding" [ref=e152]:
                  - img [ref=e153]
            - article [ref=e156]:
              - generic [ref=e157]:
                - button "Onboarding Flow Improvement Proposal Our onboarding flow loses users at step 2 This is a recurring issue that needs to be addressed Updated 7/9/2026, 11:46:59 AM" [ref=e158]:
                  - heading "Onboarding Flow Improvement Proposal" [level=3] [ref=e159]
                  - paragraph [ref=e160]: Our onboarding flow loses users at step 2 This is a recurring issue that needs to be addressed
                  - paragraph [ref=e161]: Updated 7/9/2026, 11:46:59 AM
                - button "Delete Onboarding Flow Improvement Proposal" [ref=e162]:
                  - img [ref=e163]
  - generic "Notifications":
    - status [ref=e167]:
      - img [ref=e168]
      - paragraph [ref=e170]: Bad Request
      - button "Dismiss notification" [ref=e171]:
        - img [ref=e172]
    - status [ref=e176]:
      - img [ref=e177]
      - paragraph [ref=e180]: Document approved and saved
      - button "Dismiss notification" [ref=e181]:
        - img [ref=e182]
```

# Test source

```ts
  1  | import { expect, test } from '@playwright/test'
  2  | import { resetWorkspace } from './helpers/api.js'
  3  | import { navigateTo, waitForApp } from './helpers/app.js'
  4  | 
  5  | test.describe('drafts', () => {
  6  |   test.beforeEach(async ({ page }) => {
  7  |     await resetWorkspace()
  8  |     await waitForApp(page)
  9  |     await navigateTo(page, 'workspace')
  10 | 
  11 |     await page.getByTestId('thought-input').fill('Draft view test thought')
  12 |     await page.getByTestId('add-thought').click()
  13 |     await page.getByTestId('organize-btn').click()
  14 |     await page.getByTestId('approve-btn').click({ timeout: 30_000 })
  15 |     await expect(page.getByTestId('toast-success')).toBeVisible()
  16 | 
  17 |     await navigateTo(page, 'drafts')
  18 |   })
  19 | 
  20 |   test('opens a draft in workspace', async ({ page }) => {
  21 |     const draftCard = page.locator('[data-testid^="draft-card-"]').first()
  22 |     await expect(draftCard).toBeVisible()
  23 |     await draftCard.getByRole('button').first().click()
  24 |     await expect(page.getByRole('heading', { name: /thinkloop workspace/i })).toBeVisible()
  25 |     await expect(page.getByText('Approved — ready to export or send')).toBeVisible()
  26 |   })
  27 | 
  28 |   test('deletes a draft', async ({ page }) => {
  29 |     const draftCard = page.locator('[data-testid^="draft-card-"]').first()
  30 |     const draftId = (await draftCard.getAttribute('data-testid'))!.replace('draft-card-', '')
  31 | 
  32 |     await page.getByTestId(`delete-draft-${draftId}`).click({ force: true })
  33 |     await expect(page.getByTestId('toast-success')).toBeVisible()
> 34 |     await expect(page.getByTestId(`draft-card-${draftId}`)).toHaveCount(0)
     |                                                             ^ Error: expect(locator).toHaveCount(expected) failed
  35 |   })
  36 | })
  37 | 
```