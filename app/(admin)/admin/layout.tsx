"use client";

import { useState, useEffect } from "react";
import NavBar from "../../../components/admin/navBar/navBar";
import SideBar from "../../../components/admin/sideBar/sideBar";
import "../../globals.css";
import { SessionProvider } from "next-auth/react";
import routes from "./routes";
import { PopupProvider } from "../../contexts/popupContext";
import Breadcrumb from "@/components/admin/breadcrumb/breadcrumb";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
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
    <html lang="en">
      <body className="overflow-x-hidden">
        <SessionProvider>
          <PopupProvider>
            <div className="flex min-h-screen bg-gray-100 relative">
              <SideBar
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                sidebarWidth={sidebarWidth}
                routes={routes}
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
                  // push content only on large screens
                  marginLeft:
                    isLargeScreen && isSidebarOpen
                      ? `${sidebarWidth}px`
                      : "0px",
                }}
              >
                <NavBar
                  toggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
                  isSidebarOpen={isSidebarOpen}
                />
                <main className="flex-1 p-5 overflow-y-auto">
                  <div>
                    <Breadcrumb pathname={pathname} />
                  </div>
                  {children}
                </main>
              </div>
            </div>
          </PopupProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
