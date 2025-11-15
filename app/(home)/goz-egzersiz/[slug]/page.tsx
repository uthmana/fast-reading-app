"use client";

import { menuItems } from "@/app/routes";
import ControlPanelGuide from "@/components/controlPanelGuide/controlPanelGuide";
import RenderExercise from "@/components/exercises";
import Whiteboard from "@/components/whiteboard/whiteboard";
import { useParams } from "next/navigation";
import { useState } from "react";
import NotFound from "../../not-found";
type ExerciseDescription = {
  description: string;
  howToPlay: string;
};

type DescriptionMap = Record<string, ExerciseDescription>;

export default function page() {
  const [pause, setPause] = useState(false);
  const [control, setControl] = useState({
    categorySelect: "",
    articleSelect: "",
    font: "16",
    level: 1,
    wordsPerFrame: 2,
  });
  const descriptions: DescriptionMap = {
    "goz-kaslarini-gelistirme": {
      description:
        "Gözlerimizde toplam 6 adet kas var. Göz kaslarını geliştirmek için koordineli olarak hareket ettirmek gerekmektedir. Bu uygulamayı günde en az 5 dakika yaparak göz kaslarınızı geliştirebilirsiniz.",

      howToPlay:
        "<p> Alttaki araçlardan hız, egzersiz tipi ve simgeyi seçip  <span style='color:blue'>►</span> butonuna basarak uygulamayı başlatın. Bilgisayarı tam karşınıza alarak, başınızı hareket ettirmeden sadece gözleriniz ile ekrandaki simgeyi süre bitene kadar takip edin.</p>",
    },

    "aktif-gorme-alanini-genisletme": {
      description:
        "Gözlerimiz bir tek şey üzerinde odaklanmış olsa bile, o cismin çevresinde olan bir sürü bilgiyi de algılama yeteneğine sahiptir. Gözlerini iyi eğiten bir okuyucu aktif görme alanını tam olarak kullanabilir. Bu egzersiz ile gözümüzün görme alanını 4 tarafa doğru geliştirebiliriz.",
      howToPlay:
        "<p>Alttaki araçlardan çerçeve genişliği, sütun sayısı ve hızı ayarlayıp <span style='color:blue'>►</span> butonuna basarak uygulamayı başlatın. Rakamların ortasındaki noktaya bakarak bütün rakamları görmeye çalışın. Rakamları seslendirmeden sadece görün. Süre bitene kadar egzersize devam edin.</p>",
    },
    "aktif-gorme-alanini-genisletme-2": {
      description:
        "Gözlerimiz bir tek şey üzerinde odaklanmış olsa bile, o cismin çevresinde olan bir sürü bilgiyi de algılama yeteneğine sahiptir. Gözlerini iyi eğiten bir okuyucu aktif görme alanını tam olarak kullanabilir. Bu egzersiz ile gözümüzün görme alanını 4 tarafa doğru geliştirebiliriz.",
      howToPlay:
        "<p>Alttaki araçlardan hız ve kutu rengini ayarlayıp <span style='color:blue'>►</span> butonuna basarak uygulamayı başlatın. Karenin ortasına bakarak bütün kareyi görmeye çalışın. Süre bitene kadar egzersize devam edin.",
    },
    "aktif-gorme-alanini-genisletme-3": {
      description:
        "Gözlerimiz bir tek şey üzerinde odaklanmış olsa bile, o cismin çevresinde olan bir sürü bilgiyi de algılama yeteneğine sahiptir. Gözlerini iyi eğiten bir okuyucu aktif görme alanını tam olarak kullanabilir. Bu egzersiz ile gözümüzün görme alanını 4 tarafa doğru geliştirebiliriz.",
      howToPlay:
        "Alttaki araçlardan hızı ayarlayıp <span style='color:blue'>►</span> butonuna basarak uygulamayı başlatın. Karenin ortasına bakarak bütün kareleri görmeye çalışın. Süre bitene kadar egzersize devam edin.",
      },
      "metronom": {
          description: "Metronom çok eski bir eğitim aracıdır. Özellikle konuşma bozukluklarına iyi gelen bu uygulamadır. Hızlı okuma ve algılamanın yanı sıra, dikkat ve odaklanmayı da arttırır.",
          howToPlay:"<p>Metronom hızını seçip <span style='color:blue'>►</span> butonuna basın ve uygulamaya başlayın."
      },
      "satir-boyu-gorme-uygulamasi": {
          description: "Bu uygulama ile gözün satır boyunca daha geniş bir alanı görmesini sağlayabilirsiniz.",
          howToPlay: "<p>Alttaki araçlardan merkeze uzaklık, harf Sayısı ve hız ayarlarınızı yapıp <span style='color:blue'>►</span> butonuna basarak uygulamayı başlatın. Ekranın ortasında ki çizgiye odaklanarak kenarlardaki kelime ve kelime gruplarını gözlerinizi hareket etmeden okuyun. Süre bitene kadar egzersize devam edin.</p>"
      }

    // 🔥 ADD MORE EXERCISES HERE
    // "kelimelerin-dansi": { ... }
  };

  const queryParams = useParams();
  const pathname: any = queryParams.slug;

  const currentMenu = menuItems.filter((m) =>
    m.subMenu?.some((s) => s.link.includes(pathname))
  );
  const exerciseDescription = descriptions[pathname];
  if (!currentMenu.length) {
    return <NotFound />;
  }

  const handleControl = (val: any) => {
    setControl(val);
  };

  const onFinishTest = async (
    val: {
      wpm: number;
      correct: number;
      counter: number;
      variant: string;
    } | null
  ) => {
    if (!val) {
      setPause(!pause);
      return;
    }
  };

  return (
    <Whiteboard
      pause={pause}
      description={
        <ControlPanelGuide
          description={exerciseDescription?.description ?? ""}
          howToPlay={exerciseDescription?.howToPlay ?? ""}
        />
      }
      body={
        <RenderExercise
          onFinishTest={onFinishTest}
          pathname={pathname}
          controls={control}
        />
      }
      control={control}
      onControlChange={handleControl}
    />
  );
}
