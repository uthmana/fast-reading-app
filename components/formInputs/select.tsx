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
    targetValue: string | string[];
    value: string;
    inputKey: string;
  }) => void;
  inputKey: string;
  styleClass?: string;
  asyncOption?: () => any;
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
  // maintain selection order for multi-select
  const [selectedOrder, setSelectedOrder] = useState<string[]>(
    Array.isArray(value?.value) ? value.value : []
  );
  useEffect(() => {
    if (!options.length && asyncOption) {
      const getOptions = async () => {
        setisLodingOption(true);
        const res = await asyncOption();
        setLocalOptions(res);
        setisLodingOption(false);
      };
      getOptions();
    }
  }, [asyncOption]);

  // Sync when external value changes
  useEffect(() => {
    if (multipleSelect) {
      const incoming = Array.isArray(value?.value) ? value.value : [];
      setSelectedOrder(incoming);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value?.value]);

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
        className={`w-full border h-10 px-2 ${
          multipleSelect ? "!h-[160px]" : ""
        }`}
        id={name}
        name={name}
        value={multipleSelect ? selectedOrder : value?.value ?? ""}
        multiple={multipleSelect}
        onChange={(e) => {
          if (!multipleSelect) {
            const newValue = e.target.value;
            onChange({ targetValue: newValue, value, inputKey });
            return;
          }

          // For multiple select, preserve the order of selection.
          const selectedOptions = Array.from(e.target.selectedOptions).map(
            (opt) => opt.value
          );

          // Build sets for comparison
          const prevSet = new Set(selectedOrder);
          const currSet = new Set(selectedOptions);

          // Determine newly added values in the order they appear in selectedOptions
          const added: string[] = [];
          for (const v of selectedOptions) {
            if (!prevSet.has(v)) added.push(v);
          }

          // Determine removed values
          const removed: string[] = [];
          for (const v of selectedOrder) {
            if (!currSet.has(v)) removed.push(v);
          }

          // Start from previous order, remove any removed values, then append added ones
          const nextOrder = selectedOrder.filter((v) => !removed.includes(v));
          // If there are new selections made that weren't present before, append them
          for (const a of added) nextOrder.push(a);

          setSelectedOrder(nextOrder);
          onChange({ targetValue: nextOrder, value, inputKey });
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
