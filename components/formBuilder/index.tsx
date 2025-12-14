"use client";

import React, { useState } from "react";
import TextInput from "../formInputs/textInput";
import Select from "../formInputs/select";
import formFields from "./formFields";
import TextArea from "../formInputs/textArea";
import Button from "../button/button";
import { convertToISO8601 } from "@/utils/helpers";

type FormId = keyof typeof formFields;

type FormBuilderProps = {
  id: FormId;
  data?: any;
  formTitle?: string;
  isSubmitting?: boolean;
  resError?: string;
  className?: string;
  onSubmit: (args: {
    isValid: boolean;
    formData: any;
    event: React.FormEvent;
  }) => void;
  submitBtnProps?: {
    text: string;
    type: "button" | "submit" | "reset";
  };
};

export default function FormBuilder({
  onSubmit,
  data,
  id,
  formTitle,
  isSubmitting,
  resError,
  className,
  submitBtnProps,
}: FormBuilderProps) {
  let fieldsData = formFields[id] || undefined;

  if (!fieldsData && !data) {
    return null;
  }

  if (fieldsData && data) {
    fieldsData = [...formFields[id]].map((fd: any) => {
      const value = data[fd.key];

      if (value !== undefined) {
        return {
          ...fd,
          value: {
            ...fd.value,
            value: fd?.multipleSelect ? value : value?.toString(),
          },
        };
      }
      return fd;
    });
  }

  const [formData, setFormData] = useState(fieldsData as any);
  const [newData, setNewData] = useState(data);
  const [isFormValid, setIsFormValid] = useState(true);

  const handleChange = ({
    targetValue,
    inputKey,
  }: {
    targetValue: any; // can be string, number, object, etc.
    inputKey: string;
  }) => {
    // update formData
    const newValues = formData.map((d: any) =>
      d.key === inputKey
        ? { ...d, value: { ...d.value, value: targetValue } }
        : d
    );
    setFormData(newValues);

    // build newData for submission
    const newDataObj = newValues.reduce((acc: any, newVal: any) => {
      let val: any = newVal.value.value;

      switch (newVal.value.type) {
        case "number":
          val = Number(val);
          break;
        case "boolean":
          val = val === "true" || val === true;
          break;
        case "date":
          val = convertToISO8601(val);
          break;
        case "multipleSelect":
          val = Array.isArray(val) ? val : [];
          break;

        default:
          val = Array.isArray(val) ? val : val?.toString()?.trim();
      }

      acc[newVal.key] = val;
      return acc;
    }, {} as Record<string, any>);

    setNewData(newDataObj);
    setIsFormValid(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    const isValid = formData.every((fd: any) => {
      if (!fd.required) return true;

      if (fd.multipleSelect) {
        return Array.isArray(fd.value?.value) && fd.value.value.length > 0;
      }

      return Boolean(fd.value?.value);
    });
    onSubmit({
      isValid,
      formData: { ...(data ? data : {}), ...newData },
      event: e,
    });
    setIsFormValid(isValid);
  };

  return (
    <form
      autoComplete="off"
      className={`w-full overflow-y-auto ${className}`}
      onSubmit={handleFormSubmit}
    >
      {formTitle ? (
        <h2 className="text-xl font-bold mb-5"> {formTitle} </h2>
      ) : null}

      <div className="w-full flex flex-wrap gap-3">
        {formData.map(
          (
            v: {
              type: string;
              placeholder: string;
              options: any;
              value: any;
              key: string;
              name: string;
              required: boolean;
              disabled: boolean;
              rows: number;
              maxlength: number;
              styleClass: string;
              asyncOption: () => any;
              multipleSelect: boolean;
              min: string;
              max: string;
            },
            idx: number
          ) => {
            if (v.type === "select") {
              return (
                <Select
                  key={idx + v.type}
                  asyncOption={v.asyncOption}
                  placeholder={v.placeholder}
                  options={v.options}
                  value={v.value}
                  onChange={handleChange}
                  inputKey={v.key}
                  name={v.name}
                  required={v.required}
                  disabled={v.disabled}
                  styleClass={v.styleClass}
                  multipleSelect={v.multipleSelect}
                />
              );
            }

            if (v.type === "textarea") {
              return (
                <TextArea
                  key={idx + v.type}
                  placeholder={v.placeholder}
                  type={v.type}
                  value={v.value}
                  onChange={handleChange}
                  inputKey={v.key}
                  name={v.name}
                  required={v.required}
                  disabled={v.disabled}
                  rows={v.rows}
                  maxlength={v?.maxlength}
                  styleClass={v?.styleClass}
                />
              );
            }

            return (
              <TextInput
                placeholder={v.placeholder}
                type={v.type}
                value={v.value}
                key={idx + v.type}
                inputKey={v.key}
                name={v.name}
                onChange={handleChange}
                required={v.required}
                disabled={v.disabled}
                maxlength={v.maxlength}
                styleClass={v.styleClass}
                min={v.min}
                max={v.max}
              />
            );
          }
        )}
      </div>
      {!isFormValid ? (
        <div className="text-xs text-left text-red-500 font-semibold mt-2">
          Please fill all required value
        </div>
      ) : null}

      {resError ? (
        <div className="text-xs text-left bg-[#eaeaea] py-1 px-2 text-red-500 drop-shadow font-semibold mt-2">
          {resError}
        </div>
      ) : null}

      <Button
        text={submitBtnProps?.text || "Submit"}
        type={submitBtnProps?.type || "button"}
        className="mt-5 bg-brand-primary-50 hover:bg-brand-primary-100 transition uppercase"
        isSubmiting={isSubmitting}
      />
    </form>
  );
}
