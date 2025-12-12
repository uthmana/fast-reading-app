import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/authOptions";
import SessionProvider from "../../components/providers";
import ClientLayout from "../../components/clientLayout";
import "../globals.css";

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

  return (
    <html lang="en" className={oswald.variable}>
      <body className="bg-gray-100 w-full h-full">
        <SessionProvider>
          {!session || session?.user?.id === undefined ? (
            <main className="w-full h-full bg-gradient-to-r from-brand-primary-200 to-brand-secondary-50">
              {children}
            </main>
          ) : (
            <ClientLayout>{children}</ClientLayout>
          )}
        </SessionProvider>
      </body>
    </html>
  );
}
