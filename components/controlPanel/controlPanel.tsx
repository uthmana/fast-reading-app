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

interface ControlPanelProps {
  onControlChange?: (v: any) => void;
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
  resultDisplay?: {
    right: number;
    wrong: number;
    net: number;
  };
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

  "dogru-rengi-bul": ["level", "resultDisplay"],
  "dogru-kelimeyi-bil": ["level", "difficultyLevel", "resultDisplay"],
  "dogru-sayiyi-bul": ["level", "difficultyLevel", "resultDisplay"],

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
};

export default function ControlPanel({
  onControlChange,
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
  resultDisplay,
}: ControlPanelProps) {
  const queryParams = useParams();
  const pathname = queryParams.slug;
  const controlItem = controlItems[pathname as any] || ["level"];
  const searchParams = useSearchParams();
  const introTest = searchParams.get("intro-test");
  const isTestSlug =
    pathname === "hizli-okuma-testi" || pathname === "anlama-testi";

  const handleChange: any = async ({
    targetValue,
    value,
    inputKey,
  }: {
    targetValue: string;
    value: string;
    inputKey: string;
  }) => {
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
    } else {
      crtVal[inputKey].value = targetValue;
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
        difficultyLevel: parseInt(crtVal.difficultyLevel.value),
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

  return (
    <div className={`flex w-full flex-col ${className}`}>
      {controlItem.includes("categorySelect") ? (
        <div
          className={`relative w-full overflow-hidden rounded-md border border-gray-400 min-h-[84px] mx-auto flex items-center justify-center shadow-[0_2px_6px_rgba(0,0,0,0.3)]`}
        >
          <img
            src={wood_img.src}
            alt="Wood background"
            className="absolute inset-0 w-full h-full object-cover z-0 bg-[#a87349]"
          />

          <div className="absolute top-2 left-2 w-[calc(100%-16px)] h-[calc(100%-16px)] bg-[#064d49]  bg-[url('/images/green-paint.jpg')] bg-no-repeat bg-cover bg-center px-5 py-1 z-[2] overflow-y-auto text-gray-800 rounded shadow-[inset_0_4px_10px_rgba(0,0,0,0.25)]">
            <div className="flex gap-2 py-2 justify-between lg:gap-4 flex-wrap lg:flex-nowrap items-center w-full">
              <div
                className={`flex-1 drop-shadow ${
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
                className={`flex-1 drop-shadow ${
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

              {isTestSlug ? (
                <div
                  className={`flex-1 drop-shadow text-white ${
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
                    styleClass="pb-8 h-4"
                  />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      {!isTestSlug ? (
        <div className="relative w-full overflow-hidden rounded-md border border-gray-400  min-h-[138px] mx-auto flex items-center justify-center shadow-[0_2px_6px_rgba(0,0,0,0.3)]">
          <img
            src={wood_img.src}
            alt="Wood background"
            className="absolute inset-0 w-full h-full object-cover z-0 bg-[#a87349]"
          />
          <div className="absolute  left-2 w-[calc(100%-16px)]  h-[calc(100%-16px)] bg-[#064d49]  bg-[url('/images/green-paint.jpg')] bg-no-repeat bg-cover bg-center px-5 py-2 z-[2] overflow-y-auto text-gray-800 rounded shadow-[inset_0_4px_10px_rgba(0,0,0,0.25)]">
            <div className="flex text-white justify-between gap-4 flex-wrap items-start w-full">
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
                  min="3"
                  max="10"
                />
              </div>
              <div
                className={`flex-1 drop-shadow ${
                  !controlItem.includes("scroll") ? "hidden" : ""
                }`}
              >
                <div className="flex w-full text-center flex-col items-center pt-3 gap-3 px-1">
                  <label className="text-white font-medium text-sm items-center whitespace-nowrap">
                    Kaydırma
                    <input
                      className="ml-2"
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
                  </label>
                  <span className="text-xs text-center lg:text-left">
                    Kelime yukarıdan aşağıya kaysın mı?
                  </span>
                </div>
              </div>

              <div
                className={`flex-1 drop-shadow ${
                  !controlItem.includes("difficultyLevel") ? "hidden" : ""
                }`}
              >
                <TextInput
                  key={controlVal.difficultyLevel}
                  placeholder="Zorluk"
                  type="range"
                  value={controlVal.difficultyLevel}
                  inputKey="difficultyLevel"
                  name="Zorluk"
                  onChange={handleChange}
                  min="1"
                  max="6"
                  description="Zorluk durumu"
                />
              </div>

              <div
                className={`flex-1 drop-shadow flex justify-center  ${
                  !controlItem.includes("resultDisplay") ? "hidden" : ""
                }`}
              >
                <div
                  key={resultDisplay as any}
                  className="flex w-fit h-full items-center gap-3"
                >
                  <div className="flex flex-col justify-center items-center">
                    <label className="text-sm font-semibold">Doğru</label>
                    <div className="w-7 h-8 border text-sm rounded-sm bg-white text-black flex justify-center items-center">
                      {resultDisplay?.right || 0}
                    </div>
                  </div>
                  <div className="flex flex-col justify-center items-center">
                    <label className="text-sm font-semibold">Yanlış</label>
                    <div className="w-7 h-8 border text-sm rounded-sm bg-white text-black flex justify-center items-center">
                      {resultDisplay?.wrong || 0}
                    </div>
                  </div>
                  <div className="flex flex-col justify-center items-center">
                    <label className="text-sm font-semibold">Net</label>
                    <div className="w-7 h-8 border text-sm rounded-sm bg-white text-black flex justify-center items-center">
                      {resultDisplay?.net || 0}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {isfastTest ? (
        <div className="relative w-full overflow-hidden rounded-md border border-gray-400  min-h-[84px] mx-auto flex items-center justify-center shadow-[0_2px_6px_rgba(0,0,0,0.3)]">
          <img
            src={wood_img.src}
            alt="Wood background"
            className="absolute inset-0 w-full h-full object-cover z-0 bg-[#a87349]"
          />

          <div className="absolute  left-2 w-[calc(100%-16px)]  h-[calc(100%-16px)] bg-[#064d49]  bg-[url('/images/green-paint.jpg')] bg-no-repeat bg-cover bg-center px-5 py-2 z-[2] overflow-y-auto text-gray-800 rounded shadow-[inset_0_4px_10px_rgba(0,0,0,0.25)]">
            <div className="flex justify-between text-white gap-2 items-center w-full h-full">
              <div className="flex text-sm flex-col justify-center items-center gap-1">
                <IoMdClock className="text-white mx-auto w-8 h-8" />
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
                <MdTitle className="text-white w-8 h-8" />
                <div className="font-semibold">
                  Metindeki Kelime Sayısı :
                  <span className="font-normal">
                    {" "}
                    {readingStatus?.totalWords} adet
                  </span>
                </div>
              </div>
              <div className="flex text-sm flex-col justify-center items-center gap-1">
                <MdSpeed className="text-white w-8 h-8" />
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
