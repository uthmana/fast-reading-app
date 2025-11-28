"use client";

import { usePopup } from "@/app/contexts/popupContext";
import Icon from "@/components/icon/icon";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";

interface Route {
  path?: string;
  name: string;
  icon?: React.ReactNode;
  children?: Route[];
  roles?: string[];
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
  const { data: session } = useSession();
  const { isShow } = usePopup();

  const normalize = (p: string) => (p === "/" ? "/" : p.replace(/\/+$/, ""));
  const cur = normalize(pathname);

  // Track manual toggle actions by the user
  const [manualOpen, setManualOpen] = useState<Record<string, boolean>>({});

  const toggleMenu = (name: string) =>
    setManualOpen((prev) => ({ ...prev, [name]: !prev[name] }));

  // Determine active route for auto-open
  const activePath = useMemo(() => {
    let best: string | null = null;

    const search = (routesList: Route[]) => {
      for (const r of routesList) {
        const rp = r.path ? normalize(r.path) : "";

        if (rp && (cur === rp || cur.startsWith(rp + "/"))) {
          if (!best || rp.length > best.length) best = rp;
        }

        if (r.children) search(r.children);
      }
    };

    search(routes);
    return best;
  }, [cur, routes]);

  useEffect(() => {
    if (isSidebarOpen && isShow) {
      setIsSidebarOpen(false);
    }
  }, [isShow]);

  return (
    <aside
      className={`fixed top-0 left-0 h-full bg-white shadow-lg z-40 transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      style={{ width: `${sidebarWidth}px` }}
    >
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-xl font-semibold">Admin Panel</h2>

        <button
          className="lg:hidden text-gray-600 hover:text-black"
          onClick={() => setIsSidebarOpen(false)}
        >
          ✕
        </button>
      </div>

      <nav className="p-4 space-y-1">
        {routes.map((route, idx) => {
          if (session && !route.roles?.includes(session?.user.role))
            return null;

          const rp = route.path ? normalize(route.path) : "";
          const active = rp && (rp === activePath || cur.startsWith(rp + "/"));

          // submenu logic
          const hasChildren = route.children && route.children.length > 0;

          const isOpen =
            manualOpen[route.name] !== undefined
              ? manualOpen[route.name]
              : active;

          return (
            <div key={route.name + idx}>
              {/* Parent row */}
              <div
                className={`flex items-center justify-between px-3 py-2 rounded border-b cursor-pointer transition-colors duration-200 
                ${
                  active
                    ? "bg-blue-600 text-white font-semibold"
                    : "text-black hover:text-white hover:bg-blue-600"
                }`}
              >
                {route.path && !hasChildren ? (
                  <Link href={route.path} className="flex gap-3 w-full">
                    {route.icon} {route.name}
                  </Link>
                ) : (
                  <div
                    onClick={() => toggleMenu(route.name)}
                    className="flex gap-3 w-full"
                  >
                    {route.icon} {route.name}
                  </div>
                )}

                {hasChildren && (
                  <button
                    onClick={() => toggleMenu(route.name)}
                    className="ml-2 text-lg"
                  >
                    <Icon
                      name="chevron-down"
                      className={`w-3 h-3 transition-transform  ${
                        isOpen ? "!rotate-180" : ""
                      }`}
                    />
                  </button>
                )}
              </div>

              {/* Submenu */}
              {hasChildren && isOpen && (
                <div className="ml-6 mt-1 space-y-1">
                  {route?.children?.map((sub, sIdx) => {
                    const sp = normalize(sub.path || "");
                    const subActive = sp === cur;

                    return (
                      <Link
                        key={sub.name + sIdx}
                        href={sub.path!}
                        className={`block px-3 py-2 border-b border-l-4 font-medium rounded text-sm transition-colors 
                          ${
                            subActive
                              ? " border-l-blue-500 bg-blue-100 text-black font-semibold"
                              : "text-gray-700  hover:bg-blue-100"
                          }`}
                      >
                        {sub.name}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
