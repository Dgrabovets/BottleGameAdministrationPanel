import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { BrandLockup } from "./BrandLockup";
import { LightColumns } from "./LightColumns";
import { INTRO, ease, useFrame } from "./timing";

/** Title card: the brand lockup fades in and out */
export const Intro = () => {
  const frame = useFrame();
  const fadeIn = interpolate(frame, [0, 24], [0, 1], { extrapolateRight: "clamp", easing: ease });
  const fadeOut = interpolate(frame, [INTRO - 12, INTRO], [1, 0], { extrapolateLeft: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: fadeIn * fadeOut }}>
      <LightColumns />
      <BrandLockup role="Next.js 15 · React 19 · TypeScript · Tailwind CSS" lines={["Back office of a Telegram mini-app game"]} />
    </AbsoluteFill>
  );
};
