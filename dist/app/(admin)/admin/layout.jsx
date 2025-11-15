"use client";
import { useState, useEffect } from "react";
import NavBar from "../../../components/admin/navBar/navBar";
import SideBar from "../../../components/admin/sideBar/sideBar";
import routes from "./routes";
import "../../globals.css";
export default function DashboardLayout(_a) {
    var children = _a.children;
    var _b = useState(true), isSidebarOpen = _b[0], setIsSidebarOpen = _b[1];
    var _c = useState(false), isLargeScreen = _c[0], setIsLargeScreen = _c[1];
    var sidebarWidth = 250; // px
    useEffect(function () {
        var handleResize = function () {
            var large = window.innerWidth >= 1024;
            setIsLargeScreen(large);
            setIsSidebarOpen(function (prev) { return (typeof prev === "boolean" ? prev : large); });
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return function () { return window.removeEventListener("resize", handleResize); };
    }, []);
    return (<html lang="en">
      <body className="overflow-x-hidden">
        <div className="flex min-h-screen bg-gray-100 relative">
          <SideBar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} sidebarWidth={sidebarWidth} routes={routes}/>

          {/* Backdrop shown only on small screens when sidebar is open */}
          {!isLargeScreen && (<div className={"fixed inset-0 bg-black/40 z-30 transition-opacity duration-300 ".concat(isSidebarOpen
                ? "opacity-100 visible"
                : "opacity-0 invisible pointer-events-none")} onClick={function () { return setIsSidebarOpen(false); }}/>)}

          {/* Main content: pushed on large screens when sidebar is open */}
          <div className="flex flex-col flex-1 transition-all duration-300 ease-in-out" style={{
            // push content only on large screens
            marginLeft: isLargeScreen && isSidebarOpen ? "".concat(sidebarWidth, "px") : "0px",
        }}>
            <NavBar toggleSidebar={function () { return setIsSidebarOpen(function (prev) { return !prev; }); }} isSidebarOpen={isSidebarOpen}/>
            <main className="flex-1 p-6 overflow-y-auto">{children}</main>
          </div>
        </div>
      </body>
    </html>);
}
