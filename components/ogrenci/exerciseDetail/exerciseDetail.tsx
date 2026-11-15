"use client";

import Link from "next/link";
import Button from "@/components/common/button/button";
import { MdPlayCircle } from "react-icons/md";
import { useMenu } from "@/providers/menuProvider";
import YouTubeEmbed from "@/components/common/youtubeEmbed/youbuteEmbed";

export default function ExerciseDetail(pathName: { pathName?: string }) {
  const { menuItems } = useMenu();

  console.log("menuItems", menuItems);
  const menuItem = pathName.pathName
    ? menuItems?.find((item) => item.link === pathName.pathName)
    : menuItems?.[0];

  const startLink = menuItem?.subMenu[1]?.link ?? "";

  if (!menuItem) {
    return <div>Menü bulunamadı.</div>;
  }

  return (
    <div className="mb-5 shadow border border-brand-tertiary-50 pb-4 rounded-md w-[calc(100%-32px)] mx-auto bg-white flex flex-col">
      {menuItem.youtubeId && (
        <YouTubeEmbed
          videoId={menuItem.youtubeId}
          autoplay={false}
          controls={true}
          start={30}
          loop={false}
          mute={false}
          rel={0}
          modestBranding={true}
          onLoad={() => console.log("iframe loaded")}
        />
      )}

      <div className="px-4">
        <h1 className="my-5 text-2xl font-bold capitalize">{menuItem.name}</h1>

        <p className="mb-8">{menuItem.description}</p>

        <Link className="block max-w-[170px]" href={startLink ?? "#"}>
          <Button
            text="Hemen Başla"
            className="bg-brand-primary-100 whitespace-nowrap mb-5 hover:bg-brand-primary-150"
            icon={<MdPlayCircle className="w-6 h-6 text-white" />}
          />
        </Link>
      </div>
    </div>
  );
}
