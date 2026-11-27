import React from "react";
import routes from "../../constants/routes";

export default function Breadcrumb({ pathname }: { pathname: string }) {
  let route = routes.find((item) =>
    item.children?.find((item) => item.path === pathname),
  );
  if (!route) {
    route = routes.find((item) => item.path === pathname);
    if (!route) return null;
  }

  const currentRoute = route.children?.find((item) => item.path === pathname);

  return (
    <div className="w-full flex flex-col mb-7 py-2 gap-2">
      <div className="flex items-center gap-3">
        <p className={`${!currentRoute?.name ? "text-xl font-semibold" : ""}`}>
          {route?.name}
        </p>
        <h1 className="text-xl font-semibold">
          {currentRoute?.name ? " / " + currentRoute?.name : ""}
        </h1>
      </div>
      {route?.description ? (
        <div>
          <p className="text-base">{route?.description}</p>
        </div>
      ) : null}
    </div>
  );
}
