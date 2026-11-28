// Renders admin-request-path.svg and admin-request-path-light.svg to 2x PNGs with headless Edge.
// Usage: node render.mjs <folder with JetBrainsMono[wght].ttf and IBMPlexSans[wdth,wght].ttf>
// Needs Windows with Microsoft Edge
import { execFileSync } from "node:child_process";
import {
  existsSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const EDGE =
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const DIAGRAMS = ["admin-request-path", "admin-request-path-light"];

const fonts = process.argv[2];
if (!fonts) throw new Error("Pass the fonts folder: node render.mjs <folder>");
// Without this check the browser silently falls back to other fonts
const missing = [
  "JetBrainsMono[wght].ttf",
  "IBMPlexSans[wdth,wght].ttf",
].filter((name) => !existsSync(resolve(fonts, name)));
if (missing.length) {
  throw new Error(`Missing in ${resolve(fonts)}: ${missing.join(", ")}`);
}

const file = (name) => fileURLToPath(new URL(name, import.meta.url));
const font = (name) => pathToFileURL(resolve(fonts, name)).href;
const work = mkdtempSync(join(tmpdir(), "diagram-"));
const html = join(work, "wrapper.html");

for (const diagram of DIAGRAMS) {
  writeFileSync(
    html,
    `<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:'JetBrains Mono';src:url('${font("JetBrainsMono[wght].ttf")}');font-weight:100 800}
@font-face{font-family:'IBM Plex Sans';src:url('${font("IBMPlexSans[wdth,wght].ttf")}');font-weight:100 700}
body{margin:0}svg{display:block}</style>${readFileSync(file(`${diagram}.svg`), "utf8")}`,
  );
  execFileSync(
    EDGE,
    [
      "--headless=new",
      "--disable-gpu",
      "--hide-scrollbars",
      "--allow-file-access-from-files",
      `--user-data-dir=${join(work, diagram)}`,
      "--force-device-scale-factor=2",
      "--window-size=1200,760",
      "--virtual-time-budget=5000",
      `--screenshot=${file(`${diagram}.png`)}`,
      pathToFileURL(html).href,
    ],
    { stdio: "inherit", timeout: 60000 },
  );
}
rmSync(work, { recursive: true, force: true, maxRetries: 10, retryDelay: 500 });
