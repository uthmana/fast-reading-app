"use client";

import Link from "next/link";
import reading_icon from "/public/images/reading-icon.png";
import Image from "next/image";
import Profile from "../profile/profile";
import { useSession } from "next-auth/react";

export default function NavBar({
  toggleSidebar,
  isSidebarOpen,
}: {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}) {
  const { data: session, status } = useSession();

  return (
    <header className="flex items-center justify-between px-4 py-4 bg-white shadow-md sticky top-0 z-20">
      <button
        onClick={toggleSidebar}
        className="text-gray-700 hover:text-black"
        aria-label="Toggle sidebar"
      >
        <svg viewBox="0 0 60 60" width="20" height="20" fill="gray">
          <rect width="60" height="8" rx="4"></rect>
          <rect y="20" width="60" height="8" rx="4"></rect>
          <rect y="40" width="60" height="8" rx="4"></rect>
        </svg>
      </button>

      <div className="space-x-4">
        <Profile user={session?.user} />

        {/* <Link
          href="/"
          title="Çalışma platformu"
          className="text-blue-600 underline"
        >
          <Image
            src={reading_icon}
            alt={"reading icon"}
            width="24"
            height="24"
            unoptimized
            className="mx-auto"
          />
        </Link> */}
      </div>
    </header>
  );
}
