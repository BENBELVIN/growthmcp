import { Resend } from "resend";

let resend: Resend | null = null;

export function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;

  if (!resend) {
    resend = new Resend(apiKey);
  }

  return resend;
}

export function getFromEmail() {
  return (
    process.env.RESEND_FROM_EMAIL ?? "growseo <onboarding@resend.dev>"
  );
}
