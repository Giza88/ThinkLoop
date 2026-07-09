# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: email-reply.spec.ts >> email reply >> selects an email from the inbox
- Location: tests\e2e\email-reply.spec.ts:10:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Contract renewal — pricing discussion')
Expected: visible
Error: strict mode violation: getByText('Contract renewal — pricing discussion') resolved to 2 elements:
    1) <p class="mt-0.5 truncate text-sm text-tl-gray-700">Contract renewal — pricing discussion</p> aka getByTestId('email-card-email-2')
    2) <h3 class="mt-1 text-base font-semibold text-tl-gray-900">Contract renewal — pricing discussion</h3> aka getByRole('heading', { name: 'Contract renewal — pricing' })

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText('Contract renewal — pricing discussion')

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
              - generic [ref=e132]: "1"
              - generic [ref=e133]: Read email
            - generic [ref=e135]:
              - generic [ref=e136]: "2"
              - generic [ref=e137]: Answer questions
            - generic [ref=e139]:
              - generic [ref=e140]: "3"
              - generic [ref=e141]: Approve reply
          - generic [ref=e142]:
            - generic [ref=e143]:
              - heading "Inbox (demo)" [level=2] [ref=e144]
              - generic [ref=e145]:
                - 'button "Sarah Chen Q2 product launch timeline — need your input Hi Alex, Hope you''re doing well. Our leadership team is preparing for the Q2 launch review next Monday and I need a quick update from your side. Specifically: 1. Are we still on track for the April 15 beta release? 2. What''s the current status on the onboarding flow redesign? 3. Do you foresee any blockers we should flag to the exec team? If possible, could you send something back by EOD Thursday? Happy to jump on a quick call if that''s easier. Thanks, Sarah Outlook Thu, Jun 18, 8:42 PM" [ref=e146]':
                  - generic [ref=e147]:
                    - generic [ref=e148]:
                      - paragraph [ref=e149]: Sarah Chen
                      - paragraph [ref=e150]: Q2 product launch timeline — need your input
                      - paragraph [ref=e151]: "Hi Alex, Hope you're doing well. Our leadership team is preparing for the Q2 launch review next Monday and I need a quick update from your side. Specifically: 1. Are we still on track for the April 15 beta release? 2. What's the current status on the onboarding flow redesign? 3. Do you foresee any blockers we should flag to the exec team? If possible, could you send something back by EOD Thursday? Happy to jump on a quick call if that's easier. Thanks, Sarah"
                    - generic [ref=e152]: Outlook
                  - paragraph [ref=e153]: Thu, Jun 18, 8:42 PM
                - button "James Okonkwo Contract renewal — pricing discussion Hello Alex, Your annual contract with Vendor.io is up for renewal on July 1. We'd love to continue the partnership. Our standard renewal is $48,000/year, but I can offer $42,000 if you sign by June 30. This includes the same seat count and premium support. Can you confirm whether you'd like to proceed, and if so, who should I send the updated agreement to? Best, James Okonkwo Account Manager Outlook Thu, Jun 18, 2:15 AM" [active] [ref=e154]:
                  - generic [ref=e155]:
                    - generic [ref=e156]:
                      - paragraph [ref=e157]: James Okonkwo
                      - paragraph [ref=e158]: Contract renewal — pricing discussion
                      - paragraph [ref=e159]: Hello Alex, Your annual contract with Vendor.io is up for renewal on July 1. We'd love to continue the partnership. Our standard renewal is $48,000/year, but I can offer $42,000 if you sign by June 30. This includes the same seat count and premium support. Can you confirm whether you'd like to proceed, and if so, who should I send the updated agreement to? Best, James Okonkwo Account Manager
                    - generic [ref=e160]: Outlook
                  - paragraph [ref=e161]: Thu, Jun 18, 2:15 AM
                - 'button "Priya Sharma Reschedule our design review? Hey Alex, Something came up on my end — would you be open to moving our design review from tomorrow 2pm to Friday morning? We have three items to cover: - Mobile navigation patterns - Approval workflow screens - Empty states for the brainstorm board Let me know what works. If Friday is bad, I can do Thursday after 4pm. Cheers, Priya Outlook Thu, Jun 18, 6:30 PM" [ref=e162]':
                  - generic [ref=e163]:
                    - generic [ref=e164]:
                      - paragraph [ref=e165]: Priya Sharma
                      - paragraph [ref=e166]: Reschedule our design review?
                      - paragraph [ref=e167]: "Hey Alex, Something came up on my end — would you be open to moving our design review from tomorrow 2pm to Friday morning? We have three items to cover: - Mobile navigation patterns - Approval workflow screens - Empty states for the brainstorm board Let me know what works. If Friday is bad, I can do Thursday after 4pm. Cheers, Priya"
                    - generic [ref=e168]: Outlook
                  - paragraph [ref=e169]: Thu, Jun 18, 6:30 PM
            - generic [ref=e170]:
              - generic [ref=e171]:
                - paragraph [ref=e172]: Selected email
                - heading "Contract renewal — pricing discussion" [level=3] [ref=e173]
                - paragraph [ref=e174]: James Okonkwo <j.okonkwo@vendor.io>
                - paragraph [ref=e175]: Thu, Jun 18, 2:15 AM
              - paragraph [ref=e177]: Hello Alex, Your annual contract with Vendor.io is up for renewal on July 1. We'd love to continue the partnership. Our standard renewal is $48,000/year, but I can offer $42,000 if you sign by June 30. This includes the same seat count and premium support. Can you confirm whether you'd like to proceed, and if so, who should I send the updated agreement to? Best, James Okonkwo Account Manager
              - button "Read & analyze with agent" [ref=e178]:
                - img [ref=e179]
                - text: Read & analyze with agent
  - generic "Notifications"
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
> 12  |     await expect(page.getByText('Contract renewal — pricing discussion')).toBeVisible()
      |                                                                           ^ Error: expect(locator).toBeVisible() failed
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
  59  |     await expect(page.getByText('Approved — ready to send via Outlook')).toBeVisible()
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