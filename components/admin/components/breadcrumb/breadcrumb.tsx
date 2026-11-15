import routes from "@/app/(admin)/admin/routes";
import React from "react";

export default function Breadcrumb({ pathname }: { pathname: string }) {
  let route = routes.find((item) =>
    item.children?.find((item) => item.path === pathname)
  );
  if (!route) {
    route = routes.find((item) => item.path === pathname);
    if (!route) return null;
  }

  const currentRoute = route.children?.find((item) => item.path === pathname);

  return (
    <div className="w-full flex items-center mb-7 p-2 gap-3">
      <p className={`${!currentRoute?.name ? "text-xl font-semibold" : ""}`}>
        {route?.name}
      </p>
      <h1
        className="text-xl 
       font-semibold"
      >
        {currentRoute?.name ? " / " + currentRoute?.name : ""}
      </h1>
    </div>
  );
}
