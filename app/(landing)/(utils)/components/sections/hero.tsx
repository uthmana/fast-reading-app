import Link from "next/link";

import { companyInfo } from "@/app/(ogrenci)/ogrenci/(utils)/constants/constants";
import HeroVisual from "../heroVisual";
import PremiumBackground from "../premiumBackground";
import TypingText from "../typingText";

export default function Hero() {
  return (
    <section className="hero-full-height relative isolate flex items-center overflow-hidden bg-brand-primary-100">
      <PremiumBackground />

      <div className="relative z-10 mx-auto w-full landing-container grid items-center gap-10 px-6 py-14 sm:gap-12 sm:py-20 lg:grid-cols-2 lg:py-24">
        {/* Text */}
        <div className="mx-auto w-full max-w-xl md:ml-auto">
          <h1 className="text-center text-4xl font-extrabold leading-tight text-white sm:text-5xl md:text-left lg:text-6xl">
            {companyInfo?.name} ile
            <span className="block text-brand-secondary-150">
              Daha Hızlı Oku, Daha İyi Anla
            </span>
          </h1>

          <TypingText
            text="Okuma hızınızı 2–4 kat artırın, odaklanmanızı güçlendirin ve zamandan tasarruf edin."
            className="mx-auto mt-6 min-h-24 max-w-xl pb-5 text-center text-base leading-7 text-brand-tertiary-50 sm:text-lg md:mx-0 md:text-left"
          />

          <div className="mx-auto flex w-full max-w-sm flex-col gap-3 sm:max-w-fit sm:flex-row sm:gap-4 md:mx-0">
            <Link
              href="/basvur"
              className="rounded-lg bg-brand-secondary-150 px-4 py-2.5 text-center font-semibold text-brand-primary-200 transition hover:bg-brand-secondary-200 sm:px-6 sm:py-3"
            >
              Hemen Başvur
            </Link>
            <Link
              href="/#nasil-calisir"
              className="rounded-lg border border-brand-tertiary-50 px-4 py-2.5 text-center font-semibold text-brand-tertiary-50 transition hover:bg-white/10 sm:px-6 sm:py-3"
            >
              Nasıl Çalışır
            </Link>
          </div>
        </div>

        {/* Image */}
        <HeroVisual
          src="/images/hero-digital-reading.png"
          alt={`${companyInfo?.name} hızlı okuma`}
        />
      </div>
    </section>
  );
}
