import React from "react";
import wood_img from "/public/images/wood.jpg";

export default function WoodenFrame({
  className = "",
  innerClassName = "",
  children,
  font,
}: {
  className?: string;
  innerClassName?: string;
  children?: React.ReactNode;
  font?: string;
}) {
  return (
    <div
      className={`relative w-full overflow-hidden rounded-md border border-gray-400 min-h-[84px] bg-[url('/images/green-paint.jpg')]  mx-auto flex items-center justify-center shadow-[0_2px_6px_rgba(0,0,0,0.3)] ${className}`}
    >
      <img
        src={wood_img.src}
        alt="Wood background"
        className="absolute inset-0 w-full h-full object-cover z-0 bg-[#a87349]"
      />

      <div
        className={`absolute  top-2 left-2 w-[calc(100%-16px)] h-[calc(100%-16px)]  bg-no-repeat bg-cover bg-center px-5 py-1 z-[2] overflow-y-auto text-gray-800 rounded shadow-[inset_0_4px_10px_rgba(0,0,0,0.25)] ${innerClassName}`}
        style={{
          fontSize: `${font && parseInt(font)}px`,
          lineHeight: `${font && parseInt(font) * 1.5}px`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
