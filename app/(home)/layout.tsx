import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/authOptions";
import Providers from "../../components/providers";
import ClientLayout from "../../components/clientLayout";
import "../globals.css";

export const metadata = {
  title: "Fast Reading App",
  description: "Speed reading practice platform",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session: { user: { id: string; role: string; name: string } } | null =
    await getServerSession(authOptions);

  return (
    <html lang="en">
      <body>
        <Providers>
          <ClientLayout session={session}>{children}</ClientLayout>
        </Providers>
      </body>
    </html>
  );
}
