"use client";

import { useState, ReactElement, useEffect, useRef } from "react";
import { MdPlayCircle } from "react-icons/md";
import Button from "@/components/button/button";
import wood_img from "/public/images/wood.jpg";
import ControlPanel from "../controlPanel/controlPanel";

interface WhiteboardProps {
  body?: ReactElement;
  description: ReactElement;
  options?: any;
  pause?: boolean;
  showControlPanel?: boolean;
  onControlChange?: (v: any) => void;
  control?: any;
}

export default function Whiteboard({
  body,
  description,
  showControlPanel = true,
  onControlChange,
  control = {},
  pause,
}: WhiteboardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const { categorySelect, articleSelect, font, level, wordsPerFrame } = control;
  const [controlVal, setControlVal] = useState({
    categorySelect: {
      value: categorySelect ? categorySelect : "",
    },
    articleSelect: {
      value: articleSelect ? articleSelect?.id : "",
    },
    font: {
      value: font ? font : "16",
    },
    level: {
      value: (level ? level : 1)?.toString(),
    },
    wordsPerFrame: {
      value: (wordsPerFrame ? wordsPerFrame : 1)?.toString(),
    },
  } as any);

  useEffect(() => {
    if (pause !== undefined) {
      setIsPlaying(pause ? !isPlaying : pause);
    }
  }, [pause]);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handleControlChange = (val: any) => {
    if (onControlChange) onControlChange(val);
    const preview = previewRef.current;
    if (preview) {
      preview.style.fontSize = `${controlVal.font.value}px !important`;
    }
  };

  return (
    <div className="flex flex-col px-5">
      {/* Whiteboard preview */}
      <div className="relative w-full overflow-hidden mb-1 rounded-md border border-gray-400 min-h-[460px] mx-auto flex items-center justify-center shadow-[0_2px_6px_rgba(0,0,0,0.3)]">
        <img
          src={wood_img.src}
          alt="Wood background"
          className="absolute inset-0 w-full h-full object-cover z-0 bg-[#a87349]"
        />

        <div className="absolute top-[3%] flex flex-col items-center justify-center left-[2%] w-[96%] h-[94%] bg-white px-5 py-4 z-[2] overflow-y-auto text-gray-800 rounded shadow-[inset_0_4px_10px_rgba(0,0,0,0.25)]">
          <div
            className="w-full"
            style={{
              fontSize: `${parseInt(control.font)}px`,
              lineHeight: `${parseInt(control.font) * 1.5}px`,
              height: "fit-content",
            }}
          >
            {description}
          </div>

          <Button
            text=""
            className={`!w-fit !h-10 my-4 bg-blue-600 hover:bg-blue-700 shadow-lg  ml-auto`}
            icon={<MdPlayCircle className="w-6 h-6 text-white" />}
            onClick={handlePlay}
          />
        </div>
      </div>
      {/* Control panel */}

      <div className="flex justify-between gap-4 flex-wrap items-center w-full">
        <ControlPanel
          key={controlVal}
          controlVal={controlVal}
          setControlVal={setControlVal}
          onControlChange={handleControlChange}
        />
      </div>

      {/* Fullscreen reading overlay */}
      {isPlaying && (
        <div className="fixed inset-0 bg-black/90 flex flex-col items-center justify-center z-[60]">
          <div className="relative lg:max-w-[900px] w-full md:h-[600px] mb-1  h-[calc(100%-30px)] mx-auto overflow-hidden rounded-xl border border-black flex lg:items-center justify-center shadow-[0_2px_6px_rgba(0,0,0,0.3)]">
            <img
              src={wood_img.src}
              alt="Wood background"
              className="absolute inset-0 w-full h-full object-cover z-0 bg-[#a87349]"
            />
            <div className="absolute top-[3%] left-[2%] w-[96%] h-[94%] px-6 py-4 bg-white text-base rounded overflow-y-auto z-[2] shadow-[inset_0_4px_10px_rgba(0,0,0,0.25)]">
              {body}
            </div>
          </div>

          <div className="lg:max-w-[900px] w-full">
            <ControlPanel
              key={controlVal}
              controlVal={controlVal}
              setControlVal={setControlVal}
              onControlChange={handleControlChange}
            />
          </div>
        </div>
      )}
    </div>
  );
}
