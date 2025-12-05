import React, { useState } from "react";

type ActionButtonProps = {
  placeholder?: string;
  value?: { value: string | number; key: string; type: string };
  name?: string;
  onChange: (args: {
    targetValue: boolean;
    value: any;
    inputKey: string;
  }) => void;
  inputKey: string;
  styleClass?: string;
  buttonNames?: { correct: string; wrong: string };
};
function AnswerButton(props: ActionButtonProps) {
  const {
    placeholder,
    value,
    name,
    onChange,
    inputKey,
    buttonNames,
    styleClass = "",
  } = props;
  const handleClick = (target: any) => {
    let targetvalue = true;
    if (target.name === "wrongAnswer") targetvalue = false;
    console.log(targetvalue);
    console.log(value);
    console.log(inputKey);
    console.log("Clicked button:", target.name);
    onChange({ targetValue: targetvalue, value: value, inputKey: inputKey });
  };

  return (
    <div className={`w-full mb-2 text-sm flex gap-2 ${styleClass}`}>
      <button
        type="button"
        id={inputKey}
        name="correctAnswer"
        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold h-12 px-4 rounded shadow-md transition-colors duration-200 flex items-center justify-center gap-2"
        onClick={(e) => handleClick(e.target)}
      >
        <span className="text-xl">◄</span>
        <span>{buttonNames?.correct || "Doğru"}</span>
      </button>
      <button
        type="button"
        id={inputKey}
        name="wrongAnswer"
        className="flex-1 bg-red-700 hover:bg-red-800 text-white font-bold h-12 px-4 rounded shadow-md transition-colors duration-200 flex items-center justify-center gap-2"
        onClick={(e) => handleClick(e.target)}
      >
        <span>{buttonNames?.wrong || "Yanlış"}</span>
        <span className="text-xl">►</span>
      </button>
    </div>
  );
}

export default AnswerButton;
