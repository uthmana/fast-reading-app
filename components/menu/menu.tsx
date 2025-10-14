"use client";

import { useState } from "react";
import { menuItems } from "../../utils/constants";
import Link from "next/link";
import LogOutInput from "../formInputs/logoutInput";
import Icon from "../icon/icon";
import Image from "next/image";
import reading_icon from "/public/images/reading-icon.png";
import { useSession } from "next-auth/react";

interface MenuProps {
  onActiveMenu: (menuName: string | null) => void;
  pathname?: string;
}

export default function Menu({ onActiveMenu, pathname }: MenuProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const { data: session }: any = useSession();

  const toggleSubMenu = (menuName: string) => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      const newActive = activeMenu === menuName ? null : menuName;
      setActiveMenu(newActive);
      onActiveMenu(newActive);
    } else {
      onActiveMenu(menuName);
    }
  };

  return (
    <header className="w-full sticky top-0 z-10 container bg-blue-500 lg:border-b-0 text-white border-b ">
      <div className="w-full mx-auto flex items-center justify-between lg:px-0 lg:py-4 px-4 py-3">
        <div className="w-full flex items-center justify-between gap-8">
          <h1 className="font-medium text-gray-800">
            <Link
              className="flex gap-3 items-center text-white"
              href="/"
              onClick={() => setMenuOpen(false)}
            >
              <Image
                src={reading_icon}
                alt={"Etkin Hızlı Okuma"}
                width="34"
                height="34"
                unoptimized
                priority
                className="mx-auto"
              />
              <span> {session?.user?.name} </span>
            </Link>
          </h1>

          {/* Desktop Menu */}
          <nav className="hidden lg:flex items-center space-x-1">
            {menuItems.map((item) => (
              <div key={item.name} className="relative h-full">
                {item.link ? (
                  <Link
                    href={item.link}
                    className={`flex items-center text-sm font-bold text-white  hover:bg-blue-400 rounded-md px-2 py-2 ${
                      pathname?.includes(item.link) ? "!bg-blue-700 " : ""
                    }`}
                    onClick={() => item.subMenu && toggleSubMenu(item.name)}
                  >
                    {item.name}
                  </Link>
                ) : (
                  <button
                    onClick={() => toggleSubMenu(item.name)}
                    className={`flex items-center text-gray-800 hover:text-blue-600 font-medium ${
                      activeMenu === item.name ? "text-blue-600" : ""
                    }`}
                  >
                    {item.name}
                    {item.subMenu && (
                      <Icon
                        name="chevron-down"
                        className={`ml-1 w-4 h-4 transition-transform ${
                          activeMenu === item.name ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </button>
                )}
              </div>
            ))}
            <LogOutInput />
          </nav>
        </div>

        {/* Hamburger */}
        <button
          className="lg:hidden text-gray-700"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <Icon name={menuOpen ? "close" : "menu"} className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Menu */}
      <nav
        className={`lg:hidden transition-all duration-300 bg-white border-t overflow-hidden ${
          menuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <ul className="flex flex-col p-4 space-y-2">
          {menuItems.map((item) => (
            <li key={item.name}>
              <button
                onClick={() => toggleSubMenu(item.name)}
                className={`flex justify-between items-center w-full text-gray-800 font-medium ${
                  pathname?.includes(item.link) ? "!text-blue-400" : ""
                }`}
              >
                {item.name}
                {item.subMenu && (
                  <Icon
                    name="chevron-down"
                    className={`w-4 h-4 transition-transform ${
                      activeMenu === item.name ? "rotate-180" : ""
                    }`}
                  />
                )}
              </button>

              {/* Submenu */}
              {item.subMenu && (
                <ul
                  className={`flex flex-col pl-4 border-l mt-2 space-y-1 transition-all duration-300 ${
                    activeMenu === item.name
                      ? "max-h-96 opacity-100"
                      : "max-h-0 opacity-0 overflow-hidden"
                  }  `}
                >
                  {item.subMenu.map((sub) => (
                    <li key={sub.name}>
                      <Link
                        href={sub.link}
                        className={`block py-2 px-2 text-sm text-gray-700 hover:text-blue-600 ${
                          pathname === sub.link
                            ? "!bg-blue-300 text-white rounded"
                            : ""
                        }`}
                        onClick={() => setMenuOpen(false)}
                      >
                        {sub.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
          <li>
            <LogOutInput className="text-black" />
          </li>
        </ul>
      </nav>
    </header>
  );
}
