"use client";

import { useSession } from "next-auth/react";
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
    targetValue: string | string[];
    value: string;
    inputKey: string;
  }) => void;
  inputKey: string;
  styleClass?: string;
  asyncOption?: (session: any) => any;
  multipleSelect?: boolean;
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
  multipleSelect = false,
  ...rest
}: SelectPropTypes) {
  const [localOptions, setLocalOptions] = useState(options as any);
  const [isLodingOption, setisLodingOption] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    if (!session) return;
    if (!options.length && asyncOption) {
      const getOptions = async () => {
        setisLodingOption(true);
        const res = await asyncOption(session);
        setLocalOptions(res);
        setisLodingOption(false);
      };
      getOptions();
    }
  }, [session, asyncOption]);

  return (
    <div className={`w-full mb-2 text-sm ${styleClass}`}>
      {showLabel ? (
        <label
          className="text-sm font-medium flex gap-1 items-center"
          htmlFor={inputKey}
        >
          {name}
          {
            <span
              className={
                required && !value.value ? "text-red-400" : "text-green-400"
              }
            >
              *
            </span>
          }
        </label>
      ) : null}

      <select
        disabled={disabled}
        required={required}
        className={`w-full border h-10 px-2 ${
          multipleSelect ? "!h-[160px]" : ""
        }`}
        id={name}
        name={name}
        value={
          multipleSelect
            ? Array.isArray(value?.value)
              ? value.value
              : []
            : value?.value ?? ""
        }
        multiple={multipleSelect}
        onChange={(e) => {
          const newValue = multipleSelect
            ? Array.from(e.target.selectedOptions).map((opt) => opt.value)
            : e.target.value;

          onChange({ targetValue: newValue, value, inputKey });
        }}
        {...rest}
      >
        <option value=""> {placeholder}</option>
        {isLodingOption ? <option value=""> Loading... </option> : null}

        {localOptions?.map(
          (item: { name: string; value: string }, idx: number) => {
            return (
              <option value={item.value} key={idx}>
                {item.name}
              </option>
            );
          }
        )}
      </select>
    </div>
  );
}

export default Select;
