import React from "react";
import LogOutInput from "../formInputs/logoutInput";

export default function SecondaryFooter() {
  return (
    <div className="w-full flex flex-wrap justify-between text-xs px-3 py-4 items-center border-t border-dotted border-black pb-3 ">
      <LogOutInput
        text="Çıkış Yap"
        className="text-sm px-0 border-0 !py-0 w-full md:flex-1 font-normal opacity-75 hover:opacity-100 !gap-1 group"
        iconClassName="!w-4 !h-4"
      />
      <div className="text-center w-full md:flex-1 opacity-75">
        ©2025Tüm Hakları saklıdır.
      </div>
      <div className="flex gap-2 md:justify-end justify-center whitespace-nowrap items-center w-full md:flex-1 font-normal">
        <a
          href="/"
          className="text-blue-500 hover:underline opacity-75 hover:opacity-100"
        >
          Serioku
        </a>
        <a
          href="tel:+905456432420"
          className="hover:underline opacity-75 hover:opacity-100"
        >
          +90 545 643 24 00
        </a>
        <a
          href="mailto:info@serioku.com"
          className="hover:underline opacity-75 hover:opacity-100"
        >
          info@serioku.com
        </a>
      </div>
    </div>
  );
}
