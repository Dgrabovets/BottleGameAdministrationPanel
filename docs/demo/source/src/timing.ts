import { Easing, useCurrentFrame } from "remotion";

/** The timeline is written in frames of a 30 fps video, the video itself is rendered at SCALE times that rate */
export const FPS = 30;
export const SCALE = 2;
export const RENDER_FPS = FPS * SCALE;

/** Length of the intro card, in 30 fps frames */
export const INTRO = 3.5 * FPS;
/** Length of the outro card, in 30 fps frames */
export const OUTRO = 3 * FPS;

export const ease = Easing.bezier(0.45, 0, 0.2, 1);

/** Current frame in 30 fps units, fractional between them, so every animation moves on each rendered frame */
export const useFrame = () => useCurrentFrame() / SCALE;
