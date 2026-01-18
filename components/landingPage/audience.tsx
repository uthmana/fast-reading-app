const audience = [
  {
    group: "İlkokul (2–3)",
    desc: "2. ve 3. sınıf öğrencileri için okuma becerilerini güçlendirmeye yönelik, temel alışkanlıkları kazandıran özel bir eğitim programıdır.",
    image: "/images/studygroup/cretch.jpg",
  },
  {
    group: "İlkokul (4)",
    desc: "4. sınıf öğrencilerine yönelik olarak hazırlanan bu grup, okuma hızını ve anlama becerisini birlikte geliştirmeyi hedefler.",
    image: "/images/studygroup/primary.jpg",
  },
  {
    group: "Ortaokul",
    desc: "Ortaokul seviyesindeki öğrenciler için yaş ve seviye uyumlu metinlerle desteklenen yapılandırılmış bir eğitim sunulur.",
    image: "/images/studygroup/middle.jpg",
  },
  {
    group: "Lise",
    desc: "Lise öğrencilerinin sınav ve ders yükünü daha verimli yönetebilmesi için hız ve odaklanma odaklı bir eğitim grubudur.",
    image: "/images/studygroup/secondary.jpg",
  },
  {
    group: "Üniversite",
    desc: "Yoğun okuma gerektiren akademik süreçler için üniversite öğrencilerine özel, ileri seviye okuma teknikleri sunar.",
    image: "/images/studygroup/university.jpg",
  },
  {
    group: "Doktora",
    desc: "Akademik araştırma, tez çalışmaları ve sınav hazırlıkları için derin odaklanma ve hızlı analiz becerilerini geliştirmeye yöneliktir.",
    image: "/images/studygroup/phd.jpg",
  },
  {
    group: "Genel Okuyucular",
    desc: "Günlük okuma alışkanlığını geliştirmek ve daha kısa sürede daha fazla bilgiye ulaşmak isteyen herkes için uygundur.",
    image: "/images/studygroup/general.jpg",
  },
  {
    group: "Disleksi",
    desc: "Okuma sürecini kolaylaştırmaya yönelik, bireysel ilerlemeyi destekleyen özel egzersizlerle hazırlanmış bir programdır.",
    image: "/images/studygroup/disleksi.jpg",
  },
];

export default function Audience() {
  return (
    <section className="py-20 " id="egitim-grubu">
      <div className="landing-container mx-auto px-6">
        <h2 className="text-3xl text-center font-bold">Kimler İçin?</h2>
        <p className="max-w-2xl mx-auto text-center text-gray-700 text-lg mt-3">
          SeriOku eğitim grupları, yaş ve seviyeye göre özel olarak hazırlanır.
          Her katılımcı, kendi düzeyine uygun içeriklerle okuma hızını ve anlama
          becerisini geliştirebilir.
        </p>

        <div className="mt-10 w-full md:mb-5 mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 items-stretch">
          {audience.map((item) => (
            <div
              key={item.group}
              className="h-full relative group flex flex-col rounded-xl overflow-hidden border font-medium"
            >
              {/* Image */}
              <div
                className="w-full min-h-[200px] bg-center bg-cover"
                style={{ backgroundImage: `url('${item.image}')` }}
              />

              {/* Content */}
              <div
                className="
              absolute left-0 bottom-0 h-full w-full
              bg-brand-primary-150/60
              px-4 py-3 space-y-2 text-white
              transform translate-y-[calc(100%-50px)]
              transition-transform duration-400 ease-in
              group-hover:translate-y-0"
              >
                <h3 className="text-xl drop-shadow-lg">{item.group}</h3>
                <p className="text-sm drop-shadow-lg">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
