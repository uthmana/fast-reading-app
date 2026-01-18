import React from "react";

export default function TermsOfUsePage() {
  return (
    <section className="bg-brand-tertiary-10 py-16 text-black">
      <div className="mx-auto px-6 max-w-3xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">Kullanım Şartları</h1>
          <p className="text-gray-600 text-lg">
            SeriOku platformunu kullanmadan önce lütfen bu şartları dikkatlice
            okuyunuz.
          </p>
        </div>

        {/* Intro */}
        <div className="space-y-4 text-gray-700 mb-10">
          <p>
            Bu Kullanım Şartları, SeriOku hızlı okuma ve anlama platformuna
            erişiminiz ve platformu kullanımınız sırasında uymanız gereken
            kuralları tanımlamaktadır.
          </p>
          <p>
            Platformu kullanarak, aşağıda belirtilen tüm şartları kabul etmiş
            sayılırsınız.
          </p>
        </div>

        {/* Scope */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Hizmetin Kapsamı</h2>
          <p className="text-gray-700">
            SeriOku; okuma hızı, anlama becerisi ve zihinsel gelişimi
            destekleyen dijital eğitim içerikleri sunar. Sunulan hizmetler
            bilgilendirme ve eğitim amaçlıdır; herhangi bir akademik veya
            mesleki başarı garantisi içermez.
          </p>
        </div>

        {/* User Responsibilities */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">
            Kullanıcı Yükümlülükleri
          </h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Platformu yalnızca yasal ve etik amaçlarla kullanmak</li>
            <li>Hesap bilgilerinin gizliliğini korumak</li>
            <li>
              Başka kullanıcıların haklarını ihlal edecek davranışlardan
              kaçınmak
            </li>
            <li>SeriOku altyapısına zarar verecek girişimlerde bulunmamak</li>
          </ul>
        </div>

        {/* Intellectual Property */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Fikri Mülkiyet Hakları</h2>
          <p className="text-gray-700">
            SeriOku platformunda yer alan tüm içerikler, yazılımlar, tasarımlar
            ve materyaller SeriOku’ya aittir veya lisanslı olarak
            kullanılmaktadır. İzinsiz kopyalanamaz, çoğaltılamaz veya
            dağıtılamaz.
          </p>
        </div>

        {/* Limitation */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">
            Sorumluluğun Sınırlandırılması
          </h2>
          <p className="text-gray-700">
            SeriOku, platformun kesintisiz veya hatasız çalışacağını garanti
            etmez. Hizmetin kullanımından doğabilecek doğrudan veya dolaylı
            zararlardan sorumlu tutulamaz.
          </p>
        </div>

        {/* Termination */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">
            Hesabın Askıya Alınması
          </h2>
          <p className="text-gray-700">
            Kullanım şartlarının ihlali durumunda SeriOku, kullanıcı hesabını
            geçici veya kalıcı olarak askıya alma ya da sonlandırma hakkını
            saklı tutar.
          </p>
        </div>

        {/* Changes */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Değişiklikler</h2>
          <p className="text-gray-700">
            SeriOku, kullanım şartlarını önceden bildirimde bulunmaksızın
            güncelleyebilir. Güncel şartlar platform üzerinden yayımlandığı
            tarihten itibaren geçerli olur.
          </p>
        </div>

        {/* Contact */}
        <div className="bg-gray-50 border rounded-lg p-6 mb-12">
          <h2 className="text-xl font-semibold mb-3">İletişim</h2>
          <p className="text-gray-700">
            Kullanım şartlarıyla ilgili sorularınız için bizimle iletişime
            geçebilirsiniz:
          </p>
          <p className="mt-2">
            <strong>E-posta:</strong>{" "}
            <a
              href="mailto:info@serioku.com"
              className="text-blue-600 hover:underline"
            >
              info@serioku.com
            </a>
          </p>
        </div>

        {/* Footer */}
        <div className=" text-gray-600 text-sm">
          <p>
            SeriOku platformunu kullanmaya devam etmeniz, bu kullanım şartlarını
            kabul ettiğiniz anlamına gelir.
          </p>
        </div>
      </div>
    </section>
  );
}
