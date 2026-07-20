import { NextResponse, type NextRequest } from "next/server";
import { randomBytes } from "crypto";
import { createClient } from "@/lib/supabase/server";
import { buildBingAuthUrl } from "@/lib/bing/oauth";
import { getBingOAuthEnv, BING_OAUTH_STATE_COOKIE } from "@/lib/bing/env";
import { getSiteOrigin } from "@/lib/gsc/env";

export async function GET(request: NextRequest) {
  try {
    getBingOAuthEnv();
  } catch (e) {
    const msg = e instanceof Error ? e.message : "OAuth not configured";
    return NextResponse.redirect(
      new URL(
        `/dashboard/engine/integrations?bing_error=${encodeURIComponent(msg)}`,
        request.url
      )
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const websiteId = request.nextUrl.searchParams.get("websiteId");
  if (!websiteId) {
    return NextResponse.redirect(
      new URL("/dashboard/engine/integrations?bing_error=missing_website", request.url)
    );
  }

  const { data: website } = await supabase
    .from("websites")
    .select("id, workspace_id")
    .eq("id", websiteId)
    .maybeSingle();

  if (!website) {
    return NextResponse.redirect(
      new URL(
        "/dashboard/engine/integrations?bing_error=website_not_found",
        request.url
      )
    );
  }

  const origin = getSiteOrigin(request.headers);
  const redirectUri = `${origin}/api/integrations/bing/callback`;
  const nonce = randomBytes(16).toString("hex");
  const statePayload = Buffer.from(
    JSON.stringify({ websiteId, workspaceId: website.workspace_id, nonce })
  ).toString("base64url");

  const authUrl = buildBingAuthUrl({ redirectUri, state: statePayload });

  const response = NextResponse.redirect(authUrl);
  response.cookies.set(BING_OAUTH_STATE_COOKIE, statePayload, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 10,
  });

  return response;
}
