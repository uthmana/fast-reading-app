import { roboto } from "@/public/fonts/googleFonts";
import { companyInfo } from "@/utils/constants";
import "../globals.css";
import Header from "./landingPageClient/header";
import Footer from "./landingPageClient/footer";

export const metadata = {
  title: `${companyInfo?.name} | Etkin Hızlı Okuma`,
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" style={{ scrollBehavior: "smooth" }}>
      <body className={`scroll-smooth ${roboto.variable} bg-white text-black`}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
