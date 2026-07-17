import type { Metadata } from "next";
import { Logo } from "@/components/shared/logo";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to GrowthMCP with Google.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const params = await searchParams;
  const next = params.next?.startsWith("/") ? params.next : "/dashboard";
  const error = params.error;

  return (
    <div className="dark relative flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
      <div className="pointer-events-none absolute inset-0 grid-fade opacity-50" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(ellipse_55%_45%_at_50%_-10%,rgba(100,180,255,0.14),transparent_70%)]" />

      <div className="relative z-10 w-full max-w-[400px]">
        <div className="mb-10 flex justify-center">
          <Logo href="/" />
        </div>

        <div className="rounded-3xl border border-border bg-card/80 p-8 shadow-2xl shadow-black/40 backdrop-blur-xl">
          <div className="space-y-3 text-center">
            <h1 className="text-balance text-2xl font-semibold tracking-tight sm:text-[1.65rem] sm:leading-snug">
              Give your AI coding agent the growth data it needs.
            </h1>
            <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
              Connect Search Console, Trends, and your growth stack — then ask
              Cursor what to improve this week.
            </p>
          </div>

          <div className="mt-8 space-y-4">
            <GoogleSignInButton next={next} />

            {error && (
              <p className="text-center text-sm text-destructive" role="alert">
                Something went wrong signing in. Please try again.
              </p>
            )}

            <p className="text-center text-xs leading-relaxed text-muted-foreground">
              By continuing, you agree to let GrowthMCP create your account and
              a personal workspace.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
