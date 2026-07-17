import type { Metadata } from "next";
import { BentoCard } from "@/components/dashboard/bento-card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Integrations" };

const integrations = [
  {
    name: "Google Search Console",
    description:
      "Pull queries, pages, CTR, and position changes into GrowthMCP.",
    logo: "/logos/gsc.svg",
    status: "Not connected" as const,
  },
  {
    name: "Google Trends",
    description:
      "Surface rising topics so your agent knows what demand is building.",
    logo: "/logos/trends.png",
    status: "Not connected" as const,
  },
];

export default function IntegrationsPage() {
  return (
    <div className="flex-1 p-4 sm:p-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Connect your data
          </h2>
          <p className="mt-3 text-muted-foreground">
            Start with Search Console and Trends. That&apos;s enough for Cursor
            to give useful growth recommendations.
          </p>
        </div>

        <div className="space-y-4">
          {integrations.map((item) => (
            <BentoCard
              key={item.name}
              className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-start gap-4">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.logo}
                    alt=""
                    width={28}
                    height={28}
                    className="size-7 object-contain"
                  />
                </span>
                <div>
                  <h3 className="text-base font-semibold tracking-tight">
                    {item.name}
                  </h3>
                  <p className="mt-1 max-w-md text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {item.status}
                  </p>
                </div>
              </div>
              <Button className="h-10 shrink-0 rounded-full bg-primary px-5 text-primary-foreground">
                Connect
              </Button>
            </BentoCard>
          ))}
        </div>
      </div>
    </div>
  );
}
