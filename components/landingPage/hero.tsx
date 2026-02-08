import Image from "next/image";
import Link from "next/link";
import TypingText from "./typingText";

export default function Hero() {
  return (
    <section className="bg-brand-primary-100">
      <div className="mx-auto landing-container px-6 py-24 grid gap-12 lg:grid-cols-2 items-center">
        {/* Text */}
        <div className="mx-auto md:ml-auto">
          <h1 className="text-4xl text-center  text-white md:text-left font-extrabold sm:text-6xl leading-tight">
            SeriOku ile
            <span className="block text-brand-secondary-150">
              Daha Hızlı Oku, Daha İyi Anla
            </span>
          </h1>

          <TypingText
            text="Okuma hızınızı 2–4 kat artırın, odaklanmanızı güçlendirin ve zamandan tasarruf edin."
            className="mt-6 pb-5 leading-5 min-h-24 max-w-xl text-brand-tertiary-50 text-lg text-center md:text-left"
          />

          <div className="flex gap-4 max-w-fit mx-auto md:ml-0">
            <Link
              href="/basvur"
              className="rounded-lg bg-brand-secondary-150 px-3 py-2 md:px-6 md:py-3 font-semibold text-brand-primary-200 hover:bg-brand-secondary-200 transition"
            >
              Hemen Başvur
            </Link>
            <Link
              href="/#nasil-calisir"
              className="rounded-lg border border-brand-tertiary-50 px-3 py-2 md:px-6 md:py-3 font-semibold text-brand-tertiary-50 hover:bg-white/10 transition"
            >
              Nasıl Çalışır
            </Link>
          </div>
        </div>

        {/* Image */}
        <div className="relative mx-auto md:ml-auto animate-reading">
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
            <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white/10 to-transparent animate-pulse" />
          </div>
          <div className="rounded-2xl animate-focus">
            <Image
              src="/images/hero-digital-reading.png"
              className="rounded-2xl shadow-lg"
              alt="SeriOku hızlı okuma"
              width={460}
              height={360}
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
