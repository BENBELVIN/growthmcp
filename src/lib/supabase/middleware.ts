import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { User } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { getSupabaseEnv } from "@/lib/supabase/env";

const AUTH_TIMEOUT_MS = 3_000;

function getAuthCookieNames(request: NextRequest) {
  return request.cookies
    .getAll()
    .map(({ name }) => name)
    .filter((name) => name.includes("-auth-token"));
}

function clearAuthCookies(response: NextResponse, request: NextRequest) {
  for (const name of getAuthCookieNames(request)) {
    response.cookies.set(name, "", { maxAge: 0, path: "/" });
  }
}

async function getUserWithTimeout(
  getUser: () => ReturnType<
    ReturnType<typeof createServerClient<Database>>["auth"]["getUser"]
  >
): Promise<User | null> {
  try {
    const result = await Promise.race([
      getUser(),
      new Promise<never>((_, reject) =>
        setTimeout(
          () => reject(new Error("Supabase auth request timed out")),
          AUTH_TIMEOUT_MS
        )
      ),
    ]);

    return result.error ? null : (result.data.user ?? null);
  } catch {
    return null;
  }
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const { url, anonKey } = getSupabaseEnv();

  const supabase = createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  const pathname = request.nextUrl.pathname;
  const isDashboard = pathname.startsWith("/dashboard");
  const isLogin = pathname === "/login";
  const hadAuthCookies = getAuthCookieNames(request).length > 0;

  // Do not add logic between createServerClient and getUser().
  const user = await getUserWithTimeout(() => supabase.auth.getUser());

  if (!user && hadAuthCookies) {
    clearAuthCookies(supabaseResponse, request);
  }

  if (isDashboard && !user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("next", pathname);
    const redirect = NextResponse.redirect(redirectUrl);
    if (hadAuthCookies) {
      clearAuthCookies(redirect, request);
    }
    return redirect;
  }

  if (isLogin && user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/dashboard";
    return NextResponse.redirect(redirectUrl);
  }

  return supabaseResponse;
}
