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
            - heading "Email Reply" [level=1] [ref=e104]
            - paragraph [ref=e105]: "Demo: agent reads an Outlook email, asks clarifying questions, then drafts a reply for your approval before anything is sent."
            - paragraph [ref=e106]:
              - img [ref=e107]
              - text: Reading from Microsoft Outlook
          - generic [ref=e111]:
            - generic [ref=e112]:
              - img [ref=e114]
              - generic [ref=e117]: Read email
            - generic [ref=e119]:
              - img [ref=e121]
              - generic [ref=e124]: Answer questions
            - generic [ref=e126]:
              - generic [ref=e127]: "3"
              - generic [ref=e128]: Approve reply
          - generic [ref=e129]:
            - generic [ref=e130]:
              - paragraph [ref=e131]: Replying to
              - paragraph [ref=e132]: Sarah Chen
              - paragraph [ref=e133]: sarah.chen@acmecorp.com
              - paragraph [ref=e134]: "Re: Q2 product launch timeline — need your input"
            - generic [ref=e135]:
              - paragraph [ref=e137]: Approved — ready to send via Outlook
              - generic [ref=e138]:
                - generic [ref=e139]: Subject
                - textbox [disabled] [ref=e140]: "Re: Q2 product launch timeline — need your input"
                - generic [ref=e141]: Body
                - textbox [disabled] [ref=e142]: "Hi Sarah, Thank you for your email regarding \"Q2 product launch timeline — need your input\". Based on our current plans: - Approval test answer 1. - Approval test answer 2. - Approval test answer 3. Please let me know if you need anything else. Best regards, Alex Morgan"
                - generic [ref=e143]:
                  - button "Start over" [ref=e144]
                  - generic [ref=e145]:
                    - button "Copy" [ref=e146]:
                      - img [ref=e147]
                      - text: Copy
                    - button "Send via Outlook" [ref=e150]:
                      - img [ref=e151]
                      - text: Send via Outlook
  - generic "Notifications":
    - status [ref=e155]:
      - img [ref=e156]
      - paragraph [ref=e159]: Reply drafted — review and approve before sending
      - button "Dismiss notification" [ref=e160]:
        - img [ref=e161]
    - status [ref=e165]:
      - img [ref=e166]
      - paragraph [ref=e169]: Reply approved — ready to send via Outlook
      - button "Dismiss notification" [ref=e170]:
        - img [ref=e171]
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