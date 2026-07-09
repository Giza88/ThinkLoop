# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: dashboard.spec.ts >> dashboard >> integration connect opens modal for github
- Location: tests\e2e\dashboard.spec.ts:34:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByTestId('toast-success')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByTestId('toast-success')

```

```yaml
- complementary:
  - img "ThinkLoop"
  - navigation:
    - list:
      - listitem:
        - button "Dashboard"
      - listitem:
        - button "AI Workspace"
      - listitem:
        - button "Email Reply"
      - listitem:
        - button "Brainstorm"
    - list:
      - listitem:
        - button "4"
      - listitem:
        - button "History"
    - list:
      - listitem:
        - button "Summaries"
      - listitem:
        - button "Research"
      - listitem:
        - button "Team"
  - button "Settings"
  - button "Expand sidebar"
- banner:
  - searchbox "Search ideas, drafts, summaries…"
  - text: ⌘K You approve · Agent proposes
  - button "Switch to dark mode"
  - button "Notifications"
  - button "AM Alex Morgan"
- main:
  - heading "Good morning, Alex" [level=1]
  - paragraph: Connect your tools, let the agent propose — you stay the backbone of every decision.
  - text: Human-in-the-loop backbone
  - heading "You stay in control — not on the sidelines" [level=2]
  - paragraph: Like Microsoft Copilot, ThinkLoop connects to your work tools through sign-in. Unlike autopilot agents, every output passes through you. You are the backbone — the agent proposes, you review, you approve.
  - paragraph: Copilot-style reach
  - paragraph: Connect anything via login
  - paragraph: ThinkLoop difference
  - paragraph: Nothing acts without your approval
  - paragraph: Connected via sign-in
  - text: MS
  - paragraph: Microsoft 365
  - paragraph: Outlook, Teams, SharePoint, OneDrive
  - text: G
  - paragraph: Google Workspace
  - paragraph: Gmail, Calendar, Drive, Docs
  - text: Sl
  - paragraph: Slack
  - paragraph: Channels, threads, and team context
  - text: GH
  - paragraph: GitHub
  - paragraph: Repos, PRs, issues, and commits
  - paragraph: OAuth sign-in — agent reads context, never stores passwords
  - paragraph: Agent
  - paragraph: Proposes only
  - text: You Step 1
  - paragraph: Connect your tools
  - paragraph: Sign in once — the agent reads context from Outlook, Slack, GitHub, and more.
  - text: You Step 2
  - paragraph: You set the goal
  - paragraph: Tell the agent what you want. Your intent drives every action.
  - text: Agent Step 3
  - paragraph: Agent proposes
  - paragraph: AI drafts summaries, replies, and documents — never sends them alone.
  - text: You Step 4
  - paragraph: You review & edit
  - paragraph: Change anything. The agent waits. Nothing moves until you say so.
  - text: You Step 5
  - paragraph: You approve to act
  - paragraph: Only approved output reaches your tools, teammates, or customers.
  - strong: "The backbone:"
  - text: every agent action is a proposal until you approve it — send email, post to Slack, update a doc, or export a file.
  - heading "Connect your stack" [level=3]
  - paragraph: Sign in to any tool — Microsoft 365, Google, Slack, GitHub, and more. The agent uses connected context to propose drafts; you approve before anything goes out.
  - text: MS
  - paragraph: Microsoft 365
  - text: Connected
  - paragraph: Outlook, Teams, SharePoint, OneDrive
  - button "Disconnect"
  - text: G
  - paragraph: Google Workspace
  - paragraph: Gmail, Calendar, Drive, Docs
  - button "Sign in to connect"
  - text: Sl
  - paragraph: Slack
  - text: Connected
  - paragraph: Channels, threads, and team context
  - button "Disconnect"
  - text: GH
  - paragraph: GitHub
  - text: Connected
  - paragraph: Repos, PRs, issues, and commits
  - button "Disconnect"
  - text: Li
  - paragraph: Linear
  - paragraph: Issues, cycles, and project updates
  - button "Sign in to connect"
  - text: "N"
  - paragraph: Notion
  - paragraph: Pages, databases, and wikis
  - button "Sign in to connect"
  - text: 3 tools connected — agent can read context from these sources. All outbound actions still require your approval.
  - button "Start a new session Capture thoughts, get an AI proposal, approve before export — the full human loop. Open workspace":
    - paragraph: Start a new session
    - paragraph: Capture thoughts, get an AI proposal, approve before export — the full human loop.
    - text: Open workspace
  - button "Connect more tools Sign in to Microsoft, Slack, GitHub, and more — agent reads context, you approve actions. Manage integrations":
    - paragraph: Connect more tools
    - paragraph: Sign in to Microsoft, Slack, GitHub, and more — agent reads context, you approve actions.
    - text: Manage integrations
  - button "Brainstorm ideas Collect product ideas, tag them, and pick one to develop in the workspace. View board":
    - paragraph: Brainstorm ideas
    - paragraph: Collect product ideas, tag them, and pick one to develop in the workspace.
    - text: View board
  - paragraph: "15"
  - paragraph: Outputs Generated
  - paragraph: +15 this week
  - paragraph: 100%
  - paragraph: Approval Rate
  - paragraph: Healthy approved vs rejected
  - paragraph: "11"
  - paragraph: Drafts Saved
  - paragraph: total saves
  - paragraph: "0"
  - paragraph: Exports
  - paragraph: approved exports
  - heading "AI Outputs This Week" [level=3]
  - paragraph: Recent structured documents
  - button "Add Idea"
  - heading "E2E Idea 1783556645893" [level=4]
  - text: UX
  - paragraph: End-to-end brainstorm test idea.
  - heading "E2E Idea 1783556012465" [level=4]
  - text: UX
  - paragraph: End-to-end brainstorm test idea.
  - heading "Personalized onboarding flow" [level=4]
  - text: Product UX
  - paragraph: Use AI to analyze user role on sign-up and serve tailored next steps — reduce time-to-value by ~40%.
  - heading "Weekly digest newsletter" [level=4]
  - text: Marketing Automation
  - paragraph: Auto-summarize team activity from Slack, Linear, and GitHub into a readable Friday newsletter.
  - heading "Weekly Activity" [level=3]
  - paragraph: AI outputs by day
  - text: Sun Mon Tue Wed Thu Fri Sat
- status:
  - paragraph: Bad Request
  - button "Dismiss notification"
```

# Test source

```ts
  1  | import { expect, test } from '@playwright/test'
  2  | import { navigateTo, waitForApp } from './helpers/app.js'
  3  | 
  4  | const INTEGRATION_PROVIDER_IDS = ['microsoft', 'google', 'slack', 'github', 'linear', 'notion']
  5  | 
  6  | test.describe('dashboard', () => {
  7  |   test.beforeEach(async ({ page }) => {
  8  |     await waitForApp(page)
  9  |     await navigateTo(page, 'dashboard')
  10 |   })
  11 | 
  12 |   test('start a new session navigates to workspace', async ({ page }) => {
  13 |     await page.getByTestId('card-new-session').click()
  14 |     await expect(page.getByRole('heading', { name: /thinkloop workspace/i })).toBeVisible()
  15 |   })
  16 | 
  17 |   test('connect more tools navigates to settings', async ({ page }) => {
  18 |     await page.getByTestId('card-connect-tools').click()
  19 |     await expect(page.getByRole('heading', { name: /^settings$/i })).toBeVisible()
  20 |   })
  21 | 
  22 |   test('brainstorm ideas navigates to brainstorm', async ({ page }) => {
  23 |     await page.getByTestId('card-brainstorm').click()
  24 |     await expect(page.getByRole('heading', { name: /brainstorm board/i })).toBeVisible()
  25 |   })
  26 | 
  27 |   test('add idea button in stats panel does not crash', async ({ page }) => {
  28 |     await page.getByTestId('add-idea-btn').click()
  29 |     await expect(page.getByTestId('app-shell')).toBeVisible()
  30 |     await expect(page.getByTestId('toast-error')).toHaveCount(0)
  31 |   })
  32 | 
  33 |   for (const providerId of INTEGRATION_PROVIDER_IDS) {
  34 |     test(`integration connect opens modal for ${providerId}`, async ({ page }) => {
  35 |       const button = page.getByTestId(`integration-${providerId}`).first()
  36 |       const label = await button.textContent()
  37 | 
  38 |       if (label?.includes('Disconnect')) {
  39 |         await button.click()
> 40 |         await expect(page.getByTestId('toast-success')).toBeVisible()
     |                                                         ^ Error: expect(locator).toBeVisible() failed
  41 |         await page.getByTestId(`integration-${providerId}`).first().click()
  42 |       }
  43 | 
  44 |       await expect(page.getByTestId('connect-modal')).toBeVisible()
  45 |       await page.getByLabel('Close modal').click()
  46 |       await expect(page.getByTestId('connect-modal')).toBeHidden()
  47 |     })
  48 |   }
  49 | 
  50 |   test('integration disconnect removes connected state', async ({ page }) => {
  51 |     const slackButton = page.getByTestId('integration-slack').first()
  52 | 
  53 |     if ((await slackButton.textContent())?.includes('Disconnect')) {
  54 |       await slackButton.click()
  55 |       await expect(page.getByTestId('toast-success')).toBeVisible()
  56 |     }
  57 | 
  58 |     await slackButton.click()
  59 |     await page.getByTestId('connect-continue').click()
  60 |     await expect(page.getByTestId('toast-success')).toBeVisible({ timeout: 10_000 })
  61 | 
  62 |     const connectedButton = page.getByTestId('integration-slack').first()
  63 |     await expect(connectedButton).toContainText('Disconnect')
  64 | 
  65 |     await connectedButton.click()
  66 |     await expect(page.getByTestId('toast-success')).toBeVisible()
  67 |     await expect(connectedButton).toContainText('Sign in to connect')
  68 |   })
  69 | })
  70 | 
```