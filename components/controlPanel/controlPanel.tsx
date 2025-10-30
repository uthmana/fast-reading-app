"use client";

import { useEffect, useState } from "react";
import Select from "../formInputs/select";
import wood_img from "/public/images/wood.jpg";
import TextInput from "../formInputs/textInput";
import { useParams } from "next/navigation";
import { fetchData } from "@/utils/fetchData";

interface ControlPanelProps {
  onControlChange?: (v: any) => void;
  controlVal?: any;
  setControlVal?: any;
  className?: string;
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
  "kayan-okuma": ["level", "font"],
  "hizli-okuma-testi": ["font", "categorySelect", "articleSelect"],
  "anlama-testi": ["font", "categorySelect", "articleSelect"],
  zigzag: ["level", "font"],
  okuma: ["categorySelect", "articleSelect", "wordsPerFrame", "level", "font"],
};

export default function ControlPanel({
  onControlChange,
  controlVal,
  setControlVal,
  className,
}: ControlPanelProps) {
  const queryParams = useParams();
  const pathname = queryParams.slug;
  const controlItem = controlItems[pathname as any] || ["level"];
  const [articles, setArticles] = useState([] as any);
  const [categoryOptions, setCategoryOptions] = useState([] as any);
  const [articleOptions, setArticleOptions] = useState([] as any);

  const handleChange: any = ({
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
      setArticleOptions(
        [...articles]
          .filter((item) => item.level === targetValue)
          ?.map((item) => {
            return { name: item.title, value: item.id };
          })
      );
    } else if (inputKey === "articleSelect") {
      const selectedArticle = [...articles].find(
        (item) => item.id === targetValue
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
        categorySelect: crtVal.categorySelect.value,
        articleSelect: [...articles].find(
          (item) => item.id === crtVal.articleSelect.value
        ),
        wordsPerFrame: parseInt(crtVal.wordsPerFrame.value),
      });
    }
  };

  useEffect(() => {
    if (!controlItem.includes("categorySelect")) return;
    const fetchArticles = async () => {
      try {
        const resData = await fetchData({
          apiPath: "/api/articles",
        });
        setArticles(resData);
        setCategoryOptions(
          resData.map((item: any) => {
            return { name: item.level, value: item.level };
          })
        );
        if (controlVal.articleSelect.value) {
          setArticleOptions(
            resData
              .filter((item: any) => item.id === controlVal.articleSelect.value)
              ?.map((item: any) => {
                return { name: item.title, value: item.id };
              })
          );
        }
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };

    fetchArticles();
  }, []);

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

        <div className="absolute top-[8%] left-[2%] w-[96%] h-[82%] bg-gradient-to-r from-[#1D63F0] to-[#1AD7FD] px-5 py-2 z-[2] overflow-y-auto text-gray-800 rounded shadow-[inset_0_4px_10px_rgba(0,0,0,0.25)]">
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
          </div>
        </div>
      </div>
    </div>
  );
}
