import Reveal from "../reveal";

const faqs = [
  {
    q: "Gerçekten hızlı okuma mümkün mü?",
    a: "Evet. Doğru teknikler ve düzenli egzersizlerle okuma hızını artırmak mümkündür. Yanlış okuma alışkanlıklarını bırakıp doğru göz ve dikkat teknikleriyle kalıcı gelişme sağlanır.",
  },
  {
    q: "Hızlı okuma anlama oranını düşürür mü?",
    a: "Hayır. Doğru uygulandığında anlama oranı düşmez, aksine artar. Beyin metne daha iyi odaklandığı için okunan bilgiyi daha verimli işler.",
  },
  {
    q: "Ne kadar sürede sonuç almaya başlarım?",
    a: "Düzenli kullanımda 2–3 hafta içinde okuma hızında ve odakta fark edilir gelişmeler görülür. Kalıcı sonuçlar için istikrar önemlidir.",
  },
  {
    q: "Sınavlarda gerçekten fayda sağlar mı?",
    a: "Evet. Okuma hızının artması, sınav süresini daha verimli kullanmanızı sağlar ve zaman baskısını önemli ölçüde azaltır.",
  },
  {
    q: "Günde ne kadar süre ayırmam gerekiyor?",
    a: "Günde ortalama 15–20 dakikalık düzenli çalışma, etkili sonuçlar almak için yeterlidir.",
  },
];

export default function FAQ() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <Reveal>
          <h2 className="text-3xl font-bold text-center">
            Sık Sorulan Sorular
          </h2>
        </Reveal>

        <div className="mt-10 max-w-2xl mx-auto md:mb-10 space-y-4">
          {faqs.map((faq, index) => (
            <Reveal key={faq.q} delay={index * 0.06}>
              <details className="faq-item">
                <summary>{faq.q}</summary>
                <p>{faq.a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
