import React from "react";

export default function PrivacyPage() {
  return (
    <section className="bg-brand-tertiary-10 py-16 text-black">
      <div className="mx-auto px-6 max-w-3xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">Gizlilik Politikası</h1>
          <p className="text-gray-600 text-lg">
            SeriOku olarak kişisel verilerinizin güvenliğini önemsiyoruz.
          </p>
        </div>

        {/* Intro */}
        <div className="space-y-4 text-gray-700 mb-10">
          <p>
            Bu Gizlilik Politikası, SeriOku hızlı okuma ve anlama platformunu
            kullandığınızda hangi kişisel verilerin toplandığını, bu verilerin
            nasıl kullanıldığını ve nasıl korunduğunu açıklamaktadır.
          </p>
          <p>
            Platformumuzu kullanarak, bu politikada belirtilen uygulamaları
            kabul etmiş sayılırsınız.
          </p>
        </div>

        {/* Collected Data */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Toplanan Bilgiler</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Ad, soyad, e-posta adresi ve telefon numarası</li>
            <li>Kullanıcı hesabı ve giriş bilgileri</li>
            <li>Okuma hızı, anlama oranı ve eğitim performans verileri</li>
            <li>
              Platform kullanımına ilişkin teknik ve istatistiksel veriler
            </li>
          </ul>
        </div>

        {/* Usage */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">
            Bilgilerin Kullanım Amacı
          </h2>
          <p className="text-gray-700 mb-3">
            Toplanan kişisel veriler aşağıdaki amaçlarla kullanılmaktadır:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Eğitim hizmetlerinin sunulması ve geliştirilmesi</li>
            <li>Kişiselleştirilmiş öğrenme deneyimi oluşturulması</li>
            <li>Kullanıcı desteği ve iletişim süreçlerinin yürütülmesi</li>
            <li>Yasal yükümlülüklerin yerine getirilmesi</li>
          </ul>
        </div>

        {/* Data Protection */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Veri Güvenliği</h2>
          <p className="text-gray-700">
            SeriOku, kişisel verilerinizi yetkisiz erişim, kayıp veya kötüye
            kullanıma karşı korumak için güncel teknik ve idari güvenlik
            önlemlerini uygular. Verileriniz, güvenli sunucular üzerinde
            saklanır ve yalnızca yetkili kişiler tarafından erişilebilir.
          </p>
        </div>

        {/* Third Parties */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">
            Üçüncü Taraflarla Paylaşım
          </h2>
          <p className="text-gray-700">
            Kişisel verileriniz, yasal zorunluluklar dışında üçüncü kişilerle
            paylaşılmaz. Hizmetin sağlanması için gerekli durumlarda, yalnızca
            güvenilir iş ortaklarıyla ve gizlilik yükümlülükleri çerçevesinde
            paylaşım yapılabilir.
          </p>
        </div>

        {/* User Rights */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Kullanıcı Hakları</h2>
          <p className="text-gray-700 mb-3">
            Kullanıcılar olarak aşağıdaki haklara sahipsiniz:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Kişisel verilerinize erişme</li>
            <li>Yanlış veya eksik verilerin düzeltilmesini talep etme</li>
            <li>
              Verilerinizin silinmesini veya işlenmesinin sınırlandırılmasını
              isteme
            </li>
            <li>Veri işleme faaliyetlerine itiraz etme</li>
          </ul>
        </div>

        {/* Contact */}
        <div className="bg-gray-50 border rounded-lg p-6 mb-12">
          <h2 className="text-xl font-semibold mb-3">İletişim</h2>
          <p className="text-gray-700">
            Gizlilik politikamız hakkında sorularınız veya talepleriniz için
            bizimle iletişime geçebilirsiniz:
          </p>
          <p className="mt-2">
            <strong>E-posta:</strong>
            <a
              href="mailto:info@serioku.com"
              className="text-blue-600 hover:underline"
            >
              info@serioku.com
            </a>
          </p>
        </div>

        {/* Closing */}
        <div className="text-center text-gray-600 text-sm">
          <p>
            Bu gizlilik politikası gerektiğinde güncellenebilir. Güncel sürüm
            her zaman SeriOku platformu üzerinden yayımlanır.
          </p>
        </div>
      </div>
    </section>
  );
}
