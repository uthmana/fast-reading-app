import ReadingScoreClient from "@/app/(ogrenci)/ogrenci/(utils)/components/readingScoreClient/readingScoreClient";
import { authOptions } from "@/app/(auth)/api/auth/authOptions";
import { formatDateTime } from "@/app/(ogrenci)/ogrenci/(utils)/helpers/helpers";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Hızlı okuma gelişimi | Etkin Hızlı Okuma",
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

export default async function page() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/ogrenci-giris");
  const baseUrl = process.env.NEXT_PUBLIC_BASE_PATH;
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_BASE_PATH is not defined");
  }

  const resData = await fetch(
    `${baseUrl}/api/users?username=${encodeURIComponent(
      session.user.username,
    )}`,
    {
      cache: "no-store",
    },
  ).then((r) => r.json());

  const attempts = resData?.Student?.attempts || [];

  const formatted = attempts?.map(
    ({ wpm, createdAt, correct, variant, totalQuiz }: any) => ({
      wpm,
      correct,
      variant,
      totalQuiz,
      category: formatDateTime(createdAt),
    }),
  );

  const formattedAttempts = formatted;

  const buildData = (key: "wpm" | "correct", variant: string) => {
    const filtered = formatted.filter((i: any) => i.variant === variant);
    return {
      data: filtered.map((i: any) => i[key]),
      categories: filtered.map((i: any) => i.category),
    };
  };

  const fastReadingData = !attempts?.length
    ? { data: [], categories: [] }
    : buildData("wpm", "FASTREADING");

  return (
    <ReadingScoreClient
      formattedAttempts={formattedAttempts}
      fastReadingData={fastReadingData}
    />
  );
}
