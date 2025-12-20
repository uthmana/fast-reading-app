"use client";

import { menuItems } from "@/app/routes";
import { usePathname } from "next/navigation";
import { MdInfo } from "react-icons/md";

export default function ControlPanelGuide({
  data = {
    description:
      "Metin Seçin: Açılır menüden okumak veya üzerinde çalışmak istediğiniz metni seçin.",
    howToPlay:
      "<p>Alttaki araçlardan hız, egzersiz tipi ve simgeyi seçip  butonuna basarak uygulamayı başlatın. Bilgisayarı tam karşınıza alarak, başınızı hareket ettirmeden sadece gözleriniz ile ekrandaki simgeyi süre bitene kadar takip edin.</p>",
  },
}:
  | {
      data?: { description?: string; howToPlay?: string };
    }
  | any) {
  const pathname = usePathname();
  const menu = menuItems.find((item) =>
    item.subMenu.find((sub) => sub.link === pathname)
  );

  const title =
    menu?.subMenu.find((sub) => sub.link === pathname)?.name ||
    "Kontrol Paneli Nasıl Kullanılır";

  return (
    <div className="w-full h-full px-1 lg:px-7 flex flex-col justify-center space-y-2">
      <div className="flex items-center gap-2">
        <MdInfo className="text-blue-600 w-6 h-6" />
        <h2 className="font-bold">{title}</h2>
      </div>
      <div>{data.description}</div>
      <h3 className=" font-semibold">Nasıl Kullanılır :</h3>
      <div dangerouslySetInnerHTML={{ __html: data.howToPlay }} />
    </div>
  );
}
