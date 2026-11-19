import { Composition } from "remotion";
import { AdminDemo, RENDER_FPS, TOTAL_FRAMES } from "./AdminDemo";

/** Registers the demo video: 1920x1080 at 60 fps */
export const Root = () => (
  <Composition
    id="AdminDemo"
    component={AdminDemo}
    durationInFrames={TOTAL_FRAMES}
    fps={RENDER_FPS}
    width={1920}
    height={1080}
  />
);
