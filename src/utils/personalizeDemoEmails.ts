import type { DemoEmail } from '../types'

export function personalizeDemoEmails(
  emails: DemoEmail[],
  firstName: string | null,
): DemoEmail[] {
  const greetingName = firstName?.trim() || 'there'

  return emails.map((email) => ({
    ...email,
    body: email.body.replaceAll('{{firstName}}', greetingName),
  }))
}
