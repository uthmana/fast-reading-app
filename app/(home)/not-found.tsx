export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-full bg-gray-50 text-center p-6">
      <h1 className="text-6xl font-bold text-blue-600 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        Sayfa Bulunamadı
      </h2>
      <p className="text-gray-500 mb-6 max-w-md">
        Aradığınız sayfa mevcut değil veya taşınmış olabilir.
      </p>
      <a
        href="/"
        className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
      >
        Ana Sayfaya Dön
      </a>
    </div>
  );
}
