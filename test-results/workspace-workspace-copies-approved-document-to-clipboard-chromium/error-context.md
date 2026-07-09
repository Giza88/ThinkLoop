# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: workspace.spec.ts >> workspace >> copies approved document to clipboard
- Location: tests\e2e\workspace.spec.ts:82:3

# Error details

```
Test timeout of 30000ms exceeded.
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
                  - listitem [ref=e180]: Clipboard test thought
            - generic [ref=e181]:
              - generic [ref=e182]:
                - generic [ref=e183]:
                  - heading "Clipboard test thought" [level=3] [ref=e184]
                  - paragraph [ref=e185]: Approved — ready to export or send
                - generic [ref=e186]:
                  - button "Copy document" [ref=e187]:
                    - img [ref=e188]
                  - button "Export document" [ref=e191]:
                    - img [ref=e192]
              - generic [ref=e196]:
                - generic [ref=e198]:
                  - heading "Problem Statement" [level=4] [ref=e199]
                  - paragraph [ref=e200]: • Clipboard test thought
                - generic [ref=e201]:
                  - paragraph [ref=e202]: Proposed 12:23:45 PM · Approved by you
                  - button "Re-organize" [ref=e203]:
                    - img [ref=e204]
                    - text: Re-organize
  - generic "Notifications"
```

# Test source

```ts
  1   | import { expect, test } from '@playwright/test'
  2   | import { getDrafts, resetWorkspace } from './helpers/api.js'
  3   | import { navigateTo, waitForApp } from './helpers/app.js'
  4   | 
  5   | test.describe('workspace', () => {
  6   |   test.beforeEach(async ({ page }) => {
  7   |     await resetWorkspace()
  8   |     await waitForApp(page)
  9   |     await navigateTo(page, 'workspace')
  10  |   })
  11  | 
  12  |   test('cycles writing prompts', async ({ page }) => {
  13  |     const prompt = page.locator('text=Prompt:').locator('..')
  14  |     const before = await prompt.textContent()
  15  |     await page.getByTestId('next-prompt').click()
  16  |     const after = await prompt.textContent()
  17  |     expect(after).not.toBe(before)
  18  |   })
  19  | 
  20  |   test('voice button does not crash', async ({ page }) => {
  21  |     await page.getByTestId('voice-btn').click()
  22  |     await expect(page.getByTestId('app-shell')).toBeVisible()
  23  |   })
  24  | 
  25  |   test('adds a thought via button and keyboard shortcut', async ({ page }) => {
  26  |     await page.getByTestId('thought-input').fill('E2E test thought one')
  27  |     await page.getByTestId('add-thought').click()
  28  |     await expect(page.getByText('E2E test thought one')).toBeVisible()
  29  | 
  30  |     await page.getByTestId('thought-input').fill('E2E test thought two')
  31  |     await page.keyboard.press('Control+Enter')
  32  |     await expect(page.getByText('E2E test thought two')).toBeVisible()
  33  |   })
  34  | 
  35  |   test('organizes thoughts into a pending document', async ({ page }) => {
  36  |     await page.getByTestId('thought-input').fill('Users drop off at onboarding step two')
  37  |     await page.getByTestId('add-thought').click()
  38  |     await page.getByTestId('thought-input').fill('Role-based walkthroughs could help activation')
  39  |     await page.getByTestId('add-thought').click()
  40  | 
  41  |     await page.getByTestId('organize-btn').click()
  42  |     await expect(page.getByText('Awaiting your approval')).toBeVisible({ timeout: 30_000 })
  43  |     await expect(page.getByTestId('approve-btn')).toBeVisible()
  44  |     await expect(page.getByTestId('reject-btn')).toBeVisible()
  45  |   })
  46  | 
  47  |   test('approves document and saves to drafts', async ({ page }) => {
  48  |     await page.getByTestId('thought-input').fill('Approval flow test thought')
  49  |     await page.getByTestId('add-thought').click()
  50  |     await page.getByTestId('organize-btn').click()
  51  |     await expect(page.getByTestId('approve-btn')).toBeVisible({ timeout: 30_000 })
  52  | 
  53  |     await page.getByTestId('approve-btn').click()
  54  |     await expect(page.getByText('Approved — ready to export or send')).toBeVisible()
  55  |     await expect(page.getByTestId('toast-success')).toBeVisible()
  56  | 
  57  |     const drafts = await getDrafts()
  58  |     expect(drafts.length).toBeGreaterThan(0)
  59  |   })
  60  | 
  61  |   test('rejects pending proposal', async ({ page }) => {
  62  |     await page.getByTestId('thought-input').fill('Reject flow test thought')
  63  |     await page.getByTestId('add-thought').click()
  64  |     await page.getByTestId('organize-btn').click()
  65  |     await expect(page.getByTestId('reject-btn')).toBeVisible({ timeout: 30_000 })
  66  | 
  67  |     await page.getByTestId('reject-btn').click()
  68  |     await expect(page.getByTestId('organize-btn')).toBeVisible()
  69  |     await expect(page.getByTestId('toast-info')).toBeVisible()
  70  |   })
  71  | 
  72  |   test('re-organizes after approval', async ({ page }) => {
  73  |     await page.getByTestId('thought-input').fill('Reorganize test thought')
  74  |     await page.getByTestId('add-thought').click()
  75  |     await page.getByTestId('organize-btn').click()
  76  |     await page.getByTestId('approve-btn').click({ timeout: 30_000 })
  77  |     await expect(page.getByTestId('reorganize-btn')).toBeVisible()
  78  |     await page.getByTestId('reorganize-btn').click()
  79  |     await expect(page.getByText('Awaiting your approval')).toBeVisible({ timeout: 30_000 })
  80  |   })
  81  | 
  82  |   test('copies approved document to clipboard', async ({ page, context }) => {
  83  |     await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  84  | 
  85  |     await page.getByTestId('thought-input').fill('Clipboard test thought')
  86  |     await page.getByTestId('add-thought').click()
  87  |     await page.getByTestId('organize-btn').click()
> 88  |     await page.getByTestId('approve-btn').click({ timeout: 30_000 })
      |                                           ^ Error: locator.click: Test timeout of 30000ms exceeded.
  89  |     await expect(page.getByTestId('copy-btn')).toBeVisible()
  90  | 
  91  |     await page.getByTestId('copy-btn').click()
  92  |     await expect(page.getByTestId('toast-success')).toBeVisible()
  93  | 
  94  |     const clipboard = await page.evaluate(() => navigator.clipboard.readText())
  95  |     expect(clipboard.length).toBeGreaterThan(10)
  96  |   })
  97  | 
  98  |   test('exports approved document', async ({ page }) => {
  99  |     await page.getByTestId('thought-input').fill('Export test thought')
  100 |     await page.getByTestId('add-thought').click()
  101 |     await page.getByTestId('organize-btn').click()
  102 |     await page.getByTestId('approve-btn').click({ timeout: 30_000 })
  103 | 
  104 |     const downloadPromise = page.waitForEvent('download')
  105 |     await page.getByTestId('export-btn').click()
  106 |     const download = await downloadPromise
  107 |     expect(download.suggestedFilename()).toMatch(/\.md$/)
  108 |     await expect(page.getByTestId('toast-success')).toBeVisible()
  109 |   })
  110 | })
  111 | 
```