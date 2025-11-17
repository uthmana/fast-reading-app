"use client";
import React from "react";
import { signOut } from "next-auth/react";
import Dropdown from "../dropdown/dropdown";
import { MdAccountCircle } from "react-icons/md";
import Link from "next/link";

export default function Profile({ user }: any) {
  const handleSignOut = () => {
    signOut({ callbackUrl: "/login" });
  };

  return (
    <Dropdown
      key={user?.name}
      button={<MdAccountCircle className="w-8 h-8 text-blue-600" />}
      classNames={"py-2 top-8 -left-[180px] w-max border bg-white rounded-lg"}
    >
      <div className="flex w-56 flex-col justify-start  pb-5 shadow-xl shadow-shadow-500">
        <div className="ml-4 mt-3">
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold text-navy-700 capitalize">
              👋 Merhaba, {user?.name}
            </p>
          </div>
        </div>
        <div className="mt-3 h-px w-full bg-gray-200" />
        <div className="ml-4 mt-3">
          <ul className="w-full space-y-2 text-sm text-black">
            <li className="">
              <Link
                target="_blank"
                href="/"
                title="Çalışma platformu"
                className="hover:text-blue-600 tracking-tight"
              >
                Öğrenci Çalışma Platformu
              </Link>
            </li>
            <li>
              <button
                onClick={handleSignOut}
                className="block text-left font-medium hover:text-red-500"
              >
                Çıkış Yap
              </button>
            </li>
          </ul>
        </div>
      </div>
    </Dropdown>
  );
}
