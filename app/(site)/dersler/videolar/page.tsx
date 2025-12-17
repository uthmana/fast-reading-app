import { menuItems } from "@/app/routes";
import Icon from "@/components/icon/icon";
import InfoSideBar from "@/components/sideBar/infoSideBar";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

export const metadata = {
  title: "Videolar | Etkin Hızlı Okuma",
  description: "Hızlı okuma pratik platformu",
};

export default async function page() {
  const videoItems = menuItems.filter((m) => m.youtubeId !== "");

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");
  const baseUrl = process.env.NEXT_PUBLIC_BASE_PATH;
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_BASE_PATH is not defined");
  }

  const progressSummary = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_PATH}/api/progressSummary?studentId=${session?.user.student.id}`,
    {
      cache: "no-store",
    }
  ).then((r) => r.json());

  return (
    <div className="w-full mb-5 flex items-start flex-col lg:flex-row justify-start gap-5 px-3">
      <InfoSideBar
        progressSummary={progressSummary}
        videoItems={videoItems}
        pathname="/dersler/videolar"
      />
      <div className="flex gap-4 flex-wrap">
        {videoItems.map((item, idx) => (
          <div
            key={idx}
            className="w-full md:w-[calc(50%-12px)] group max-h-fit shadow rounded border bg-white"
          >
            <div className="w-full aspect-video">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${item.youtubeId}`}
                title={item.name}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
            <div className="px-3 flex items-start py-5  gap-2">
              <div className="flex justify-center items-center p-1 ">
                <Icon
                  name={`${item.icon as "menu"}`}
                  className="w-6 h-6 transition group-hover:scale-110"
                  fill="black"
                />
              </div>
              <div>
                <h2 className="text-xl font-semibold">{item.name}</h2>
                <p
                  title={item.description}
                  className="text-gray-600 text-sm line-clamp-3"
                >
                  {item.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
