import React, { ReactElement } from "react";

export default function Widget({
  icon,
  title,
  description,
  className,
}: {
  icon?: ReactElement;
  title?: string | null;
  description?: string;
  className?: string;
}) {
  return (
    <div
      className={`flex-1 min-h-[82px] group rounded flex items-center gap-4 px-5 lg:px-7 py-4 border shadow ${className}`}
    >
      {icon}
      <div>
        <h3 className="font-semibold text-lg lg:text-xl whitespace-nowrap">
          {title}
        </h3>
        <p className="text-sm whitespace-nowrap">{description}</p>
      </div>
    </div>
  );
}
