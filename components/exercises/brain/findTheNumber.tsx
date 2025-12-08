import Button from "@/components/button/button";
import Countdown from "@/components/countDown/countDown";
import TextInput from "@/components/formInputs/textInput";
import React, { useState } from "react";
import { MdPauseCircle, MdThumbUp } from "react-icons/md";

export default function FindTheNumber({
  onFinishTest,
  onResultDisplay,
  controls,
}: {
  onFinishTest: (v: any) => void;
  pathname: string;
  controls: any;
  onResultDisplay: (v: any) => void;
}) {
  const [selectedAnswer, setSelectedAnswer] = useState({
    targetValue: "",
    value: { value: "" },
  });
  const [start, setStart] = useState(false);
  const [countValue, setCountValue] = useState(10);

  const handlePause = () => {
    if (onFinishTest) {
      onFinishTest(null);
    }
  };

  const onCountDownFinish = () => {
    alert("finished");
  };

  const handleChange = (val: {
    targetValue: any;
    value: any;
    inputKey: string;
  }) => {
    setSelectedAnswer({ ...val, value: { value: val.targetValue } });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const { right, wrong } = controls.resultDisplay;
    if (selectedAnswer.value.value === "") return;
    if (selectedAnswer.targetValue === "answer") {
      onResultDisplay({
        right: right + 1,
        wrong: wrong,
        net: right + 1 - wrong,
      });
    } else {
      onResultDisplay({
        right: right,
        wrong: wrong + 1,
        net: right - (wrong + 1),
      });
    }
    setSelectedAnswer({ ...selectedAnswer, value: { value: "" } });
  };

  return (
    <div className="w-full h-full group">
      <div className="w-full h-[calc(100%-40px)]"> findTheNumber</div>

      <div className="flex gap-1 justify-center w-full">
        <Countdown
          className="!py-1 h-10 !px-2"
          text=""
          initial={countValue}
          start={start}
          onFinish={onCountDownFinish}
        />
        <form onSubmit={handleSubmit} className="flex items-center">
          <TextInput
            placeholder=""
            type="text"
            value={
              selectedAnswer.value as {
                value: string | number;
                key: string;
                type: string;
              }
            }
            inputKey="numberTest"
            name=""
            showLabel={false}
            onChange={handleChange}
            required={false}
          />
          <Button
            icon={<MdThumbUp className="w-4 h-4 text-white" />}
            text="Doğrula"
            className="max-w-fit rounded-none !px-2 mb-2 text-sm  bg-green-600 hover:bg-green-700"
            type="submit"
          />
        </form>
      </div>

      <Button
        icon={<MdPauseCircle className="w-6 h-6 text-white" />}
        className="max-w-fit transition-opacity lg:opacity-0 group-hover:opacity-100 absolute right-2 bottom-0 my-4 ml-auto bg-blue-600 hover:bg-blue-700 shadow-lg"
        onClick={handlePause}
      />
    </div>
  );
}
