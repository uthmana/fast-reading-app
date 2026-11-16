"use client";
import Audience from "./sections/audience";
import CTA from "./sections/CTA";
import FAQ from "./sections/faq";
import FastReading from "./sections/fastReading";
import Features from "./sections/features";
import Hero from "./sections/hero";
import HowItWorks from "./sections/howItWorks";
import Teachers from "./sections/teachers";

export default function LandingClient() {
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
