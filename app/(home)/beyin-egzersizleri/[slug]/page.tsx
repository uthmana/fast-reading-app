"use client";

import { menuItems } from "@/app/routes";
import ControlPanelGuide from "@/components/controlPanelGuide/controlPanelGuide";
import RenderExercise from "@/components/exercises";
import Whiteboard from "@/components/whiteboard/whiteboard";
import { useParams, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import NotFound from "../../not-found";
import { fetchData } from "@/utils/fetchData";
import ColorFinderControls from "@/components/formInputs/colorFinderControls";
import FindTheColor from "@/components/exercises/brain/findTheColor";
import NumberFinderControls from "@/components/formInputs/numberFinderControls";
import FindTheNumber from "@/components/exercises/brain/findTheNumber";
import { useSession } from "next-auth/react";
import { eyeExerciseDescription } from "@/utils/constants";

export default function page() {
  const { data: session } = useSession();
  const queryParams = useParams();
  const pathname: any = queryParams.slug;
  const searchParams = useSearchParams();
  const lessonParams = searchParams.get("lessonId");
  const exerciseParams = searchParams.get("exerciseId");
  const durationParams = searchParams.get("duration");

  //dogru Rengi Bul States Custom Controls
  const [level, setLevel] = useState(2);
  const [running, setRunning] = useState(true);

  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);

  // Get checkAnswer function from ColorFinder (exposed via ref)
  const finderRef = useRef<any>(null);

  const triggerCheck = (answer: boolean) => {
    if (finderRef.current?.check) {
      finderRef.current.check(answer);
    }
  };

  //DOGRU SAYIIYI BUL STATES CUSTOM CONTROLS
  const [speed, setSpeed] = useState(1500); // 1.5 seconds
  const [difficulty, setDifficulty] = useState(5);
  const [targetLetter, setTargetLetter] = useState("V");
  const [duration, setDuration] = useState(20); // 20 seconds

  const numberFinderRef = useRef<any>(null);
  const [numberRunning, setNumberRunning] = useState(false);
  const [numCorrect, setNumCorrect] = useState(0);
  const [numWrong, setNumWrong] = useState(0);

  const handleFinish = (stats: any) => {
    console.log("Exercise finished:", stats);
  };
  //
  const [pause, setPause] = useState(false);
  const [control, setControl] = useState({
    categorySelect: "",
    articleSelect: "",
    font: "16",
    level: 1,
    wordsPerFrame: 2,
    objectIcon: "1",
  });

  const currentMenu = menuItems.filter((m) =>
    m.subMenu?.some((s) => s.link.includes(pathname))
  );

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

  const saveProgress = async () => {
    try {
      await fetchData({
        apiPath: "/api/progress",
        method: "POST",
        payload: {
          studentId: session?.user?.student?.id,
          lessonId: lessonParams,
          exerciseId: exerciseParams,
        },
      });
    } catch (error) {
      console.error(error);
    }
  };
  if (pathname === "dogru-rengi-bul") {
    return (
      <Whiteboard
        pause={pause}
        control={control}
        description={
          <ControlPanelGuide
            howToPlay={
              eyeExerciseDescription[pathname]?.howToPlay ??
              "<p>Kategori ve makaleyi seçip  <span style='color:blue'>►</span>  butonuna basarak hız testine başlayın. Süre bitene kadar devam edin. Süre bitmeden makale biterse yeni bir makale seçerek okumaya devam edin. Yapmış olduğunuz hız testleri ile sistem, gelişiminizi takip edecektir.</p>"
            }
            description={
              eyeExerciseDescription[pathname]?.description ??
              "Doğru Rengi Bulma egzersizi. Ekranda gösterilen renk sözcüğünün rengini değerlendirip doğru/yanlış butonuna basın."
            }
          />
        }
        body={
          <div className="w-full">
            <div className="w-full">
              <FindTheColor
                ref={finderRef}
                level={level}
                running={running}
                onFinishTest={onFinishTest}
                onCorrect={() => setCorrect((c) => c + 1)}
                onWrong={() => setWrong((w) => w + 1)}
                onNewWord={() => {}}
              />
            </div>
          </div>
        }
        customControls={
          <ColorFinderControls
            onLevelChange={(lvl) => setLevel(lvl)}
            onPauseToggle={(r) => setRunning(r)}
            onCheck={(ans) => triggerCheck(ans)}
            correct={correct}
            wrong={wrong}
            running={running}
          />
        }
        onControlChange={handleControl}
        lessonData={{ id: lessonParams, duration: durationParams } as any}
        saveProgress={saveProgress}
      />
    );
  } else if (pathname === "dogru-sayiyi-bul") {
    return (
      <Whiteboard
        pause={pause}
        control={control}
        description={
          <ControlPanelGuide
            howToPlay={
              eyeExerciseDescription[pathname]?.howToPlay ??
              "<p>Kategori ve makaleyi seçip  <span style='color:blue'>►</span>  butonuna basarak hız testine başlayın. Süre bitene kadar devam edin. Süre bitmeden makale biterse yeni bir makale seçerek okumaya devam edin. Yapmış olduğunuz hız testleri ile sistem, gelişiminizi takip edecektir.</p>"
            }
            description={
              eyeExerciseDescription[pathname]?.description ??
              "Doğru Rengi Bulma egzersizi. Ekranda gösterilen renk sözcüğünün rengini değerlendirip doğru/yanlış butonuna basın."
            }
          />
        }
        body={
          <div className="w-full">
            <div className="w-full">
              <FindTheNumber
                ref={numberFinderRef}
                speed={speed}
                difficulty={difficulty}
                targetLetter={targetLetter}
                duration={duration}
                onFinish={handleFinish}
                onCorrect={() => setNumCorrect((c) => c + 1)}
                onWrong={() => setNumWrong((w) => w + 1)}
              />
            </div>
          </div>
        }
        customControls={
          <NumberFinderControls
            onSpeedChange={(ms) => setSpeed(ms)}
            onDifficultyChange={(d) => setDifficulty(d)}
            onTargetLetterChange={(s) => setTargetLetter(s)}
            onDurationChange={(n) => setDuration(n)}
            onPauseToggle={(r) => {
              setNumberRunning(r);
              if (r) numberFinderRef.current?.start();
              else numberFinderRef.current?.pause();
            }}
            onCheck={() => numberFinderRef.current?.check()}
            correct={numCorrect}
            wrong={numWrong}
            running={numberRunning}
          />
        }
        onControlChange={handleControl}
        lessonData={{ id: lessonParams, duration: durationParams } as any}
        saveProgress={saveProgress}
      />
    );
  } else {
    return (
      <Whiteboard
        pause={pause}
        description={
          <ControlPanelGuide
            description="Takistoskop çalışmasının en büyük kazanımı kelimeleri grup halde algılaya bilmektir. Bu edindiğimiz beceriyi metinler üzerinde uygulayabilmek için bloklama egzersizleri yapmak gerekmektedir. Bu egzersiz, göze metin üzerinde sıçrama noktalarını öğreterek, gözün metin üzerinde seri bir şekilde akmasını sağlar."
            howToPlay="<p>Alttaki araçlardan, kelime sayısı ve hız ayarlarını yapıp <span style='color:blue'>►</span> butonuna basarak uygulamayı başlatın. Karşınıza çıkan kelime veya kelime gruplarını okuyun. Süre bitene kadar uygulamaya devam edin.</p>"
          />
        }
        body={
          <RenderExercise
            onFinishTest={onFinishTest}
            controls={control}
            pathname={pathname}
            article={control.articleSelect as any}
          />
        }
        control={control}
        onControlChange={handleControl}
        lessonData={{ id: lessonParams, duration: durationParams } as any}
        contentClassName="!w-full"
        saveProgress={saveProgress}
      />
    );
  }
}
