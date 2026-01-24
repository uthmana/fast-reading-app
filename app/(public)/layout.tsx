import Header from "@/components/landingPage/header";
import "../globals.css";
import Footer from "@/components/landingPage/footer";
import { Roboto } from "next/font/google";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-roboto",
  display: "swap",
});
export const metadata = {
  title: "Serioku | Etkin Hızlı Okuma",
  description: "Hızlı okuma pratik platformu giriş",
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
