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
}: {
  fields: any[];
  className?: string;
  controlData?: any;
  setControlData?: any;
  isTest?: boolean;
  setIsLoading?: (val: boolean) => void;
}) {
  if (!fields || fields.length === 0) return null;

  const [formData, setFormData] = useState<any[]>([]);
  const [newData, setNewData] = useState(controlData);

  useEffect(() => {
    let mapped = fields;
    if (controlData) {
      mapped = fields.map((fd: any) => {
        const value = controlData[fd.inputKey];
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

    setNewData((prev: any) => {
      const next = {
        ...prev,
        [inputKey]: normalizeValue(targetValue),
      };
      return next;
    });

    if (setControlData) {
      setControlData((prev: any) => {
        if (inputKey !== "articleSelect") {
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
  };

  const handleAsyncList = React.useCallback(
    (inputKey: string, data: any[]) => {
      if (!data || data.length === 0) return;
      if (inputKey !== "letterCount" && inputKey !== "wordsPerFrame") return;

      if (setControlData) {
        setControlData((prev: any) => {
          if (prev?.wordList === data) return prev;
          return { ...prev, wordList: data };
        });
      }

      setNewData((prev: any) => {
        if (prev?.wordList === data) return prev;
        return { ...prev, wordList: data };
      });
    },
    [setControlData],
  );

  const setAsyncOptions = (val: any) => {
    //console.log(val);
  };

  return (
    <div className={`w-full ${className}`}>
      {formData.map((field: any, index: number) => {
        if (field.type === "range") {
          const disabled =
            (field.inputKey === "level" ||
              field.inputKey === "wordsPerFrame") &&
            isTest
              ? true
              : field.disabled;
          return (
            <TextInput
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
              asyncList={field?.asyncList}
              handleAsyncList={handleAsyncList}
              setIsLoading={setIsLoading}
              disabled={disabled}
              wordList={field?.wordList}
              {...field}
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
              value={field.articleSelect}
              onChange={handleChange}
              inputKey={field.inputKey}
              styleClass={field.styleClass}
              showLabel={field.showLabel}
              required={field.required}
              disabled={isTest ? true : field.disabled}
              optionId={field?.optionId}
              asyncOption={field?.asyncOption}
              asyncOptionById={field?.asyncOptionById}
              setAsyncOptions={setAsyncOptions}
              setIsLoading={setIsLoading}
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
