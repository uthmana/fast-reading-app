import Link from "next/link";
import Icon from "../icon/icon";
import YearNow from "./yearNow";

export default function Footer() {
  return (
    <footer className="bg-brand-primary-200 text-brand-tertiary-50">
      {/* Main footer */}
      <div className="mx-auto landing-container px-6 py-16 grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div>
          <h3 className="text-xl font-bold text-white">
            <Icon name="logo" className="h-10" />
          </h3>
          <p className="mt-4 text-sm leading-relaxed">
            SeriOku, öğrenciler ve eğitmenler için geliştirilmiş modern hızlı
            okuma ve odaklanma eğitim platformudur.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold text-white mb-4">Hızlı Bağlantılar</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href="/#hizliokuma"
                className="hover:text-brand-secondary-150 transition"
              >
                Hızlı Okuma
              </Link>
            </li>
            <li>
              <Link
                href="/#egitim-grubu"
                className="hover:text-brand-secondary-150 transition"
              >
                Eğitim Grubu
              </Link>
            </li>

            <li>
              <Link
                href="/#nasil-calisir"
                className="hover:text-brand-secondary-150 transition"
              >
                Nasıl Çalışır
              </Link>
            </li>
            <li>
              <Link
                href="/#egitmenlerimiz"
                className="hover:text-brand-secondary-150 transition"
              >
                Eğitmenlerimiz
              </Link>
            </li>

            <li>
              <Link
                href="/bayilik"
                className="block hover:text-brand-secondary-150 transition"
              >
                Bayilik
              </Link>
            </li>
          </ul>
        </div>

        {/* Corporate */}
        <div>
          <h4 className="font-semibold text-white mb-4">Kurumsal</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href="/kurumsal/hakkimizda"
                className="hover:text-brand-secondary-150 transition"
              >
                Hakkımızda
              </Link>
            </li>
            <li>
              <Link
                href="/kurumsal/gizlilik-politikasi"
                className="hover:text-brand-secondary-150 transition"
              >
                Gizlilik Politikası
              </Link>
            </li>
            <li>
              <Link
                href="/kurumsal/kullanim-sartlari"
                className="hover:text-brand-secondary-150 transition"
              >
                Kullanım Şartları
              </Link>
            </li>
            <li>
              <Link
                href="/kurumsal/iletisim"
                className="hover:text-brand-secondary-150 transition"
              >
                İletişim
              </Link>
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div>
          <h4 className="font-semibold text-white mb-4">Platformlar</h4>
          <ul className="space-y-3 text-sm">
            <li>
              <Link
                href="/login?giris=ogrenci"
                className="inline-block rounded-md bg-brand-secondary-150 px-4 py-2 font-semibold text-brand-primary-200 hover:bg-brand-secondary-200 transition"
              >
                Öğrenci Giriş
              </Link>
            </li>
            <li>
              <Link
                href="/login?giris=egtmen"
                className="inline-block rounded-md border border-brand-secondary-150 px-4 py-2 font-semibold text-brand-secondary-150 hover:bg-brand-secondary-50 transition"
              >
                Eğitmen Giriş
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto landing-container px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <span>
            © <YearNow /> SeriOku. Tüm hakları saklıdır.
          </span>

          <div className="flex gap-4">
            <Link
              href="/kurumsal/gizlilik-politikasi"
              className="hover:text-brand-secondary-150 transition"
            >
              Gizlilik Politikası
            </Link>
            <Link
              href="/kurumsal/kullanim-sartlari"
              className="hover:text-brand-secondary-150 transition"
            >
              Kullanım Şartları
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
