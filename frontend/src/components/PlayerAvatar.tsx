"use client";

import {
  isExternalAvatarSrc,
  PLAYER_AVATAR_PLACEHOLDER,
  resolvePlayerAvatarSrc,
} from "@/lib/player-avatar";
import { cn } from "@/lib/utils";
import Image from "next/image";
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

  const sharedClassName = cn("rounded-full object-cover", className);

  if (isExternalAvatarSrc(currentSrc)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={currentSrc}
        width={width}
        height={height}
        alt={alt}
        className={sharedClassName}
        referrerPolicy="no-referrer"
        onError={() => setCurrentSrc(PLAYER_AVATAR_PLACEHOLDER)}
      />
    );
  }

  return (
    <Image
      src={currentSrc}
      width={width}
      height={height}
      alt={alt}
      className={sharedClassName}
      onError={() => setCurrentSrc(PLAYER_AVATAR_PLACEHOLDER)}
    />
  );
}
