import ReadingScoreClient from "@/components/readindScoreClient/readingScoreClient";
import { authOptions } from "@/lib/authOptions";
import { formatDateTime } from "@/utils/helpers";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Okuma-Anlama Testleri | Etkin Hızlı Okuma",
  description: "Hızlı okuma pratik platformu",
};

export default async function page() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");
  const baseUrl = process.env.NEXT_PUBLIC_BASE_PATH;
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_BASE_PATH is not defined");
  }

  const resData = await fetch(
    `${baseUrl}/api/users?username=${encodeURIComponent(
      session.user.username
    )}`,
    {
      cache: "no-store",
    }
  ).then((r) => r.json());

  const attempts = resData?.Student?.attempts || [];

  const formatted = attempts?.map(
    ({ wpm, createdAt, correct, variant }: any) => ({
      wpm,
      correct,
      variant,
      category: formatDateTime(createdAt),
    })
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
  const understandingData = !attempts?.length
    ? { data: [], categories: [] }
    : buildData("correct", "UNDERSTANDING");

  return (
    <ReadingScoreClient
      formattedAttempts={formattedAttempts}
      fastReadingData={fastReadingData}
      understandingData={understandingData}
    />
  );
}
