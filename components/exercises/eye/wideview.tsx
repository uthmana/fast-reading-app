"use client";

import Button from "@/components/button/button";
import React from "react";
import { MdPauseCircle } from "react-icons/md";

type WideviewProps = {
  controls?: { level?: 1 | 2 | 3 | 4 | 5 };
  onFinishTest?: (v: any) => void;
};

export default function Wideview({ controls, onFinishTest }: WideviewProps) {
  const handlePause = () => {
    if (onFinishTest) {
      onFinishTest(null);
    }
  };

  return (
    <div className="w-full h-full">
      wideview {controls && controls.level}
      <Button
        icon={<MdPauseCircle className="w-6 h-6 text-white" />}
        className="max-w-fit absolute right-1 -bottom-1 my-4 ml-auto bg-blue-600 hover:bg-blue-700 shadow-lg"
        onClick={handlePause}
      />
    </div>
  );
}
