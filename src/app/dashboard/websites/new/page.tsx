import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { WebsiteForm } from "@/components/dashboard/website-form";
import { BentoCard } from "@/components/dashboard/bento-card";

export const metadata: Metadata = { title: "Add Website" };

export default function NewWebsitePage() {
  return (
    <div className="flex-1 p-4 sm:p-8">
      <div className="mx-auto max-w-lg space-y-6">
        <div>
          <Link
            href="/dashboard/websites"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            Websites
          </Link>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
            Add Website
          </h2>
          <p className="mt-2 text-muted-foreground">
            Connect a site to this workspace. You can add more later.
          </p>
        </div>

        <BentoCard className="p-6 sm:p-8">
          <WebsiteForm mode="create" />
        </BentoCard>
      </div>
    </div>
  );
}
