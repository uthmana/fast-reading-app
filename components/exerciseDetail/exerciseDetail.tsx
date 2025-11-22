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
  const startLink = menu?.subMenu?.[1]?.link || "";

  return (
    <div className="px-4 mb-5 pb-4 rounded-md w-full lg:px-0 lg:w-[calc(100%-32px)] mx-auto bg-white flex flex-col">
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
      <div className="px-4">
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
    </div>
  );
}
