"use client";

import React, { useEffect, useState } from "react";

type SelectPropTypes = {
  placeholder?: string;
  options?: Array<{ name: string; value: string }>;
  value: any;
  name?: string;
  required?: boolean;
  disabled?: boolean;
  showLabel?: boolean;
  onChange: (e: {
    targetValue: string;
    value: string;
    inputKey: string;
  }) => void;
  inputKey: string;
  styleClass?: string;
  asyncOption?: () => any;
};

function Select({
  placeholder,
  options = [],
  name,
  required = false,
  value,
  onChange,
  inputKey,
  showLabel = true,
  disabled = false,
  styleClass = "",
  asyncOption,
  ...rest
}: SelectPropTypes) {
  const [localOptions, setLocalOptions] = useState(options as any);

  useEffect(() => {
    if (!options.length && asyncOption) {
      const getOptions = async () => {
        const res = await asyncOption();
        setLocalOptions(res);
      };
      getOptions();
    }
  }, [asyncOption]);

  return (
    <div className={`w-full mb-2 text-sm ${styleClass}`}>
      {showLabel ? (
        <label
          className="text-sm font-medium flex gap-1 items-center"
          htmlFor={inputKey}
        >
          {name}
          {
            <span className={!value.value ? "text-red-400" : "text-green-400"}>
              *
            </span>
          }
        </label>
      ) : null}

      <select
        disabled={disabled}
        required={required}
        className="w-full border h-10 px-2"
        id={name}
        name={name}
        value={value?.value}
        onChange={(e) =>
          onChange({ targetValue: e.target.value, value, inputKey })
        }
        {...rest}
      >
        <option value=""> {placeholder}</option>
        {localOptions?.map(
          (item: { name: string; value: string }, idx: number) => {
            return (
              <option value={item.value} key={idx}>
                {item.name}
              </option>
            );
          }
        )}
        {/* {options?.map((v: { name: string; value: string }, idx) => {
          return (
            <option value={v.value} key={idx}>
              {v.name}
            </option>
          );
        })} */}
      </select>
    </div>
  );
}

export default Select;
