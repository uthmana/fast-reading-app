"use client";

import React from "react";
import Link from "next/link";
import Button from "@/components/button/button";
import { MdPlayCircle } from "react-icons/md";
import YouTubeEmbed from "../youtubeEmbed/youbuteEmbed";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

type MenuPropsTypes = {
  name: string;
  link: string;
  subMenu: { name: string; link: string }[];
  description: string;
  youtubeId: string;
};

export default function ExerciseDetail({
  menuItems,
}: {
  menuItems: MenuPropsTypes[];
}) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isPrimaryStudent =
    session?.user?.student?.studyGroup?.includes("ILKOKUL");

  const menu = menuItems.find((item) => item.link === pathname);
  const startLink = menu?.subMenu?.[1]?.link || "";

  return (
    <div className="mb-5 shadow border border-brand-tertiary-50 pb-4 rounded-md   w-[calc(100%-32px)] mx-auto bg-white flex flex-col">
      {menu?.youtubeId ? (
        <YouTubeEmbed
          videoId={menu?.youtubeId}
          autoplay={false}
          controls={true}
          start={30}
          loop={false}
          mute={false}
          rel={0}
          modestBranding={true}
          onLoad={() => console.log("iframe loaded")}
        />
      ) : null}
      <div
        className={`px-4 ${
          isPrimaryStudent ? "font-tttkbDikTemelAbece text-lg" : ""
        } `}
      >
        <h1 className="my-5 text-2xl font-bold capitalize"> {menu?.name} </h1>
        <p className="mb-8">{menu?.description}</p>
        <Link className="block max-w-[170px]" href={startLink}>
          <Button
            text="Hemen Başla"
            className="bg-brand-primary-50 whitespace-nowrap mb-5 hover:bg-brand-primary-100"
            icon={<MdPlayCircle className="w-6 h-6 text-white" />}
          />
        </Link>
      </div>
    </div>
  );
}
