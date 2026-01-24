"use client";

import { useParams, useSearchParams } from "next/navigation";
import WoodenFrame from "../woodenFrame/woodenFrame";
import ControlBuilder from "./controlBuilder/controlBuilder";
import { controlFields } from "./controlBuilder/controlFields";
import ControlReader from "./controlBuilder/controlReader";

interface ControlPanelProps {
  className?: string;
  setIsLoading?: any;
  isfastTest?: boolean;
  readingStatus?: any;
  controlData?: any;
  setControlData?: any;
}

export default function ControlPanel({
  className,
  setIsLoading,
  isfastTest = false,
  readingStatus,
  controlData,
  setControlData,
}: ControlPanelProps) {
  const queryParams = useParams();
  const pathname = queryParams.slug as any;
  const searchParams = useSearchParams();
  const introTest = searchParams.get("intro-test");
  const isTestSlug =
    pathname === "hizli-okuma-testi" || pathname === "anlama-testi";

  const isArticleControl =
    controlFields[pathname]?.filter(
      (item) =>
        item.inputKey === "articleSelect" ||
        item.inputKey === "categorySelect" ||
        (item.inputKey === "font" && isTestSlug)
    ) || [];

  const isControlItems =
    controlFields[pathname]?.filter(
      (item) =>
        !isTestSlug &&
        item.inputKey !== "articleSelect" &&
        item.inputKey !== "categorySelect"
    ) || [];

  return (
    <div className={`flex w-full flex-col ${className}`}>
      {isArticleControl.length > 0 ? (
        <WoodenFrame
          key={isArticleControl.length}
          innerClassName="flex items-center bg-[#064d49] bg-[url('/images/green-paint.jpg')]"
          className="!min-h-[84px]"
        >
          <ControlBuilder
            controlData={controlData}
            setControlData={setControlData}
            className="flex gap-2 text-black"
            fields={isArticleControl}
            introTest={introTest}
            setIsLoading={setIsLoading}
          />
        </WoodenFrame>
      ) : null}

      {isControlItems.length > 0 ? (
        <WoodenFrame
          key={isControlItems.length}
          className="!min-h-[130px]"
          innerClassName="flex items-center bg-[#064d49] bg-[url('/images/green-paint.jpg')]"
        >
          <ControlBuilder
            controlData={controlData}
            setControlData={setControlData}
            className="flex gap-2 text-white"
            fields={isControlItems}
            introTest={introTest}
            setIsLoading={setIsLoading}
          />
        </WoodenFrame>
      ) : null}

      {isfastTest ? (
        <WoodenFrame
          className="!min-h-[84px]"
          innerClassName="bg-[#064d49] bg-[url('/images/green-paint.jpg')]"
        >
          <ControlReader readingStatus={readingStatus} />
        </WoodenFrame>
      ) : null}
    </div>
  );
}
