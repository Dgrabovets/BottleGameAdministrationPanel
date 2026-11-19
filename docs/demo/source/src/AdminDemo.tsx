import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
} from "remotion";

/** The timeline is written in frames of a 30 fps video, the video itself is rendered at SCALE times that rate */
const FPS = 30;
export const SCALE = 2;
export const RENDER_FPS = FPS * SCALE;

/** Current frame in 30 fps units, fractional between them, so every animation moves on each rendered frame */
const useFrame = () => useCurrentFrame() / SCALE;

const OV = 14; // frames of overlap between scenes
const WIN_W = 1440;
const WIN_H = 810;
const BAR_H = 40;
const IMG_W = 1440;
const SIDEBAR_W = 290; // width of the sidebar in the screenshots, it must not slide with the rows

const CARD = "rgb(18,32,49)";
const FONT = "Satoshi, 'Segoe UI', Arial, sans-serif";
const ease = Easing.bezier(0.45, 0, 0.2, 1);

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
    id: "login",
    image: "login.png",
    imgH: 900,
    seconds: 3,
    title: "Sign in",
    caption: "Cookie session, the JWT never reaches the browser",
    cam: [
      { f: 0, cx: 720, cy: 450, z: 1 },
      { f: 0.55, cx: 372, cy: 420, z: 1.5 },
      { f: 1, cx: 372, cy: 470, z: 1.6 },
    ],
    callouts: [{ x: 372, y: 532, dx: 330, dy: -120, text: "Server-side proxy and rate limit", from: 0.45, to: 1 }],
  },
  {
    id: "dashboard",
    image: "tall-dashboard.png",
    imgH: 1500,
    seconds: 6,
    title: "Dashboard",
    caption: "Income, deposits, players and pending withdrawals for any period",
    cam: [
      { f: 0, cx: 720, cy: 450, z: 1 },
      { f: 0.2, cx: 840, cy: 300, z: 1.4 },
      { f: 0.42, cx: 840, cy: 320, z: 1.4 },
      { f: 0.58, cx: 720, cy: 740, z: 1.15 },
      { f: 0.76, cx: 720, cy: 1230, z: 1.3 },
      { f: 1, cx: 720, cy: 1230, z: 1.3 },
    ],
    callouts: [
      { x: 640, y: 888, dx: -60, dy: -150, text: "Live: refreshes every 5 seconds", from: 0.5, to: 0.7 },
      { x: 1250, y: 1110, dx: -330, dy: -170, text: "Charts built from the timeline API", from: 0.8, to: 1 },
    ],
  },
  {
    id: "players",
    image: "tall-players.png",
    imgH: 1100,
    seconds: 4.5,
    title: "Players",
    caption: "Search by Telegram id or name, ban and unban",
    cam: [
      { f: 0, cx: 720, cy: 450, z: 1 },
      { f: 0.5, cx: 1000, cy: 420, z: 1.3 },
      { f: 1, cx: 1000, cy: 520, z: 1.35 },
    ],
    bands: { y0: 313, rowH: 93, count: 8, delay: 8, stagger: 5 },
    callouts: [
      { x: 1370, y: 209, dx: -570, dy: 0, text: "Search by Telegram id or name", from: 0.35, to: 0.62 },
      { x: 1357, y: 452, dx: -430, dy: 20, text: "Ban or unban in one click", from: 0.62, to: 1 },
    ],
  },
  {
    id: "player",
    image: "tall-player.png",
    imgH: 1900,
    seconds: 5,
    title: "Player profile",
    caption: "Balance, moderation, round history and transactions",
    cam: [
      { f: 0, cx: 720, cy: 450, z: 1 },
      { f: 0.3, cx: 1000, cy: 400, z: 1.3 },
      { f: 0.55, cx: 780, cy: 800, z: 1.05 },
      { f: 1, cx: 780, cy: 1300, z: 1.05 },
    ],
    bands: { y0: 864, rowH: 61, count: 12, delay: 50, stagger: 3 },
    callouts: [
      { x: 1198, y: 405, dx: -520, dy: 150, text: "Direct balance edit: debug only, read-only in production", from: 0.15, to: 0.45 },
    ],
  },
  {
    id: "withdrawals",
    image: "withdrawals.png",
    imgH: 900,
    seconds: 4.5,
    title: "Withdrawals",
    caption: "Approve or reject: the status can change only once",
    cam: [
      { f: 0, cx: 720, cy: 450, z: 1 },
      { f: 0.4, cx: 920, cy: 380, z: 1.4 },
      { f: 1, cx: 1000, cy: 380, z: 1.5 },
    ],
    bands: { y0: 296, rowH: 93, count: 4, delay: 8, stagger: 7 },
    callouts: [{ x: 1342, y: 342, dx: -470, dy: 130, text: "Approve or reject a request", from: 0.28, to: 0.52 }],
  },
  {
    id: "deposits",
    image: "deposits.png",
    imgH: 900,
    seconds: 2.5,
    title: "Deposits",
    caption: "Every top-up with its status",
    cam: [
      { f: 0, cx: 720, cy: 450, z: 1 },
      { f: 1, cx: 860, cy: 520, z: 1.2 },
    ],
    bands: { y0: 242, rowH: 93, count: 7, delay: 6, stagger: 5 },
  },
  {
    id: "settings",
    image: "tall-settings.png",
    imgH: 1780,
    seconds: 4,
    title: "Game settings",
    caption: "Win chances, multipliers and the application balance threshold",
    cam: [
      { f: 0, cx: 720, cy: 450, z: 1 },
      { f: 0.3, cx: 860, cy: 420, z: 1.3 },
      { f: 0.7, cx: 860, cy: 1000, z: 1.2 },
      { f: 1, cx: 860, cy: 1500, z: 1.2 },
    ],
    callouts: [
      { x: 1245, y: 367, dx: -520, dy: 120, text: "Edited live and saved through the API", from: 0.12, to: 0.4 },
      { x: 615, y: 1620, dx: 330, dy: -140, text: "Lower threshold guards payouts", from: 0.8, to: 1 },
    ],
  },
];

const INTRO = 3.5 * FPS;
const OUTRO = 3 * FPS;
const SCENE_FRAMES = SCENES.map((s) => Math.round(s.seconds * FPS));
export const TOTAL_FRAMES = (INTRO + SCENE_FRAMES.reduce((a, b) => a + b, 0) + OUTRO) * SCALE;

// ---------------------------------------------------------------- background

/** Dark gradient with slowly drifting light blobs and a faint grid */
const Backdrop = () => {
  const frame = useFrame();
  const blob = (color: string, x: number, y: number, size: number, sx: number, sy: number, ph: number) => (
    <div
      style={{
        position: "absolute",
        left: x + Math.sin(frame / sx + ph) * 160,
        top: y + Math.cos(frame / sy + ph) * 110,
        width: size,
        height: size,
        borderRadius: size,
        background: `radial-gradient(circle, ${color} 0%, rgba(0,0,0,0) 68%)`,
      }}
    />
  );
  return (
    <AbsoluteFill style={{ background: "linear-gradient(135deg,#050816,#0d1230 55%,#150d2e)" }}>
      {blob("rgba(79,70,229,0.55)", 100, 80, 900, 90, 110, 0)}
      {blob("rgba(14,165,233,0.35)", 1100, 380, 800, 120, 80, 2)}
      {blob("rgba(168,85,247,0.35)", 600, 700, 700, 100, 130, 4)}
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          transform: `translateY(${(frame * 0.4) % 64}px)`,
        }}
      />
    </AbsoluteFill>
  );
};

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

/** Dashboard numbers that count up from zero, and charts that are drawn from left to right */
const DashboardLive = ({ frame, len }: { frame: number; len: number }) => {
  const count = interpolate(frame, [18, 80], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const reveal = interpolate(frame, [len * 0.62, len * 0.88], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
  const charts = [
    { x: 366, w: 470 },
    { x: 900, w: 470 },
  ];
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
              fontFamily: FONT,
              fontWeight: 700,
              fontSize: 26,
              lineHeight: "34px",
              paddingLeft: 6,
            }}
          >
            {formatCount(n.target * count, n.kind)}
          </div>
        ))}
      {reveal < 1 &&
        charts.map((c, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: c.x + c.w * reveal,
              top: 1096,
              width: c.w * (1 - reveal) + 4,
              height: 310,
              background: CARD,
              boxShadow: reveal > 0 ? "-12px 0 24px rgba(79,70,229,0.5)" : undefined,
            }}
          />
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
            fontFamily: FONT,
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
        <line x1={p.x} y1={p.y} x2={lx} y2={ly} stroke="#818cf8" strokeWidth={2.5} strokeDasharray="6 6" />
        <circle cx={p.x} cy={p.y} r={7} fill="#818cf8" />
        <circle cx={p.x} cy={p.y} r={7 + pulse * 26} fill="none" stroke="#818cf8" strokeWidth={2.5} opacity={1 - pulse} />
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
          background: "rgba(10,14,35,0.94)",
          border: "1.5px solid #6366f1",
          boxShadow: "0 0 30px rgba(99,102,241,0.55)",
          color: "white",
          fontFamily: FONT,
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
    <AbsoluteFill style={{ opacity: tin * (1 - tout), fontFamily: FONT }}>
      <div style={{ position: "absolute", left: 240, top: 50, perspective: 2400 }}>
        <div
          style={{
            width: WIN_W,
            transform: `translate(${sx}px, ${floatY}px) rotateX(${rx}deg) rotateY(${ry}deg)`,
            transformStyle: "preserve-3d",
            borderRadius: 18,
            overflow: "hidden",
            boxShadow: "0 50px 140px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.08), 0 0 80px rgba(99,102,241,0.25)",
            background: "#0b1220",
          }}
        >
          <div style={{ height: BAR_H, background: "#111a2c", display: "flex", alignItems: "center", gap: 9, padding: "0 16px" }}>
            {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
              <div key={c} style={{ width: 13, height: 13, borderRadius: 7, background: c }} />
            ))}
            <div
              style={{
                marginLeft: 18,
                flex: 1,
                height: 24,
                borderRadius: 12,
                background: "#0b1220",
                color: "#7b8aa5",
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
              {scene.id === "dashboard" && <DashboardLive frame={frame} len={len} />}
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
          bottom: 42,
          textAlign: "center",
          color: "white",
          opacity: textIn * textOut,
          transform: `translateY(${(1 - textIn) * 28}px)`,
        }}
      >
        <div style={{ fontSize: 52, fontWeight: 700, textShadow: "0 0 40px rgba(99,102,241,0.7)" }}>{scene.title}</div>
        <div style={{ fontSize: 28, marginTop: 6, opacity: 0.8, fontWeight: 500 }}>{scene.caption}</div>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- intro and outro

/** Title card: the words fly in one by one */
const Intro = () => {
  const frame = useFrame();
  const fps = FPS;
  const words = ["Bottle", "Game", "Admin", "Panel"];
  const line = interpolate(frame, [30, 70], [0, 1], { extrapolateRight: "clamp", easing: ease });
  const sub = interpolate(frame, [50, 80], [0, 1], { extrapolateRight: "clamp" });
  const out = interpolate(frame, [INTRO - 12, INTRO], [1, 0], { extrapolateLeft: "clamp" });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", fontFamily: FONT, color: "white", opacity: out }}>
      <div style={{ display: "flex", gap: 28, fontSize: 130, fontWeight: 700 }}>
        {words.map((w, i) => {
          const s = Math.min(spring({ frame: frame - i * 7, fps, config: { damping: 14, stiffness: 120 } }), 1.2);
          return (
            <span
              key={w}
              style={{ display: "inline-block", opacity: Math.min(s, 1), transform: `translateY(${(1 - s) * 80}px) scale(${0.8 + 0.2 * s})` }}
            >
              {w}
            </span>
          );
        })}
      </div>
      <div
        style={{
          width: 760 * line,
          height: 5,
          borderRadius: 3,
          marginTop: 26,
          background: "linear-gradient(90deg,#6366f1,#0ea5e9,#a855f7)",
          boxShadow: "0 0 30px #6366f1",
        }}
      />
      <div style={{ opacity: sub, marginTop: 34, fontSize: 40, fontWeight: 500 }}>Next.js 15 · React 19 · TypeScript · Tailwind CSS</div>
      <div style={{ opacity: sub * 0.75, marginTop: 12, fontSize: 30 }}>Back office of a Telegram mini-app game</div>
    </AbsoluteFill>
  );
};

/** Closing card with the repository links */
const Outro = () => {
  const frame = useFrame();
  const fps = FPS;
  const a = spring({ frame, fps, config: { damping: 200 } });
  const b = interpolate(frame, [25, 50], [0, 1], { extrapolateRight: "clamp" });
  const glow = 0.5 + Math.sin(frame / 12) * 0.25;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", fontFamily: FONT, color: "white" }}>
      <div
        style={{
          opacity: a,
          transform: `translateY(${(1 - a) * 40}px)`,
          fontSize: 84,
          fontWeight: 700,
          textShadow: `0 0 60px rgba(99,102,241,${glow})`,
        }}
      >
        Runs against the API demo mode
      </div>
      <div style={{ opacity: b, marginTop: 26, fontSize: 38, fontWeight: 500 }}>docker compose up, then npm run dev</div>
      <div style={{ marginTop: 56, fontSize: 34, opacity: b * 0.9 }}>github.com/Dgrabovets/BottleGameAdministrationPanel</div>
      <div style={{ marginTop: 10, fontSize: 34, opacity: b * 0.9 }}>github.com/Dgrabovets/BottleGameAPI</div>
    </AbsoluteFill>
  );
};

/** The whole demo video: intro, one scene per page, outro */
export const AdminDemo = () => {
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
  const fonts = `
    @font-face { font-family: "Satoshi"; src: url("${staticFile("Satoshi-Medium.woff2")}") format("woff2"); font-weight: 500; }
    @font-face { font-family: "Satoshi"; src: url("${staticFile("Satoshi-Bold.woff2")}") format("woff2"); font-weight: 700; }
  `;
  return (
    <AbsoluteFill>
      <style>{fonts}</style>
      <Backdrop />
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
