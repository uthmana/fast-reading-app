import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import VideoLessonClient from "./VideoLessonClient";

export const metadata = {
  title: "Videolar | Etkin Hızlı Okuma",
  description: "Hızlı okuma pratik platformu",
};

export default async function page() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");
  const baseUrl = process.env.NEXT_PUBLIC_BASE_PATH;
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_BASE_PATH is not defined");
  }

  const progressSummary = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_PATH}/api/progressSummary?studentId=${session?.user?.student?.id}`,
    {
      cache: "no-store",
    },
  ).then((r) => r.json());

  return <VideoLessonClient progressSummary={progressSummary} />;
}
