import React from "react";
import { COLOR } from "./brand";

// The columns stay right of FROM, so they never run under the text of the cards
const FROM = 1150;
const TO = 1890;
const HEIGHT = 1080;
const BAR_WIDTH_SCALE = 2.4;
const BAR_HEIGHT_SCALE = 3.5;
const GROUPS = 34;

/** Seeded random numbers, so every frame draws the same columns */
function rng(seed: number) {
  return () => (seed = (seed * 16807) % 2147483647) / 2147483647;
}

/** Clusters of thin vertical bars with a vertical fade, denser and brighter to the right */
export const LightColumns = () => {
  const random = rng(23);
  const bars: React.ReactNode[] = [];
  for (let group = 0; group < GROUPS; group++) {
    const x = FROM + random() * (TO - FROM);
    const y = -30 + (Math.floor(random() * 4) * HEIGHT) / 3.8 + random() * 12;
    const height = (50 + random() * 70) * BAR_HEIGHT_SCALE;
    const count = 4 + Math.floor(random() * 9);
    const color = [COLOR.decor, COLOR.columns, COLOR.columns, COLOR.second][Math.floor(random() * 4)];
    const opacity = 0.3 + ((x - FROM) / (TO - FROM)) * 0.6;
    for (let i = 0; i < count; i++) {
      bars.push(
        <rect
          key={`${group}-${i}`}
          x={x + i * 5 * BAR_WIDTH_SCALE}
          y={y + random() * 8}
          width={(random() < 0.18 ? 3.4 : 1.8) * BAR_WIDTH_SCALE}
          height={height * (0.75 + random() * 0.4)}
          fill={`url(#column-${color.slice(1)})`}
          opacity={Math.min(1, opacity * (0.7 + random() * 0.7))}
        />,
      );
    }
  }
  return (
    <svg width={1920} height={HEIGHT} style={{ position: "absolute", left: 0, top: 0 }}>
      <defs>
        {[COLOR.decor, COLOR.columns, COLOR.second].map((color) => (
          <linearGradient key={color} id={`column-${color.slice(1)}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={color} stopOpacity="0" />
            <stop offset="0.75" stopColor={color} />
            <stop offset="1" stopColor={color} stopOpacity="0" />
          </linearGradient>
        ))}
      </defs>
      {bars}
    </svg>
  );
};
