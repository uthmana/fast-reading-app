"use client";

import { useState, ReactElement } from "react";
import { MdPauseCircle, MdPlayCircle } from "react-icons/md";
import Button from "@/components/button/button";
import Select from "../formInputs/select";
import wood_img from "/public/images/wood.jpg";
import Timer from "../timer/timer";

type PlayValues = {
  speed: string;
  start: boolean;
  value: string;
  counter?: number;
  article?: any;
};

interface WhiteboardProps {
  body: ReactElement;
  description: ReactElement;
  articles?: any;
  options?: any;
  isTest?: boolean;
  onFinishTest?: (params: PlayValues) => void;
}

export default function Whiteboard({
  body,
  description,
  options = [],
  onFinishTest,
  articles = [],
  isTest = false,
}: WhiteboardProps) {
  const [speed, setSpeed] = useState("1");
  const [isPlaying, setIsPlaying] = useState(false);
  const [value, setValue] = useState(options[0] ?? "");
  const speedList = ["1", "2", "3", "4", "5"];
  const [counter, setCounter] = useState(0);
  const [selectedArticle, setSelectedArticle] = useState(
    articles || (null as any)
  );

  const handlePlay = () => {
    if (articles.length) {
      const randomArticle =
        articles[Math.floor(Math.random() * articles.length)];
      setSelectedArticle(randomArticle);
    }

    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
    if (onFinishTest) {
      onFinishTest({
        speed,
        start: false,
        value,
        counter,
        article: selectedArticle,
      });
    }
  };

  const handleChange = ({ targetValue }: { targetValue: string }) => {
    if (articles) {
      setSelectedArticle(
        [...articles]?.find((article) => article.id === targetValue)
      );
    }
    setValue(targetValue);
  };

  return (
    <div className="flex flex-col py-7 px-5">
      {/* Whiteboard preview */}
      <div className="relative w-full overflow-hidden rounded-md border border-gray-400 min-h-[460px] mx-auto mb-7 flex items-center justify-center shadow-[0_2px_6px_rgba(0,0,0,0.3)]">
        <img
          src={wood_img.src}
          alt="Wood background"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />

        <div className="absolute top-[3%] left-[2%] w-[96%] h-[94%] bg-white px-5 py-4 z-[2] overflow-y-auto text-gray-800 rounded shadow-[inset_0_4px_10px_rgba(0,0,0,0.25)]">
          {description}
        </div>
      </div>

      {/* Fullscreen reading overlay */}
      {isPlaying && (
        <div className="fixed inset-0 bg-black/90 flex flex-col items-center justify-center z-[60]">
          <div className="relative w-[80%] min-h-[80%] mx-auto my-5 overflow-hidden rounded-3xl border border-black flex items-center justify-center shadow-[0_2px_6px_rgba(0,0,0,0.3)]">
            <img
              src={wood_img.src}
              alt="Wood background"
              className="absolute inset-0 w-full h-full object-cover z-0"
            />
            <div className="absolute top-[3%] left-[2%] w-[96%] h-[94%] px-6 py-4 bg-white text-base rounded overflow-y-auto z-[2] shadow-[inset_0_4px_10px_rgba(0,0,0,0.25)]">
              {isTest ? (
                <div className="w-full text-right sticky top-0">
                  <Timer onValue={(v) => setCounter(v)} start={isPlaying} />
                </div>
              ) : null}
              {selectedArticle ? (
                <div className="w-full h-full text-left">
                  <h1>{selectedArticle?.title}</h1>
                  <p>{selectedArticle?.description} </p>
                </div>
              ) : (
                body
              )}
            </div>
          </div>

          <Button
            text=""
            className="max-w-fit bg-blue-600 hover:bg-blue-700"
            icon={<MdPauseCircle className="w-7 h-7 text-white" />}
            onClick={handlePause}
          />
        </div>
      )}

      {/* Control panel */}

      <div className="flex justify-between gap-4 items-center w-full">
        {!isTest ? (
          <>
            {options?.length ? (
              <div className="w-[230px] shadow-lg">
                <Select
                  placeholder="Metin Seçin"
                  options={options}
                  name="textSelect"
                  value={value}
                  onChange={handleChange}
                  inputKey="textSelect"
                  showLabel={false}
                />
              </div>
            ) : null}

            <div className="flex gap-[1px] w-fit shadow-lg">
              {speedList.map((s) => (
                <Button
                  key={s}
                  text={s}
                  className={`max-w-fit !p-3 h-8 bg-blue-300 hover:bg-blue-500 ${
                    speed === s ? "!bg-blue-800" : ""
                  }`}
                  onClick={() => setSpeed(s)}
                />
              ))}
            </div>
          </>
        ) : null}

        <Button
          text=""
          className="flex-1 max-w-16 bg-blue-600 hover:bg-blue-700 shadow-lg"
          icon={<MdPlayCircle className="w-6 h-6 text-white" />}
          onClick={handlePlay}
        />
      </div>
    </div>
  );
}
