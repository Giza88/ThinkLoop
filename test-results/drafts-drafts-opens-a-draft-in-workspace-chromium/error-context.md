# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: drafts.spec.ts >> drafts >> opens a draft in workspace
- Location: tests\e2e\drafts.spec.ts:20:3

# Error details

```
Test timeout of 30000ms exceeded while running "beforeEach" hook.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByTestId('approve-btn')

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - generic [ref=e3]:
    - complementary [ref=e4]:
      - img "ThinkLoop" [ref=e6]
      - navigation [ref=e7]:
        - list [ref=e9]:
          - listitem [ref=e10]:
            - button "Dashboard" [ref=e11]:
              - img [ref=e12]
          - listitem [ref=e17]:
            - button "AI Workspace" [ref=e18]:
              - img [ref=e19]
          - listitem [ref=e22]:
            - button "Email Reply" [ref=e23]:
              - img [ref=e24]
          - listitem [ref=e27]:
            - button "Brainstorm" [ref=e28]:
              - img [ref=e29]
        - list [ref=e32]:
          - listitem [ref=e33]:
            - button "4" [ref=e34]:
              - img [ref=e35]
              - generic [ref=e38]: "4"
          - listitem [ref=e39]:
            - button "History" [ref=e40]:
              - img [ref=e41]
        - list [ref=e46]:
          - listitem [ref=e47]:
            - button "Summaries" [ref=e48]:
              - img [ref=e49]
          - listitem [ref=e57]:
            - button "Research" [ref=e58]:
              - img [ref=e59]
          - listitem [ref=e62]:
            - button "Team" [ref=e63]:
              - img [ref=e64]
      - generic [ref=e69]:
        - button "Settings" [ref=e70]:
          - img [ref=e71]
        - button "Expand sidebar" [ref=e74]:
          - img [ref=e75]
    - generic [ref=e77]:
      - banner [ref=e78]:
        - generic [ref=e79]:
          - img [ref=e80]
          - searchbox "Search ideas, drafts, summaries…" [ref=e83]
          - generic [ref=e84]: ⌘K
        - generic [ref=e85]:
          - generic [ref=e86]: You approve · Agent proposes
          - button "Switch to dark mode" [ref=e88]:
            - img [ref=e89]
          - button "Notifications" [ref=e91]:
            - img [ref=e92]
          - button "AM Alex Morgan" [ref=e96]:
            - generic [ref=e97]: AM
            - generic [ref=e98]: Alex Morgan
            - img [ref=e99]
      - main [ref=e101]:
        - generic [ref=e102]:
          - generic [ref=e103]:
            - heading "ThinkLoop Workspace" [level=1] [ref=e104]
            - paragraph [ref=e105]: Your ideas drive everything. The agent proposes — you review and approve before anything is saved or exported.
            - paragraph [ref=e106]: Reading context from 3 connected tools. Outbound actions still need your approval.
          - generic [ref=e107]:
            - generic [ref=e108]:
              - paragraph [ref=e109]: The human-in-the-loop loop
              - generic [ref=e110]: 4 of 5 steps need you
            - generic [ref=e111]:
              - generic [ref=e112]:
                - img [ref=e114]
                - generic [ref=e117]:
                  - paragraph [ref=e118]: You
                  - paragraph [ref=e119]: Connect tools
                  - paragraph [ref=e120]: Sign in to Microsoft, Slack, GitHub…
              - generic [ref=e121]:
                - img [ref=e123]
                - generic [ref=e126]:
                  - paragraph [ref=e127]: You
                  - paragraph [ref=e128]: You think it
                  - paragraph [ref=e129]: Capture raw thoughts and goals
              - generic [ref=e130]:
                - img [ref=e132]
                - generic [ref=e135]:
                  - paragraph [ref=e136]: Agent
                  - paragraph [ref=e137]: AI proposes
                  - paragraph [ref=e138]: Structures drafts from your input + connected context
              - generic [ref=e139]:
                - img [ref=e141]
                - generic [ref=e144]:
                  - paragraph [ref=e145]: You
                  - paragraph [ref=e146]: You review it
                  - paragraph [ref=e147]: Edit every section before anything moves
              - generic [ref=e148]:
                - img [ref=e150]
                - generic [ref=e153]:
                  - paragraph [ref=e154]: You
                  - paragraph [ref=e155]: You approve it
                  - paragraph [ref=e156]: Export, send, or post — only after you say yes
          - generic [ref=e157]:
            - generic [ref=e158]:
              - generic [ref=e159]:
                - generic [ref=e160]:
                  - img [ref=e161]
                  - heading "Capture Your Thoughts" [level=3] [ref=e163]
                - paragraph [ref=e164]: Raw, messy, incomplete — that's fine. Just get it out.
              - generic [ref=e165]:
                - paragraph [ref=e167]: Start typing — prompts are turned off in Settings.
                - textbox "Type anything — fragments, questions, half-formed ideas, frustrations…" [ref=e168]
                - generic [ref=e169]:
                  - generic [ref=e170]:
                    - button "Voice" [ref=e171]:
                      - img [ref=e172]
                      - text: Voice
                    - generic [ref=e175]: ⌘↵ to add
                  - button "Add Thought" [disabled] [ref=e176]:
                    - img [ref=e177]
                    - text: Add Thought
                - list [ref=e179]:
                  - listitem [ref=e180]: Draft view test thought
            - generic [ref=e181]:
              - generic [ref=e182]:
                - generic [ref=e183]:
                  - heading "Draft view test thought" [level=3] [ref=e184]
                  - paragraph [ref=e185]: Approved — ready to export or send
                - generic [ref=e186]:
                  - button "Copy document" [ref=e187]:
                    - img [ref=e188]
                  - button "Export document" [ref=e191]:
                    - img [ref=e192]
              - generic [ref=e196]:
                - generic [ref=e198]:
                  - heading "Problem Statement" [level=4] [ref=e199]
                  - paragraph [ref=e200]: • Draft view test thought
                - generic [ref=e201]:
                  - paragraph [ref=e202]: Proposed 12:26:01 PM · Approved by you
                  - button "Re-organize" [ref=e203]:
                    - img [ref=e204]
                    - text: Re-organize
  - generic "Notifications"
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
> 14 |     await page.getByTestId('approve-btn').click({ timeout: 30_000 })
     |                                           ^ Error: locator.click: Test timeout of 30000ms exceeded.
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
  34 |     await expect(page.getByTestId(`draft-card-${draftId}`)).toHaveCount(0)
  35 |   })
  36 | })
  37 | 
```