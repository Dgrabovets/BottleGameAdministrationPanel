import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
} from "remotion";
import { COLOR, MONO, SANS, useFonts } from "./brand";
import { Intro } from "./Intro";
import { Outro } from "./Outro";
import { FPS, INTRO, OUTRO, SCALE, ease, useFrame } from "./timing";

const OV = 14; // frames of overlap between scenes
const WIN_W = 1440;
const WIN_H = 900; // the window shows a whole screenshot, so nothing is cut at zoom 1
const WIN_SCALE = 0.9; // shrinks the window to leave room for the caption
const BAR_H = 40;
const IMG_W = 1440;
const SIDEBAR_W = 290; // width of the sidebar in the screenshots, it must not slide with the rows

const CARD = "rgb(18,32,49)";
const PANEL_FONT = "Satoshi, 'Segoe UI', Arial, sans-serif"; // text that imitates the panel itself

// ---------------------------------------------------------------- camera

type Key = { f: number; cx: number; cy: number; z: number };
type Cam = { cx: number; cy: number; z: number };

/** Interpolates the camera between keyframes, p is the progress 0..1 of the scene */
function camAt(keys: Key[], p: number, imgH: number): Cam {
  let a = keys[0];
  let b = keys[keys.length - 1];
  for (let i = 0; i < keys.length - 1; i++) {
    if (p >= keys[i].f && p <= keys[i + 1].f) {
      a = keys[i];
      b = keys[i + 1];
      break;
    }
  }
  const t = b.f === a.f ? 1 : ease((p - a.f) / (b.f - a.f));
  const z = a.z + (b.z - a.z) * t;
  const cx = a.cx + (b.cx - a.cx) * t;
  const cy = a.cy + (b.cy - a.cy) * t;
  return {
    z,
    cx: Math.min(Math.max(cx, IMG_W / 2 / z), IMG_W - IMG_W / 2 / z),
    cy: Math.min(Math.max(cy, WIN_H / 2 / z), Math.max(imgH - WIN_H / 2 / z, WIN_H / 2 / z)),
  };
}

/** Converts a point of the screenshot to a point of the window */
function toWin(cam: Cam, x: number, y: number) {
  return { x: (x - cam.cx) * cam.z + WIN_W / 2, y: (y - cam.cy) * cam.z + WIN_H / 2 };
}

// The whole screenshot
const FULL = { cx: 720, cy: 450, z: 1 };
// The only zoom that hides the whole sidebar and keeps the page uncut from its left to its right edge
const PAGE = { cx: 873, z: 1.27 };

/** Camera that zooms from the whole screenshot to the page at the height cy and stays there */
function zoomToPage(reached: number, cy: number): Key[] {
  return [
    { f: 0, ...FULL },
    { f: reached, ...PAGE, cy },
    { f: 1, ...PAGE, cy },
  ];
}

// ---------------------------------------------------------------- scenes

type Band = { y0: number; rowH: number; count: number; delay: number; stagger: number };
type Callout = { x: number; y: number; dx: number; dy: number; text: string; from: number; to: number };
type SceneDef = {
  id: string;
  image: string;
  imgH: number;
  seconds: number;
  title: string;
  caption: string;
  cam: Key[];
  bands?: Band;
  callouts?: Callout[];
};

const SCENES: SceneDef[] = [
  {
    id: "dashboard",
    image: "dashboard.jpg",
    imgH: 900,
    seconds: 5,
    title: "Dashboard",
    caption: "Income, deposits, players and pending withdrawals for any period",
    cam: [
      { f: 0, ...FULL },
      { f: 0.15, ...PAGE, cy: 354 },
      { f: 0.5, ...PAGE, cy: 354 },
      { f: 0.7, ...FULL },
      { f: 1, ...FULL },
    ],
    callouts: [{ x: 650, y: 888, dx: 270, dy: -18, text: "Live: refreshes every 5 seconds", from: 0.65, to: 1 }],
  },
  {
    id: "players",
    image: "players.jpg",
    imgH: 900,
    seconds: 4.5,
    title: "Players",
    caption: "Search by Telegram id or name, ban and unban",
    cam: zoomToPage(0.3, 423),
    bands: { y0: 313, rowH: 93, count: 6, delay: 8, stagger: 5 },
    callouts: [
      { x: 1370, y: 209, dx: -570, dy: 0, text: "Search by Telegram id or name", from: 0.35, to: 0.62 },
      { x: 1357, y: 452, dx: -430, dy: 20, text: "Ban or unban in one click", from: 0.62, to: 1 },
    ],
  },
  {
    id: "player",
    image: "player.jpg",
    imgH: 900,
    seconds: 3.5,
    title: "Player profile",
    caption: "Balance, moderation, round history and transactions",
    cam: zoomToPage(0.35, 449),
    callouts: [
      { x: 1198, y: 405, dx: -709, dy: 247, text: "Direct balance edit: debug only, read-only in production", from: 0.4, to: 0.9 },
    ],
  },
  {
    id: "withdrawals",
    image: "withdrawals.jpg",
    imgH: 900,
    seconds: 4.5,
    title: "Withdrawals",
    caption: "Approve or reject: the status can change only once",
    cam: zoomToPage(0.3, 354),
    bands: { y0: 296, rowH: 93, count: 4, delay: 8, stagger: 7 },
    callouts: [{ x: 1342, y: 342, dx: -435, dy: -272, text: "Approve or reject a request", from: 0.28, to: 0.52 }],
  },
  {
    id: "deposits",
    image: "deposits.jpg",
    imgH: 900,
    seconds: 2.5,
    title: "Deposits",
    caption: "Every top-up with its status",
    cam: zoomToPage(0.5, 445),
    bands: { y0: 242, rowH: 93, count: 7, delay: 6, stagger: 5 },
  },
  {
    id: "settings",
    image: "settings.jpg",
    imgH: 900,
    seconds: 3.5,
    title: "Game settings",
    caption: "Win chances, multipliers and boosts",
    cam: zoomToPage(0.35, 430),
    callouts: [{ x: 1245, y: 367, dx: -440, dy: -145, text: "Edited live and saved through the API", from: 0.4, to: 0.95 }],
  },
];

const SCENE_FRAMES = SCENES.map((s) => Math.round(s.seconds * FPS));
export const TOTAL_FRAMES = (INTRO + SCENE_FRAMES.reduce((a, b) => a + b, 0) + OUTRO) * SCALE;

// ---------------------------------------------------------------- scene pieces

/** Image rows that slide in one after another */
const Bands = ({ image, imgH, band, frame }: { image: string; imgH: number; band: Band; frame: number }) => {
  const end = band.y0 + band.rowH * band.count;
  const src = staticFile(image);
  const base = (clip: string) => (
    <Img src={src} style={{ position: "absolute", left: 0, top: 0, width: IMG_W, clipPath: clip }} />
  );
  return (
    <>
      {base(`inset(0px 0px ${imgH - band.y0}px 0px)`)}
      {base(`inset(${end}px 0px 0px 0px)`)}
      {base(`inset(${band.y0}px ${IMG_W - SIDEBAR_W}px ${imgH - end}px 0px)`)}
      {Array.from({ length: band.count }, (_, i) => {
        const t = interpolate(frame, [band.delay + i * band.stagger, band.delay + i * band.stagger + 16], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: ease,
        });
        const top = band.y0 + i * band.rowH;
        return (
          <Img
            key={i}
            src={src}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: IMG_W,
              clipPath: `inset(${top}px 0px ${imgH - top - band.rowH}px ${SIDEBAR_W}px)`,
              opacity: t,
              transform: `translateX(${(1 - t) * 120}px)`,
            }}
          />
        );
      })}
    </>
  );
};

const NUMBERS = [
  { x: 363, y: 296, target: 8600, kind: "money" },
  { x: 578, y: 296, target: 19000, kind: "money" },
  { x: 793, y: 296, target: 19000, kind: "money" },
  { x: 1009, y: 296, target: 8, kind: "int" },
  { x: 1224, y: 296, target: 750, kind: "money" },
  { x: 363, y: 782, target: 19000, kind: "money" },
  { x: 722, y: 782, target: 19000, kind: "money" },
  { x: 1081, y: 782, target: 8, kind: "int" },
];

function formatCount(v: number, kind: string): string {
  if (kind === "int") return String(Math.round(v));
  if (v >= 10000) return `${Math.round(v / 1000)}K ₽`;
  if (v >= 1000) return `${(v / 1000).toFixed(1)}K ₽`;
  return `${Math.round(v)} ₽`;
}

/** Dashboard numbers that count up from zero */
const DashboardLive = ({ frame }: { frame: number }) => {
  const count = interpolate(frame, [18, 80], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return (
    <>
      {count < 1 &&
        NUMBERS.map((n, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: n.x - 6,
              top: n.y,
              width: 150,
              height: 34,
              background: CARD,
              color: "white",
              fontFamily: PANEL_FONT,
              fontWeight: 700,
              fontSize: 26,
              lineHeight: "34px",
              paddingLeft: 6,
            }}
          >
            {formatCount(n.target * count, n.kind)}
          </div>
        ))}
    </>
  );
};

/** Pending turns into Approved with a flash, the action icons disappear */
const ApproveFlash = ({ frame, at }: { frame: number; at: number }) => {
  const t = interpolate(frame, [at, at + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (t <= 0) return null;
  const ring = interpolate(frame, [at, at + 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <>
      <div style={{ position: "absolute", left: 1290, top: 318, width: 110, height: 48, background: CARD }} />
      <div
        style={{
          position: "absolute",
          left: 950,
          top: 322,
          width: 110,
          height: 40,
          background: CARD,
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          style={{
            marginLeft: 10,
            padding: "5px 14px",
            borderRadius: 20,
            background: "rgba(33,150,83,0.16)",
            color: "#2fbf71",
            fontFamily: PANEL_FONT,
            fontWeight: 500,
            fontSize: 15,
            transform: `scale(${1 + (1 - t) * 0.3})`,
          }}
        >
          Approved
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 960,
          top: 328,
          width: 90,
          height: 28,
          borderRadius: 20,
          border: "2px solid #2fbf71",
          opacity: 1 - ring,
          transform: `scale(${1 + ring * 1.2})`,
        }}
      />
    </>
  );
};

/** Label with a leader line and a pulsing target point, placed in window coordinates */
const CalloutView = ({ c, cam, frame, len }: { c: Callout; cam: Cam; frame: number; len: number }) => {
  const fps = FPS;
  const start = c.from * len;
  const end = c.to * len;
  const appear = Math.min(spring({ frame: frame - start, fps, config: { damping: 18, stiffness: 140 } }), 1);
  const out = interpolate(frame, [end - 8, end], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (frame < start || out <= 0) return null;
  const p = toWin(cam, c.x, c.y);
  const lx = p.x + c.dx;
  const ly = p.y + c.dy;
  const pulse = ((frame - start) % 40) / 40;
  const opacity = appear * out;
  return (
    <>
      <svg width={WIN_W} height={WIN_H} style={{ position: "absolute", left: 0, top: 0, opacity }}>
        <line x1={p.x} y1={p.y} x2={lx} y2={ly} stroke={COLOR.second} strokeWidth={2.5} strokeDasharray="6 6" />
        <circle cx={p.x} cy={p.y} r={7} fill={COLOR.accent} />
        <circle cx={p.x} cy={p.y} r={7 + pulse * 26} fill="none" stroke={COLOR.accent} strokeWidth={2.5} opacity={1 - pulse} />
      </svg>
      <div
        style={{
          position: "absolute",
          left: lx,
          top: ly,
          transform: `translate(-50%,-50%) scale(${0.85 + 0.15 * appear})`,
          opacity,
          padding: "12px 20px",
          borderRadius: 14,
          background: COLOR.surface,
          border: `2px solid ${COLOR.accent}`,
          boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
          color: COLOR.text,
          fontFamily: SANS,
          fontWeight: 500,
          fontSize: 25,
          whiteSpace: "nowrap",
        }}
      >
        {c.text}
      </div>
    </>
  );
};

/** One page of the app in a floating browser window with a moving camera */
const SceneView = ({ scene, len }: { scene: SceneDef; len: number }) => {
  const raw = useFrame();
  const fps = FPS;
  const frame = Math.max(raw - OV, 0); // local frame, the first OV frames are the slide-in
  const total = len + OV * 2;
  const tin = ease(interpolate(raw, [0, OV * 1.6], [0, 1], { extrapolateRight: "clamp" }));
  const tout = ease(interpolate(raw, [total - OV * 1.6, total], [0, 1], { extrapolateLeft: "clamp" }));
  const cam = camAt(scene.cam, Math.min(frame / len, 1), scene.imgH);
  // The caption appears once the window has slid in and leaves quickly, so two captions are never on screen together
  const textIn = spring({ frame: raw - OV, fps, config: { damping: 200 } });
  const textOut = interpolate(tout, [0, 0.35], [1, 0], { extrapolateRight: "clamp" });
  const sx = (1 - tin) * 320 - tout * 320;
  const ry = (1 - tin) * -16 + tout * 16 + Math.sin(raw / 38) * 2.2;
  const rx = 3 + Math.cos(raw / 47) * 1.4;
  const floatY = Math.sin(raw / 30) * 7;

  return (
    <AbsoluteFill style={{ opacity: tin * (1 - tout), fontFamily: SANS }}>
      <div style={{ position: "absolute", left: 240, top: 40, perspective: 2400, transform: `scale(${WIN_SCALE})`, transformOrigin: "50% 0" }}>
        <div
          style={{
            width: WIN_W,
            transform: `translate(${sx}px, ${floatY}px) rotateX(${rx}deg) rotateY(${ry}deg)`,
            transformStyle: "preserve-3d",
            borderRadius: 18,
            overflow: "hidden",
            boxShadow: `0 0 0 1px ${COLOR.border}, 0 0 80px rgba(95,224,138,0.16)`,
            background: COLOR.surface,
          }}
        >
          <div style={{ height: BAR_H, background: COLOR.surface, display: "flex", alignItems: "center", gap: 9, padding: "0 16px" }}>
            {[COLOR.decor, COLOR.second, COLOR.accent].map((c) => (
              <div key={c} style={{ width: 13, height: 13, borderRadius: 7, background: c }} />
            ))}
            <div
              style={{
                marginLeft: 18,
                flex: 1,
                height: 24,
                borderRadius: 12,
                background: COLOR.background,
                color: COLOR.muted,
                fontSize: 14,
                display: "flex",
                alignItems: "center",
                paddingLeft: 14,
              }}
            >
              localhost:3000
            </div>
          </div>
          <div style={{ width: WIN_W, height: WIN_H, overflow: "hidden", position: "relative" }}>
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: IMG_W,
                height: scene.imgH,
                transformOrigin: "0 0",
                transform: `translate(${WIN_W / 2 - cam.cx * cam.z}px, ${WIN_H / 2 - cam.cy * cam.z}px) scale(${cam.z})`,
              }}
            >
              {scene.bands ? (
                <Bands image={scene.image} imgH={scene.imgH} band={scene.bands} frame={frame} />
              ) : (
                <Img src={staticFile(scene.image)} style={{ position: "absolute", left: 0, top: 0, width: IMG_W }} />
              )}
              {scene.id === "dashboard" && <DashboardLive frame={frame} />}
              {scene.id === "withdrawals" && <ApproveFlash frame={frame} at={Math.round(len * 0.55)} />}
            </div>
            {(scene.callouts ?? []).map((c, i) => (
              <CalloutView key={i} c={c} cam={cam} frame={frame} len={len} />
            ))}
          </div>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 34,
          textAlign: "center",
          opacity: textIn * textOut,
          transform: `translateY(${(1 - textIn) * 28}px)`,
        }}
      >
        <div style={{ width: 44, height: 5, borderRadius: 3, margin: "0 auto 10px", background: COLOR.accent }} />
        <div style={{ fontFamily: MONO, fontSize: 46, fontWeight: 700, color: COLOR.text }}>{scene.title}</div>
        <div style={{ fontSize: 28, marginTop: 4, color: COLOR.muted }}>{scene.caption}</div>
      </div>
    </AbsoluteFill>
  );
};

/** The whole demo video: intro, one scene per page, outro */
export const AdminDemo = () => {
  useFonts();
  const parts: React.ReactNode[] = [];
  let start = INTRO;
  SCENES.forEach((scene, i) => {
    const len = SCENE_FRAMES[i];
    parts.push(
      <Sequence key={scene.id} from={(start - OV) * SCALE} durationInFrames={(len + OV * 2) * SCALE}>
        <SceneView scene={scene} len={len} />
      </Sequence>,
    );
    start += len;
  });
  return (
    <AbsoluteFill style={{ background: COLOR.background }}>
      <Sequence from={0} durationInFrames={INTRO * SCALE}>
        <Intro />
      </Sequence>
      {parts}
      <Sequence from={(start - OV) * SCALE} durationInFrames={(OUTRO + OV) * SCALE}>
        <Outro />
      </Sequence>
    </AbsoluteFill>
  );
};
