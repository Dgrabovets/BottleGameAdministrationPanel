import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { BrandLockup } from "./BrandLockup";
import { LightColumns } from "./LightColumns";
import { ease, useFrame } from "./timing";

/** Closing card with the repository links */
export const Outro = () => {
  const frame = useFrame();
  const fadeIn = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp", easing: ease });
  return (
    <AbsoluteFill style={{ opacity: fadeIn }}>
      <LightColumns />
      <BrandLockup
        role="Runs against the API demo mode"
        lines={[
          "docker compose up, then npm run dev",
          "github.com/Dgrabovets/BottleGameAdministrationPanel",
          "github.com/Dgrabovets/BottleGameAPI",
        ]}
      />
    </AbsoluteFill>
  );
};
