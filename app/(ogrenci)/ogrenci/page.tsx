import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import HomeClient from "./homeClient";

export const metadata = {
  title: "Ana sayfa | Etkin Hızlı Okuma",
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

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const baseUrl = process.env.NEXT_PUBLIC_BASE_PATH;
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_BASE_PATH is not defined");
  }

  const [user, progressSummary] = await Promise.all([
    fetch(
      `${baseUrl}/api/users?username=${encodeURIComponent(
        session.user.username,
      )}`,
      {
        cache: "no-store",
      },
    ).then((r) => r.json()),

    fetch(
      `${baseUrl}/api/progressSummary?studentId=${session?.user?.student?.id}`,
      {
        cache: "no-store",
      },
    ).then((r) => r.json()),
  ]);

  return <HomeClient user={user} progressSummary={progressSummary} />;
}
