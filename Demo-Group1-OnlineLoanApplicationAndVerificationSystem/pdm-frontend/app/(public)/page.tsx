"use client";

import LandingHeader from "@/components/landing/LandingHeader";
import Hero from "@/components/landing/Hero";
import Benefits from "@/components/landing/Benefits";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import Statistics from "@/components/landing/Statistics";
import Testimonials from "@/components/landing/Testimonials";
import FAQ from "@/components/landing/FAQ";
import CTA from "@/components/landing/CTA";

/**
 * Landing page for the OLAVS loan application system
 */
export default function LandingPage() {
  return (
    <div className="font-sans">
      <LandingHeader />
      <Hero />
      <Benefits />
      <Features />
      <HowItWorks />
      <Statistics />
      <Testimonials />
      <FAQ />
      <CTA />
    </div>
  );
}
