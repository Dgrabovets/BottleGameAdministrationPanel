import { Composition } from "remotion";
import { AdminDemo, TOTAL_FRAMES } from "./AdminDemo";

/** Registers the demo video: 1920x1080 at 30 fps */
export const Root = () => (
  <Composition
    id="AdminDemo"
    component={AdminDemo}
    durationInFrames={TOTAL_FRAMES}
    fps={30}
    width={1920}
    height={1080}
  />
);
