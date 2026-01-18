import React, { use, useEffect, useRef } from "react";

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
  handleAsyncList?: (inputKey: string, data: any) => void;
  asyncList?: any;
  setIsLoading?: (val: boolean) => void;
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
    asyncList,
    handleAsyncList,
    setIsLoading,
    ...rest
  } = props;

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const debounceDelay = 500; // ms

  useEffect(() => {
    if (!asyncList) return;
    const getWordList = async () => {
      try {
        if (setIsLoading) setIsLoading(true);
        const res = await asyncList(
          parseInt(value?.value?.toString() || "1"),
          1
        );
        handleAsyncList && handleAsyncList(inputKey, res);
        if (setIsLoading) setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    timeoutRef.current = setTimeout(() => {
      getWordList();
    }, debounceDelay);

    return () => clearTimeout(timeoutRef.current!);
  }, [value?.value, inputKey, asyncList, handleAsyncList]);

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
                <span className="absolute rounded-full w-10 h-8 right-1 -top-[5px]">
                  <img
                    className="h-full aspect-auto inline-block"
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
        inputMode={type === "tel" ? "numeric" : undefined}
        onChange={(e) => {
          let nextValue = e.target.value;

          if (type === "tel") {
            nextValue = nextValue.replace(/\D/g, "");
            if (maxlength) nextValue = nextValue.slice(0, maxlength);
          }

          onChange({ targetValue: nextValue, value, inputKey });
        }}
        disabled={disabled}
        {...rest}
      />

      {description ? (
        <div className="text-xs font-medium text-center lg:text-left">
          {description}
        </div>
      ) : null}
    </div>
  );
}

export default TextInput;
