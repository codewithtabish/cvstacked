import { seniorSoftwareEngineerResume } from "@/data/resume";
import { AtsSection } from "./ats-section";
import BeforeAfter from "./beforeafter/before-after-section";
import AICapabilities from "./capabilities/ai-capabilities-section";
import { FaqSection } from "./faq-section";
import { FinalCta } from "./final-cta";
import LiveFormBuilder from "./formbuilder/liveform-builder";
import HeroToggle from "./heros/hero-toggle";
import { PricingSection } from "./pricing-section";
import Stats from "./stats/stats";
// import TemplatesShowcase from "./templateshowcase/template-showcase";
import TestimonialsSection from "./testmonials/testmonial-section";
import HowItWorks from "./working/how-it-work";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main>
        <HeroToggle resume={seniorSoftwareEngineerResume} />
        <HowItWorks />
        {/* <TemplatesShowcase /> */}
        <AICapabilities resume={seniorSoftwareEngineerResume} />
        <LiveFormBuilder resume={seniorSoftwareEngineerResume} />
        <BeforeAfter />
        {/* <HowItWorks /> */}

        {/* <HowItWorks /> */}
        {/* <ResumeBuilderShowcase /> */}
        <AtsSection />
        <Stats />
        <TestimonialsSection />
        {/* <FeatureBento /> */}
        <PricingSection />
        <FaqSection />
        <FinalCta />
      </main>
    </div>
  );
}
