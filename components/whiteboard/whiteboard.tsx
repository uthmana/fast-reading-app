"use client";

import { useState, ReactElement } from "react";
import { MdPauseCircle, MdPlayCircle } from "react-icons/md";
import Button from "@/components/button/button";
import Select from "../formInputs/select";
import wood_img from "/public/images/wood.jpg";

interface WhiteboardProps {
  body?: ReactElement;
  description: ReactElement;
  options?: any;
  isTest?: boolean;
  showControlPanel?: boolean;
  onControl?: (v: any) => void;
}

export default function Whiteboard({
  body,
  description,
  options = [],
  isTest = false,
  showControlPanel = true,
  onControl,
}: WhiteboardProps) {
  const [level, setLevel] = useState("1");
  const [isPlaying, setIsPlaying] = useState(false);
  const [value, setValue] = useState(options[0]?.id ?? "");
  const levelList = ["1", "2", "3", "4", "5"];

  const [controlVal, setControlVal] = useState({
    level: 1,
    articleId: options[0]?.id,
  });

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleChange = ({
    targetValue,
    value,
    inputKey,
  }: {
    targetValue: string;
    value: string;
    inputKey: string;
  }) => {
    let crtVal = { ...controlVal };

    if (inputKey === "textSelect") {
      setValue(targetValue);
      if (targetValue) {
        crtVal.articleId = targetValue;
      }
    }
    if (inputKey === "level") {
      setLevel(targetValue);
      if (targetValue) {
        crtVal.level = parseInt(targetValue);
      }
    }
    setControlVal(crtVal);
    if (onControl) {
      onControl(crtVal);
    }
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
          <div className="relative lg:max-w-[900px] w-full md:h-[600px] mb-3  h-[calc(100%-30px)] mx-auto overflow-hidden rounded-3xl border border-black flex lg:items-center justify-center shadow-[0_2px_6px_rgba(0,0,0,0.3)]">
            <img
              src={wood_img.src}
              alt="Wood background"
              className="absolute inset-0 w-full h-full object-cover z-0"
            />
            <div className="absolute top-[3%] left-[2%] w-[96%] h-[94%] px-6 py-4 bg-white text-base rounded overflow-y-auto z-[2] shadow-[inset_0_4px_10px_rgba(0,0,0,0.25)]">
              {body}
            </div>

            {!isTest ? (
              <Button
                text=""
                className="max-w-fit absolute z-10 right-[3%] bottom-[4%] bg-blue-600 hover:bg-blue-700"
                icon={<MdPauseCircle className="w-7 h-7 text-white" />}
                onClick={handlePause}
              />
            ) : null}
          </div>
        </div>
      )}

      {/* Control panel */}

      {!showControlPanel ? null : (
        <div className="flex justify-between gap-4 flex-wrap items-center w-full">
          {!isTest ? (
            <>
              {options?.length ? (
                <div className="w-full lg:w-[230px] shadow-lg">
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
                {levelList.map((s) => (
                  <Button
                    key={s}
                    text={s}
                    className={`max-w-fit !p-3 h-8 bg-blue-300 hover:bg-blue-500 ${
                      level === s ? "!bg-blue-800" : ""
                    }`}
                    onClick={() =>
                      handleChange({
                        inputKey: "level",
                        targetValue: s,
                        value: s,
                      })
                    }
                  />
                ))}
              </div>
            </>
          ) : null}

          <Button
            text=""
            className={`flex-1 max-w-16 bg-blue-600 hover:bg-blue-700 shadow-lg ${
              isTest ? "ml-auto" : ""
            }`}
            icon={<MdPlayCircle className="w-6 h-6 text-white" />}
            onClick={handlePlay}
          />
        </div>
      )}
    </div>
  );
}
