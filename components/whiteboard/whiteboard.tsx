"use client";

import Button from "@/components/button/button";
import { ReactElement, useState } from "react";
import { MdPauseCircle, MdPlayCircle } from "react-icons/md";
import Select from "../formInputs/select";
import wood_img from "/public/images/wood.jpg";

export default function whiteboard({
  body,
  description,
  options,
  onPlayExercise,
}: {
  body: ReactElement;
  description: ReactElement;
  options?: any;
  onPlayExercise: (e: { speed: string; start: boolean; value: string }) => void;
}) {
  const [speed, setSpeed] = useState("1");
  const [start, setStart] = useState(false);
  const [value, setValue] = useState(options ? options[0] : "");
  const speedList = ["1", "2", "3", "4", "5"];

  const handlePlay = () => {
    setStart(true);
    onPlayExercise({ speed, start: true, value });
  };

  const handleChange = ({ targetValue }: { targetValue: string }) => {
    setValue(targetValue);
  };

  return (
    <div className="flex flex-col py-7 px-5">
      <div
        className={`relative w-full overflow-hidden rounded-3xl shadow-xl border-1 border-black min-h-[460px] mx-auto mb-7 flex  items-center justify-center`}
      >
        <img src={wood_img.src} className="w-full h-full z-0 min-h-[460px]" />
        <div className="rounded absolute top-[3%] shadow px-6 bg-white py-4 h-[94%] w-[96%] text-lg z-[2] overflow-y-auto text-gray-800">
          {description}
        </div>
      </div>

      <div
        className={` ${
          start ? "fixed" : "hidden"
        } bg-black/90 flex flex-col items-center justify-center top-0 left-0 w-screen h-screen z-[60] `}
      >
        <div
          className={`relative w-[80%] overflow-hidden rounded-3xl shadow-2xl border-1 border-black min-h-[80%] mx-auto my-5 flex  items-center justify-center`}
        >
          <img src={wood_img.src} className="w-full h-full z-0 min-h-[460px]" />
          <div className="rounded absolute top-[3%] text-base shadow px-6 bg-white py-4 h-[94%] w-[96%]  z-[2] overflow-y-auto">
            {body}
          </div>
        </div>

        <Button
          text=""
          className="max-w-fit bg-blue-600 hover:bg-blue-700"
          icon={<MdPauseCircle className="w-7 h-7 text-white " />}
          onClick={() => setStart(false)}
        />
      </div>

      <div className="flex justify-between gap-4 items-center w-full">
        {options ? (
          <div className="w-[230px] shadow-xl">
            <Select
              placeholder="Metin Seçin"
              options={options}
              name="textSelect"
              value={value}
              onChange={handleChange}
              inputKey={"textSelect"}
              showLabel={false}
            />
          </div>
        ) : null}

        <div className="flex gap-[1px] w-fit shadow-xl">
          {speedList.map((s: string, idx) => (
            <Button
              className={`max-w-fit bg-blue-300 hover:bg-blue-500 !p-3 h-8 ${
                speed == s ? "!bg-blue-600" : ""
              }`}
              text={s}
              key={idx}
              onClick={() => setSpeed(s)}
            />
          ))}
        </div>

        <Button
          text=""
          className="max-w-fit bg-blue-600 hover:bg-blue-700 flex-1 shadow-xl"
          icon={<MdPlayCircle className="w-5 h-5 text-white " />}
          onClick={handlePlay}
        />
      </div>
    </div>
  );
}
