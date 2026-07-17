/**
 * Shared Supabase public env. Throws a clear error when missing
 * so middleware/pages don't fail with the opaque @supabase/ssr message.
 */
export function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. " +
        "Add them to .env.local (see .env.local.example), then restart `next dev`."
    );
  }

  return { url, anonKey };
}
