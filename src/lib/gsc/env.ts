export function getGoogleOAuthEnv() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error(
      "Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET. Add them to .env.local (see .env.local.example)."
    );
  }

  return { clientId, clientSecret };
}

export function getSiteOrigin(headerList: Headers) {
  const origin = headerList.get("origin");
  if (origin) return origin;

  const host = headerList.get("x-forwarded-host") ?? headerList.get("host");
  const proto = headerList.get("x-forwarded-proto") ?? "http";
  if (host) return `${proto}://${host}`;

  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

export const GSC_SCOPES = [
  "https://www.googleapis.com/auth/webmasters.readonly",
].join(" ");

export const GSC_OAUTH_STATE_COOKIE = "gsc_oauth_state";
