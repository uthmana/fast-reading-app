"use client";

import React, { useState } from "react";
import Menu from "./menu/menu";
import Sidebar from "./sideBar/sideBar";
import { usePathname } from "next/navigation";
import AudioPlayer from "./audioPlayer/audioPlayer";
import { playlists } from "../utils/constants";

interface ClientLayoutProps {
  children: React.ReactNode;
  session: { user: { id: string; role: string; name: string } } | null;
}

export default function ClientLayout({ children, session }: ClientLayoutProps) {
  const [activeMenu, setActiveMenu] = useState("" as string | null);
  const pathname = usePathname();

  return (
    <div className="w-full relative flex flex-col min-h-screen">
      <div className="lg:bg-blue-500 w-full lg:before:absolute lg:before:top-0 lg:before:left-0 lg:before:w-full lg:before:h-40 lg:before:bg-blue-500 lg:before:z-0">
        {session ? (
          <Menu
            pathname={pathname}
            onActiveMenu={(menuName) => setActiveMenu(menuName)}
          />
        ) : null}
      </div>

      <main className="w-full h-full relative">
        <div
          className={`flex flex-row items-start gap-4 lg:bg-white lg:shadow lg:rounded-xl lg:p-4 lg:pb-10 lg:border ${
            session?.user ? "container" : ""
          }`}
        >
          <Sidebar pathname={pathname} activeMenu={activeMenu} />
          <div className="flex-1">{children}</div>
        </div>
      </main>

      {session ? <AudioPlayer playlists={playlists} /> : null}
    </div>
  );
}
