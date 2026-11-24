import { companyInfo } from "@/app/(ogrenci)/ogrenci/(utils)/constants/constants";
import { signOut } from "next-auth/react";
import { MdLogout } from "react-icons/md";

export default function Footer() {
  return (
    <div className="w-full flex flex-wrap justify-between text-xs px-3 py-4 items-center border-t border-dotted border-black pb-3">
      <button
        title="Çıkış"
        className={`items-center rounded  flex  w-fit sm:w-full mx-auto sm:ml-auto text-sm px-0 border-0 !py-0  md:flex-1 font-normal opacity-75 hover:opacity-100  hover:text-red-500 gap-1 group`}
        onClick={() => signOut({ callbackUrl: "/ogrenci-giris" })}
      >
        <MdLogout className={`transition group-hover:scale-110 w-4 h-4`} />
        Çıkış Yap
      </button>

      <div className="text-center w-full md:flex-1">
        ©2025 {companyInfo?.name}. Tüm Hakları saklıdır.
      </div>
      <div className="flex gap-2 md:justify-end justify-center whitespace-nowrap items-center w-full md:flex-1 font-normal">
        <a href="/" className="hover:underline hover:text-blue-700">
          {companyInfo?.name}
        </a>
        <a
          href={`tel:${companyInfo?.phone?.replaceAll(" ", "")}`}
          className="hover:underline hover:text-blue-700"
        >
          {companyInfo?.phone}
        </a>
        <a
          href={`mailto:${companyInfo?.email}`}
          className="hover:underline hover:text-blue-700"
        >
          {companyInfo?.email}
        </a>
      </div>
    </div>
  );
}
