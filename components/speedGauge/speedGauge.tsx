"use client";
import React from "react";

type GaugeProps = {
  value: number;
  max: number;
  title: string;
  subtitle?: string;
};

export default function SpeedMeter({
  value,
  max,
  title,
  subtitle,
}: GaugeProps) {
  const r = 100; // radius
  const cx = 150; // center x
  const cy = 150; // center y
  const clamped = Math.min(Math.max(value, 0), max);

  // convert value → angle
  // 0 → -90°, max → +90°
  const angle = (clamped / max) * 180 - 90;
  const rad = (angle * Math.PI) / 180;

  const needleX = cx + r * Math.cos(rad);
  const needleY = cy + r * Math.sin(rad);

  // Generate tick marks
  const ticks = [];
  for (let i = 0; i <= 100; i += 5) {
    const a = (i / 100) * Math.PI - Math.PI; // -180° to 0°
    const isMajor = i % 10 === 0;
    const len = isMajor ? 14 : 7;

    const x1 = cx + (r - len) * Math.cos(a);
    const y1 = cy + (r - len) * Math.sin(a);

    const x2 = cx + (r + 2) * Math.cos(a);
    const y2 = cy + (r + 2) * Math.sin(a);

    ticks.push(
      <line
        key={i}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="#444"
        strokeWidth={isMajor ? 3 : 1.5}
        strokeLinecap="round"
      />
    );
  }

  return (
    <div className="w-[300px] flex flex-col items-center select-none">
      <svg width="300" height="180">
        {/* colored bands */}
        <path
          d="M 50 150 A 100 100 0 0 1 250 150"
          fill="none"
          stroke="#c0392b"
          strokeWidth="20"
        />

        <path
          d="M 90 60 A 100 100 0 0 1 210 60"
          fill="none"
          stroke="#f39c12"
          strokeWidth="20"
        />

        <path
          d="M 110 40 A 100 100 0 0 1 190 40"
          fill="none"
          stroke="#2980b9"
          strokeWidth="20"
        />

        <path
          d="M 130 20 A 100 100 0 0 1 170 20"
          fill="none"
          stroke="#27ae60"
          strokeWidth="20"
        />

        {/* ticks */}
        {ticks}

        {/* needle */}
        <line
          x1={cx}
          y1={cy}
          x2={needleX}
          y2={needleY}
          stroke="#e02424"
          strokeWidth="6"
          strokeLinecap="round"
          style={{ transition: "0.4s ease-in-out" }}
        />

        {/* needle center */}
        <circle cx={cx} cy={cy} r={8} fill="#e02424" />
      </svg>

      <div className="mt-1 text-gray-800 font-semibold text-sm">{title}</div>
      <div className="text-gray-600 text-xs">{subtitle}</div>
    </div>
  );
}
