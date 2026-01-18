import Icon from "../icon/icon";

const features = [
  {
    title: "Zamanı Daha Verimli Kullanmanızı Sağlar",
    desc: "Okuma süresini kısaltarak aynı zamanda daha fazla bilgiye ulaşmanızı sağlar.",
    icon: "lesson",
  },
  {
    title: "Göz ve Beyin Uyumunu Geliştirir",
    desc: "Doğru okuma teknikleri sayesinde gözler beyne daha düzenli ve etkili veri iletir.",
    icon: "eye",
  },
  {
    title: "Odaklanma Becerisini Güçlendirir",
    desc: "Metne tam odaklanmayı sağlayarak dikkat dağınıklığını minimuma indirir.",
    icon: "brain",
  },
  {
    title: "Dikkat Süresini Artırır",
    desc: "Odaklanma arttıkça okuma sırasında dikkat süresi de doğal olarak uzar.",
    icon: "test",
  },
  {
    title: "Anlama Oranını Yükseltir",
    desc: "Hızlı ve doğru okuma, bilgiyi daha iyi analiz etmeyi ve kalıcı öğrenmeyi destekler.",
    icon: "book",
  },
  {
    title: "Sınav Stresini Azaltır",
    desc: "Zaman baskısını ortadan kaldırarak sınavlarda daha sakin ve kontrollü olmanızı sağlar.",
    icon: "text",
  },
];

export default function Features() {
  return (
    <section id="features" className="bg-brand-tertiary-50 py-20">
      <div className="landing-container mb-5 mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-brand-primary-200">
          SeriOku’nun Faydaları
        </h2>

        <p className="mt-3 max-w-2xl mx-auto text-center text-gray-700 text-base">
          SeriOku, okuma hızınızı artırırken anlama, odaklanma ve zaman yönetimi
          becerilerinizi birlikte geliştirir.
        </p>

        <div className="mt-14 grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((item) => (
            <div key={item.title} className="flex gap-7">
              <div>
                <Icon
                  name={`${item.icon as "menu"}`}
                  className="w-10 h-10"
                  fill="white"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold text-brand-primary-150">
                  {item.title}
                </h3>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
