import "../globals.css";

export const metadata = {
  title: "Giriş | Etkin Hızlı Okuma",
  description: "Hızlı okuma pratik platformu giriş",
  manifest: "/favicons/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicons/favicon.ico" },
      { url: "/favicons/favicon-16x16.png", sizes: "16x16" },
      { url: "/favicons/favicon-32x32.png", sizes: "32x32" },
    ],
    apple: "/favicons/apple-touch-icon.png",
  },
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
