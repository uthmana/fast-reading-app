import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/authOptions";

import ClientLayout from "./clientLayout";
import { redirect } from "next/navigation";
import "../../globals.css";

import { Oswald } from "next/font/google";
import SessionProvider from "@/providers/sessionProvider";
import getMenuItems from "@/lib/api/getMenuItems";

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-oswald",
});

export const metadata = {
  title: "Etkin Hızlı Okuma",
  description: "Hızlı okuma pratik platformu",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session: { user: { id: string; role: string; name: string } } | any =
    await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const menuItems = await getMenuItems();

  if (!menuItems || menuItems.length === 0) {
    throw new Error("Menu items not found");
  }

  return (
    <html lang="tr" className={oswald.variable}>
      <body className="bg-gray-100 w-full h-full">
        <SessionProvider>
          <ClientLayout menuItems={menuItems}>{children}</ClientLayout>
        </SessionProvider>
      </body>
    </html>
  );
}
