"use client";

import React from "react";
//import ReactJson from "@microlink/react-json-view";
import dynamic from "next/dynamic";

const ReactJson = dynamic(() => import("@microlink/react-json-view"), {
  ssr: false,
});

type JsonEditorProps = {
  name: string;
  inputKey: string;
  value?: { value?: any }; // same shape as other form inputs
  onChange: (args: { targetValue: any; inputKey: string }) => void;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  rows?: number;
  jsonFields?: any;
};

export default function JsonEditor({
  name,
  inputKey,
  value,
  onChange,
  required,
  disabled,
  jsonFields,
}: JsonEditorProps) {
  const jsonValue = value?.value || {};

  const handlePaste = async () => {
    if (disabled) return;
    try {
      const text = await navigator.clipboard.readText();
      const parsed = JSON.parse(text); // ensure valid JSON
      onChange({ targetValue: parsed, inputKey });
    } catch (error) {
      alert("Clipboard content is not valid JSON!");
    }
  };
  const handleChange = (updated: any) => {
    onChange({ targetValue: updated.updated_src, inputKey });
  };

  return (
    <div className="text-left">
      <div className="flex justify-between">
        <label
          className="font-semibold text-sm flex gap-1 items-center mb-1"
          htmlFor={inputKey}
        >
          {name}
          {required && (
            <span className={!value?.value ? "text-red-400" : "text-green-400"}>
              *
            </span>
          )}
        </label>
        <button
          type="button"
          onClick={handlePaste}
          className="self-start px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          disabled={disabled}
        >
          Paste JSON
        </button>
      </div>

      <div
        className={`border border-gray-200 rounded-md p-2 ${
          disabled ? "opacity-50 pointer-events-none" : ""
        }`}
      >
        <ReactJson
          src={jsonValue}
          onEdit={handleChange}
          onAdd={handleChange}
          onDelete={handleChange}
          displayDataTypes={true}
          enableClipboard={false}
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: "6px",
            padding: "8px",
            height: "220px",
            overflow: "auto",
          }}
        />
      </div>
    </div>
  );
}
