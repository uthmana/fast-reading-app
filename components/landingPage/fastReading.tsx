import YouTubeEmbed from "../youtubeEmbed/youbuteEmbed";

export default function FastReading() {
  return (
    <section id="hizliokuma" className="bg-brand-tertiary-10 py-20 text-black">
      <div className="landing-container mb-10 mx-auto px-6">
        <h2 className="text-3xl my-0 text-center font-bold">
          Hızlı Okuma Nedir?
        </h2>
      </div>
      <div className="landing-container mx-auto items-center md:mb-10 px-6 grid gap-12 lg:grid-cols-2 ">
        <YouTubeEmbed
          videoId={"EdbHwXRiDao"}
          autoplay={false}
          controls={true}
          start={0}
          loop={false}
          mute={false}
          rel={0}
          modestBranding={true}
          aspectRatio={16 / 9}
          className="w-full rounded-2xl shadow-lg"
        />

        <div className="text-gray-700 leading-relaxed font-medium space-y-4">
          <p>
            Hızlı okuma, bir metni anlamından ödün vermeden daha kısa sürede
            okuyabilme becerisidir. Doğru teknikler ve düzenli çalışmalarla
            geliştirilebilir.
          </p>
          <p>
            Bu yöntem, okuma sırasında yapılan gereksiz duraksamaları azaltarak
            göz ve zihnin daha uyumlu çalışmasını sağlar. Böylece metne
            odaklanma artar ve okuma süreci daha akıcı hâle gelir.
          </p>
          <p>
            Hızlı okuma sayesinde kişi, zamandan tasarruf ederken daha fazla
            içeriğe ulaşabilir. Bu da öğrenme sürecini daha verimli ve
            sürdürülebilir kılar.
          </p>
        </div>
      </div>
    </section>
  );
}
