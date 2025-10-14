"use client";

import React, { useState } from "react";
import Menu from "./menu/menu";
import Sidebar from "./sideBar/sideBar";
import { usePathname } from "next/navigation";
import AudioPlayer from "./audioPlayer/audioPlayer";
import { playlists } from "../utils/constants";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const [activeMenu, setActiveMenu] = useState("" as string | null);
  const pathname = usePathname();

  return (
    <div className="w-full relative flex flex-col min-h-screen">
      <div className="lg:bg-blue-500 w-full lg:before:absolute lg:before:top-0 lg:before:left-0 lg:before:w-full lg:before:h-40 lg:before:bg-blue-500 lg:before:z-0">
        <Menu
          pathname={pathname}
          onActiveMenu={(menuName) => setActiveMenu(menuName)}
        />
      </div>
      <main className="w-full h-full relative">
        <div
          className={`flex flex-row items-start gap-4 lg:bg-white lg:shadow lg:rounded-xl lg:p-4 lg:pb-10 lg:border container`}
        >
          <Sidebar pathname={pathname} activeMenu={activeMenu} />
          <div className="flex-1 min-h-[500px]">{children}</div>
        </div>
      </main>
      <AudioPlayer playlists={playlists} />
    </div>
  );
}
