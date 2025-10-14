"use client";

import React from "react";
import Link from "next/link";
import Button from "@/components/button/button";
import { MdPlayCircle } from "react-icons/md";
import YouTubeEmbed from "../youtubeEmbed/youbuteEmbed";

type MenuPropsTypes = {
  name: string;
  link: string;
  subMenu: { name: string; link: string }[];
  description: string;
  youtubeId: string;
};

export default function ExerciseDetail({
  pathname,
  menuItems,
}: {
  pathname: string;
  menuItems: MenuPropsTypes[];
}) {
  const menu = menuItems.find((item) => item.link === pathname);
  const startLink = menu?.subMenu?.[0]?.link || "";

  return (
    <div className="p-4 w-full flex flex-col">
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

      <h1 className="my-5 text-2xl font-bold capitalize"> {menu?.name} </h1>
      <p className="mb-8">{menu?.description}</p>
      <Link className="block max-w-[170px]" href={startLink}>
        <Button
          text="Hemen Başla"
          className="bg-blue-600 hover:bg-blue-700"
          icon={<MdPlayCircle className="w-6 h-6 text-white" />}
        />
      </Link>
    </div>
  );
}
