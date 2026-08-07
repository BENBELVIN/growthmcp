import {
  buildWaitlistConfirmationEmail,
  waitlistConfirmationSubject,
} from "@/lib/email/waitlist-confirmation";

export async function GET(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return new Response("Not found", { status: 404 });
  }

  const url = new URL(request.url);
  const isNew = url.searchParams.get("isNew") !== "false";

  const html = buildWaitlistConfirmationEmail({ isNew });
  const subject = waitlistConfirmationSubject();

  return new Response(`<!-- Subject: ${subject} -->\n${html}`, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
