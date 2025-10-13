"use client";

import React from "react";
import YouTubeEmbed from "../../../components/youtubeEmbed/youbuteEmbed";
import Link from "next/link";
import Button from "@/components/button/button";
import { MdPlayCircle } from "react-icons/md";
import { usePathname } from "next/navigation";
import { menuItems } from "@/utils/constants";

export default function page() {
  const pathname = usePathname();

  const startLink =
    menuItems.find((item) => item.link === pathname)?.subMenu[0]?.link || "";

  return (
    <div className="p-4 w-full flex flex-col">
      <YouTubeEmbed
        videoId="xiTK523Ot5U"
        autoplay={false}
        controls={true}
        start={30}
        loop={false}
        mute={false}
        rel={0}
        modestBranding={true}
        onLoad={() => console.log("iframe loaded")}
      />
      <h1 className="my-5 text-2xl font-bold">Okuma Egzersizleri</h1>
      <p className="mb-8">
        Okuma egzersizlerindeki temel amaç göze hız kazandırmak, göz kaslarını
        güçlendirmek, gözün kelimeleri hızlı tanımasını sağlamak.Bu uygulamadan
        yeterince yararlanmak için her egzersizi 1. seviden 5. seviyeye kadar
        kademe kademe uygulayınız.
      </p>

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
