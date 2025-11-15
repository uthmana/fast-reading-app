import Button from "@/components/button/button";
import React from "react";
import { MdPauseCircle } from "react-icons/md";

export default function LineLengthView({
  onFinishTest,
  pathname,
  controls,
}: {
  onFinishTest: (v: any) => void;
  pathname: string;
  controls: any;
}) {
  const handlePause = () => {
    if (onFinishTest) {
      onFinishTest(null);
    }
  };

  return (
    <div className="w-full h-full group">
      lineLengthView
      <Button
        icon={<MdPauseCircle className="w-6 h-6 text-white" />}
        className="max-w-fit transition-opacity lg:opacity-0 group-hover:opacity-100 absolute right-2 bottom-0 my-4 ml-auto bg-blue-600 hover:bg-blue-700 shadow-lg"
        onClick={handlePause}
      />
    </div>
  );
}
