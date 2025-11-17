"use client";

import React, { useEffect, useState } from "react";
import Menu from "./menu/menu";
import Sidebar from "./sideBar/sideBar";
import { usePathname } from "next/navigation";
import AudioPlayer from "./audioPlayer/audioPlayer";
import { playlists } from "../utils/constants";
import { menuItems } from "@/app/routes";
import Breadcrumb from "./breadcrumb/breadcrumb";
import LogOutInput from "./formInputs/logoutInput";
import { fetchData } from "@/utils/fetchData";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const [activeMenu, setActiveMenu] = useState("" as string | null);
  const [currentMenu, setCurrentMenu] = useState([] as any);

  const pathname = usePathname();

  useEffect(() => {
    const firstSegment = pathname?.split("/")[1] || "";
    const menuItem = menuItems.find((item) => item.link === `/${firstSegment}`);
    if (pathname) {
      setCurrentMenu(
        menuItem?.subMenu?.filter(
          (item: any) => item.link === menuItem?.link || item.link === pathname
        )
      );
    }

    setActiveMenu(menuItem?.name ?? null);
  }, [pathname]);

  return (
    <div className="w-full pb-16 relative flex flex-col min-h-screen">
      <div className="lg:bg-black/0 w-full lg:before:absolute lg:before:top-0 lg:before:left-0 lg:before:w-full  lg:before:h-[170px] lg:before:bg-blue-500 lg:before:z-0 lg:before:bg-[url('/images/blue-gradient.jpeg')] lg:before:bg-cover lg:before:bg-no-repeat lg:before:bg-top">
        <Menu
          pathname={pathname}
          onActiveMenu={(menuName) => setActiveMenu(menuName)}
        />
      </div>
      <main className="w-full h-full relative">
        <div
          className={`flex flex-col items-start  lg:bg-white lg:shadow lg:rounded-xl lg:px-4 lg:pb-10 lg:border container`}
        >
          <Breadcrumb menuItem={currentMenu} />
          <div className="w-full flex ">
            <Sidebar pathname={pathname} activeMenu={activeMenu} />
            <div className="flex-1 min-h-[500px]">{children}</div>
          </div>
          <div className="w-fit hidden -mb-5 lg:block opacity-50 hover:opacity-100">
            <LogOutInput
              text="Çıkış Yap"
              className="text-sm px-0 border-0 !py-0 font-semibold !gap-1 group"
              iconClassName="!w-4 !h-4"
            />
          </div>
        </div>
      </main>
      <AudioPlayer playlists={playlists} />
    </div>
  );
}
