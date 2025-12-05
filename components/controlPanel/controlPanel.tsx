"use client";

import { useEffect, useRef } from "react";
import Select from "../formInputs/select";
import wood_img from "/public/images/wood.jpg";
import TextInput from "../formInputs/textInput";
import { useParams, useSearchParams } from "next/navigation";
import {
  getArticleByCategoryId,
  getCategoryOptions,
} from "../formBuilder/request";
import { MdSpeed, MdTitle } from "react-icons/md";
import { IoMdClock } from "react-icons/io";
import { speedMap } from "@/utils/constants";
import Button from "../button/button";
import { table } from "console";
import ActionButton from "../button/actionbutton";
import AnswerButton from "../button/actionbutton";

interface ControlPanelProps {
  onControlChange?: (v: any) => void;
  OnClick?: () => void;
  controlVal?: any;
  setControlVal?: any;
  className?: string;
  setIsLoading?: any;
  isLoading?: boolean;
  articles?: [];
  setArticles?: any;
  categoryOptions: [];
  setCategoryOptions?: any;
  articleOptions: [];
  setArticleOptions?: any;
  isfastTest?: boolean;
  readingStatus?: any;
}

export const controlItems: any = {
  "goz-kaslarini-gelistirme": ["level", "type", "objectIcon"],
  "aktif-gorme-alanini-genisletme-1": ["frame", "grid", "level"],
  "aktif-gorme-alanini-genisletme-2": ["level", "color"],
  "aktif-gorme-alanini-genisletme-3": ["level"],
  "satir-boyu-gorme-uygulamasi": ["distance", "letterCount", "level", "scroll"],
  "hizli-gorme": ["level", "font", "wordsPerFrame"],
  "goz-cevikligi-artirma": ["level", "font", "wordsPerFrame"],
  "seviye-yukselt": ["level", "font", "wordsPerFrame"],
  "hizli-okuma-testi": ["font", "categorySelect", "articleSelect"],
  "anlama-testi": ["font", "categorySelect", "articleSelect"],
  "silinmeden-okuma": [
    "categorySelect",
    "articleSelect",
    "wordsPerFrame",
    "level",
    "font",
  ],
  "silinerek-okuma": [
    "categorySelect",
    "articleSelect",
    "wordsPerFrame",
    "level",
    "font",
  ],
  "odakli-okuma": [
    "categorySelect",
    "articleSelect",
    "wordsPerFrame",
    "level",
    "font",
  ],
  "grup-okuma": [
    "categorySelect",
    "articleSelect",
    "wordsPerFrame",
    "level",
    "font",
  ],
  "dogru-rengi-bul": [
    "level",
    "displayCorrectAnswer",
    "diplayWrongAnswer",
    "displayNetAnswer",
    "checkCorrect",
  ],
  "dogru-kelimeyi-bil": [
    "levelWord",
    "displayCorrectAnswerWord",
    "diplayWrongAnswerWord",
    "displayNetAnswerWord",
    "checkCorrectWord",
    "difficultyWord",
  ],
  "dogru-sayiyi-bul": [
    "levelNumber",
    "difficultyNumber",
    "displayCorrectAnswerNumber",
    "diplayWrongAnswerNumber",
    "displayNetAnswerNumber",
    "userAnswerNumber",
    "checkCorrectNumber",
  ],
};

export default function ControlPanel({
  onControlChange,
  OnClick,

  controlVal,
  setControlVal,
  className,
  setIsLoading,
  articles,
  setArticles,
  categoryOptions,
  setCategoryOptions,
  articleOptions,
  setArticleOptions,
  isfastTest = false,
  readingStatus,
}: ControlPanelProps) {
  const queryParams = useParams();
  const pathname = queryParams.slug;
  const controlItem = controlItems[pathname as any] || ["level"];
  const searchParams = useSearchParams();
  const introTest = searchParams.get("intro-test");

  const handleChange: any = async ({
    targetValue,
    value,
    inputKey,
  }: {
    targetValue: string;
    value: string;
    inputKey: string;
  }) => {
    console.log("targetValue", targetValue, inputKey, value);
    let crtVal = { ...controlVal };
    if (inputKey === "categorySelect") {
      crtVal["categorySelect"].value = targetValue;
      crtVal["articleSelect"].value = "";

      try {
        setArticleOptions([]);
        setIsLoading(true);
        const articleRes = await getArticleByCategoryId(targetValue);
        setArticles(articleRes);

        setArticleOptions(
          [...articleRes]?.map((item) => {
            return { name: item.title, value: item.id };
          })
        );

        setIsLoading(false);
      } catch (error) {}
    } else if (inputKey === "articleSelect") {
      const selectedArticle = [...(articles as any)].find(
        (item) => item.id === parseInt(targetValue)
      );
      if (selectedArticle) {
        crtVal["articleSelect"].value = selectedArticle.id;
      }
    } else if (inputKey === "checkCorrect") {
      // Just pass through the button click - let the exercise component handle the logic
      if (!crtVal["checkCorrect"]) {
        crtVal["checkCorrect"] = {
          value: "",
          targetValue: false,
          inputKey: "",
        };
      }

      // Store the check values (exercise component will handle counter updates)
      crtVal["checkCorrect"].value = targetValue;
      crtVal["checkCorrect"].targetValue = targetValue;
      crtVal["checkCorrect"].inputKey = inputKey;

      console.log(
        "ControlPanel: checkCorrect button clicked, targetValue:",
        targetValue
      );
    } else if (inputKey === "checkCorrectWord") {
      // Just pass through the button click - let the exercise component handle the logic
      if (!crtVal["checkCorrectWord"]) {
        crtVal["checkCorrectWord"] = {
          value: "",
          targetValue: false,
          inputKey: "",
        };
      }

      // Store the check values (exercise component will handle counter updates)
      crtVal["checkCorrectWord"].value = targetValue;
      crtVal["checkCorrectWord"].targetValue = targetValue;
      crtVal["checkCorrectWord"].inputKey = inputKey;

      console.log(
        "ControlPanel: checkCorrectWord button clicked, targetValue:",
        targetValue
      );
    } else if (inputKey === "checkCorrectNumber") {
      // Just pass through the button click - let the exercise component handle the logic
      if (!crtVal["checkCorrectNumber"]) {
        crtVal["checkCorrectNumber"] = {
          value: "",
          targetValue: false,
          inputKey: "",
        };
      }

      // Store the check values (exercise component will handle counter updates)
      crtVal["checkCorrectNumber"].value = targetValue;
      crtVal["checkCorrectNumber"].targetValue = targetValue;
      crtVal["checkCorrectNumber"].inputKey = inputKey;

      console.log(
        "ControlPanel: checkCorrectNumber button clicked, targetValue:",
        targetValue
      );
    } else {
      if (!crtVal[inputKey]) {
        crtVal[inputKey] = { value: targetValue };
      } else {
        crtVal[inputKey].value = targetValue;
      }
      console.log(targetValue);
    }

    setControlVal(crtVal);

    if (onControlChange) {
      onControlChange({
        font: crtVal.font.value,
        level: parseInt(crtVal.level.value),
        objectIcon: crtVal.objectIcon.value,
        type: crtVal.type.value,
        categorySelect: crtVal.categorySelect.value,
        articleSelect:
          articles &&
          [...articles].find(
            (item: { id: string }) => item.id === crtVal.articleSelect.value
          ),
        wordsPerFrame: parseInt(crtVal.wordsPerFrame.value),
        frame: parseInt(crtVal.frame.value),
        grid: parseInt(crtVal.grid.value),
        color: parseInt(crtVal.color?.value),
        perspectivecolor: parseInt(crtVal.perspectivecolor?.value),
        distance: parseInt(crtVal.distance?.value),
        letterCount: parseInt(crtVal.letterCount?.value),
        size: parseInt(crtVal.size?.value),
        scroll: crtVal.scroll?.value === "1" || crtVal.scroll?.value === true,
        checkCorrect: {
          value: crtVal.checkCorrect?.value || "",
          targetValue: crtVal.checkCorrect?.targetValue || false,
          inputKey: crtVal.checkCorrect?.inputKey || "",
        },
        displayCorrectAnswer: crtVal.displayCorrectAnswer?.value || "0",
        diplayWrongAnswer: crtVal.diplayWrongAnswer?.value || "0",
        displayNetAnswer: crtVal.displayNetAnswer?.value || "0",
        // For FindTheWord exercise
        levelWord: parseInt(crtVal.levelWord?.value),
        displayCorrectAnswerWord: crtVal.displayCorrectAnswerWord?.value || "0",
        diplayWrongAnswerWord: crtVal.diplayWrongAnswerWord?.value || "0",
        displayNetAnswerWord: crtVal.displayNetAnswerWord?.value || "0",
        checkCorrectWord: {
          value: crtVal.checkCorrectWord?.value || "",
          targetValue: crtVal.checkCorrectWord?.targetValue || false,
          inputKey: crtVal.checkCorrectWord?.inputKey || "",
        },
        difficultyWord: crtVal.difficultyWord?.value || "",
        // For FindTheNumber exercise
        levelNumber: parseInt(crtVal.levelNumber?.value),
        difficultyNumber: parseInt(crtVal.difficultyNumber?.value),
        displayCorrectAnswerNumber:
          crtVal.displayCorrectAnswerNumber?.value || "0",
        diplayWrongAnswerNumber: crtVal.diplayWrongAnswerNumber?.value || "0",
        displayNetAnswerNumber: crtVal.displayNetAnswerNumber?.value || "0",
        userAnswerNumber: crtVal.userAnswerNumber?.value || "",
        checkCorrectNumber: {
          value: crtVal.checkCorrectNumber?.value || "",
          targetValue: crtVal.checkCorrectNumber?.targetValue || false,
          inputKey: crtVal.checkCorrectNumber?.inputKey || "",
        },
      });
    }
  };

  useEffect(() => {
    if (!controlItem.includes("categorySelect")) return;
    const fetchCategory = async () => {
      if (categoryOptions.length) return;
      try {
        setIsLoading(true);
        const opts = await getCategoryOptions();
        setCategoryOptions(opts);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCategory();
  }, [categoryOptions]);

  const controlBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const controlBar = controlBarRef.current;
    if (controlBar) {
      controlBar.style.height = "auto"; // reset height
      controlBar.style.height = controlBar.scrollHeight - 32 + "px !important"; // adjust to content
    }
  }, [controlVal]);

  const handleClick = () => {
    if (OnClick) {
      OnClick();
    }
  };
  return (
    <div className={`flex w-full flex-col ${className}`}>
      {controlItem.includes("categorySelect") ? (
        <div className="relative w-full overflow-hidden rounded-md border border-gray-400 lg:min-h-[84px] min-h-[124px] mx-auto flex items-center justify-center shadow-[0_2px_6px_rgba(0,0,0,0.3)]">
          <img
            src={wood_img.src}
            alt="Wood background"
            className="absolute inset-0 w-full h-full object-cover z-0 bg-[#a87349]"
          />

          <div className="absolute top-2 left-2 w-[calc(100%-16px)] h-[calc(100%-16px)]  bg-[#1AD7FD] px-5 py-1 z-[2] overflow-y-auto text-gray-800 rounded shadow-[inset_0_4px_10px_rgba(0,0,0,0.25)]">
            <div className="flex py-2 justify-between lg:gap-4 flex-wrap lg:flex-nowrap items-center w-full">
              <div
                className={`lg:flex-1 w-full drop-shadow ${
                  !controlItem.includes("categorySelect") ? "hidden" : ""
                }`}
              >
                <Select
                  key={categoryOptions as any}
                  placeholder="Makale Kategorisi Seçiniz"
                  options={categoryOptions}
                  name="Makale Kategorisi Seçiniz"
                  value={controlVal.categorySelect}
                  onChange={handleChange}
                  inputKey="categorySelect"
                  styleClass="!mb-0"
                  showLabel={false}
                  disabled={introTest ? true : false}
                />
              </div>

              <div
                className={`lg:flex-1 w-full drop-shadow ${
                  !controlItem.includes("articleSelect") ? "hidden" : ""
                }`}
              >
                <Select
                  key={articleOptions as any}
                  placeholder="Makale Seçebilmek için Önce Kategori Seçmelisiniz"
                  options={articleOptions}
                  name="Metin Seçin"
                  value={controlVal.articleSelect}
                  onChange={handleChange}
                  inputKey="articleSelect"
                  styleClass="!mb-0"
                  showLabel={false}
                  disabled={introTest ? true : false}
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="relative w-full overflow-hidden rounded-md border border-gray-400  min-h-[138px] mx-auto flex items-center justify-center shadow-[0_2px_6px_rgba(0,0,0,0.3)]">
        <img
          src={wood_img.src}
          alt="Wood background"
          className="absolute inset-0 w-full h-full object-cover z-0 bg-[#a87349]"
        />
        <div className="absolute  left-2 w-[calc(100%-16px)]  h-[calc(100%-16px)]  bg-[#1AD7FD] px-5 py-2 z-[2] overflow-y-auto text-gray-800 rounded shadow-[inset_0_4px_10px_rgba(0,0,0,0.25)]">
          <div className="flex justify-between gap-4 flex-wrap items-start w-full">
            <div
              className={`flex-1 drop-shadow ${
                !controlItem.includes("wordsPerFrame") ? "hidden" : ""
              }`}
            >
              <TextInput
                key={controlVal.wordsPerFrame}
                placeholder="Kelime sayısı"
                type="range"
                value={controlVal.wordsPerFrame}
                inputKey="wordsPerFrame"
                name="Kelime sayısı"
                onChange={handleChange}
                min="1"
                max="5"
                required={false}
                styleClass="mb-0"
                description="Yükselttikçe aynı anda görebileceğiniz kelime sayısı artar."
              />
            </div>
            <div
              className={`flex-1 drop-shadow ${
                !controlItem.includes("level") ? "hidden" : ""
              }`}
            >
              <TextInput
                key={controlVal.level}
                placeholder="Hız"
                type="range"
                value={controlVal.level}
                inputKey="level"
                name="Hız"
                onChange={handleChange}
                min="1"
                max="10"
                required={false}
                valueMap={speedMap}
                styleClass="mb-0"
                description="Nesnenin hareket hızı"
              />
            </div>
            <div
              className={`flex-1 drop-shadow ${
                !controlItem.includes("font") ? "hidden" : ""
              }`}
            >
              <TextInput
                key={controlVal.font}
                placeholder="Font"
                type="range"
                value={controlVal.font}
                inputKey="font"
                name="Font"
                onChange={handleChange}
                min="16"
                max="32"
                step="2"
                required={false}
                styleClass="mb-0"
                description="Yazı karekterinin büyüklüğü, okuma zorluğu çekiyorsanız büyütün"
              />
            </div>
            <div
              className={`flex-1 drop-shadow ${
                !controlItem.includes("type") ? "hidden" : ""
              }`}
            >
              <TextInput
                key={controlVal.type}
                placeholder="Egzersiz Tipi "
                type="range"
                value={controlVal.type}
                inputKey="type"
                name="Egzersiz Tipi"
                onChange={handleChange}
                min="1"
                max="6"
                required={false}
                styleClass="mb-0"
                description="Nesne ne yönde nasıl kayacak"
              />
            </div>
            <div
              className={`flex-1 drop-shadow ${
                !controlItem.includes("objectIcon") ? "hidden" : ""
              }`}
            >
              <TextInput
                key={controlVal.objectIcon}
                placeholder="Simge"
                type="range"
                value={controlVal.objectIcon}
                inputKey="objectIcon"
                name="Simge"
                onChange={handleChange}
                min="1"
                max="9"
                required={false}
                showRangeIcon={true}
                styleClass="mb-0"
                description="Kendinize özel simge seçebilirsiniz"
              />
            </div>
            <div
              className={`flex-1 drop-shadow ${
                !controlItem.includes("frame") ? "hidden" : ""
              }`}
            >
              <TextInput
                key={controlVal.frame}
                placeholder="Çerçeve Genişliği"
                type="range"
                value={controlVal.frame}
                inputKey="frame"
                name="Çerçeve Genişliği"
                onChange={handleChange}
                description="Köşe noktalarının genişliği"
                min="2"
                max="10"
              />
            </div>
            <div
              className={`flex-1 drop-shadow ${
                !controlItem.includes("grid") ? "hidden" : ""
              }`}
            >
              <TextInput
                key={controlVal.grid}
                placeholder="Sütun Sayısı"
                type="range"
                value={controlVal.grid}
                inputKey="grid"
                name="Sütun Sayısı"
                onChange={handleChange}
                description="Rakamlar kaç satır ve sütun gelsin"
                min="2"
                max="10"
              />
            </div>
            <div
              className={`flex-1 drop-shadow ${
                !controlItem.includes("color") ? "hidden" : ""
              }`}
            >
              <TextInput
                key={controlVal.color}
                placeholder="Kutu Rengi"
                type="range"
                name="Kutu Rengi"
                value={controlVal.color}
                inputKey="color"
                description="Sürükleyeen kutunun rengini değiştirin"
                min="1"
                max="9"
                onChange={handleChange}
                showRangeColor={true}
                colorList={{
                  "1": "#2ecc71",
                  "2": "#f1c40f",
                  "3": "#e74c3c",
                  "4": "#3498db",
                  "5": "#8B4513",
                  "6": "#000000",
                  "7": "#e67e22",
                  "8": "#8e44ad",
                  "9": "#ff69b4",
                }}
              />
            </div>
            <div
              className={`flex-1 drop-shadow ${
                !controlItem.includes("perspectivecolor") ? "hidden" : ""
              }`}
            >
              <TextInput
                key={controlVal.perspectivecolor}
                name="Kutu Rengi"
                value={controlVal.perspectivecolor}
                min="1"
                max="9"
                type="range"
                inputKey="perspectivecolor"
                onChange={handleChange}
                showRangeColor={true}
                colorList={{
                  "1": "#2ecc71", // 1 green
                  "2": "#f1c40f", // 2 yellow
                  "3": "#e74c3c", // 3 red
                  "4": "#3498db", // 4 blue
                  "5": "#8B4513", // 5 coffee
                  "6": "#000000", // 6 black
                  "7": "#e67e22", // 7 orange
                  "8": "#8e44ad", // 8 purple
                  "9": "#ff69b4", // 9 pink
                }}
                description="Sürükleyen kutunun rengini değiştirin"
              />
            </div>
            <div
              className={`flex-1 drop-shadow ${
                !controlItem.includes("distance") ? "hidden" : ""
              }`}
            >
              <TextInput
                key={controlVal.distance}
                placeholder="Merkeze Uzaklık"
                type="range"
                value={controlVal.distance}
                inputKey="distance"
                name="Merkeze Uzaklık"
                onChange={handleChange}
                description="İki kelimenin merkeze uzaklığı"
                min="1"
                max="10"
              />
            </div>
            <div
              className={`flex-1 drop-shadow ${
                !controlItem.includes("letterCount") ? "hidden" : ""
              }`}
            >
              <TextInput
                key={controlVal.letterCount}
                placeholder="Harf Sayısı"
                type="range"
                value={controlVal.letterCount}
                inputKey="letterCount"
                name="Harf Sayısı"
                onChange={handleChange}
                description="Metindeki harf sayısı"
                min="1"
                max="10"
              />
            </div>
            <div className="flex-1 flex gap-2">
              <div
                className={`flex-1 drop-shadow ${
                  !controlItem.includes("displayNetAnswer") ? "hidden" : ""
                }`}
              >
                <TextInput
                  key={controlVal.displayNetAnswer}
                  type="text"
                  value={controlVal.displayNetAnswer}
                  inputKey="displayNetAnswer"
                  onChange={handleChange}
                  name="Net"
                />
              </div>
              <div
                className={`flex-1 drop-shadow ${
                  !controlItem.includes("diplayWrongAnswer") ? "hidden" : ""
                }`}
              >
                <TextInput
                  key={controlVal.diplayWrongAnswer}
                  type="text"
                  value={controlVal.diplayWrongAnswer}
                  inputKey="diplayWrongAnswer"
                  name="Yanlış "
                  onChange={handleChange}
                />
              </div>
              <div
                className={`flex-1 drop-shadow ${
                  !controlItem.includes("displayCorrectAnswer") ? "hidden" : ""
                }`}
              >
                <TextInput
                  key={controlVal.displayCorrectAnswer}
                  type="text"
                  value={controlVal.displayCorrectAnswer}
                  inputKey="displayCorrectAnswer"
                  name="Doğru"
                  onChange={handleChange}
                />
              </div>

              <div
                className={`flex-1 drop-shadow ${
                  !controlItem.includes("checkCorrect") ? "hidden" : ""
                }`}
              >
                <AnswerButton
                  styleClass="bg-"
                  inputKey="checkCorrect"
                  onChange={handleChange}
                  buttonNames={{ correct: "Doğru", wrong: "Yanlış" }}
                />
              </div>
            </div>
            {/* FindTheWord - Single Row Layout */}
            <div className="w-full flex gap-2 justify-between items-end">
              {/* Speed */}
              <div
                className={`flex-1 drop-shadow ${
                  !controlItem.includes("levelWord") ? "hidden" : ""
                }`}
              >
                <TextInput
                  key={controlVal.levelWord}
                  placeholder="Hız"
                  type="range"
                  value={controlVal.levelWord}
                  inputKey="levelWord"
                  name="Hız"
                  onChange={handleChange}
                  min="1"
                  max="10"
                  required={false}
                  valueMap={speedMap}
                  styleClass="mb-0"
                  description="Gösterim Hızı"
                />
              </div>

              {/* Difficulty */}
              <div
                className={`flex-1 drop-shadow ${
                  !controlItem.includes("difficultyWord") ? "hidden" : ""
                }`}
              >
                <TextInput
                  key={controlVal.difficultyWord}
                  placeholder="Zorluk"
                  type="range"
                  value={controlVal.difficultyWord}
                  inputKey="difficultyWord"
                  name="Zorluk"
                  onChange={handleChange}
                  min="2"
                  max="6"
                  required={false}
                  styleClass="mb-0"
                  description="Zorluk Durumu"
                />
              </div>

              {/* Correct Counter */}
              <div
                className={`flex-1 drop-shadow ${
                  !controlItem.includes("displayCorrectAnswerWord")
                    ? "hidden"
                    : ""
                }`}
              >
                <TextInput
                  key={controlVal.displayCorrectAnswerWord}
                  type="text"
                  value={controlVal.displayCorrectAnswerWord}
                  inputKey="displayCorrectAnswerWord"
                  name="Doğru"
                  onChange={handleChange}
                  styleClass="mb-0"
                />
              </div>

              {/* Wrong Counter */}
              <div
                className={`flex-1 drop-shadow ${
                  !controlItem.includes("diplayWrongAnswerWord") ? "hidden" : ""
                }`}
              >
                <TextInput
                  key={controlVal.diplayWrongAnswerWord}
                  type="text"
                  value={controlVal.diplayWrongAnswerWord}
                  inputKey="diplayWrongAnswerWord"
                  name="Yanlış"
                  onChange={handleChange}
                  styleClass="mb-0"
                />
              </div>

              {/* Net Counter */}
              <div
                className={`flex-1 drop-shadow ${
                  !controlItem.includes("displayNetAnswerWord") ? "hidden" : ""
                }`}
              >
                <TextInput
                  key={controlVal.displayNetAnswerWord}
                  type="text"
                  value={controlVal.displayNetAnswerWord}
                  inputKey="displayNetAnswerWord"
                  onChange={handleChange}
                  name="Net"
                  styleClass="mb-0"
                />
              </div>

              {/* Answer Buttons */}
              <div
                className={`flex-1 drop-shadow ${
                  !controlItem.includes("checkCorrectWord") ? "hidden" : ""
                }`}
              >
                <AnswerButton
                  styleClass="mb-0"
                  inputKey="checkCorrectWord"
                  onChange={handleChange}
                  buttonNames={{ correct: "Aynı", wrong: "Farklı" }}
                />
              </div>
            </div>

            {/* FindTheNumber - Single Row Layout */}
            <div className="w-full flex gap-2 justify-between items-end">
              {/* Speed */}
              <div
                className={`flex-1 drop-shadow ${
                  !controlItem.includes("levelNumber") ? "hidden" : ""
                }`}
              >
                <TextInput
                  key={controlVal.levelNumber}
                  placeholder="Hız"
                  type="range"
                  value={controlVal.levelNumber}
                  inputKey="levelNumber"
                  name="Hız"
                  onChange={handleChange}
                  min="1"
                  max="10"
                  required={false}
                  valueMap={speedMap}
                  styleClass="mb-0"
                  description="Gösterim Hızı"
                />
              </div>

              {/* Difficulty */}
              <div
                className={`flex-1 drop-shadow ${
                  !controlItem.includes("difficultyNumber") ? "hidden" : ""
                }`}
              >
                <TextInput
                  key={controlVal.difficultyNumber}
                  placeholder="Zorluk"
                  type="range"
                  value={controlVal.difficultyNumber}
                  inputKey="difficultyNumber"
                  name="Zorluk"
                  onChange={handleChange}
                  min="5"
                  max="10"
                  required={false}
                  styleClass="mb-0"
                  description="Karakter Sayısı"
                />
              </div>

              {/* Correct Counter */}
              <div
                className={`flex-1 drop-shadow ${
                  !controlItem.includes("displayCorrectAnswerNumber")
                    ? "hidden"
                    : ""
                }`}
              >
                <TextInput
                  key={
                    typeof controlVal.displayCorrectAnswerNumber === "object"
                      ? controlVal.displayCorrectAnswerNumber.value ?? "0"
                      : controlVal.displayCorrectAnswerNumber ?? "0"
                  }
                  type="text"
                  value={
                    typeof controlVal.displayCorrectAnswerNumber === "object"
                      ? controlVal.displayCorrectAnswerNumber.value ?? "0"
                      : controlVal.displayCorrectAnswerNumber ?? "0"
                  }
                  inputKey="displayCorrectAnswerNumber"
                  name="Doğru"
                  onChange={handleChange}
                  styleClass="mb-0"
                />
              </div>

              {/* Wrong Counter */}
              <div
                className={`flex-1 drop-shadow ${
                  !controlItem.includes("diplayWrongAnswerNumber")
                    ? "hidden"
                    : ""
                }`}
              >
                <TextInput
                  key={controlVal.diplayWrongAnswerNumber}
                  type="text"
                  value={controlVal.diplayWrongAnswerNumber}
                  inputKey="diplayWrongAnswerNumber"
                  name="Yanlış"
                  onChange={handleChange}
                  styleClass="mb-0"
                />
              </div>

              {/* Net Counter */}
              <div
                className={`flex-1 drop-shadow ${
                  !controlItem.includes("displayNetAnswerNumber")
                    ? "hidden"
                    : ""
                }`}
              >
                <TextInput
                  key={controlVal.displayNetAnswerNumber}
                  type="text"
                  value={controlVal.displayNetAnswerNumber}
                  inputKey="displayNetAnswerNumber"
                  onChange={handleChange}
                  name="Net"
                  styleClass="mb-0"
                />
              </div>

              {/* User Answer Input */}
              <div
                className={`flex-1 drop-shadow ${
                  !controlItem.includes("userAnswerNumber") ? "hidden" : ""
                }`}
              >
                <TextInput
                  key={controlVal.userAnswerNumber}
                  type="number"
                  value={controlVal.userAnswerNumber}
                  inputKey="userAnswerNumber"
                  name="Cevap"
                  placeholder="Sayı girin"
                  onChange={handleChange}
                  styleClass="mb-0"
                />
              </div>

              {/* Check Button */}
              <div
                className={`flex-1 drop-shadow ${
                  !controlItem.includes("checkCorrectNumber") ? "hidden" : ""
                }`}
              >
                <button
                  type="button"
                  onClick={() =>
                    handleChange({
                      targetValue: true,
                      value: controlVal.userAnswerNumber,
                      inputKey: "checkCorrectNumber",
                    })
                  }
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold h-12 px-4 rounded shadow-md transition-colors duration-200"
                >
                  Doğrula
                </button>
              </div>
            </div>

            <div
              className={`flex-1 drop-shadow ${
                !controlItem.includes("scroll") ? "hidden" : ""
              }`}
            >
              <div className="flex w-full items-center gap-3 px-1">
                <label className="text-white font-medium">Kaydırma</label>
                <input
                  type="checkbox"
                  checked={
                    controlVal?.scroll?.value === "1" ||
                    controlVal?.scroll?.value === true
                  }
                  onChange={(e) =>
                    handleChange({
                      targetValue: e.target.checked ? "1" : "0",
                      value: controlVal.scroll,
                      inputKey: "scroll",
                    })
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {isfastTest ? (
        <div className="relative w-full overflow-hidden rounded-md border border-gray-400  min-h-[100px] mx-auto flex items-center justify-center shadow-[0_2px_6px_rgba(0,0,0,0.3)]">
          <img
            src={wood_img.src}
            alt="Wood background"
            className="absolute inset-0 w-full h-full object-cover z-0 bg-[#a87349]"
          />

          <div className="absolute  left-2 w-[calc(100%-16px)]  h-[calc(100%-16px)] bg-[#1AD7FD] px-5 py-2 z-[2] overflow-y-auto text-gray-800 rounded shadow-[inset_0_4px_10px_rgba(0,0,0,0.25)]">
            <div className="flex justify-between gap-2 items-center w-full h-full">
              <div className="flex text-sm flex-col justify-center items-center gap-1">
                <IoMdClock className="text-white mx-auto w-7 h-7" />
                <div className="font-semibold">
                  Okuma Süresi :
                  <span className="font-normal">
                    {" "}
                    {readingStatus?.counter}{" "}
                  </span>
                  sn
                </div>
              </div>
              <div className="flex text-sm flex-col justify-center items-center gap-1">
                <MdTitle className="text-white w-7 h-7 underline" />
                <div className="font-semibold">
                  Metindeki Kelime Sayısı :
                  <span className="font-normal">
                    {" "}
                    {readingStatus?.totalWords} adet
                  </span>
                </div>
              </div>
              <div className="flex text-sm flex-col justify-center items-center gap-1">
                <MdSpeed className="text-white w-7 h-7" />
                <div className="font-semibold">
                  Okuma Hızı :
                  <span className="font-normal">
                    {" "}
                    Dakikada {readingStatus?.wpm} kelime
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
