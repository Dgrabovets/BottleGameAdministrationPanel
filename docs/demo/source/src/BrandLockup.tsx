import React from "react";
import { COLOR, MONO, SANS } from "./brand";

type Props = {
  /** Green line under the title */
  role: string;
  /** Muted lines at the bottom */
  lines: string[];
};

/** Left aligned brand lockup: accent bar and handle, project name, role line and muted text */
export const BrandLockup = ({ role, lines }: Props) => (
  <div
    style={{
      position: "absolute",
      left: 126,
      top: 0,
      bottom: 0,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      whiteSpace: "nowrap",
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
      <div style={{ width: 61, height: 9, borderRadius: 5, background: COLOR.accent }} />
      <div style={{ fontFamily: MONO, fontWeight: 500, fontSize: 33, letterSpacing: 13, color: COLOR.accent }}>DGRABOVETS</div>
    </div>
    <div style={{ marginTop: 34, fontFamily: MONO, fontWeight: 700, fontSize: 120, lineHeight: 1.12, color: COLOR.text }}>
      Bottle Game
      <br />
      Admin Panel
    </div>
    <div style={{ marginTop: 40, marginBottom: 20, fontFamily: MONO, fontWeight: 500, fontSize: 32, color: COLOR.accent }}>{role}</div>
    {lines.map((line) => (
      <div key={line} style={{ marginTop: 14, fontFamily: SANS, fontSize: 34, color: COLOR.muted }}>
        {line}
      </div>
    ))}
  </div>
);
