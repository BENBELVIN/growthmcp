import { cookies } from "next/headers";

export const WORKSPACE_COOKIE = "gm_workspace_id";
export const WEBSITE_COOKIE = "gm_website_id";

export async function getActiveContextCookies() {
  const jar = await cookies();
  return {
    workspaceId: jar.get(WORKSPACE_COOKIE)?.value ?? null,
    websiteId: jar.get(WEBSITE_COOKIE)?.value ?? null,
  };
}

export async function setActiveContextCookies(
  workspaceId: string,
  websiteId: string | null
) {
  const jar = await cookies();
  jar.set(WORKSPACE_COOKIE, workspaceId, {
    path: "/",
    sameSite: "lax",
    httpOnly: false,
    maxAge: 60 * 60 * 24 * 365,
  });

  if (websiteId) {
    jar.set(WEBSITE_COOKIE, websiteId, {
      path: "/",
      sameSite: "lax",
      httpOnly: false,
      maxAge: 60 * 60 * 24 * 365,
    });
  } else {
    jar.delete(WEBSITE_COOKIE);
  }
}
