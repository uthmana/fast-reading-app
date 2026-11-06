import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found">
      <div className="not-found__content">
        <div className="not-found__icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="8" r="6" />
            <path d="M8.21 13.89 7 23l5-3 5 3-1.21-9.12" />
          </svg>
        </div>

        <span className="not-found__badge">Sertifika Bulunamadı</span>

        <h1>Aradığınız Sertifika Bulunamadı</h1>

        <p className="not-found__description">
          Girmiş olduğunuz sertifika numarası geçersiz veya sistemimizde kayıtlı
          değil. Lütfen sertifika numarasını kontrol ederek tekrar deneyiniz.
        </p>

        <Link href="/" className="not-found__button">
          Ana Sayfaya Dön
        </Link>

        <p className="not-found__footer">Sertifika doğrulama sistemi</p>
      </div>
    </main>
  );
}
