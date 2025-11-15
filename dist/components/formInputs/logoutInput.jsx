"use client";
import { signOut } from "next-auth/react";
import { MdLogout } from "react-icons/md";
export default function LogOutInput(_a) {
    var _b = _a.text, text = _b === void 0 ? "Çıkış" : _b, _c = _a.className, className = _c === void 0 ? "" : _c;
    return (<button className={"hover:bg-red-500 items-center hover:text-white rounded px-3 py-1 border flex gap-2 ".concat(className)} onClick={function () { return signOut(); }}>
      <MdLogout className="w-5 h-5 rotate-180"/> {text}
    </button>);
}
