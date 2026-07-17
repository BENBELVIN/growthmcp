import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { exchangeCodeForTokens } from "@/lib/gsc/oauth";
import {
  getSiteOrigin,
  GSC_OAUTH_STATE_COOKIE,
} from "@/lib/gsc/env";
import { listGscSites } from "@/lib/gsc/client";
import { preferWwwProperty } from "@/lib/gsc/properties";

type StatePayload = {
  websiteId: string;
  workspaceId: string;
  nonce: string;
};

export async function GET(request: NextRequest) {
  const origin = getSiteOrigin(request.headers);
  const redirectUri = `${origin}/api/integrations/gsc/callback`;
  const fail = (msg: string) =>
    NextResponse.redirect(
      new URL(`/dashboard/integrations?gsc_error=${encodeURIComponent(msg)}`, origin)
    );

  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const oauthError = request.nextUrl.searchParams.get("error");

  if (oauthError) {
    return fail(oauthError);
  }

  if (!code || !state) {
    return fail("missing_oauth_params");
  }

  const cookieState = request.cookies.get(GSC_OAUTH_STATE_COOKIE)?.value;
  if (!cookieState || cookieState !== state) {
    return fail("invalid_oauth_state");
  }

  let payload: StatePayload;
  try {
    payload = JSON.parse(
      Buffer.from(state, "base64url").toString("utf8")
    ) as StatePayload;
  } catch {
    return fail("bad_oauth_state");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/login", origin));
  }

  try {
    const tokens = await exchangeCodeForTokens(code, redirectUri);
    if (!tokens.refresh_token) {
      return fail(
        "No refresh token returned. Revoke GrowthMCP access in Google Account permissions and try again."
      );
    }

    const tokenExpiresAt = new Date(
      Date.now() + tokens.expires_in * 1000
    ).toISOString();

    const { error: upsertError } = await supabase.from("gsc_connections").upsert(
      {
        website_id: payload.websiteId,
        workspace_id: payload.workspaceId,
        connected_by: user.id,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        token_expires_at: tokenExpiresAt,
        property_uri: null,
        status: "pending_property",
        last_error: null,
      },
      { onConflict: "website_id" }
    );

    if (upsertError) {
      return fail(upsertError.message);
    }

    // Prefer www property automatically when available
    const { data: website } = await supabase
      .from("websites")
      .select("url")
      .eq("id", payload.websiteId)
      .maybeSingle();

    if (website) {
      try {
        const sites = await listGscSites(tokens.access_token);
        const { preferred } = preferWwwProperty(website.url, sites);
        if (preferred) {
          await supabase
            .from("gsc_connections")
            .update({
              property_uri: preferred,
              status: "connected",
              last_synced_at: new Date().toISOString(),
            })
            .eq("website_id", payload.websiteId);

          const res = NextResponse.redirect(
            new URL("/dashboard/integrations?gsc=connected", origin)
          );
          res.cookies.delete(GSC_OAUTH_STATE_COOKIE);
          return res;
        }
      } catch {
        // Fall through to picker
      }
    }

    const res = NextResponse.redirect(
      new URL(
        `/dashboard/integrations/gsc?websiteId=${payload.websiteId}`,
        origin
      )
    );
    res.cookies.delete(GSC_OAUTH_STATE_COOKIE);
    return res;
  } catch (e) {
    return fail(e instanceof Error ? e.message : "oauth_exchange_failed");
  }
}
