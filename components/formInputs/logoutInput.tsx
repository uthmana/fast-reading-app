"use client";

import { signOut } from "next-auth/react";
import { MdLogout } from "react-icons/md";

export default function LogOutInput({ text = "", className = "" }) {
  return (
    <button
      title="Çıkış"
      className={` items-center rounded px-3 py-1 border flex gap-2 ${className}`}
      onClick={() => signOut()}
    >
      <MdLogout className="w-6 h-6 rotate-180 hover:text-red-500" /> {text}
    </button>
  );
}
