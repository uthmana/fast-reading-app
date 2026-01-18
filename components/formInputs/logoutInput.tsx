"use client";

import { signOut } from "next-auth/react";
import { MdLogout } from "react-icons/md";

export default function LogOutInput({
  text = "",
  className = "",
  iconClassName = "",
}) {
  return (
    <button
      title="Çıkış"
      className={`items-center rounded px-3 py-1 border flex gap-2 ${className}`}
      onClick={() => signOut({ callbackUrl: "/" })}
    >
      <MdLogout
        className={`w-6 h-6 transition group-hover:scale-110 ${iconClassName}`}
      />
      {text}
    </button>
  );
}
