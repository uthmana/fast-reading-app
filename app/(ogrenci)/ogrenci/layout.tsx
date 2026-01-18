import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/authOptions";
import SessionProvider from "../../../components/providers";
import ClientLayout from "../../../components/clientLayout";
import { redirect } from "next/navigation";
import "../../globals.css";

import { Oswald } from "next/font/google";

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

  return (
    <html lang="en" className={oswald.variable}>
      <body className="bg-gray-100 w-full h-full">
        <SessionProvider>
          <ClientLayout>{children}</ClientLayout>
        </SessionProvider>
      </body>
    </html>
  );
}
