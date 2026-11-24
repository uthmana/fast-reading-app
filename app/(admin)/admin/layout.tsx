import routes from "./(utils)/constants/routes";
import { verdana, tttkb, oswald, roboto } from "@/public/fonts/fonts";
import RootProvider from "./(utils)/components/rootProvider/RootProvider";
import Navigation from "./(utils)/components/navigation/Navigation";
import "../../globals.css";

export const metadata = {
  title: "HappyBrains | Yönetim Paneli",
  description: "Hızlı okuma yönetim Paneli",
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
  route: any;
}) {
  return (
    <html
      lang="en"
      className={`${oswald.variable} ${tttkb.variable} ${verdana.variable} ${roboto.variable}`}
    >
      <body className="overflow-x-hidden">
        <RootProvider>
          <Navigation routes={routes}>{children}</Navigation>
        </RootProvider>
      </body>
    </html>
  );
}
