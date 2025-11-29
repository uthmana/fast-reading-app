"use client";
import Icon from "@/components/icon/icon";
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
    <header className="w-full flex items-center justify-between px-4 py-4 bg-white shadow-md sticky top-0 z-20">
      <button
        onClick={toggleSidebar}
        className="text-gray-700 hover:text-black"
        aria-label="Toggle sidebar"
      >
        <Icon name="menu" className="w-7 h-7 text-gray-600" />
      </button>

      <div className="flex items-center gap-2">
        <p className="text-sm">{session?.user?.name}</p>
        <Profile user={session?.user} />
      </div>
    </header>
  );
}
