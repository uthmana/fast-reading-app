import React from "react";

type TextAreaProps = {
  placeholder?: string;
  value: { value: string | number; key: string; type: string };
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
  rows?: number;
  maxlength?: number;

  styleClass: string;
};

function TextArea(props: TextAreaProps) {
  const {
    placeholder,
    value,
    required = false,
    name,
    onChange,
    inputKey,
    disabled,
    rows = 4,
    maxlength,
    styleClass = "",
  } = props;

  return (
    <div className={`w-full mb-2 text-sm ${styleClass}`}>
      <label className="font-medium flex gap-1 items-center" htmlFor={inputKey}>
        {name}
        {
          <span className={!value?.value ? "text-red-400" : "text-green-400"}>
            *
          </span>
        }
      </label>
      <textarea
        disabled={disabled}
        required={required}
        className="w-full border p-2"
        id={name}
        name={name}
        rows={rows}
        maxLength={maxlength}
        placeholder={placeholder}
        value={value?.value}
        onChange={(e) =>
          onChange({ targetValue: e.target.value, value, inputKey })
        }
      />
    </div>
  );
}

export default TextArea;
