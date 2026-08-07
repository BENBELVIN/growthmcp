import { Hero } from "@/components/marketing/hero";
import { getWaitlistCount } from "@/lib/waitlist/queries";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const [params, waitlistCount] = await Promise.all([
    searchParams,
    getWaitlistCount(),
  ]);

  return (
    <Hero waitlistCount={waitlistCount} referralCode={params.ref} />
  );
}
