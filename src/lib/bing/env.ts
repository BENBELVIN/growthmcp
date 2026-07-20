export function getBingOAuthEnv() {
  const clientId = process.env.BING_CLIENT_ID;
  const clientSecret = process.env.BING_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error(
      "Missing BING_CLIENT_ID or BING_CLIENT_SECRET. Add them to .env.local (see .env.local.example)."
    );
  }

  return { clientId, clientSecret };
}

/** Read-only access to Bing Webmaster data. */
export const BING_SCOPES = "webmaster.read";

export const BING_OAUTH_STATE_COOKIE = "bing_oauth_state";
