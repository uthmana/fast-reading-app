import React, { useState } from "react";

type InputProps = {
  placeholder?: string;
  value?: { value: string | number; key: string; type: string };
  name?: string;
  type?: string;
  required?: boolean;
  onChange: (args: {
    targetValue: string;
    value: any;
    inputKey: string;
  }) => void;
  inputKey: string;
  disabled?: boolean;
  maxlength?: number;
  styleClass?: string;
  min?: string;
  max?: string;
  step?: string;
  showRangeIcon?: boolean;
  showRangeColor?: boolean;
  description?: string;
  colorList?: any;
  valueMap?: any;
  showLabel?: boolean;
  labelClassName?: string;
};

function TextInput(props: InputProps) {
  const {
    placeholder,
    type,
    required = false,
    value,
    name,
    onChange,
    inputKey,
    disabled,
    maxlength,
    styleClass = "",
    labelClassName = "",
    step,
    showRangeIcon = false,
    showRangeColor = false,
    showLabel = true,
    description,
    min,
    max,
    colorList,
    valueMap,
    ...rest
  } = props;

  return (
    <div className={`w-full mb-2 text-sm relative ${styleClass}`}>
      {showLabel ? (
        <label
          className={`font-medium flex gap-1 w-full items-center whitespace-nowrap ${labelClassName}`}
          htmlFor={inputKey}
        >
          {name}
          {type === "range" ? (
            <div className="w-full relative flex justify-between items-center">
              <span className="inline-block">
                :
                {valueMap && value?.value
                  ? valueMap[value?.value]
                  : value?.value}
              </span>
              {type === "range" && showRangeIcon ? (
                <span className="absolute right-1 -top-[5px]">
                  <img
                    className="h-8 inline-block"
                    src={`/images/objects/icon${value?.value}.png`}
                  />
                </span>
              ) : null}
              {type === "range" && showRangeColor ? (
                <span
                  className="absolute border border-white right-1 -top-[5px] w-8 h-8 rounded-full"
                  style={{
                    backgroundColor: colorList[value?.value ?? "1"],
                  }}
                ></span>
              ) : null}
            </div>
          ) : (
            <span
              className={
                required && !value?.value ? "text-red-400" : "text-green-400"
              }
            >
              *
            </span>
          )}
        </label>
      ) : null}

      <input
        autoComplete={`new-${type}`}
        maxLength={maxlength}
        required={required}
        id={inputKey}
        name={inputKey}
        className={`w-full border h-10  ${
          type === "range" ? "cursor-grab !h-auto mt-1" : "px-2"
        }`}
        min={min}
        max={max}
        placeholder={placeholder}
        type={type}
        step={step}
        value={value?.value}
        onChange={(e) => {
          onChange({ targetValue: e.target.value, value, inputKey });
        }}
        disabled={disabled}
        {...rest}
      />

      {description ? (
        <div className="text-xs text-center lg:text-left">{description}</div>
      ) : null}
    </div>
  );
}

export default TextInput;
