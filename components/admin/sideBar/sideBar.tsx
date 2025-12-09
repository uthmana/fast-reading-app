"use client";

import { useAuthHandler } from "@/app/(admin)/admin/authHandler/authOptions";
import { usePopup } from "@/app/contexts/popupContext";
import Icon from "@/components/icon/icon";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { IoMdGlobe } from "react-icons/io";
import { MdLogout } from "react-icons/md";

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
  const { isShow } = usePopup();
  const { canViewMenu } = useAuthHandler();

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

  const handleSignOut = () => {
    signOut({ callbackUrl: "/login" });
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-full bg-white shadow-lg z-40 transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      style={{ width: `${sidebarWidth}px` }}
    >
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-xl ml-4 font-semibold">Admin Panel</h2>

        <button
          className="lg:hidden text-gray-600 hover:text-black"
          onClick={() => setIsSidebarOpen(false)}
        >
          ✕
        </button>
      </div>

      <div className="w-full h-[calc(100%-160px)]  flex flex-col justify-between">
        <nav className="p-4 space-y-1">
          {routes.map((route, idx) => {
            const rp = route.path ? normalize(route.path) : "";
            const active =
              rp && (rp === activePath || cur.startsWith(rp + "/"));

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
                    {route?.children?.map((sub: any, sIdx) => {
                      if (!canViewMenu(sub.path)) {
                        return null;
                      }

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
        <nav className=" border-t text-left w-full flex flex-col px-4">
          <Link
            target="_blank"
            href={"/"}
            className="border-b py-3 text-gray-500 hover:text-gray-900 flex gap-3 ml-2 items-center text-base"
          >
            <IoMdGlobe className="w-6 h-6" /> Siteyi Görüntüle
          </Link>
          <button
            onClick={handleSignOut}
            className="ml-2 text-left text-gray-500 hover:text-gray-900 py-3 flex items-center gap-3 text-base border-b"
          >
            <MdLogout className={`w-6 h-6`} /> Çıkış Yap
          </button>
        </nav>
      </div>
    </aside>
  );
}
