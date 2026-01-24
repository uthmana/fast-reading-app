import Image from "next/image";
import Link from "next/link";

const steps = [
  {
    title: "Seviye Belirleme ve Kişisel Başlangıç",
    desc: "Eğitim, okuma hızınızı ve anlama düzeyinizi ölçen kısa bir değerlendirme ile başlar.",
  },
  {
    title: "Günlük Kısa ve Etkili Egzersizler",
    desc: "Günde ortalama 15–20 dakikalık egzersizlerle göz, dikkat ve algı becerileri geliştirilir.",
  },
  {
    title: "Odaklanma ve Anlayarak Okuma",
    desc: "Dikkat dağınıklıkları azaltılır ve metni daha hızlı, doğru ve akıcı okuma becerisi kazandırılır.",
  },
  {
    title: "Gelişim ve Performans Takibi",
    desc: "İlerleme düzenli olarak ölçülür ve gelişim süreci şeffaf şekilde takip edilir.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 bg-brand-tertiary-10" id="nasil-calisir">
      <div className="landing-container mx-auto px-6">
        {/* Title */}
        <h2 className="text-3xl md:text-4xl mb-4 font-bold text-center text-brand-primary-200">
          SeriOku Nasıl Çalışır?
        </h2>

        <p className="max-w-2xl mx-auto text-center text-gray-700 text-lg">
          SeriOku, bilimsel okuma tekniklerini dijital egzersizlerle
          birleştirerek okuma hızınızı ve anlama becerinizi adım adım
          geliştirir.
        </p>

        {/* Content Grid */}
        <div className="mt-14 grid gap-12 lg:grid-cols-2 items-center">
          {/* Visual */}
          <Image
            src="/images/online-study.webp"
            alt="SeriOku eğitim süreci"
            width={520}
            height={420}
            className="rounded-2xl mx-auto shadow-lg"
            priority
          />

          {/* Steps */}
          <div className="text-black mx-auto">
            <ul className="space-y-6 text-lg">
              {steps.map((item, index) => (
                <li key={index} className="flex gap-4">
                  <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-brand-primary-100 text-white font-semibold">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-gray-700 text-base">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CTA (layout-safe) */}
        <div className="mt-16 text-center">
          <p className="mb-6 text-gray-700">
            Okuma hızınızı ve anlama becerinizi geliştirmeye hazır mısınız?
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
    </section>
  );
}
