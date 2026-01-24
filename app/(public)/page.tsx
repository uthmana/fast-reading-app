import Audience from "@/components/landingPage/audience";
import CTA from "@/components/landingPage/CTA";
import FAQ from "@/components/landingPage/faq";
import FastReading from "@/components/landingPage/fastReading";
import Features from "@/components/landingPage/features";
import Hero from "@/components/landingPage/hero";
import HowItWorks from "@/components/landingPage/howItWorks";
import Teachers from "@/components/landingPage/teachers";
import React from "react";

export default function HomePage() {
  return (
    <main className="w-full">
      <Hero />
      <FastReading />
      <Features />
      <Audience />
      <HowItWorks />
      <Teachers />
      <FAQ />
      <CTA />
    </main>
  );
}
