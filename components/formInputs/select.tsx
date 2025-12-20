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
    selectedData: any;
  }) => void;
  inputKey: string;
  styleClass?: string;
  asyncOption?: (session: any) => any;
  asyncOptionById?: (categoryId: string) => any;
  multipleSelect?: boolean;
  optionId?: string;
  setAsyncOptions?: (data: any) => any;
  setIsLoading?: (val: boolean) => any;
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
  asyncOptionById,
  optionId,
  setAsyncOptions,
  setIsLoading,
  ...rest
}: SelectPropTypes) {
  const [localOptions, setLocalOptions] = useState(options as any);
  const [isLodingOption, setisLodingOption] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    if (disabled || !session || !asyncOption) return;
    if (!optionId && !options.length && asyncOption) {
      const getOptions = async () => {
        setisLodingOption(true);
        if (setIsLoading) setIsLoading(true);
        const res = await asyncOption(session);
        setLocalOptions(res);
        setisLodingOption(false);
        if (setIsLoading) setIsLoading(false);
      };
      getOptions();
    }
  }, [disabled, asyncOption, session]);

  useEffect(() => {
    if (disabled || !optionId || !asyncOptionById) return;
    if (!options.length) {
      const getOptions = async () => {
        setisLodingOption(true);
        if (setIsLoading) setIsLoading(true);
        const res = await asyncOptionById(optionId);
        setLocalOptions(res);
        if (setAsyncOptions) {
          setAsyncOptions({ options: res, inputKey });
        }
        setisLodingOption(false);
        if (setIsLoading) setIsLoading(false);
      };
      getOptions();
    }
  }, [optionId, disabled, asyncOptionById, setAsyncOptions]);

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
          const selectedData = localOptions?.find(
            (item: any) => item.value?.toString() === e.target.value
          );
          onChange({ targetValue: newValue, value, inputKey, selectedData });
        }}
        {...rest}
      >
        <option value=""> {placeholder}</option>
        {isLodingOption ? <option value=""> Loading... </option> : null}

        {!isLodingOption &&
          localOptions?.map(
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
