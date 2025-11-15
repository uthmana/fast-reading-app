"use client";
import { menuItems } from "@/app/routes";
import Link from "next/link";
export default function Sidebar(_a) {
    var _b;
    var activeMenu = _a.activeMenu, pathname = _a.pathname;
    if (pathname === "/")
        return null;
    var selected = menuItems.find(function (m) { return m.name === activeMenu; });
    if (!activeMenu) {
        selected = menuItems.find(function (menu) { return menu.link === pathname; });
        if (!selected) {
            selected = menuItems.find(function (menu) { var _a; return (_a = menu.subMenu) === null || _a === void 0 ? void 0 : _a.find(function (sub) { return sub.link.includes(pathname); }); });
        }
    }
    if (!selected)
        return null;
    return (<aside className="hidden min-h-96 lg:block w-64 bg-white  py-4 pl-4">
      <ul className="space-y-2">
        {(_b = selected === null || selected === void 0 ? void 0 : selected.subMenu) === null || _b === void 0 ? void 0 : _b.map(function (item) { return (<li key={item.name}>
            <Link href={item.link || "#"} className={"block px-3 py-2 border  rounded-lg text-white bg-blue-600  hover:bg-blue-900 transition ".concat(pathname === item.link ? "bg-blue-900" : "")}>
              {item.name}
            </Link>
          </li>); })}
      </ul>
    </aside>);
}
