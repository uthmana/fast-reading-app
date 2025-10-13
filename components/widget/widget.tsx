import React, { ReactElement } from "react";

export default function Widget({
  icon,
  title,
  description,
  className,
}: {
  icon?: ReactElement;
  title?: string;
  description?: string;
  className?: string;
}) {
  return (
    <div
      className={`flex-1 min-h-[82px] rounded flex items-center gap-4 px-7 py-4 border shadow ${className}`}
    >
      {icon}
      <div>
        <h3 className="font-semibold text-xl">{title}</h3>
        <p className="text-sm">{description}</p>
      </div>
    </div>
  );
}
