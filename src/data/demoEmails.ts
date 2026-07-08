import type { DemoEmail } from '../types'

export const DEMO_EMAILS: DemoEmail[] = [
  {
    id: 'email-1',
    from: 'Sarah Chen',
    fromEmail: 'sarah.chen@acmecorp.com',
    subject: 'Q2 product launch timeline — need your input',
    receivedAt: '2026-06-18T08:42:00.000Z',
    source: 'outlook',
    body: `Hi {{firstName}},

Hope you're doing well. Our leadership team is preparing for the Q2 launch review next Monday and I need a quick update from your side.

Specifically:
1. Are we still on track for the April 15 beta release?
2. What's the current status on the onboarding flow redesign?
3. Do you foresee any blockers we should flag to the exec team?

If possible, could you send something back by EOD Thursday? Happy to jump on a quick call if that's easier.

Thanks,
Sarah`,
  },
  {
    id: 'email-2',
    from: 'James Okonkwo',
    fromEmail: 'j.okonkwo@vendor.io',
    subject: 'Contract renewal — pricing discussion',
    receivedAt: '2026-06-17T14:15:00.000Z',
    source: 'outlook',
    body: `Hello {{firstName}},

Your annual contract with Vendor.io is up for renewal on July 1. We'd love to continue the partnership.

Our standard renewal is $48,000/year, but I can offer $42,000 if you sign by June 30. This includes the same seat count and premium support.

Can you confirm whether you'd like to proceed, and if so, who should I send the updated agreement to?

Best,
James Okonkwo
Account Manager`,
  },
  {
    id: 'email-3',
    from: 'Priya Sharma',
    fromEmail: 'priya@partnerstudio.com',
    subject: 'Reschedule our design review?',
    receivedAt: '2026-06-18T06:30:00.000Z',
    source: 'outlook',
    body: `Hey {{firstName}},

Something came up on my end — would you be open to moving our design review from tomorrow 2pm to Friday morning?

We have three items to cover:
- Mobile navigation patterns
- Approval workflow screens
- Empty states for the brainstorm board

Let me know what works. If Friday is bad, I can do Thursday after 4pm.

Cheers,
Priya`,
  },
]
