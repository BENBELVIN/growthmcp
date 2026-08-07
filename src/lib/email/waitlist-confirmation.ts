import { siteConfig } from "@/lib/site";

/** Landing-page palette (hex for email clients). */
const colors = {
  background: "#f5f8f8",
  card: "#ffffff",
  foreground: "#1a1f2e",
  muted: "#64748b",
  border: "#e2e8ec",
  brand: "#14a08c",
  footer: "#94a3b8",
} as const;

type WaitlistConfirmationParams = {
  isNew: boolean;
};

export function waitlistConfirmationSubject() {
  return `You're on the ${siteConfig.name} early access list`;
}

export function buildWaitlistConfirmationEmail({
  isNew,
}: WaitlistConfirmationParams) {
  const siteUrl = siteConfig.url;
  const logoUrl = `${siteUrl}/logos/growseo.png`;

  const headline = isNew ? "You're on the list" : "You're already on the list";
  const intro = isNew
    ? "Thanks for joining early access. We'll email you when your spot opens."
    : "Your spot is saved. We'll email you when early access opens.";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light" />
  <meta name="supported-color-schemes" content="light" />
  <title>${siteConfig.name} waitlist</title>
</head>
<body style="margin:0;padding:0;background:${colors.background};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:${colors.foreground};-webkit-font-smoothing:antialiased;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
    ${headline}. ${intro}
  </div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${colors.background};padding:40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:520px;background:${colors.card};border:1px solid ${colors.border};border-radius:24px;overflow:hidden;box-shadow:0 1px 3px rgba(26,31,46,0.06);">
          <tr>
            <td style="height:4px;background:linear-gradient(90deg,${colors.brand} 0%,rgba(20,160,140,0.35) 50%,${colors.brand} 100%);font-size:0;line-height:0;">&nbsp;</td>
          </tr>
          <tr>
            <td style="padding:32px 32px 0;text-align:center;">
              <a href="${siteUrl}" style="text-decoration:none;">
                <img
                  src="${logoUrl}"
                  alt="${siteConfig.name}"
                  width="152"
                  height="32"
                  style="display:block;margin:0 auto;height:32px;width:auto;max-width:152px;border:0;"
                />
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 32px 24px;text-align:center;">
              <h1 style="margin:0 0 12px;font-size:26px;line-height:1.2;font-weight:600;letter-spacing:-0.02em;color:${colors.foreground};">
                ${headline}
              </h1>
              <p style="margin:0;font-size:16px;line-height:1.6;color:${colors.muted};">
                ${intro}
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px 32px;">
              <p style="margin:0 0 10px;font-size:15px;line-height:1.5;color:${colors.foreground};">
                <strong>What you signed up for</strong>
              </p>
              <p style="margin:0 0 20px;font-size:15px;line-height:1.65;color:${colors.muted};">
                ${siteConfig.description}
              </p>
              <p style="margin:0 0 10px;font-size:15px;line-height:1.5;color:${colors.foreground};">
                <strong>What happens next</strong>
              </p>
              <ul style="margin:0;padding-left:18px;font-size:15px;line-height:1.7;color:${colors.muted};">
                <li style="margin-bottom:6px;">You're confirmed — no action needed right now.</li>
                <li style="margin-bottom:6px;">We'll email you personally when early access opens.</li>
                <li>Occasional product updates only. No spam, no fixed launch date promises.</li>
              </ul>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px;border-top:1px solid ${colors.border};background:${colors.background};text-align:center;">
              <p style="margin:0;font-size:13px;line-height:1.6;color:${colors.footer};">
                ${siteConfig.name} · Grow your product with organic traffic<br />
                <a href="${siteUrl}" style="color:${colors.brand};text-decoration:none;">${siteUrl.replace(/^https?:\/\//, "")}</a>
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
