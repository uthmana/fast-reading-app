import React from "react";

type InputProps = {
  value?: { value: string | number; key: string; type: string };
  name?: string;
  type?: string;
  required?: boolean;
  onChange: (args: {
    targetValue: boolean | string | number;
    value: any;
    inputKey: string;
    selectedData: any;
  }) => void;
  inputKey: string;
  disabled?: boolean;
  maxlength?: number;
  styleClass?: string;
  description?: string;
  showLabel?: boolean;
  labelClassName?: string;
};

export default function CheckboxInput(props: InputProps) {
  const {
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
    showLabel = true,
    description,
    ...rest
  } = props;

  return (
    <div className="w-full text-left flex-col items-center pt-3 gap-3 px-1">
      <label className="text-white block mb-2 font-medium text-sm">
        <input
          className=""
          type="checkbox"
          checked={value?.value === "true" || value?.value === (true as any)}
          onChange={(e) => {
            onChange({
              targetValue: e.target.checked,
              value,
              inputKey,
              selectedData: "",
            });
          }}
          {...rest}
        />
        <span> Kaydırma</span>
      </label>
      <div className="text-xs">Kelime yukarıdan aşağıya kaysın mı?</div>
    </div>
  );
}
