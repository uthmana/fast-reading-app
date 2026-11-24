import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "../../(auth)/api/auth/authOptions";
import ClientLayout from "./(utils)/clientLayout";
import { redirect } from "next/navigation";
import SessionProvider from "@/app/(ogrenci)/ogrenci/(utils)/providers/sessionProvider";
import getMenuItems from "@/app/(ogrenci)/ogrenci/(utils)/api/getMenuItems";
import { verdana, tttkb, oswald, roboto } from "@/public/fonts/fonts";
import "../../globals.css";

export const metadata = {
  title: "Etkin Hızlı Okuma",
  description: "Hızlı okuma pratik platformu",
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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session: { user: { id: string; role: string; name: string } } | any =
    await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/ogrenci-giris");
  }

  const menuItems = await getMenuItems();

  if (!menuItems || menuItems.length === 0) {
    throw new Error("Menu items not found");
  }

  return (
    <html
      lang="tr"
      className={`${oswald.variable} ${tttkb.variable} ${verdana.variable} ${roboto.variable}`}
    >
      <body className="bg-gray-100 w-full h-full">
        <SessionProvider>
          <ClientLayout menuItems={menuItems}>{children}</ClientLayout>
        </SessionProvider>
      </body>
    </html>
  );
}
