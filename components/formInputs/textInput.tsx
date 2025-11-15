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
    ...rest
  } = props;

  return (
    <div className={`w-full mb-2 text-sm  ${styleClass}`}>
      <label
        className="font-medium flex gap-1 w-full items-center whitespace-nowrap"
        htmlFor={inputKey}
      >
        {name}
        {type === "range" ? (
          <span>: {value?.value}</span>
        ) : (
          <span className={!value?.value ? "text-red-400" : "text-green-400"}>
            *
          </span>
        )}
        {}
      </label>
      <input
        autoComplete={`new-${type}`}
        maxLength={maxlength}
        required={required}
        id={inputKey}
        name={inputKey}
        className="w-full border h-10 px-2"
        placeholder={placeholder}
        type={type}
        value={value?.value}
        onChange={(e) => {
          onChange({ targetValue: e.target.value, value, inputKey });
        }}
        disabled={disabled}
        {...rest}
      />
    </div>
  );
}

export default TextInput;
