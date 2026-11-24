import Image from "next/image";
import Link from "next/link";

export default function CTA() {
  return (
    <section className="bg-brand-tertiary-10 py-20 text-white">
      <div className="container mx-auto md:my-5 px-4">
        <div className="grid gap-3 lg:grid-cols-2 justify-center items-center">
          <Image
            src="/images/speed-reading-books.jpg"
            alt="Kitap okuma"
            width={450}
            height={450}
            className="rounded-2xl shadow-lg"
          />
          <div className=" space-y-5">
            <h2 className="text-3xl  mb-4 font-bold  text-brand-primary-200">
              Okuma Potansiyelinizi Açığa Çıkarın
            </h2>
            <p className="max-w-2xl text-gray-700 text-lg">
              Hemen Başvurun, Hızlı Okuma Yolculuğunuzu Başlatın
            </p>
            <Link
              href="/basvur"
              className="
              inline-flex items-center justify-center
              rounded-lg
              bg-brand-primary-100
              px-8 py-3
              text-white font-semibold
              transition
              hover:bg-brand-primary-50
              focus:outline-none focus:ring-4 focus:ring-brand-primary-50
            "
            >
              Hemen Başla
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
