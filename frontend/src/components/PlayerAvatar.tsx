"use client";

import {
  PLAYER_AVATAR_PLACEHOLDER,
  resolvePlayerAvatarSrc,
} from "@/lib/player-avatar";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

type PlayerAvatarProps = {
  src?: string | null;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
};

export function PlayerAvatar({
  src,
  alt,
  width = 50,
  height = 50,
  className,
}: PlayerAvatarProps) {
  const [currentSrc, setCurrentSrc] = useState(() =>
    resolvePlayerAvatarSrc(src),
  );

  useEffect(() => {
    setCurrentSrc(resolvePlayerAvatarSrc(src));
  }, [src]);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={currentSrc}
      width={width}
      height={height}
      alt={alt}
      className={cn("rounded-full object-cover", className)}
      loading="lazy"
      decoding="async"
      onError={() => setCurrentSrc(PLAYER_AVATAR_PLACEHOLDER)}
    />
  );
}
