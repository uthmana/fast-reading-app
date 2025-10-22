import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/authOptions";
import SessionProvider from "../../components/providers";
import ClientLayout from "../../components/clientLayout";
import "../globals.css";

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
    <html lang="en">
      <body className="bg-gray-100 w-full h-full">
        <SessionProvider>
          {!session ? (
            <main
              className="w-full h-full bg-cover bg-no-repeat bg-blue-700 bg-center"
              style={{
                backgroundImage: "linear-gradient(to right, #1D63F0, #1AD7FD",
              }}
            >
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
