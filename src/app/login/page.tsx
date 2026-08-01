import type { Metadata } from "next";
import Image from "next/image";
import { Logo } from "@/components/shared/logo";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to GrowthSEO with Google.",
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
    <div className="min-h-screen bg-background">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Left — sign in */}
        <div className="relative flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16 xl:px-20">
          <div className="pointer-events-none absolute inset-0 grid-fade-light" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[480px] bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(20,160,140,0.14),transparent_70%)]" />

          <div className="relative z-10 mx-auto w-full max-w-sm">
            <Logo href="/" className="mb-12" />

            <div className="space-y-6">
              <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                  Sign in
                </h1>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Continue with your Google account to access your workspace.
                </p>
              </div>

              <GoogleSignInButton next={next} />

              {errorMessage && (
                <p className="text-sm text-destructive" role="alert">
                  {errorMessage}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right — feature image */}
        <div className="relative hidden min-h-[320px] lg:block">
          <Image
            src="/hero-feature.png"
            alt="Growseo glass logo floating over a field of daisies"
            fill
            priority
            sizes="50vw"
            className="object-cover object-center"
          />
        </div>
      </div>
    </div>
  );
}
