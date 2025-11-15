"use client";

type SliderBlockWithColorProps = {
  label: string;
  value: number | string;
  description?: string;
  min: string;
  max: string;
  inputKey: string;
  onChange: any;
  colors: string[];
};

export default function SliderBlockWithColor({
  label,
  value,
  description,
  min,
  max,
  inputKey,
  onChange,
  colors,
}: SliderBlockWithColorProps) {
  const index = isNaN(Number(value)) ? 0 : Number(value) - 1;
  const colorValue = colors[index] || colors[0];

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
      {/* Label */}
      <label className="font-medium flex gap-1 w-full items-center text-white text-sm">
        {label}
        <span className="font-bold text-white/90">: {value}</span>
      </label>

      {/* Slider + Color Circle */}
      <div className="flex items-center gap-3 w-full mt-1">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          className="w-full h-2 accent-white cursor-pointer rounded-lg"
          onChange={(e) =>
            onChange({
              targetValue: e.target.value,
              inputKey,
            })
          }
        />

        {/* Circle at end */}
        <div
          className="w-5 h-5 rounded-full border border-white shadow flex-shrink-0"
          style={{ backgroundColor: colorValue }}
        ></div>
      </div>

      {/* Description */}
      {description && (
        <div className="text-[11px] text-white/70 mt-1">{description}</div>
      )}
    </div>
  );
}
