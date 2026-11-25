"use client";

import { MdInfo } from "react-icons/md";
import { usePathname } from "next/navigation";
import { useMenu } from "@/app/(ogrenci)/ogrenci/(utils)/providers/menuProvider";

interface ControlPanelGuideData {
  description?: string;
  howToPlay?: string;
}

interface ControlPanelGuideProps {
  data?: ControlPanelGuideData;
  intoTest?: string | undefined;
}

const DEFAULT_GUIDE: Required<ControlPanelGuideData> = {
  description:
    "Metin Seçin: Açılır menüden okumak veya üzerinde çalışmak istediğiniz metni seçin.",
  howToPlay:
    "<p>Alttaki araçlardan hız, egzersiz tipi ve simgeyi seçip butonuna basarak uygulamayı başlatın. Bilgisayarı tam karşınıza alarak, başınızı hareket ettirmeden sadece gözleriniz ile ekrandaki simgeyi süre bitene kadar takip edin.</p>",
};

const introTestDefault = {
  title: "Seviye Belirleme Testi",
  description:
    "Bu test ile mevcut okuma anlama seviyeniz belirlenecektir. Test sonucunuza göre size uygun okuma anlama egzersizleri sunulacaktır. Üç farklı okuma anlama testi yapmanızı gerekiyor. Her testte 10'ar soru sorulacaktır. Test sonunda doğru cevap sayınıza göre seviyeniz belirlenecektir.",
};

export default function ControlPanelGuide({
  data,
  intoTest,
}: ControlPanelGuideProps) {
  const pathname = usePathname();
  const { menuItems } = useMenu();

  const introTitle = intoTest ? `${introTestDefault.title} ${intoTest}` : null;
  const introDesc = intoTest ? introTestDefault.description : null;

  const currentSubMenu = menuItems
    .flatMap((menu) => menu.subMenu)
    .find((sub) => sub.link === pathname);

  const title = currentSubMenu?.name ?? "Kontrol Paneli Nasıl Kullanılır";
  const description = data?.description ?? DEFAULT_GUIDE.description;
  const howToPlay = data?.howToPlay ?? DEFAULT_GUIDE.howToPlay;

  return (
    <div className="flex h-full w-full flex-col justify-center space-y-2 px-1 lg:px-7">
      <div className="flex items-center gap-2">
        <MdInfo className="h-6 w-6 shrink-0 text-blue-600" />
        <h2 className="font-bold">{intoTest ? introTitle : title}</h2>
      </div>

      <div>{intoTest ? introDesc : description}</div>
      <h3 className="font-semibold">Nasıl Kullanılır:</h3>
      <div dangerouslySetInnerHTML={{ __html: howToPlay }} />
    </div>
  );
}
