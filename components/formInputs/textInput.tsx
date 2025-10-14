import React from "react";

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
  } = props;

  return (
    <div className="w-full flex-col text-sm ">
      <label
        className="font-semibold flex gap-1 items-center"
        htmlFor={inputKey}
      >
        {name}
        {
          <span className={!value?.value ? "text-red-400" : "text-green-400"}>
            *
          </span>
        }
      </label>
      <input
        autoComplete={`new-${type}`}
        required={required}
        id={inputKey}
        name={inputKey}
        className="w-full border h-10 px-2"
        placeholder={placeholder}
        type={type}
        value={value?.value}
        onChange={(e) =>
          onChange({ targetValue: e.target.value, value, inputKey })
        }
        disabled={disabled}
      />
    </div>
  );
}

export default TextInput;
