"use client";

import dynamic from "next/dynamic";
import React from "react";
const ReactSpeedometer = dynamic(() => import("react-d3-speedometer"), {
  ssr: false,
});

type Range = {
  red: [number, number];
  blue: [number, number];
  green: [number, number];
};

type GaugeProps = {
  value: number;
  max: number;
  title: string;
  ranges?: Range;
  needleColor?: string;
  width?: number;
  height?: number;
  ticksWidth?: string;
  ticksHeight?: string;
  className?: string;
  valueTextFontSize?: string;
  segmentsList?: Array<{ start: number; end: number; color: string }>;
};

export default function SpeedGauge({
  value,
  max,
  title = "Value: ${value}",
  className = "",
  needleColor = "#715540",
  width = 260,
  height = 180,
  valueTextFontSize = "12px",
  ticksWidth = "260",
  ticksHeight = "154",
  ranges = {
    red: [0, 40],
    blue: [40, 60],
    green: [60, 100],
  },
  segmentsList,
}: GaugeProps) {
  const segments = segmentsList || [
    { start: ranges.red[0], end: ranges.red[1], color: "#ff1d00" },
    { start: 10, end: 20, color: "#ff1d00" },
    { start: 20, end: 40, color: "#ff1d00" },
    { start: 40, end: 50, color: "#1c7ff3" },
    { start: ranges.blue[0], end: ranges.blue[1], color: "#1c7ff3" },
    { start: 60, end: 80, color: "#0cc042" },
    { start: ranges.green[0], end: ranges.green[1], color: "#0cc042" },
  ];

  const segmentStops = segments.map((s) => s.end);
  const segmentColors = segments.map((s) => s.color);

  return (
    <div className={`relative w-full flex flex-col items-center ${className}`}>
      {/* MAIN SPEEDOMETER */}
      <ReactSpeedometer
        minValue={0}
        maxValue={max}
        value={value || 0}
        needleColor={needleColor}
        currentValueText={title}
        needleTransitionDuration={1500}
        segments={segments.length}
        segmentColors={segmentColors}
        customSegmentStops={[0, ...segmentStops]}
        height={height}
        width={width}
        ringWidth={4}
        textColor="#333"
        valueTextFontSize={valueTextFontSize}
        labelFontSize="12px"
      />

      {/* TICKS OVERLAY */}
      {value !== null && value !== undefined && (
        <svg
          width={ticksWidth}
          height={ticksHeight}
          viewBox="0 0 260 180"
          className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
        >
          {renderTicks(130, 150, 105)}
        </svg>
      )}
    </div>
  );
}

/* ──────────── CUSTOM TICKS DRAWER ──────────── */

function renderTicks(cx: number, cy: number, radius: number) {
  const ticks = [];

  for (let i = 0; i <= 10; i++) {
    const percent = i / 10;
    const angle = Math.PI * (1 + percent); // 180° → 360°

    const isMajor = i % 2 === 0;

    // smaller tick lengths
    const r1 = radius - (isMajor ? 12 : 6);
    const r2 = radius;

    const x1 = cx + r1 * Math.cos(angle);
    const y1 = cy + r1 * Math.sin(angle);
    const x2 = cx + r2 * Math.cos(angle);
    const y2 = cy + r2 * Math.sin(angle);

    ticks.push(
      <line
        key={i}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="#555"
        strokeWidth={isMajor ? 2 : 1}
        strokeLinecap="round"
      />
    );
  }

  return ticks;
}
