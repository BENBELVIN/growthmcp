import { SiteHeader } from "@/components/marketing/site-header";
import { Hero } from "@/components/marketing/hero";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <Hero />
      </main>
    </div>
  );
}
