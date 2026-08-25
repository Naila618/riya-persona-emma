"use client";

import React from "react";
import { Navbar } from "@/components/ui/navbar";
import { Hero } from "@/components/landing/hero";
import { FeaturesGrid } from "@/components/landing/features-grid";
import { HowItWorks } from "@/components/landing/how-it-works";
import { RoiCalculator } from "@/components/landing/roi-calculator";
import { Testimonials } from "@/components/landing/testimonials";
import { PricingSection } from "@/components/landing/pricing-section";
import { FaqAccordion } from "@/components/landing/faq-accordion";
import { CtaBanner } from "@/components/landing/cta-banner";
import { Footer } from "@/components/ui/footer";
import { CommandPalette } from "@/components/ui/command-palette";
import { EmailSimulatorModal } from "@/components/ui/email-simulator-modal";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <FeaturesGrid />
        <HowItWorks />
        <RoiCalculator />
        <Testimonials />
        <PricingSection />
        <FaqAccordion />
        <CtaBanner />
      </main>
      <Footer />
      <CommandPalette />
      <EmailSimulatorModal />
    </div>
  );
}
