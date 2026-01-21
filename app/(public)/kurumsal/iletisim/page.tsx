import { contactInfo } from "@/utils/constants";
import React from "react";

export default function ContactPage() {
  return (
    <section className="bg-brand-tertiary-10 py-16 text-black">
      <div className="max-w-3xl mx-auto space-y-10 mb-10">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">Bizimle İletişime Geçin</h1>
          <p className="text-gray-600 text-lg">
            SeriOku ile daha hızlı, daha odaklı ve daha verimli okuma
            yolculuğunuza bugün başlayın.
          </p>
        </div>

        {/* Intro */}
        <div className="mb-10 space-y-4 text-gray-700">
          <p>
            SeriOku; öğrenciler, veliler, eğitmenler ve kurumlar için
            geliştirilmiş modern bir hızlı okuma ve anlama platformudur. Eğitim
            programlarımız, bilimsel temellere dayalı tekniklerle okuma hızını
            ve anlama becerisini birlikte geliştirir.
          </p>
          <p>
            Platformumuz, kullanıcıların ihtiyaçlarına göre şekillenen esnek
            yapısıyla hem bireysel hem de kurumsal çözümler sunar. Aklınıza
            takılan her konuda bizimle iletişime geçebilirsiniz.
          </p>
        </div>

        {/* Contact Info */}
        <div className="bg-gray-50 border rounded-lg p-6 mb-12">
          <h2 className="text-xl font-semibold mb-4">İletişim Bilgileri</h2>
          <div className="space-y-2 text-gray-700">
            <p>
              <strong>E-posta:</strong>
              <a
                href={`mailto:${contactInfo.email}`}
                className="text-blue-600 hover:underline"
              >
                {contactInfo.email}
              </a>
            </p>
            <p>
              <strong>Telefon:</strong>
              <a
                href={`tel:${contactInfo?.phone?.replaceAll(" ", "")}`}
                className="hover:underline"
              >
                {contactInfo.phone}
              </a>
            </p>
            <p>
              <strong>Çalışma Saatleri:</strong> Hafta içi 09:00 – 18:00
            </p>
          </div>
        </div>

        {/* What we help with */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-4">
            Size Nasıl Yardımcı Olabiliriz?
          </h2>
          <ul className="space-y-2 text-gray-700 list-disc list-inside">
            <li>Platform kullanımı ve teknik destek</li>
            <li>Eğitim programları ve içerik detayları</li>
            <li>Öğrenci kayıtları ve deneme dersleri</li>
            <li>Kurumlar için toplu eğitim ve iş birlikleri</li>
            <li>Geri bildirim, öneri ve iş birliği talepleri</li>
          </ul>
        </div>

        <div className="space-y-6 text-gray-700">
          <div>
            <h3 className="text-lg font-semibold mb-2">
              Öğrenciler ve Veliler İçin
            </h3>
            <p>
              Okuma hızını artırmak, sınav başarısını desteklemek ve öğrenme
              verimliliğini yükseltmek isteyen öğrenciler için en uygun eğitim
              programını birlikte belirleyelim.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">
              Kurumlar ve İş Ortakları İçin
            </h3>
            <p>
              Okullar, kurs merkezleri ve kurumlar için ölçeklenebilir hızlı
              okuma çözümleri sunuyoruz. Kurumsal iş birlikleri ve özel eğitim
              modelleri hakkında detaylı bilgi almak için bizimle iletişime
              geçin.
            </p>
          </div>
        </div>

        <div className="mt-12">
          <p className="text-brand-primary-200 font-medium">
            Daha hızlı okumak, daha iyi anlamak ve öğrenme gücünüzü artırmak
            için SeriOku yanınızda.
          </p>
        </div>
      </div>
    </section>
  );
}
