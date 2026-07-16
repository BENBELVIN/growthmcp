import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { Hero } from "@/components/marketing/hero";
import { IntegrationsSection } from "@/components/marketing/integrations-section";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { FeaturesSection } from "@/components/marketing/features-section";
import { ExampleConversation } from "@/components/marketing/example-conversation";
import { DeveloperSection } from "@/components/marketing/developer-section";
import { CtaSection } from "@/components/marketing/cta-section";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <Hero />
        <IntegrationsSection />
        <HowItWorks />
        <FeaturesSection />
        <ExampleConversation />
        <DeveloperSection />
        <CtaSection />
      </main>
      <SiteFooter />
    </div>
  );
}
