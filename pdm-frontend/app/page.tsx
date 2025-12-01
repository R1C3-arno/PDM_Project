"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
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
 * Redirects authenticated users to their appropriate dashboard
 */
export default function LandingPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'APPLICANT') {
        router.push('/dashboard');
      } else {
        router.push('/staff/dashboard');
      }
    }
  }, [isAuthenticated, user, router]);

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
