import React from "react";
export default function Widget(_a) {
    var icon = _a.icon, title = _a.title, description = _a.description, className = _a.className;
    return (<div className={"flex-1 min-h-[82px] rounded flex items-center gap-4 px-7 py-4 border shadow ".concat(className)}>
      {icon}
      <div>
        <h3 className="font-semibold text-xl">{title}</h3>
        <p className="text-sm">{description}</p>
      </div>
    </div>);
}
