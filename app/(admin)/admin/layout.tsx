"use client";

import { useState, useEffect } from "react";
import NavBar from "../../../components/admin/navBar/navBar";
import SideBar from "../../../components/admin/sideBar/sideBar";
import routes from "./routes";
import "../../globals.css";
import { SessionProvider } from "next-auth/react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
              className="flex flex-col flex-1 transition-all duration-300 ease-in-out"
              style={{
                // push content only on large screens
                marginLeft:
                  isLargeScreen && isSidebarOpen ? `${sidebarWidth}px` : "0px",
              }}
            >
              <NavBar
                toggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
                isSidebarOpen={isSidebarOpen}
              />
              <main className="flex-1 p-6 overflow-y-auto">{children}</main>
            </div>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
