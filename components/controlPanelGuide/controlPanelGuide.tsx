"use client";

import { menuItems } from "@/app/routes";
import { usePathname } from "next/navigation";
import { MdInfo } from "react-icons/md";

export default function ControlPanelGuide({
  description = "Metin Seçin: Açılır menüden okumak veya üzerinde çalışmak istediğiniz metni seçin.",
  howToPlay = "<p>Alttaki araçlardan hız, egzersiz tipi ve simgeyi seçip  butonuna basarak uygulamayı başlatın. Bilgisayarı tam karşınıza alarak, başınızı hareket ettirmeden sadece gözleriniz ile ekrandaki simgeyi süre bitene kadar takip edin.</p>",
}) {
  const pathname = usePathname();
  const menu = menuItems.find((item) =>
    item.subMenu.find((sub) => sub.link === pathname)
  );
  const title =
    menu?.subMenu.find((sub) => sub.link === pathname)?.name ||
    "Kontrol Paneli Nasıl Kullanılır";

  return (
    <div className="h-full lg:px-5 flex flex-col justify-center text-gray-800 lg:max-w-[90%] max-w-full  mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <MdInfo className="text-blue-600 w-6 h-6" />
        <h2 className="font-bold">{title}</h2>
      </div>
      <p className="mb-4">{description ? description : ""}</p>
      <h3 className="mb-1  font-semibold">Nasıl Kullanılır :</h3>
      <div dangerouslySetInnerHTML={{ __html: howToPlay }} />
    </div>
  );
}
