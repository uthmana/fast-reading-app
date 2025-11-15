"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useMemo } from "react";
import LogOutInput from "../../formInputs/logoutInput";
export default function SideBar(_a) {
    var isSidebarOpen = _a.isSidebarOpen, setIsSidebarOpen = _a.setIsSidebarOpen, sidebarWidth = _a.sidebarWidth, routes = _a.routes;
    var pathname = usePathname() || "/";
    // Normalize paths by removing trailing slashes (but keep root '/')
    var normalize = function (p) { return (p === "/" ? "/" : p.replace(/\/+$/, "")); };
    var cur = normalize(pathname);
    // Find the best (longest) matching route path for the current pathname
    var activePath = useMemo(function () {
        var best = null;
        for (var _i = 0, routes_1 = routes; _i < routes_1.length; _i++) {
            var r = routes_1[_i];
            var rp = normalize(r.path);
            // Exact match or prefix match (prefix only valid if not root)
            var matches = cur === rp || (rp !== "/" && cur.startsWith(rp + "/"));
            if (matches) {
                // pick the longest matched route (most specific)
                if (!best || rp.length > best.length) {
                    best = rp;
                }
            }
        }
        return best; // could be null
    }, [cur, routes]);
    return (<aside 
    // fixed so it can slide over content on mobile; translate-x-full/-translate-x-full handles sliding
    className={"fixed top-0 left-0 h-full bg-white shadow-lg z-40 transform transition-transform duration-300 ease-in-out\n        ".concat(isSidebarOpen ? "translate-x-0" : "-translate-x-full")} style={{ width: "".concat(sidebarWidth, "px") }}>
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-xl font-semibold">Admin Panel</h2>

        {/* Close button visible on mobile; on large screens user can use navbar toggle */}
        <button className="lg:hidden text-gray-600 hover:text-black" onClick={function () { return setIsSidebarOpen(false); }} aria-label="Close sidebar">
          ✕
        </button>
      </div>

      <nav className="p-4">
        {routes.map(function (route, idx) {
            var rp = normalize(route.path);
            var active = rp === activePath;
            return (<Link key={route.name + idx} href={route.path} className={"block px-3 py-2 rounded border-b transition-colors duration-200 text-black hover:text-white  hover:bg-blue-600 ".concat(active ? "bg-blue-600 text-white font-semibold" : "")}>
              {route.name}
            </Link>);
        })}
      </nav>

      <div className="p-4 absolute bottom-0">
        <LogOutInput />
      </div>
    </aside>);
}
