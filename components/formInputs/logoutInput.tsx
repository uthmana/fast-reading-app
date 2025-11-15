"use client";

import { signOut } from "next-auth/react";
import { MdLogout } from "react-icons/md";

export default function LogOutInput({ text = "", className = "" }) {
  return (
    <button
      title="Çıkış"
      className={` items-center rounded px-3 py-1 border flex gap-2 ${className}`}
      onClick={() => signOut({ callbackUrl: "/login" })}
    >
      <MdLogout className="w-6 h-6 transition rotate-180 group-hover:scale-110" />{" "}
      {text}
    </button>
  );
}
