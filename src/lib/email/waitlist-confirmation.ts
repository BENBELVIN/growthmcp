import { siteConfig } from "@/lib/site";

type WaitlistConfirmationParams = {
  email: string;
  position: number;
  referralCode: string;
  isNew: boolean;
};

function formatPosition(position: number) {
  return position.toLocaleString("en-US");
}

export function waitlistConfirmationSubject(position: number) {
  return `You're #${formatPosition(position)} on the ${siteConfig.name} waitlist`;
}

export function buildWaitlistConfirmationEmail({
  position,
  referralCode,
  isNew,
}: WaitlistConfirmationParams) {
  const referralUrl = `${siteConfig.url}?ref=${referralCode}`;
  const formattedPosition = formatPosition(position);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${siteConfig.name} waitlist</title>
</head>
<body style="margin:0;padding:0;background:#f4f6f8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#111827;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f6f8;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border:1px solid #e5e7eb;border-radius:16px;overflow:hidden;">
          <tr>
            <td style="padding:32px 32px 24px;">
              <p style="margin:0 0 8px;font-size:13px;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;color:#14a08c;">
                ${siteConfig.name}
              </p>
              <h1 style="margin:0 0 12px;font-size:28px;line-height:1.2;font-weight:600;color:#111827;">
                ${isNew ? "You're on the list" : "You're already on the list"}
              </h1>
              <p style="margin:0;font-size:16px;line-height:1.6;color:#4b5563;">
                ${
                  isNew
                    ? "Thanks for joining early access. We'll email you as soon as your spot opens."
                    : "Good news — your spot is saved. We'll email you when early access opens."
                }
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px 24px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f8fafb;border:1px solid #e5e7eb;border-radius:12px;">
                <tr>
                  <td style="padding:20px 24px;text-align:center;">
                    <p style="margin:0 0 4px;font-size:13px;color:#6b7280;">Your place in line</p>
                    <p style="margin:0;font-size:36px;line-height:1;font-weight:700;color:#111827;">#${formattedPosition}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px 24px;">
              <p style="margin:0 0 12px;font-size:15px;line-height:1.6;color:#374151;">
                <strong>What happens next</strong>
              </p>
              <ul style="margin:0;padding-left:20px;font-size:15px;line-height:1.7;color:#4b5563;">
                <li>We're onboarding teams in batches over the coming weeks.</li>
                <li>You'll get a personal invite email when it's your turn.</li>
                <li>No spam — just launch updates and your access link.</li>
              </ul>
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px 32px;">
              <p style="margin:0 0 12px;font-size:15px;line-height:1.6;color:#374151;">
                <strong>Move up the list</strong>
              </p>
              <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#4b5563;">
                Share your link with a founder or marketer who'd benefit from growseo.
              </p>
              <p style="margin:0;padding:12px 14px;background:#f8fafb;border:1px solid #e5e7eb;border-radius:10px;font-size:14px;line-height:1.5;color:#14a08c;word-break:break-all;">
                <a href="${referralUrl}" style="color:#14a08c;text-decoration:none;">${referralUrl}</a>
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px;border-top:1px solid #e5e7eb;background:#fafafa;">
              <p style="margin:0;font-size:13px;line-height:1.5;color:#9ca3af;">
                ${siteConfig.name} · Grow your product with organic traffic<br />
                <a href="${siteConfig.url}" style="color:#14a08c;text-decoration:none;">${siteConfig.url.replace(/^https?:\/\//, "")}</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
