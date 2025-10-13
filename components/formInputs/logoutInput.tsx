"use client";

import { signOut } from "next-auth/react";
import { MdLogout } from "react-icons/md";

export default function LogOutInput({ text = "Çıkış", className = "" }) {
  return (
    <button
      className={`hover:bg-red-500 items-center hover:text-white rounded px-3 py-1 border flex gap-2 ${className}`}
      onClick={() => signOut()}
    >
      <MdLogout className="w-5 h-5 rotate-180" /> {text}
    </button>
  );
}
