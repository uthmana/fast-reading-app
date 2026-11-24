import { companyInfo } from "@/app/(ogrenci)/ogrenci/(utils)/constants/constants";
import Header from "./(utils)/components/header";
import Footer from "./(utils)/components/footer";
import { verdana, tttkb, oswald, roboto } from "@/public/fonts/fonts";
import "../globals.css";

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
    <html
      lang="en"
      style={{ scrollBehavior: "smooth" }}
      className={`${oswald.variable} ${tttkb.variable} ${verdana.variable} ${roboto.variable}`}
    >
      <body className={`scroll-smooth`}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
