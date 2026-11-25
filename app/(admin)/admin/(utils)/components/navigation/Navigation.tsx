"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { AdminRouteTypes } from "../../lib/dataModel";
import SideBar from "../sideBar/sideBar";
import NavBar from "../navBar/navBar";
import Breadcrumb from "../breadcrumb/breadcrumb";

export default function Navigation({
  children,
  routes,
}: {
  children: React.ReactNode;
  routes: AdminRouteTypes;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const sidebarWidth = 250; // px

  useEffect(() => {
    const handleResize = () => {
      const large = window.innerWidth >= 1024;
      setIsLargeScreen(large);
      setIsSidebarOpen((prev) => (typeof prev === "boolean" ? prev : large));
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100 relative">
      <SideBar
        routes={routes}
        pathname={pathname}
        sidebarWidth={sidebarWidth}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* Backdrop shown only on small screens when sidebar is open */}
      {!isLargeScreen && (
        <div
          className={`fixed inset-0 bg-black/40 z-30 transition-opacity duration-300 ${
            isSidebarOpen
              ? "opacity-100 visible"
              : "opacity-0 invisible pointer-events-none"
          }`}
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      {/* Main content: pushed on large screens when sidebar is open */}
      <div
        className="flex w-full flex-col flex-1 transition-all duration-300 ease-in-out"
        style={{
          marginLeft:
            isLargeScreen && isSidebarOpen ? `${sidebarWidth}px` : "0px",
        }}
      >
        <NavBar toggleSidebar={() => setIsSidebarOpen((prev) => !prev)} />
        <main className="flex-1 p-5 overflow-y-auto">
          <div>
            <Breadcrumb pathname={pathname} />
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
