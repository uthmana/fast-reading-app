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
    fieldsData = [...formFields[id]].map((fd) => {
      const value = data[fd.key];

      if (value !== undefined) {
        return { ...fd, value: { ...fd.value, value: value.toString() } };
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
    targetValue: string | number;
    inputKey: string;
  }) => {
    let newValues = [...formData].map((d) => {
      if (d.key === inputKey) {
        return { ...d, value: { ...d.value, value: targetValue } };
      }
      return d;
    });

    setFormData(newValues);

    const newData = [...newValues].map((newVal) => {
      let val = newVal.value.value?.toString();
      if (newVal.value.type === "number") {
        val = parseInt(newVal.value.value);
      }
      if (newVal.value.type === "boolean") {
        const valStr = newVal.value.value;
        val = valStr === "true" || valStr === true;
      }

      if (newVal.value.type === "date") {
        val = convertToISO8601(newVal.value.value);
      }

      return {
        [newVal.key]: val,
      };
    });

    setNewData(Object.assign({}, ...newData));
    setIsFormValid(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    const isValid = formData.every(
      (fd: { required: Boolean; value: { value: any } }) =>
        !fd.required || Boolean(fd.value?.value)
    );

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
      className={`w-full ${className}`}
      onSubmit={handleFormSubmit}
    >
      {formTitle ? (
        <h2 className="text-xl font-bold mb-5"> {formTitle} </h2>
      ) : null}

      <div className="w-full flex flex-col gap-3">
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
            },
            idx: number
          ) => {
            if (v.type === "select") {
              return (
                <Select
                  key={idx + v.type}
                  placeholder={v.placeholder}
                  options={v.options}
                  value={v.value}
                  onChange={handleChange}
                  inputKey={v.key}
                  name={v.name}
                  required={v.required}
                  disabled={v.disabled}
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
        <div className="text-xs text-left text-red-500 font-semibold mt-2">
          {resError}
        </div>
      ) : null}

      <Button
        text={submitBtnProps?.text || "Submit"}
        type={submitBtnProps?.type || "button"}
        className="mt-5"
        isSubmiting={isSubmitting}
      />
    </form>
  );
}
