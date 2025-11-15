"use client";
import { useState } from "react";
import Link from "next/link";
import LogOutInput from "../formInputs/logoutInput";
import Icon from "../icon/icon";
import { useSession } from "next-auth/react";
import { MdAccountCircle } from "react-icons/md";
import { menuItems } from "@/app/routes";
export default function Menu(_a) {
    var _b, _c, _d;
    var onActiveMenu = _a.onActiveMenu, pathname = _a.pathname;
    var _e = useState(false), menuOpen = _e[0], setMenuOpen = _e[1];
    var _f = useState(null), activeMenu = _f[0], setActiveMenu = _f[1];
    var session = useSession().data;
    var toggleSubMenu = function (menuName) {
        if (typeof window !== "undefined" && window.innerWidth < 1024) {
            var newActive = activeMenu === menuName ? null : menuName;
            setActiveMenu(newActive);
            onActiveMenu(newActive);
        }
        else {
            onActiveMenu(menuName);
        }
    };
    return (<header className="w-full sticky top-0 z-10 container bg-blue-500 lg:border-b-0 text-white border-b ">
      <div className="w-full mx-auto flex items-center justify-between lg:px-0 lg:py-4 px-4 py-3">
        <div className="w-full flex items-center justify-between gap-8">
          <h1 className="text-gray-800">
            <Link className="flex gap-3 items-center text-white" href="/" onClick={function () { return setMenuOpen(false); }}>
              <span className="w-10 font-semibold h-10 border tex capitalize text-lg bg-blue-800  flex items-center justify-center rounded-full">
                {!session ? (<MdAccountCircle className="w-8 h-8 text-blue-400"/>) : ((_c = (_b = session === null || session === void 0 ? void 0 : session.user) === null || _b === void 0 ? void 0 : _b.name[0]) === null || _c === void 0 ? void 0 : _c.toUpperCase())}
              </span>
              <span className="-tracking-tighter"> {(_d = session === null || session === void 0 ? void 0 : session.user) === null || _d === void 0 ? void 0 : _d.name} </span>
            </Link>
          </h1>

          {/* Desktop Menu */}
          <nav className="hidden lg:flex items-center space-x-1">
            {menuItems.map(function (item) { return (<div key={item.name} className="relative h-full">
                {item.link ? (<Link href={item.link} className={"flex relative items-center text-sm font-bold text-white  hover:bg-blue-400 rounded-md px-2 py-2 ".concat((pathname === null || pathname === void 0 ? void 0 : pathname.includes(item.link)) ? "!bg-blue-700" : "")} onClick={function () { return item.subMenu && toggleSubMenu(item.name); }}>
                    {item.name}
                  </Link>) : (<button onClick={function () { return toggleSubMenu(item.name); }} className={"flex relative items-center text-gray-800 hover:text-blue-600 font-medium ".concat(activeMenu === item.name ? "text-blue-600 " : "")}>
                    {item.name}
                    {item.subMenu && (<Icon name="chevron-down" className={"ml-1 w-4 h-4 transition-transform ".concat(activeMenu === item.name ? "rotate-180" : "")}/>)}
                  </button>)}
              </div>); })}
            <LogOutInput className="!ml-3 border-0 font-semibold"/>
          </nav>
        </div>

        {/* Hamburger */}
        <button className="lg:hidden text-gray-700" onClick={function () { return setMenuOpen(!menuOpen); }} aria-label="Toggle menu">
          <Icon name={menuOpen ? "close" : "menu"} className="w-6 h-6 text-white"/>
        </button>
      </div>

      {/* Mobile Menu */}
      <nav className={"lg:hidden transition-all duration-300 bg-white border-t overflow-hidden ".concat(menuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0")}>
        <ul className="flex flex-col p-4 space-y-2">
          {menuItems === null || menuItems === void 0 ? void 0 : menuItems.map(function (item) { return (<li key={item.name}>
              <button onClick={function () { return toggleSubMenu(item.name); }} className={"flex justify-between items-center w-full text-gray-800 font-medium ".concat((pathname === null || pathname === void 0 ? void 0 : pathname.includes(item.link)) ? "!text-blue-400" : "")}>
                {item.name}
                {item.subMenu && (<Icon name="chevron-down" className={"w-4 h-4 transition-transform ".concat(activeMenu === item.name ? "rotate-180" : "")}/>)}
              </button>

              {/* Submenu */}
              {item.subMenu && (<ul className={"flex flex-col pl-4 border-l mt-2 space-y-1 transition-all duration-300 ".concat(activeMenu === item.name
                    ? "max-h-96 opacity-100 overflow-y-auto"
                    : "max-h-0 opacity-0 overflow-hidden", "  ")}>
                  {item.subMenu.map(function (sub) { return (<li key={sub.name}>
                      <Link href={sub.link} className={"block py-2 px-2 text-sm text-gray-700 hover:text-blue-600 ".concat(pathname === sub.link
                        ? "!bg-blue-300 text-white rounded"
                        : "")} onClick={function () { return setMenuOpen(false); }}>
                        {sub.name}
                      </Link>
                    </li>); })}
                </ul>)}
            </li>); })}
          <li>
            <LogOutInput className="text-black"/>
          </li>
        </ul>
      </nav>
    </header>);
}
