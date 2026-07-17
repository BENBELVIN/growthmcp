import type { Metadata } from "next";
import { Logo } from "@/components/shared/logo";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to GrowthMCP with Google.",
};

const errorMessages: Record<string, string> = {
  unauthorized: "This account isn’t invited yet. Sign-in is currently private.",
  auth_callback_failed: "Something went wrong signing in. Please try again.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const params = await searchParams;
  const next = params.next?.startsWith("/") ? params.next : "/dashboard";
  const error = params.error;
  const errorMessage = error
    ? (errorMessages[error] ?? errorMessages.auth_callback_failed)
    : null;

  return (
    <div className="dark relative flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
      <div className="pointer-events-none absolute inset-0 grid-fade opacity-50" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(ellipse_55%_45%_at_50%_-10%,rgba(100,180,255,0.14),transparent_70%)]" />

      <div className="relative z-10 w-full max-w-[360px]">
        <div className="mb-10 flex justify-center">
          <Logo href="/" />
        </div>

        <div className="rounded-3xl border border-border bg-card/80 p-8 shadow-2xl shadow-black/40 backdrop-blur-xl">
          <div className="mb-6 space-y-1.5 text-center">
            <h1 className="text-xl font-semibold tracking-tight">Sign in</h1>
            <p className="text-sm text-muted-foreground">
              Continue with your Google account to access your workspace.
            </p>
          </div>

          <GoogleSignInButton next={next} />

          {errorMessage && (
            <p className="mt-4 text-center text-sm text-destructive" role="alert">
              {errorMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
