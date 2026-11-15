import React from "react";

export default function ResultInput({
  resultDisplay,
}: {
  resultDisplay: { right: number; wrong: number; net: number } | null;
}) {
  return (
    <div
      key={resultDisplay as any}
      className="w-full flex items-center justify-center gap-3"
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
  );
}
