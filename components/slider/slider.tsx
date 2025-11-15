import React, { useState } from "react";

type SliderProps = {
  /** Label shown above the slider */
  label?: string;

  /** Minimum slider value */
  min?: number;

  /** Maximum slider value */
  max?: number;

  /** Step interval */
  step?: number;

  /** Default slider value */
  defaultValue?: number;

  /** Called whenever the slider value changes */
  onChange?: (value: number) => void;
};

export default function Slider({
  label = "Speed",
  min = 1,
  max = 5,
  step = 1,
  defaultValue = 1,
  onChange,
}: SliderProps) {
  const [value, setValue] = useState(defaultValue);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    setValue(newValue);
    onChange?.(newValue);
  };

  return (
    <div className="flex flex-col items-start w-full max-w-sm">
      {label && (
        <label className="mb-2 text-sm font-semibold text-gray-700">
          {label}: <span className="text-blue-600">{value}</span>
        </label>
      )}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        className="w-full accent-blue-500 cursor-pointer"
      />
    </div>
  );
}
