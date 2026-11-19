// Takes screenshots of the admin panel through Chrome DevTools Protocol (no extra dependencies)
import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync, rmSync } from "node:fs";

const BASE = "http://localhost:3000";
const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const OUT = process.argv[2];
const FRAMES = process.argv[3];
const PROFILE = process.argv[4];
mkdirSync(OUT, { recursive: true });
mkdirSync(FRAMES, { recursive: true });
rmSync(PROFILE, { recursive: true, force: true });

const chrome = spawn(CHROME, [
  "--headless=new",
  "--remote-debugging-port=9333",
  `--user-data-dir=${PROFILE}`,
  "--window-size=1440,900",
  "--hide-scrollbars",
  "--disable-gpu",
  "about:blank",
], { stdio: "ignore" });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let targets;
for (let i = 0; i < 40; i++) {
  try {
    targets = await (await fetch("http://127.0.0.1:9333/json")).json();
    if (targets.length) break;
  } catch {}
  await sleep(250);
}
const page = targets.find((t) => t.type === "page");
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));
let id = 0;
const pending = new Map();
ws.onmessage = (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) {
    pending.get(m.id)(m);
    pending.delete(m.id);
  }
};
const send = (method, params = {}) =>
  new Promise((res, rej) => {
    const i = ++id;
    pending.set(i, (m) => (m.error ? rej(new Error(JSON.stringify(m.error))) : res(m.result)));
    ws.send(JSON.stringify({ id: i, method, params }));
  });

await send("Page.enable");
await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 900, deviceScaleFactor: 2, mobile: false });

async function go(path, wait = 3500) {
  await send("Page.navigate", { url: BASE + path });
  await sleep(wait);
}
async function shot(file, format = "jpeg") {
  await send("Runtime.evaluate", { expression: "document.querySelectorAll('nextjs-portal').forEach(n => n.remove())" });
  const r = await send("Page.captureScreenshot", { format, quality: 88 });
  writeFileSync(file, Buffer.from(r.data, "base64"));
  console.log("saved", file);
}
async function evalJs(expression) {
  return send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
}

// Login page frame, then sign in
await go("/login", 1500);
await evalJs(`localStorage.setItem("theme","dark")`);
await go("/login", 2500);
await shot(`${FRAMES}/login.png`, "png");
await evalJs(`fetch("/api/auth/login",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({login:"demo-admin@example.com",password:"demo-admin-password"})}).then(r=>r.status)`);

await evalJs(`localStorage.setItem("theme","dark")`);
const pages = [
  ["dashboard", "/", 5000],
  ["players", "/players", 3500],
  ["player", "/player/3", 4000],
  ["withdrawals", "/withdraws", 3500],
  ["deposits", "/deposits", 3500],
  ["settings", "/settings", 3500],
  ["top-players", "/top-players", 3500],
  ["moderators", "/moderators", 3500],
];
for (const [name, path, wait] of pages) {
  await go(path, wait);
  await shot(`${FRAMES}/${name}.png`, "png");
}

// Dark theme dashboard for the video
await evalJs(`localStorage.setItem("theme","dark")`);
await go("/", 5000);
await shot(`${FRAMES}/dashboard-dark.png`, "png");

// Tall captures for scrolling scenes in the video
await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 1900, deviceScaleFactor: 2, mobile: false });
for (const [name, path, wait] of [["dashboard", "/", 5000], ["player", "/player/3", 4000], ["settings", "/settings", 3500], ["players", "/players", 3500]]) {
  await go(path, wait);
  await shot(`${FRAMES}/tall-${name}.png`, "png");
}

ws.close();
chrome.kill();
process.exit(0);
