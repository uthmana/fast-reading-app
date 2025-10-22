"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useMemo } from "react";

interface Route {
  path: string;
  name: string;
}

export default function SideBar({
  isSidebarOpen,
  setIsSidebarOpen,
  sidebarWidth,
  routes,
}: {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (v: boolean) => void;
  sidebarWidth: number;
  routes: Route[];
}) {
  const pathname = usePathname() || "/";

  // Normalize paths by removing trailing slashes (but keep root '/')
  const normalize = (p: string) => (p === "/" ? "/" : p.replace(/\/+$/, ""));

  const cur = normalize(pathname);

  // Find the best (longest) matching route path for the current pathname
  const activePath = useMemo(() => {
    let best: string | null = null;

    for (const r of routes) {
      const rp = normalize(r.path);

      // Exact match or prefix match (prefix only valid if not root)
      const matches = cur === rp || (rp !== "/" && cur.startsWith(rp + "/"));

      if (matches) {
        // pick the longest matched route (most specific)
        if (!best || rp.length > best.length) {
          best = rp;
        }
      }
    }

    return best; // could be null
  }, [cur, routes]);

  return (
    <aside
      // fixed so it can slide over content on mobile; translate-x-full/-translate-x-full handles sliding
      className={`fixed top-0 left-0 h-full bg-white shadow-lg z-40 transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      style={{ width: `${sidebarWidth}px` }}
    >
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-xl font-semibold">Admin Panel</h2>

        {/* Close button visible on mobile; on large screens user can use navbar toggle */}
        <button
          className="lg:hidden text-gray-600 hover:text-black"
          onClick={() => setIsSidebarOpen(false)}
          aria-label="Close sidebar"
        >
          ✕
        </button>
      </div>

      <nav className="p-4">
        {routes.map((route: any, idx) => {
          const rp = normalize(route.path);
          const active = rp === activePath;
          return (
            <Link
              key={route.name + idx}
              href={route.path}
              className={`px-3 py-2 flex gap-4 rounded border-b transition-colors duration-200 text-black hover:text-white  hover:bg-blue-600 ${
                active ? "bg-blue-600 text-white font-semibold" : ""
              }`}
            >
              {route.icon} {route.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
