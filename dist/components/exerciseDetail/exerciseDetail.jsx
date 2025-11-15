"use client";
import React from "react";
import Link from "next/link";
import Button from "@/components/button/button";
import { MdPlayCircle } from "react-icons/md";
import YouTubeEmbed from "../youtubeEmbed/youbuteEmbed";
export default function ExerciseDetail(_a) {
    var _b, _c;
    var pathname = _a.pathname, menuItems = _a.menuItems;
    var menu = menuItems.find(function (item) { return item.link === pathname; });
    var startLink = ((_c = (_b = menu === null || menu === void 0 ? void 0 : menu.subMenu) === null || _b === void 0 ? void 0 : _b[1]) === null || _c === void 0 ? void 0 : _c.link) || "";
    return (<div className="p-4 w-full flex flex-col">
      {(menu === null || menu === void 0 ? void 0 : menu.youtubeId) ? (<YouTubeEmbed videoId={menu === null || menu === void 0 ? void 0 : menu.youtubeId} autoplay={false} controls={true} start={30} loop={false} mute={false} rel={0} modestBranding={true} onLoad={function () { return console.log("iframe loaded"); }}/>) : null}

      <h1 className="my-5 text-2xl font-bold capitalize"> {menu === null || menu === void 0 ? void 0 : menu.name} </h1>
      <p className="mb-8">{menu === null || menu === void 0 ? void 0 : menu.description}</p>
      <Link className="block max-w-[170px]" href={startLink}>
        <Button text="Hemen Başla" className="bg-blue-600 hover:bg-blue-700" icon={<MdPlayCircle className="w-6 h-6 text-white"/>}/>
      </Link>
    </div>);
}
