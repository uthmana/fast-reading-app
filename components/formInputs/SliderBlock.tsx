"use client";

type SliderBlockProps = {
  label: string;
  value: number | string;
  description?: string;
  min: string;
  max: string;
  inputKey: string;
  onChange: any;
};

export default function SliderBlock({
  label,
  value,
  description,
  min,
  max,
  inputKey,
  onChange,
}: SliderBlockProps) {
  return (
    <div
      className="
       flex flex-col 
        flex-1 
        min-w-[180px] 
        max-w-[240px] 
        mb-3 
        px-1
      "
    >
      {/* Label same style as TextInput */}
      <label className="font-medium flex gap-1 w-full items-center text-white text-sm">
        {label}
        <span className="font-bold text-white/90">: {value}</span>
      </label>

      {/* Slider */}
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        className="w-full h-2 mt-1 accent-white cursor-pointer rounded-lg"
        onChange={(e) =>
          onChange({
            targetValue: e.target.value,
            inputKey,
          })
        }
      />

      {/* Description */}
      {description && (
        <div className="text-[11px] text-white/70 mt-1">{description}</div>
      )}
    </div>
  );
}
