/**
 * Invite-only allowlist. Comma-separated emails in ALLOWED_EMAILS.
 * Defaults to the founder account when unset.
 */
export function getAllowedEmails(): string[] {
  const raw =
    process.env.ALLOWED_EMAILS ?? "benpjohnson01@gmail.com";

  return raw
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isEmailAllowed(email: string | null | undefined): boolean {
  if (!email) return false;
  return getAllowedEmails().includes(email.trim().toLowerCase());
}
