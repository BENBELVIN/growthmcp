import { getBingOAuthEnv, BING_SCOPES } from "@/lib/bing/env";

export type BingTokenResponse = {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  scope?: string;
  token_type: string;
};

const AUTHORIZE_URL = "https://www.bing.com/webmasters/oauth/authorize";
const TOKEN_URL = "https://www.bing.com/webmasters/oauth/token";

export function buildBingAuthUrl(params: {
  redirectUri: string;
  state: string;
}) {
  const { clientId } = getBingOAuthEnv();
  const url = new URL(AUTHORIZE_URL);
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", params.redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", BING_SCOPES);
  url.searchParams.set("state", params.state);
  return url.toString();
}

export async function exchangeCodeForTokens(
  code: string,
  redirectUri: string
): Promise<BingTokenResponse> {
  const { clientId, clientSecret } = getBingOAuthEnv();

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  const json = (await res.json()) as BingTokenResponse & {
    error?: string;
    error_description?: string;
  };
  if (!res.ok || !json.access_token) {
    throw new Error(
      json.error_description ?? json.error ?? "Failed to exchange Bing OAuth code"
    );
  }

  return json;
}

export async function refreshAccessToken(
  refreshToken: string
): Promise<BingTokenResponse> {
  const { clientId, clientSecret } = getBingOAuthEnv();

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  const json = (await res.json()) as BingTokenResponse & {
    error?: string;
    error_description?: string;
  };
  if (!res.ok || !json.access_token) {
    throw new Error(
      json.error_description ?? json.error ?? "Failed to refresh Bing access token"
    );
  }

  return json;
}
