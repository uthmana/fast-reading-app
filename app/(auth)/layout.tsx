import "../globals.css";

export const metadata = {
  title: "Giriş | Etkin Hızlı Okuma",
  description: "Hızlı okuma pratik platformu giriş",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="w-screen h-screen">
        <main className="w-full h-full bg-gradient-to-r from-brand-primary-200 to-brand-secondary-50">
          {children}
        </main>
      </body>
    </html>
  );
}
