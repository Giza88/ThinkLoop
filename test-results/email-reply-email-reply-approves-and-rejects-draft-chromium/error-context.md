# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: email-reply.spec.ts >> email reply >> approves and rejects draft
- Location: tests\e2e\email-reply.spec.ts:39:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Approved — ready to send via Outlook')
Expected: visible
Error: strict mode violation: getByText('Approved — ready to send via Outlook') resolved to 2 elements:
    1) <p class="text-xs font-semibold text-tl-cyan-800">Approved — ready to send via Outlook</p> aka getByTestId('app-shell').getByText('Approved — ready to send via')
    2) <p class="min-w-0 flex-1 text-sm leading-snug text-inherit">Reply approved — ready to send via Outlook</p> aka getByText('Reply approved — ready to')

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText('Approved — ready to send via Outlook')

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
            - heading "Email Reply" [level=1] [ref=e123]
            - paragraph [ref=e124]: "Demo: agent reads an Outlook email, asks clarifying questions, then drafts a reply for your approval before anything is sent."
            - paragraph [ref=e125]:
              - img [ref=e126]
              - text: Reading from Microsoft Outlook
          - generic [ref=e130]:
            - generic [ref=e131]:
              - img [ref=e133]
              - generic [ref=e136]: Read email
            - generic [ref=e138]:
              - img [ref=e140]
              - generic [ref=e143]: Answer questions
            - generic [ref=e145]:
              - generic [ref=e146]: "3"
              - generic [ref=e147]: Approve reply
          - generic [ref=e148]:
            - generic [ref=e149]:
              - paragraph [ref=e150]: Replying to
              - paragraph [ref=e151]: Sarah Chen
              - paragraph [ref=e152]: sarah.chen@acmecorp.com
              - paragraph [ref=e153]: "Re: Q2 product launch timeline — need your input"
            - generic [ref=e154]:
              - paragraph [ref=e156]: Approved — ready to send via Outlook
              - generic [ref=e157]:
                - generic [ref=e158]: Subject
                - textbox [disabled] [ref=e159]: "Re: Q2 product launch timeline — need your input"
                - generic [ref=e160]: Body
                - textbox [disabled] [ref=e161]: "Hi Sarah, Thank you for your email regarding \"Q2 product launch timeline — need your input\". Based on our current plans: - Approval test answer 1. - Approval test answer 2. - Approval test answer 3. Please let me know if you need anything else. Best regards, Alex Morgan"
                - generic [ref=e162]:
                  - button "Start over" [ref=e163]
                  - generic [ref=e164]:
                    - button "Copy" [ref=e165]:
                      - img [ref=e166]
                      - text: Copy
                    - button "Send via Outlook" [ref=e169]:
                      - img [ref=e170]
                      - text: Send via Outlook
  - generic "Notifications":
    - status [ref=e174]:
      - img [ref=e175]
      - paragraph [ref=e178]: Reply drafted — review and approve before sending
      - button "Dismiss notification" [ref=e179]:
        - img [ref=e180]
    - status [ref=e184]:
      - img [ref=e185]
      - paragraph [ref=e188]: Reply approved — ready to send via Outlook
      - button "Dismiss notification" [ref=e189]:
        - img [ref=e190]
```

# Test source

```ts
  1   | import { expect, test } from '@playwright/test'
  2   | import { navigateTo, waitForApp } from './helpers/app.js'
  3   | 
  4   | test.describe('email reply', () => {
  5   |   test.beforeEach(async ({ page }) => {
  6   |     await waitForApp(page)
  7   |     await navigateTo(page, 'email-reply')
  8   |   })
  9   | 
  10  |   test('selects an email from the inbox', async ({ page }) => {
  11  |     await page.getByTestId('email-card-email-2').click()
  12  |     await expect(page.getByText('Contract renewal — pricing discussion')).toBeVisible()
  13  |   })
  14  | 
  15  |   test('analyzes email and shows questions', async ({ page }) => {
  16  |     await page.getByTestId('analyze-btn').click()
  17  |     await expect(page.getByText('Agent questions — answer before drafting')).toBeVisible({
  18  |       timeout: 30_000,
  19  |     })
  20  |     await expect(page.locator('textarea').first()).toBeVisible()
  21  |   })
  22  | 
  23  |   test('drafts reply after answering questions', async ({ page }) => {
  24  |     await page.getByTestId('analyze-btn').click()
  25  |     await expect(page.locator('textarea').first()).toBeVisible({ timeout: 30_000 })
  26  | 
  27  |     const textareas = page.locator('textarea')
  28  |     const count = await textareas.count()
  29  |     for (let i = 0; i < count; i += 1) {
  30  |       await textareas.nth(i).fill(`E2E answer ${i + 1} with enough detail for drafting.`)
  31  |     }
  32  | 
  33  |     await page.getByTestId('draft-btn').click()
  34  |     await expect(page.getByText('Agent draft — you approve before sending')).toBeVisible({
  35  |       timeout: 30_000,
  36  |     })
  37  |   })
  38  | 
  39  |   test('approves and rejects draft', async ({ page }) => {
  40  |     await page.getByTestId('analyze-btn').click()
  41  |     await expect(page.locator('textarea').first()).toBeVisible({ timeout: 30_000 })
  42  | 
  43  |     const textareas = page.locator('textarea')
  44  |     const count = await textareas.count()
  45  |     for (let i = 0; i < count; i += 1) {
  46  |       await textareas.nth(i).fill(`Approval test answer ${i + 1}.`)
  47  |     }
  48  | 
  49  |     await page.getByTestId('draft-btn').click()
  50  |     await expect(page.getByTestId('approve-draft')).toBeVisible({ timeout: 30_000 })
  51  | 
  52  |     await page.getByTestId('reject-draft').click()
  53  |     await expect(page.getByTestId('toast-info')).toBeVisible()
  54  |     await expect(page.getByTestId('draft-btn')).toBeVisible()
  55  | 
  56  |     await page.getByTestId('draft-btn').click()
  57  |     await expect(page.getByTestId('approve-draft')).toBeVisible({ timeout: 30_000 })
  58  |     await page.getByTestId('approve-draft').click()
> 59  |     await expect(page.getByText('Approved — ready to send via Outlook')).toBeVisible()
      |                                                                          ^ Error: expect(locator).toBeVisible() failed
  60  |   })
  61  | 
  62  |   test('copies draft to clipboard', async ({ page, context }) => {
  63  |     await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  64  | 
  65  |     await page.getByTestId('analyze-btn').click()
  66  |     await expect(page.locator('textarea').first()).toBeVisible({ timeout: 30_000 })
  67  | 
  68  |     const textareas = page.locator('textarea')
  69  |     const count = await textareas.count()
  70  |     for (let i = 0; i < count; i += 1) {
  71  |       await textareas.nth(i).fill(`Copy test answer ${i + 1}.`)
  72  |     }
  73  | 
  74  |     await page.getByTestId('draft-btn').click()
  75  |     await page.getByTestId('approve-draft').click({ timeout: 30_000 })
  76  |     await page.getByTestId('copy-draft').click()
  77  |     await expect(page.getByTestId('toast-success')).toBeVisible()
  78  | 
  79  |     const clipboard = await page.evaluate(() => navigator.clipboard.readText())
  80  |     expect(clipboard).toContain('Subject:')
  81  |   })
  82  | 
  83  |   test('sends via outlook mock', async ({ page }) => {
  84  |     await page.getByTestId('analyze-btn').click()
  85  |     await expect(page.locator('textarea').first()).toBeVisible({ timeout: 30_000 })
  86  | 
  87  |     const textareas = page.locator('textarea')
  88  |     const count = await textareas.count()
  89  |     for (let i = 0; i < count; i += 1) {
  90  |       await textareas.nth(i).fill(`Send test answer ${i + 1}.`)
  91  |     }
  92  | 
  93  |     await page.getByTestId('draft-btn').click()
  94  |     await page.getByTestId('approve-draft').click({ timeout: 30_000 })
  95  |     await page.getByTestId('send-outlook').click()
  96  |     await expect(page.getByTestId('toast-success')).toBeVisible()
  97  |   })
  98  | 
  99  |   test('resets flow to inbox', async ({ page }) => {
  100 |     await page.getByTestId('analyze-btn').click()
  101 |     await expect(page.getByTestId('reset-flow').first()).toBeVisible({ timeout: 30_000 })
  102 |     await page.getByTestId('reset-flow').first().click()
  103 |     await expect(page.getByTestId('analyze-btn')).toBeVisible()
  104 |   })
  105 | })
  106 | 
```