"use client";

import { useEffect, useState } from "react";
import Select from "../formInputs/select";
import wood_img from "/public/images/wood.jpg";
import TextInput from "../formInputs/textInput";
import { useParams } from "next/navigation";
import {
  getArticleByCategoryId,
  getCategoryOptions,
} from "../formBuilder/request";
import { IconType } from "react-icons";
import { GrAchievement, GrAd, GrApple, GrBug } from "react-icons/gr";
import SliderBlock from "../formInputs/SliderBlock";
import SliderBlockWithColor from "../formInputs/SliderBlockWithColor";
import { color } from "framer-motion";

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
}

export const controlItems: any = {
  "ritmini-renklendirme": ["level", "object"],
  "siyah-beyaz": ["level"],
  "genis-bakis": ["level", "font"],
  "dortlu-kelimeler": ["level", "font"],
  "kelimelerin-dansi": ["level", "font"],
  "satir-arasi": ["level", "font"],
  "satir-basi-satir-sonu": ["level", "font"],
  "hizli-gorme": ["level", "font", "wordsPerFrame"],
  "kelimeler-1": ["level", "font"],
  "kelimeler-2": ["level", "font"],
  "kelimeler-3": ["level", "font"],
  "kelimeler-4": ["level", "font"],
  "kelimeler-5": ["level", "font"],
  "sayilar-1": ["level", "font"],
  "sayilar-2": ["level", "font"],
  "sayilar-3": ["level", "font"],
  "sayilar-4": ["level", "font"],
  "sayilar-5": ["level", "font"],
  "kayan-okuma": ["level", "font", "categorySelect", "articleSelect"],
  "hizli-okuma-testi": ["font", "categorySelect", "articleSelect"],
  "anlama-testi": ["font", "categorySelect", "articleSelect"],
  zigzag: ["level", "font"],
  okuma: ["categorySelect", "articleSelect", "wordsPerFrame", "level", "font"],
  "goz-kaslarini-gelistirme": ["symbol", "exercise", "level"],
  "aktif-gorme-alanini-genisletme": ["frame", "grid", "speed"],
  "aktif-gorme-alanini-genisletme-2": ["speed", "color"],
  "aktif-gorme-alanini-genisletme-3": ["speed", "perspectivecolor"],
  "metronom": ["speed", "size"],
  "satir-boyu-gorme-uygulamasi": ["distance", "letterCount", "speed", "scroll"],
  "goz-kaslari": ["level"],
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
}: ControlPanelProps) {
  const queryParams = useParams();
  const pathname = queryParams.slug;
  const controlItem = controlItems[pathname as any] || ["level"];
  const icons: IconType[] = [GrAd, GrApple, GrBug, GrAchievement, GrApple];
  const [IconComponent, setIconComponent] = useState<IconType>(() => icons[0]);

  useEffect(() => {
    const raw = controlVal?.symbol?.value;
    const index = Number(raw);

    if (!index || index < 1 || index > icons.length) {
      setIconComponent(() => icons[0]); // safe fallback
      return;
    }

    setIconComponent(() => icons[index - 1]);
  }, [controlVal?.symbol?.value]);
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
        (item) => item.id === targetValue
      );
      if (selectedArticle) {
        crtVal["articleSelect"].value = selectedArticle.id;
      }
    } else {
      // support checkboxes sending '1' or '0' or booleans
      crtVal[inputKey].value = targetValue;
    }

    setControlVal(crtVal);

    if (onControlChange) {
      onControlChange({
        font: crtVal.font.value,
        level: parseInt(crtVal.level.value),
        symbol: parseInt(crtVal.symbol.value),
        exercise: parseInt(crtVal.exercise.value),
        categorySelect: crtVal.categorySelect.value,
        articleSelect:
          articles &&
          [...articles].find(
            (item: { id: string }) => item.id === crtVal.articleSelect.value
          ),
        wordsPerFrame: parseInt(crtVal.wordsPerFrame.value),
        // NEW
        frame: parseInt(crtVal.frame?.value),
        grid: parseInt(crtVal.grid?.value),
        speed: parseInt(crtVal.speed?.value), // 1–10 slider
        color: parseInt(crtVal.color?.value),
        perspectivecolor: parseInt(crtVal.perspectivecolor?.value),
        // Eye specific
        object: parseInt(crtVal.object?.value),
        distance: parseInt(crtVal.distance?.value),
        letterCount: parseInt(crtVal.letterCount?.value),
        size: parseInt(crtVal.size?.value),
        scroll: crtVal.scroll?.value === "1" || crtVal.scroll?.value === true,
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

  return (
    <div className={`flex w-full flex-col ${className}`}>
      {controlItem.includes("categorySelect") ? (
        <div className="relative w-full overflow-hidden rounded-md border border-gray-400 min-h-[100px] mx-auto mb-1 flex items-center justify-center shadow-[0_2px_6px_rgba(0,0,0,0.3)]">
          <img
            src={wood_img.src}
            alt="Wood background"
            className="absolute inset-0 w-full h-full object-cover z-0 bg-[#a87349]"
          />

          <div className="absolute top-[8%] left-[2%] w-[96%] h-[82%] bg-gradient-to-r from-[#1D63F0] to-[#1AD7FD] px-5 py-1 z-[2] overflow-y-auto text-gray-800 rounded shadow-[inset_0_4px_10px_rgba(0,0,0,0.25)]">
            <div className="flex justify-between gap-4 flex-wrap items-center w-full">
              <div
                className={`flex-1 drop-shadow ${
                  !controlItem.includes("categorySelect") ? "hidden" : ""
                }`}
              >
                <Select
                  key={categoryOptions as any}
                  placeholder="Kategori Seçin"
                  options={categoryOptions}
                  name="Kategori Seçin"
                  value={controlVal.categorySelect}
                  onChange={handleChange}
                  inputKey="categorySelect"
                />
              </div>

              <div
                className={`flex-1 drop-shadow ${
                  !controlItem.includes("articleSelect") ? "hidden" : ""
                }`}
              >
                <Select
                  key={articleOptions as any}
                  placeholder="Metin Seçin"
                  options={articleOptions}
                  name="Metin Seçin"
                  value={controlVal.articleSelect}
                  onChange={handleChange}
                  inputKey="articleSelect"
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="relative w-full overflow-hidden rounded-md border border-gray-400 min-h-[110px] mx-auto mb-7 flex items-center justify-center shadow-[0_2px_6px_rgba(0,0,0,0.3)]">
        <img
          src={wood_img.src}
          alt="Wood background"
          className="absolute inset-0 w-full h-full object-cover z-0 bg-[#a87349]"
        />

        {/* <div className="absolute top-[8%] left-[2%] w-[96%] h-[82%] bg-gradient-to-r from-[#1D63F0] to-[#1AD7FD] px-5 py-2 z-[2] overflow-y-auto text-gray-800 rounded shadow-[inset_0_4px_10px_rgba(0,0,0,0.25)]"> */}
        <div
          className="
            absolute top-[8%] left-[2%] w-[96%] h-auto
            bg-gradient-to-r from-[#1D63F0] to-[#1AD7FD]
            px-5 py-2 z-[2]
            overflow-visible
            text-gray-800 rounded
            shadow-[inset_0_4px_10px_rgba(0,0,0,0.25)]
          "
        >
          <div className="flex justify-between gap-4 flex-wrap items-center w-full">
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
                max="5"
                required={false}
              />
            </div>

            <div
              className={`flex-1 drop-shadow ${
                !controlItem.includes("exercise") ? "hidden" : ""
              }`}
            >
              <TextInput
                key={controlVal.exercise}
                placeholder="egzersiz Tipi"
                type="range"
                value={controlVal.exercise}
                inputKey="exercise"
                name="Egzersiz Tipi"
                onChange={handleChange}
                min="1"
                max="5"
                required={false}
              />
            </div>

            <div
              className={`flex-1 drop-shadow ${
                !controlItem.includes("symbol") ? "hidden" : ""
              }`}
            >
              <div className="flex items-center gap-4">
                {/* 🔥 SYMBOL SLIDER */}
                <TextInput
                  key={controlVal.symbol}
                  placeholder="simge"
                  type="range"
                  value={controlVal.symbol}
                  inputKey="symbol"
                  name="simge"
                  onChange={handleChange}
                  min="1"
                  max="5"
                  required={false}
                />
                {/* 🔥 LIVE ICON PREVIEW */}
                <div className="w-10 h-10 flex items-center justify-center border rounded-lg bg-white shadow">
                  <IconComponent size={30} className="text-green-600" />
                </div>
              </div>
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
                min="12"
                max="32"
                required={false}
              />
            </div>

            {/* OBJECT SIZE (for rhythmic coloring, zigzag, etc) */}
            {controlItem.includes("object") && (
              <SliderBlock
                label="Nesne Boyutu"
                value={controlVal.object.value}
                description="Nesnenin piksel cinsinden boyutu"
                min="10"
                max="200"
                inputKey="object"
                onChange={handleChange}
              />
            )}

            {/* DISTANCE for split word mirror */}
            {controlItem.includes("distance") && (
              <SliderBlock
                label="Merkeze Uzaklık"
                value={controlVal.distance.value}
                description="Merkezden uzaklık (1-10)"
                min="1"
                max="10"
                inputKey="distance"
                onChange={handleChange}
              />
            )}

            {/* LETTER COUNT for split word mirror */}
            {controlItem.includes("letterCount") && (
              <SliderBlock
                label="Harf Sayısı"
                value={controlVal.letterCount.value}
                description="Görüntülenecek kelime uzunluğu"
                min="1"
                max="12"
                inputKey="letterCount"
                onChange={handleChange}
              />
            )}

            {/* SCROLL toggle */}
            {controlItem.includes("scroll") && (
              <div className="flex items-center gap-3 px-1">
                <label className="text-white font-medium">Kaydırma</label>
                <input
                  type="checkbox"
                  checked={
                    controlVal?.scroll?.value === "1" || controlVal?.scroll?.value === true
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
            )}

             {controlItem.includes("frame") && (
               <SliderBlock
                 label="Çerçeve Genişliği"
                 value={controlVal.frame.value}
                 description="Köşe noktalarının genişliği"
                 min="2"
                 max="10"
                 inputKey="frame"
                 onChange={handleChange}
               />
             )}

             {controlItem.includes("grid") && (
               <SliderBlock
                 label="Sütun Sayısı"
                 value={controlVal.grid.value}
                 description="Rakamlar kaç satır ve sütun gelsin"
                 min="2"
                 max="10"
                 inputKey="grid"
                 onChange={handleChange}
               />
             )}

             {controlItem.includes("speed") && (
               <SliderBlock
                 label={`Hız`}
                 value={controlVal.speed.value}
                 description="Rakamlar kaç saniyede bir değişsin"
                 min="1"
                 max="10"
                 inputKey="speed"
                 onChange={handleChange}
               />
             )}
             {controlItem.includes("color") && (
               <SliderBlockWithColor
                 label="Kutu Rengi"
                 value={controlVal.color.value}
                 description="Kendinize özel simge seçebilirsiniz"
                 min="1"
                 max="9"
                 inputKey="color"
                 onChange={handleChange}
                 colors={[
                   "#2ecc71",
                   "#f1c40f",
                   "#e74c3c",
                   "#3498db",
                   "#8B4513",
                   "#000000",
                   "#e67e22",
                   "#8e44ad",
                   "#ff69b4",
                 ]}
               />
             )}

             {controlItem.includes("perspectivecolor") && (
               <SliderBlockWithColor
                 label="Kutu Rengi"
                 value={controlVal.color.value}
                 min="1"
                 max="9"
                 inputKey="color"
                 onChange={handleChange}
                 colors={[
                   "#2ecc71", // 1 green
                   "#f1c40f", // 2 yellow
                   "#e74c3c", // 3 red
                   "#3498db", // 4 blue
                   "#8B4513", // 5 coffee
                   "#000000", // 6 black
                   "#e67e22", // 7 orange
                   "#8e44ad", // 8 purple
                   "#ff69b4", // 9 pink
                 ]}
               />
             )}
             {/* SIZE for metronome */}
             {controlItem.includes("size") && (
               <SliderBlock
                 label="Simge Boyutu"
                 value={controlVal.size.value}
                 description="Metronom göz simgesi boyutu"
                 min="20"
                 max="100"
                 inputKey="size"
                 onChange={handleChange}
               />
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
