import { useEffect, useState } from "react";
import { cancelRender, continueRender, delayRender, staticFile } from "remotion";

/** Colours of the dark brand theme */
export const COLOR = {
  background: "#000000",
  surface: "#03100a",
  border: "#232a25",
  text: "#f3f2ee",
  muted: "#a4a69f",
  accent: "#5fe08a",
  second: "#2fd4c0",
  decor: "#1c6b47",
};

/** Brand font for titles and the role line */
export const MONO = "'JetBrains Mono', Consolas, monospace";
/** Brand font for body text */
export const SANS = "'IBM Plex Sans', 'Segoe UI', sans-serif";

// Family, file in the public folder, weight range. Satoshi imitates the panel text drawn over the screenshots
const FONT_FILES = [
  ["JetBrains Mono", "JetBrainsMono.ttf", "100 800"],
  ["IBM Plex Sans", "IBMPlexSans.ttf", "100 700"],
  ["Satoshi", "Satoshi-Medium.woff2", "500"],
  ["Satoshi", "Satoshi-Bold.woff2", "700"],
];

/** Loads the fonts and holds the frame until they are ready, a missing file stops the render */
export function useFonts() {
  // Called from a component: a delayRender() at module level is lost when Remotion initialises after this file
  const [handle] = useState(() => delayRender("fonts"));
  useEffect(() => {
    Promise.all(
      FONT_FILES.map(([family, file, weight]) =>
        new FontFace(family, `url("${staticFile(file)}")`, { weight }).load().then((face) => document.fonts.add(face)),
      ),
    )
      .then(() => continueRender(handle))
      .catch(cancelRender);
  }, [handle]);
}
