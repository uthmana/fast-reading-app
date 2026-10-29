"use client";

import CheckboxInput from "@/components/formInputs/checkboxInput";
import ResultInput from "@/components/formInputs/resultInput";
import Select from "@/components/formInputs/select";
import TextInput from "@/components/formInputs/textInput";
import React, { useEffect, useState } from "react";

function normalizeValue(val: any) {
  if (val === undefined || val === null) return val;

  if (typeof val === "string") {
    try {
      return JSON.parse(val);
    } catch {
      return val.trim();
    }
  }

  return val;
}

export default function ControlBuilder({
  fields,
  className = "",
  controlData,
  setControlData,
  isTest,
  setIsLoading,
  pathName,
  noInitialDataRequest,
}: {
  fields: any[];
  className?: string;
  controlData?: any;
  setControlData?: any;
  isTest?: boolean;
  pathName?: string;
  setIsLoading?: (val: boolean) => void;
  noInitialDataRequest?: boolean;
}) {
  if (!fields || fields.length === 0) return null;

  const [formData, setFormData] = useState<any[]>([]);

  //If anlama-testi get article that has questions
  const hasQuestion = pathName === "anlama-testi";

  const lessonDisabledFields = [
    "level",
    "wordsPerFrame",
    "type",
    "frame",
    "grid",
    "distance",
    "letterCount",
    "scroll",
    "difficultyLevel",
  ];

  useEffect(() => {
    let mapped = fields;
    if (controlData) {
      mapped = fields.map((fd: any) => {
        const value = controlData[fd.inputKey];

        const optionId =
          fd.inputKey === "articleSelect" && controlData?.categorySelect
            ? controlData?.categorySelect
            : fd.optionId;

        return value !== undefined
          ? {
              ...fd,
              value: {
                ...fd.value,
                value:
                  fd.value.type === "object"
                    ? JSON.stringify(value)
                    : value?.toString(),
              },
              ...(optionId ? { optionId } : {}),
            }
          : fd;
      });
    }
    setFormData(mapped);
  }, [fields, controlData]);

  const handleChange = ({
    targetValue,
    inputKey,
    selectedData,
  }: {
    targetValue: any;
    inputKey: string;
    selectedData: any;
  }) => {
    setFormData((prev) => {
      return prev.map((field) => {
        // update changed field
        if (field.inputKey === inputKey) {
          return {
            ...field,
            value: { ...field.value, value: targetValue },
          };
        }

        // update dependent field
        if (
          inputKey === "categorySelect" &&
          field.inputKey === "articleSelect"
        ) {
          return {
            ...field,
            optionId: targetValue,
          };
        }

        return field;
      });
    });

    if (setControlData) {
      setControlData((prev: any) => {
        if (inputKey !== "articleSelect") {
          //Adjust frame base on grid size "aktif-gorme-alanini-genisletme-1"
          if (inputKey === "grid") {
            const gridValue = parseInt(targetValue);
            const frameValue = parseInt(
              formData?.find((item) => item.inputKey === "frame")?.value?.value,
            );
            if (frameValue < 5 && gridValue > 4) {
              return {
                ...prev,
                [inputKey]: 5,
              };
            }
          }

          return {
            ...prev,
            [inputKey]: normalizeValue(targetValue),
          };
        }

        return {
          ...prev,
          articleSelect: targetValue,
          selectedData: selectedData?.data
            ? JSON.parse(selectedData?.data)
            : selectedData,
        };
      });
    }
    // persist font change in localStorage
    if (inputKey === "font") {
      localStorage.setItem("font", targetValue);
    }
  };

  const handleAsyncList = React.useCallback(
    (inputKey: string, data: string[]) => {
      if (!data?.length) return;
      if (inputKey !== "letterCount" && inputKey !== "wordsPerFrame") return;

      setControlData?.((prev: any) => {
        const current = prev?.wordList;

        const isSame =
          Array.isArray(current) &&
          current.length === data.length &&
          current.every((word: string, index: number) => word === data[index]);

        if (isSame) return prev;

        return { ...prev, wordList: [...data] };
      });
    },
    [setControlData],
  );

  return (
    <div className={`w-full ${className}`}>
      {formData.map((field: any, index: number) => {
        if (field.type === "range") {
          const disabled =
            lessonDisabledFields.includes(field.inputKey) && isTest
              ? true
              : field.disabled;
          return (
            <TextInput
              {...field}
              key={field.inputKey + index}
              placeholder={field.description}
              type={field.type}
              value={field.value}
              inputKey={field.inputKey}
              name={field.name}
              onChange={handleChange}
              min={field?.min}
              max={field?.max}
              step={field?.step}
              required={field.required}
              showRangeIcon={field?.showRangeIcon}
              styleClass={field.styleClass}
              description={field?.description}
              colorList={field?.colorList}
              asyncList={noInitialDataRequest ? null : field?.asyncList}
              handleAsyncList={handleAsyncList}
              setIsLoading={setIsLoading}
              disabled={disabled}
              wordList={field?.wordList}
            />
          );
        }

        if (field.type === "checkbox") {
          return (
            <CheckboxInput
              key={field.inputKey + index}
              type={field.type}
              value={field.value}
              inputKey={field.inputKey}
              name={field.name}
              onChange={handleChange}
              required={field.required}
              styleClass={field.styleClass}
              description={field.description}
            />
          );
        }

        if (field.type === "select") {
          return (
            <Select
              key={field.inputKey + index}
              placeholder={field.placeholder}
              options={field.options}
              name={field.name}
              value={field.value}
              onChange={handleChange}
              inputKey={field.inputKey}
              styleClass={field.styleClass}
              showLabel={field.showLabel}
              required={field.required}
              disabled={isTest ? true : field.disabled}
              optionId={field?.optionId}
              asyncOption={field?.asyncOption}
              asyncOptionById={field?.asyncOptionById}
              setIsLoading={setIsLoading}
              hasQuestion={hasQuestion}
            />
          );
        }
        if (field.type === "display") {
          return (
            <ResultInput
              key={field.inputKey + index}
              resultDisplay={controlData.resultDisplay}
            />
          );
        }

        return null;
      })}
    </div>
  );
}
